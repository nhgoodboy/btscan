<template>
    <div>
        <div class="topTextDiv">
            <div class="firstDiv">
                <div class="leftDiv">
                    <text class="text-normal">已发现 </text>
                    <text class="text-80">{{devicesLength()}}</text>
                    <text class="text-small"> 个设备</text>
                </div>
                <div>
                    <div class="switch-box">
                        <switch :checked="type === simulation.type" @change="turnSimulation()"></switch>
                    </div>
                    <text class="text-26">模拟数据</text>
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
                <div class="cellInnerDiv" :style="{backgroundColor: (index % 2) ? '#90D8FF' : 'white'}">
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
    import { goTo, alert, DevicesMap } from "../utils/utils";

    const scanUtil = weex.requireModule("scanUtil");

    let _this;
    let devicesMap;

    export default {
        data() {
            return {
                simulation: {type: 'solid', open: false},  //open 是否开启模拟数据
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
                this.initScanUtil();

                this.$event.on('updateDevices', key => {
                    this.devices[key].checked = false;
                    Vue.delete(this.checkedDevices, key);
                })

                this.$event.on('hadCommitTask', () => {
                    this.devices = {};
                    this.checkedDevices = {};
                    this.stopScan();
                })
            });
        },

        methods: {
            turnSimulation() {
                this.simulation.type = this.simulation.type ==='solid' ? 'hollow' : 'solid';
                if(this.simulation.type === 'hollow') {
                    this.simulation.open = true;
                }else{
                    this.simulation.open = false;
                }
            },

            checkedDevicesLength() {
                return Object.keys(this.checkedDevices).length;
            },

            devicesLength() {
                return Object.keys(this.devices).length;
            },

            goTo(name) {
                goTo(this, name, this.checkedDevices);
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

                        if(this.simulation.open) {
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
                        }else {
                            scanUtil.startRanging("start", (resData) => {
                                // this.$notice.alert({
                                //     message: resData
                                // });
                                let tempMap = {};
                                for(let item of resData) {
                                    let tempItem = {};
                                    tempItem.mac = item.mac;
                                    tempItem.alias = devicesMap.getAliasByMac(item.mac);
                                    tempItem.distance = item.distance.toFixed(2);
                                    tempItem.isFind = item.isFind;
                                    tempItem.battery = item.battery;
                                    tempItem.checked = this.checkedDevices[item.mac] ? true : false;

                                    tempMap[item.mac] = tempItem;
                                }
                                this.devices = tempMap;
                            });
                        }
                    }else{
                        this.scanButtonStatus = true;
                        this.$notice.toast({message: "请打开蓝牙"});
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
