<template>
    <div>
        <div class="topTextDiv">
            <div class="firstDiv">
                <div class="leftDiv">
                    <text class="text-normal">已发现 </text>
                    <text class="text-80">{{devicesLength()}}</text>
                    <text class="text-small"> 个设备</text>
                </div>
                <div class="clearListDiv" @click="clearList">
                    <text class="clearIcon">&#xe61d;</text>
                    <text class="text-small colorWhite">清空列表</text>
                </div>
            </div>
        </div>

        <list-top></list-top>

        <list class="list">
            <cell v-for="(item, key, index) in devices" :key="index">
                <div class="cellInnerDiv" :style="{backgroundColor: (index % 2) ? '#F2DFDD' : '#D5FFF1'}">
                    <div class="cellLeftDiv">
                        <text :class="[item.isFind ? 'devIcon' : 'devIconElse']">&#xe600;</text>
                        <text class="text-small width360">{{item.alias}}</text>
                    </div>
                    <div class="cellRightDiv">
                        <text class="text-small">{{computeDistance(item.distance)}}</text>
                        <text class="text-small">{{item.battery}}%</text>
                        <text :class="[item.checked ? 'addIconCheck' : 'addIcon']" @click="addInCheckedDevices(item, key)">&#xe632;</text>
                    </div>
                </div>
            </cell>
        </list>

        <div class="bottomFirstDiv">
            <div class="bottomLeftDiv">
                <text class="countIcon">&#xe612;</text>
                <text class="text-small">已确认清点 </text>
                <text class="text-normal">{{checkedDevicesLength()}}</text>
                <text class="text-small"> 个设备</text>
            </div>
            <div class="bottomRightDiv" @click="goTo('tasks-management')">
                <text class="text-small">去更改/提交</text>
                <text class="goIcon">&#xe615;</text>
            </div>
        </div>

        <scanButton :status="scanButtonStatus" @click.native="startScanOrStop()"></scanButton>
    </div>

</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { listTop, scanButton } from '../components/index';
    import { goTo, alert } from "../utils/utils";

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
                checkedDevices: {},
                devices: {},

                testMap: {'10:13:14:15:16:17': {isFind: true, alias: '1', distance: 11, battery: 99, checked: false},
                    '11:13:14:15:16:17': {isFind: true, alias: '2', distance: 11, battery: 99, checked: false},
                    '12:13:14:15:16:17': {isFind: true, alias: '3', distance: 11, battery: 99, checked: false},
                    '13:13:14:15:16:17': {isFind: true, alias: '4', distance: 11, battery: 99, checked: false},
                    '14:13:14:15:16:17': {isFind: true, alias: '5', distance: 11, battery: 99, checked: false},
                    '15:13:14:15:16:17': {isFind: true, alias: '6', distance: 11, battery: 99, checked: false},
                    '16:13:14:15:16:17': {isFind: true, alias: '7', distance: 8.00002, battery: 99, checked: false},
                    '17:13:14:15:16:17': {isFind: true, alias: '8', distance: 11, battery: 99, checked: false},
                    '18:13:14:15:16:17': {isFind: true, alias: '9', distance: 11, battery: 99, checked: false},
                    '19:13:14:15:16:17': {isFind: true, alias: '10', distance: 11, battery: 99, checked: false},
                    '20:13:14:15:16:17': {isFind: true, alias: '11', distance: 11, battery: 99, checked: false},
                    '21:13:14:15:16:17': {isFind: true, alias: '12', distance: 11, battery: 99, checked: false},
                    '22:13:14:15:16:17': {isFind: true, alias: '13', distance: 11, battery: 99, checked: false},
                    '23:13:14:15:16:17': {isFind: true, alias: '14', distance: 11, battery: 99, checked: false},
                    '24:13:14:15:16:17': {isFind: true, alias: '15', distance: 11, battery: 99, checked: false}}
            }
        },

        components: {
            listTop,
            scanButton
        },

        computed: {  //有缓存

        },

        watch: {

        },

        mounted() {
            _this = this;
            this.$nextTick(() => {
                devicesMap = new DevicesMap(this);
                history = new TasksList(this);
                this.initScanUtil();
            });
        },

        methods: {
            checkedDevicesLength() {
                return Object.keys(this.checkedDevices).length;
            },

            devicesLength() {
                return Object.keys(this.devices).length;
            },

            goTo(name) {
                goTo(this, name,
                    this.checkedDevices);
            },

            computeDistance(distance) {
                if(distance > 10){
                    return '>10m / ';
                }else if(distance < 1){
                    return '<1m / ';
                }else{
                    return distance + 'm / ';
                }
            },

            startScanOrStop() {
                if(this.scanButtonStatus) {
                    this.startScan();
                }else {
                    this.stopScan();
                }
            },

            clearList(){
                scanUtil.clearList((resData) => {
                    if (resData) {
                        this.devices = {};
                        this.$notice.toast({
                            'message': '列表已清空！'
                        })
                    }
                })
            },

            addInCheckedDevices(item, key){
                if(!item.checked) {
                    item.checked = true;
                    // let tempItem = JSON.stringify(item);  //json对象转json字符串
                    // this.checkedMap[key] = JSON.parse(tempItem);  //json字符串转json对象
                    this.checkedDevices[key] = item;
                }
            },

            initScanUtil() {
                scanUtil.initScanUtil((resData) => {});
            },

            startScan() {
                scanUtil.checkBluetooth((isTrue) => {
                    if(isTrue){
                        this.scanButtonStatus = false;

                        let tempMap = {};
                        for(let key in this.testMap) {
                            let tempItem = {};
                            tempItem.alias = devicesMap.getAliasByMac(key);
                            tempItem.distance = this.testMap[key].distance.toFixed(2);
                            tempItem.isFind = this.testMap[key].isFind;
                            tempItem.battery = this.testMap[key].battery;
                            tempItem.checked = false;
                            tempMap[key] = tempItem;
                        }

                        this.devices = tempMap;

                        scanUtil.startRanging("start", (resData) => {
                            // this.$notice.alert({
                            //     message: resData
                            // })
                            // let tempMap = {};
                            // for(let key in this.testMap) {
                            //     let tempItem = {};
                            //     tempItem.alias = devicesMap.getAliasByMac(key);
                            //     tempItem.distance = this.testMap[key].distance.toFixed(2);
                            //     tempItem.isFind = this.testMap[key].isFind;
                            //     tempItem.battery = this.testMap[key].battery;
                            //     tempMap[key] = tempItem;
                            // }
                            //
                            // this.devices = tempMap;
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
