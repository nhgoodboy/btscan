<style lang="sass" src="./index.scss"></style>

<template>
    <div>
        <div class="titleDiv">
            <text class="titleText">蓝牙设备扫描</text>
            <text v-if="tab.check === 0 && !scanView" class="returnIcon" @click="returnToScanView">&#xe63b;</text>
        </div>

        <div class="buttonDiv">
            <div class="butt" @click="go('iBeacon.manage-devices')">
                <text class="text32 colorWhite">管理设备</text>
            </div>
            <div class="butt" @click="go('iBeacon.history-results')">
                <text class="text32 colorWhite">历史记录</text>
            </div>

            <div class="butt" @click="go('iBeacon.home')">
                <text class="text32 colorWhite">home</text>
            </div>
        </div>

        <div class="tabDiv">
            <div :class="[tab.check === 0 ? 'tabItemDivChecked' : 'tabItemDiv']" @click="clickTab(0)">
                <text class="text36">设备清点</text>
            </div>
            <div :class="[tab.check === 1 ? 'tabItemDivChecked' : 'tabItemDiv']" @click="clickTab(1)">
                <text class="text36">设备搜寻</text>
            </div>
        </div>

        <div v-if="tab.check === 0 && scanView">
            <div class="middleTextDiv">
                <div class="firstDiv">
                    <div class="leftDiv">
                        <text class="text36">已发现 </text>
                        <text class="text80">{{mapItemNum(devArray)}}</text>
                        <text class="text32"> 个设备</text>
                    </div>
                    <div class="clearListDiv" @click="clearList">
                        <text class="clearIcon">&#xe61d;</text>
                        <text class="text32 colorWhite">清空列表</text>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="tab.check === 0 && !scanView">
            <div class="taskMiddleDiv">
                <div class="taskMiddleTopDiv">
                    <text class="text32">任务名称</text>
                    <input class="taskInput" type="text" v-model="taskName" maxlength="20"/>
                </div>
                <div class="taskMiddleBottomDiv">
                    <text class="text32">设备清单</text>
                    <div class="countRightDiv">
                        <text class="text32">共计 </text>
                        <text class="text32">{{checkedArray.length}}</text>
                        <text class="text32"> 项</text>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <div class="taskMiddleDiv">
                <div class="taskMiddleTopDiv">
                    <text class="text32">过滤条件</text>
                    <input class="taskInput" type="text" v-model="filterName" maxlength="20" @change="executeFilter"/>
                </div>
                <div class="taskMiddleBottomDiv">
                    <text class="text32">设备清单</text>
                    <div class="countRightDiv">
                        <text class="text32">符合条件的共计 </text>
                        <text class="text32">{{mapItemNum(devArray)}}</text>
                        <text class="text32"> 项</text>
                    </div>
                </div>
            </div>
        </div>

        <list class="listBox" v-if="tab.check === 0 && scanView">
            <cell v-for="(item,index) in devArray" :key="index">
                <div class="cellInnerDiv">
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

        <list class="listBox" v-else-if="tab.check === 0 && !scanView">
            <cell v-for="(item,index) in checkedArray">
                <div class="cellInnerDiv">
                    <div class="cellLeftDiv">
                        <text class="devIcon">&#xe600;</text>
                        <text class="text32 width360">{{item.alias}}</text>
                    </div>
                    <div class="cellRightDiv">
                        <text v-if="item.distance <= 10" class="text32">{{item.distance}}m / </text>
                        <text class="text32" v-else>>10m / </text>
                        <text class="text32">{{item.battery}}%</text>
                        <text class="deleteIcon" @click="deleteCheckedDev(checkedArray.indexOf(item))">&#xe634;</text>
                    </div>
                </div>
            </cell>
        </list>

        <list class="listBox" v-else>
            <cell v-for="(item,index) in devArray">
                <div class="cellInnerDiv">
                    <div class="cellLeftDiv">
                        <text :class="[item.isFind ? 'devIcon' : 'devIconElse']">&#xe600;</text>
                        <text class="text32 width360">{{item.alias}}</text>
                    </div>
                    <div class="cellRightDiv">
                        <text v-if="item.distance <= 10" class="text32">{{item.distance}}m / </text>
                        <text class="text32" v-else>>10m / </text>
                        <text class="text32">{{item.battery}}%</text>
                    </div>
                </div>
            </cell>
        </list>

        <div class="bottomDiv">
            <div v-if="tab.check === 0 && scanView">
                <div class="bottomFirstDiv">
                    <div class="bottomLeftDiv">
                        <text class="countIcon">&#xe612;</text>
                        <text class="text32">已确认清点 </text>
                        <text class="text36">{{checkedArray.length}}</text>
                        <text class="text32"> 个设备</text>
                    </div>
                    <div class="bottomRightDiv" @click="goToCommitView">
                        <text class="text32">去更改/提交</text>
                        <text class="goIcon">&#xe615;</text>
                    </div>
                </div>
            </div>
            <div v-else-if="tab.check === 0 && !scanView">
                <div class="commitDiv">
                    <div class="commitButtonDiv" @click="commitDevList">
                        <text class="text36 colorWhite">确认提交</text>
                    </div>
                </div>
            </div>

            <div v-if="buttonState" class="bottomSecondDiv" @click="startScan">
                <text class="scanIcon">&#xe64a;</text>
                <text class="text50 colorWhite">开始扫描</text>
            </div>
            <div v-else class="bottomSecondDivElse" @click="stopScan">
                <text class="scanIcon">&#xe64a;</text>
                <text class="text50 colorWhite">停止扫描</text>
            </div>
        </div>
    </div>
