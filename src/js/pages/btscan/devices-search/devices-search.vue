<template>
    <div>
        <div>
            <div class="top-first-box">
                <text class="text-small">搜索条件</text>
                <input class="input" type="text" v-model="searchContent" maxlength="20"/>
            </div>
            <div class="top-second-box">
                <text class="text-small">设备清单</text>
                <text class="text-small">符合条件的共计 {{devicesLength()}} 项</text>
            </div>
        </div>

        <list-top :marginLeft="'350px'"></list-top>

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
                    </div>
                </div>
            </cell>
        </list>

        <scanButton :status="scanButtonStatus" @click.native="startScanOrStop()"></scanButton>
    </div>
</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { DevicesMap } from "../utils/utils";
    import { listTop, scanButton } from '../components/index';
    const scanUtil = weex.requireModule("scanUtil");

    let devicesMap;

    export default {
        data() {
            return {
                simulation: false,   //是否开启模拟数据
                searchContent: '',
                devices: {},
                scanButtonStatus: true,
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

        mounted() {
            this.$nextTick(() => {
                devicesMap = new DevicesMap(this);
                this.initScanUtil();
            });
        },

        methods: {
            computeDistance(distance) {
                if(distance > 10){
                    return '>10m / ';
                }else if(distance < 1){
                    return '<1m / ';
                }else{
                    return distance + 'm / ';
                }
            },

            devicesLength() {
                return Object.keys(this.devices).length;
            },

            startScanOrStop() {
                this.scanButtonStatus ? this.startScan() : this.stopScan();
            },

            initScanUtil() {
                scanUtil.initScanUtil((resData) => {});
            },

            startScan() {
                scanUtil.checkBluetooth((isTrue) => {
                    if(isTrue){
                        this.scanButtonStatus = false;

                        if(this.simulation) {
                            let tempMap = {};
                            for(let key in this.testMap) {
                                let tempItem = {};
                                tempItem.alias = devicesMap.getAliasByMac(key);
                                tempItem.distance = this.testMap[key].distance.toFixed(2);
                                tempItem.isFind = this.testMap[key].isFind;
                                tempItem.battery = this.testMap[key].battery;

                                if (tempItem.alias.indexOf(this.searchContent) >= 0 || !this.searchContent.trim()) {
                                    tempMap[key] = tempItem;
                                }
                            }
                            this.devices = tempMap;
                        }else {
                            scanUtil.startRanging("start", (resData) => {
                                let tempMap = {};
                                for(let item of resData) {
                                    let tempItem = {};
                                    tempItem.alias = devicesMap.getAliasByMac(item.mac);
                                    tempItem.distance = item.distance.toFixed(2);
                                    tempItem.isFind = item.isFind;
                                    tempItem.battery = item.battery;

                                    if (tempItem.alias.indexOf(this.searchContent) >= 0) {
                                        tempMap[item.mac] = tempItem;
                                    }
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

<style lang="sass" src="./devices-search.scss" scoped></style>
