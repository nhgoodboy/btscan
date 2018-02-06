<template>
    <div>
        <div class="topTextDiv">
            <div class="firstDiv">
                <div class="leftDiv">
                    <text class="text36">已发现 </text>
                    <text class="text80">0</text>
                    <text class="text32"> 个设备</text>
                </div>
                <div class="clearListDiv" @click="clearList">
                    <text class="clearIcon">&#xe61d;</text>
                    <text class="text32 colorWhite">清空列表</text>
                </div>
            </div>
        </div>

        <list-top></list-top>

        <list class="listBox">
            <cell v-for="(item, index) in devicesArray" :key="index">
                <div class="cellInnerDiv" :style="{backgroundColor: (index % 2) ? '#F2DFDD' : '#D5FFF1'}">
                    <div class="cellLeftDiv">
                        <text :class="[item.isFind ? 'devIcon' : 'devIconElse']">&#xe600;</text>
                        <text class="text32 width360">{{item.alias}}</text>
                    </div>
                    <div class="cellRightDiv">
                        <text v-if="item.distance <= 10" class="text32">{{item.distance}}m / </text>
                        <text class="text32" v-else>>10m / </text>
                        <text class="text32">{{item.battery}}%</text>
                        <text :class="[item.checked ? 'addIconCheck' : 'addIcon']" @click="pushCheckedArray(item)">&#xe632;</text>
                    </div>
                </div>
            </cell>
        </list>

        <div class="bottomFirstDiv">
            <div class="bottomLeftDiv">
                <text class="countIcon">&#xe612;</text>
                <text class="text32">已确认清点 </text>
                <text class="text36">0</text>
                <text class="text32"> 个设备</text>
            </div>
            <div class="bottomRightDiv" @click="goToCommitView">
                <text class="text32">去更改/提交</text>
                <text class="goIcon">&#xe615;</text>
            </div>
        </div>

        <scanButton :status="scanButtonStatus" @click.native="startScanOrStop()"></scanButton>
    </div>

</template>

<script>
    import "Config";
    import { listTop, scanButton } from '../components/index';

    const scanUtil = weex.requireModule("scanUtil");

    class Device {
        constructor(mac, alias, battery) {
            this.alias = alias ? alias : "unknowed";
            this.mac = mac;
            this.battery = (battery <= 100 && battery >= 0) ? battery : '---';
            this.lastChangeTime = new Date().toISOString();
        }

        updateTime() {
            this.lastChangeTime = new Date().toISOString();
        }

        setAlias(alias) {
            this.alias = alias;
            this.updateTime();
        }

        updateBattery(battery) {
            this.battery = battery;
            this.updateTime();
        }
    }

    class DevicesMap {
        constructor(_this) {
            this.page = _this;
            this.init();
        }

        alert(msg) {
            this.$notice.alert({
                title: '提示',
                message: msg,
                okTitle: '确认',
                callback() {

                }
            })
        }

        init() {
            this.page.$storage.get('devicesMap').then(resData => {
                this.map = resData;
            }, error => {
                this.map = {};
            })
        }

        put(device) {
            if(!this.containsKey(device.mac)){
                this.map[device.mac] = device;
            } else {
                this.alert('设备已存在！')
            }
        }

        save() {
            this.page.$storage.set('devicesMap', this.map).then(resData => {}, error => {});
        }

        update(device) {
            if(this.containsKey(device.mac)){
                this.map[device.mac] = device;
            } else {
                this.alert('设备不存在！')
            }
        }

        search(subKey) {
            let result = [];
            let _this = this;
            for(let key in this.map) {
                if(key.indexOf(subKey) >= 0 || this.map[key].alias.indexOf(subKey) >= 0) {
                    result.push(JSON.parse(JSON.stringify(_this.map[key])));
                }
            }
            return result;
        }

        updateBattery(mac, battery) {
            this.map[mac].battery = battery;
        }

        containsKey(mac) {
            return this.map[mac] ? true : false;
        }

        getAliasByMac(mac) {
            if(this.map[mac]){
                return this.map[mac].alias;
            } else {
                return mac;
            }
        }
    }

    class Task {
        constructor(taskName, devicesList, remark, operator) {
            this.taskName = taskName;
            this.time = new Date().toISOString();
            this.deviceList = devicesList;
            this.devNum = devicesList.length;
            this.remark = remark ? remark : '';
            this.operator = operator;
        }
    }

    class TasksList {
        constructor(_this) {
            this.page = _this;
            this.init();
        }

        init() {
            this.page.$storage.get('tasksList').then(resData => {
                this.list = resData;
            }, error => {
                this.list = [];
            })
        }

        save() {
            this.page.$storage.set('tasksList', this.list).then(resData => {}, error => {})
        }

        add(obj) {
            this.list.push(obj);
        }
    }

    let _this;
    let devicesMap;
    let history;

    export default {
        data() {
            return {
                scanButtonStatus: true,
                devicesArray: [{isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},
                    {isFind: true, alias: '1', distance: 7, battery: 99, checked: false},],
            }
        },

        components: {
            listTop,
            scanButton
        },

        computed: {
            // isOddNum(index) {
            //     return index % 2 === 0 ? false : true;
            // }
        },

        mounted() {
            _this = this;
            this.$nextTick(() => {
                deviceMap = new DeviceMap(this);
                history = new TaskList(this);
                this.initScanUtil();
            });
        },

        methods: {
            startScanOrStop() {
                // this.$notice.alert({
                //     message:  "asd"
                // })
                if(this.scanButtonStatus) {
                    this.startScan();
                }else {
                    this.stopScan();
                }
            },

            clearList(){

            },

            pushCheckedArray(item){
                // if(!item.checked) {
                //     var tempItem = JSON.stringify(item);  //json对象转json字符串
                //     this.checkedArray.push(JSON.parse(tempItem));  //json字符串转json对象
                //     item.checked = true;
                // }
            },

            initScanUtil() {
                scanUtil.initScanUtil((resData) => {});
            },

            startScan() {
                scanUtil.checkBluetooth((isTrue) => {
                    if(isTrue){
                        this.scanButtonStatus = false;

                        scanUtil.startRanging("start", (resData) => {
                            // this.$notice.alert({
                            //     message: resData
                            // })
                            // let tempMap = {};
                            // resData.forEach((item, index) => {
                            //     let tempItem = {mac: '', alias: '', distance: '', isFind: '', battery: ''};
                            //     tempItem.mac = item.mac;
                            //     tempItem.alias = deviceMap.getAliasByMac(item.mac);
                            //     tempItem.distance = item.distance.toFixed(2);
                            //     tempItem.isFind = item.isFind;
                            //     tempItem.battery = item.battery;
                            //     tempMap[tempItem.mac] = tempItem;
                            // });
                            //
                            // if(_this.checkedArray.length > 0){
                            //     for (let index in _this.checkedArray){
                            //         if(tempMap[_this.checkedArray[index].mac]){
                            //             tempMap[_this.checkedArray[index].mac].checked = true;
                            //         }
                            //     }
                            // }
                            //
                            // _this.devArray = tempMap;
                        });
                    }else{
                        this.scanButtonStatus = true;
                        this.$notice.toast({message: "请打开蓝牙！"});
                    }
                })
            },

            stopScan: function () {
                scanUtil.stopRanging((e) => {});
                this.scanButtonStatus = true;
            },
        }
    }


</script>

<style lang="sass" src="./devices-check.scss" scoped></style>