</template>


<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    var scanUtil = weex.requireModule("scanUtil");
    //——————数据存储类定义——————

    //设备持久化实体类++++++++++++++++++++++++++++++++++++++++
    function Device(macAddr,alias,battery){
        this.alias = alias? alias:"unknowed";
        this.mac = macAddr;
        this.battery = (battery<=100 && battery >= 0)? battery : '---';
        this.lastChangeTime = new Date().toISOString();
    };
    Device.prototype.updateTime = function () {
        this.lastChangeTime = new Date().toISOString();
    }
    Device.prototype.setAlias = function (alias) {
        this.alias = alias;
        this.updateTime();
    };
    Device.prototype.updateBattery = function (b) {
        this.battery = b;
        this.updateTime();
    }

    //DeviceMap类（本地用）+++++++++++++++++++++++++++++++++++
    function DeviceMap(_this) {
        this.page = _this;
        this.init(this.page);
    }
    //弹窗测试方法
    DeviceMap.prototype.alert = function (msg) {
        this.page.$notice.alert({
            title: '存储提示1',
            message: msg,
            okTitle: '确认',
            callback() {
                // 点击确认按钮的回调
            }
        })
    }
    DeviceMap.prototype.updateBattery = function (mac,battery){
        this.map[mac].battery = battery;
    }
    DeviceMap.prototype.containsKey = function (mac) {
        return this.map[mac]?true:false;
    }
    DeviceMap.prototype.getAliasByMac = function (mac) {
        if(this.map[mac]){
            return this.map[mac].alias;
        } else {
            return mac;
        }
    }

    //暂时不使用
    //    const timer = weex.requireModule("timer");
    //    DeviceMap.prototype.autoSave = function () {
    //            timer.setInterval(function () {
    //
    //            }, 1000);
    //    }

    DeviceMap.prototype.put = function (device) {
        if(!this.containsKey(device.mac)){
            this.map[device.mac] = device;
        } else {
            this.alert('设备已存在！')
        }
    }
    DeviceMap.prototype.update= function (device) {
        if(this.containsKey(device.mac)){
            this.map[device.mac] = device;
        } else {
            this.alert('设备不存在！')
        }
    }
    DeviceMap.prototype.init = function () {
        //原来then里面也可以调用this的
        this.page.$storage.get('deviceMap').then(resData => {
            this.map = resData?resData:{};
        }, error =>{
            this.map = error.data?error.data:{};
        })

    }
    DeviceMap.prototype.save = function(){
        this.page.$storage.set('deviceMap', this.map)
            .then(resData => {}, error => {})
    }
    DeviceMap.prototype.search = function (subKey) {
        var resultArr = [];
        let _this = this;
        for(var key in this.map){
            if(key.indexOf(subKey) >= 0 || this.map[key].alias.indexOf(subKey) >= 0){
                resultArr.push(JSON.parse(JSON.stringify(_this.map[key])));
            }
        }
        return resultArr;
    }

    //任务本地持久化实体类+++++++++++++++++++++++++++++++++++++
    function Task(taskName, deviceList, remark, operator) {
        this.taskName = taskName;
        this.time = new Date().toISOString();
        this.deviceList = deviceList;
        this.devNum = deviceList.length;
        this.remark = remark?remark:'';
        this.operator = operator;
    }

    //任务本地持久化实体类+++++++++++++++++++++++++++++++++++++
    function TaskList(page) {
        this.page = page;
        this.init(this.page);
    }
    TaskList.prototype.init = function () {
        //原来then里面也可以调用this的
        this.page.$storage.get('taskList').then(resData => {
            this.list = resData?resData:[];
        })

    }
    TaskList.prototype.save = function(){
        this.page.$storage.set('taskList', this.list)
            .then(resData => {}, error => {})
    }
    TaskList.prototype.add = function (obj) {
        this.list.push(obj);
    }
    //没用
    TaskList.prototype.delete = function () {

    }



    //——————数据存储类定义完毕——————


    var deviceMap;
    var history;


    export default {
        bmRouter: {
            viewWillBackAppear(params, options) {
                deviceMap = new DeviceMap(this);
                history = new TaskList(this);
                for (var key in this.devArray){
                    if(deviceMap.containsKey(key)){
                        this.devArray[key].alias = deviceMap[key].alias
                    }
                }
            },
        },

        data() {
            return {
                tab: {name: {leftName: '设备清点', rightName: '设备搜寻'}, check: 0},
                devArray: [],    //扫描到的设备
                checkedArray: [],  //添加的数组
                buttonState: true,  //扫描按钮状态
                scanView: true,    //是否扫描页面
                taskName: 'admin',  //默认任务名称
                filterName: '',    //过滤的名称， 包括mac和alias

            };
        },

        components: {
        },

        created() {
            this.$nextTick(function () {

            });
        },

        mounted() {
            var _this = this;
            this.$nextTick(function () {
                deviceMap = new DeviceMap(this);
                history = new TaskList(this);
                _this.initScanUtil()
            });
        },

        methods: {
            executeFilter(){
//                var tempMap = {};
//                for(var key in this.devArray){
//                    if(this.devArray[key].alias.indexOf(this.filterName) < 0){
//                        delete this.devArray[key];
//                    }
//                }
            },

            mapItemNum(map){
                var num = 0;
                for(var index in map){
                    num++
                }
                return num;
            },

            goToCommitView(){
                this.scanView = false;
                this.taskName = 'admin ' + this.formatDateTime(new Date);
//                this.taskName = 'admin ';
            },

            formatDateTime(date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                minute = minute < 10 ? ('0' + minute) : minute;
                var second = date.getSeconds();
                second = second < 10 ? ('0' + second) : second;
//                return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
                return m + '-' + d + ' ' + h + ':' + minute;
            },

            returnToScanView(){
                this.scanView = true;
            },

            commitDevList(){
                var _this = this;
                if(this.checkedArray.length > 0){
                    //提交到设备管理
                    this.checkedArray.forEach(item =>{
                        var device = new Device(item.mac, item.alias, item.battery);
                        if(deviceMap.containsKey(device.mac)){
                            deviceMap.updateBattery(device.mac, device.battery);
                        }else{
                            deviceMap.put(device);
                        }
                    })
                    deviceMap.save();

                    //提交到历史记录
                    var task = new Task(_this.taskName, _this.checkedArray);
                    history.add(task);
                    history.save();

                    this.$notice.alert({

                        message: '已提交！',
                        okTitle: '确定',
                        callback(){
                            for (var index in _this.checkedArray){
                                if(_this.devArray[_this.checkedArray[index].mac]){
                                    _this.devArray[_this.checkedArray[index].mac].checked = false;
                                }
                            }
                            _this.checkedArray = [];
                            _this.scanView = true;
                            _this.tab.check = 0;
                        }
                    })
                }else{
                    this.$notice.toast({
                        message: '请先添加设备'
                    })
                }

            },

            deleteCheckedDev(index){
                var _this = this;
                this.$notice.confirm({

                    message: '是否确认删除？',
                    okTitle: '是',
                    cancelTitle: '否',
                    okCallback() {
                        if(_this.devArray[_this.checkedArray[index].mac]){
                            _this.devArray[_this.checkedArray[index].mac].checked = false;
                        }

                        _this.checkedArray.splice(index, 1);
                    },
                    cancelCallback() {}
                })
            },

            pushCheckedArray(item){
                if(!item.checked) {
                    var tempItem = JSON.stringify(item);  //json对象转json字符串
                    this.checkedArray.push(JSON.parse(tempItem));  //json字符串转json对象
                    item.checked = true;
                }
            },

            clearList(){
                var _this = this;
                scanUtil.clearList(function (resData) {
                    if (resData) {
                        _this.devArray = [];
                        _this.$notice.toast({
                            'message': '列表已清空！',
                        })
                    }
                })
            },

            clickTab(index){
                if(index === 0){
                    this.stopScan();
                    this.tab.check = 0;
                    this.buttonState = true;
                    this.devArray = [];
                }else{
                    this.stopScan();
                    this.tab.check = 1;
                    this.buttonState = true;
                    this.devArray = [];
                }
            },

            initScanUtil: function () {
                var _this = this;
                scanUtil.initScanUtil(function (resData) {})
            },

            go(name) {
                this.$router.open({name});
            },

            startScan: function () {
                var _this = this;

                scanUtil.checkBluetooth(function(isTrue){
                    if(isTrue){
                        _this.buttonState = false;

                        scanUtil.startRanging("start",
                            function (resData) {
                                var tempMap = {};
                                resData.forEach(function (item, index) {
                                    var tempItem = {mac: undefined, alias: undefined, distance: undefined, isFind: undefined, battery: undefined};
                                    tempItem.mac = item.mac;
                                    tempItem.alias = deviceMap.getAliasByMac(item.mac);
                                    tempItem.distance = item.distance.toFixed(2);
                                    tempItem.isFind = item.isFind;
                                    tempItem.battery = item.battery;
                                    if(_this.tab.check === 1 && _this.filterName != ''){ //设备搜寻，过滤
                                        if (tempItem.alias.indexOf(_this.filterName) >= 0) {
                                            tempMap[tempItem.mac] = tempItem;
                                        }
                                    }else{
                                        tempMap[tempItem.mac] = tempItem;
                                    }
                                })

                                if(_this.checkedArray.length > 0){
                                    for (var index in _this.checkedArray){
                                        if(tempMap[_this.checkedArray[index].mac]){
                                            tempMap[_this.checkedArray[index].mac].checked = true;
                                        }
                                    }
                                }
                                _this.devArray = tempMap;
                            }
                        );
                    }else{
                        _this.$notice.toast({message: "请打开蓝牙！"});
                    }
                })

            },

            stopScan: function () {
                scanUtil.stopRanging(function (e) { });
                this.buttonState = true;
//                this.$notice.toast({
//                    message: "已停止扫描",
//                });
            },
        }
    }
</script>
