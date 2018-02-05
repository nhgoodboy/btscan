<template>
    <div style="flex-direction: column; justify-content: space-between;">

        <div class="head">
            <div style="justify-content: space-between;">
                <div style="flex-direction: row; justify-content: space-between; align-items: flex-end; width: 400px">
                    <text style="font-size: 45px;">已发现</text>
                    <text style="font-size: 70px;">{{myNumber.toString()}}</text>
                    <text style="font-size: 35px;">个设备</text>
                </div>
                <div style="margin-top: 25px; flex-direction: row; justify-content: space-between; width: 400px">
                    <text style="font-size: 30px">上次扫描</text>
                    <text style="font-size: 30px">{{myDate}}</text>
                </div>
            </div>
            <div class="clear" @click="clearList">
                <text class="clearIcon">&#xe62f;</text>
                <text class="text" style="color: azure;" value="清空列表"></text>
            </div>
        </div>

        <div class="copyAndfilter">
            <div>
                <div style="flex-direction: row; justify-content: space-between; width: 240px">
                    <div class="sendAndReceiveDiv" @click="sendList">
                        <text class="sendAndReceive">发送</text>
                    </div>
                    <div class="sendAndReceiveDiv" @click="receiveList">
                        <text class="sendAndReceive">接收</text>
                    </div>
                </div>
                <div style="justify-content: center; align-items: center;">
                    <text class="text">已发现设备列表</text>
                </div>
            </div>
            <div class="copy" @click="myCopy">
                <image class="image" src="assets/img/copy.png"/>
                <text class="text" style="color: azure;">复制</text>
            </div>
            <div id="filterID" :class="[isFilter ? 'hasFilter' : 'filter']" @click="myFilter">
                <image class="image" src="assets/img/filter.png"/>
                <text class="text" style="color: azure;">过滤</text>
            </div>
        </div>

        <div class="line"/>

        <scroller class="myScroller">
            <div class="row" v-for="(item, index) in rows" :ref="'item'+index" @click="setAlias(item.mac, index)">
                <div v-if="ifHasAlias(item.alias)" style="flex-direction: row; justify-content: space-between; width: 690px; ">
                    <div style="flex-direction: row">
                        <image class="image" :src="item.isFind ? 'assets/img/defaultEquip.png' : 'assets/img/grayEquip.png'"/>
                        <text  :class="[item.isFind ? 'text' : 'myColor']" :ref="'text'+index"> NAME:{{item.alias}}</text>
                    </div>
                    <text  :class="[item.isFind ? 'text' : 'myColor']" :ref="'text'+index">{{item.distance.toFixed(2)}}m</text>
                </div>
                <div v-else style="flex-direction: row; justify-content: space-between; width: 690px; ">
                    <div style="flex-direction: row">
                        <image class="image" :src="item.isFind ? 'assets/img/defaultEquip.png' : 'assets/img/grayEquip.png'"/>
                        <text  :class="[item.isFind ? 'text' : 'myColor']" :ref="'text'+index"> MAC:{{item.mac}}</text>
                    </div>
                    <text  :class="[item.isFind ? 'text' : 'myColor']" :ref="'text'+index">{{item.distance.toFixed(2)}}m</text>
                </div>
            </div>
        </scroller>


        <div v-if="isScan" class="startScan" @click="startScan">
            <image style="height: 100px; width: 100px;" src="assets/img/scan.png"/>
            <text class="text" style="color: azure;">开始扫描</text>
        </div>
        <div v-else="isScan" class="stopScan" @click="stopScan">
            <image style="height: 100px; width: 100px;" src="assets/img/scan.png"/>
            <text class="text" style="color: azure;">停止扫描</text>
        </div>
    </div>
</template>

<script>
//    import 'Config'

    var modal = weex.requireModule('modal');
    var clipboard = weex.requireModule('clipboard');
    var scanUtil = weex.requireModule('scanUtil');
    const storage = weex.requireModule('storage');
    const dom = weex.requireModule('dom');


    module.exports = {
        data: function () {
            return {
                isFilter: false,
                rows: [],
                aliasRows: {},
                myTextToCopy: "",
                myNumber: 0,
                myDate: "",
                myFilterMsg: "",
                isScan: true,
                listSendText:{},
                listReceiveText:{}
            }
        },

        mounted: function () {
            var _this = this;
            this.$nextTick(function () {
                _this.initScanUtil();
                _this.initAliasRows();
            });

        },

        created: function () {
            this.getLastScanDate();
        },

        methods: {
            sendList: function () {
                var _this = this;
                let sendRows = [];
                _this.rows.forEach(function(item){
                    let tempItem = {};
                    Vue.set(tempItem, "mac", item.mac);
                    Vue.set(tempItem, "alias", item.alias);
                    sendRows.push(tempItem);
                });
                clipboard.setString(sendRows);
                modal.toast({
                    'message': '已复制到剪切板，可以发送了！',
                    'duration': 1.0
                })
            },

            receiveList: function () {
                var _this = this;
                let tempReceive = [];
                clipboard.getString(ret => {
                    try{
                        JSON.parse(ret.data);
                        let receiveRows = [];
                        receiveRows = JSON.parse(ret.data);
                        receiveRows.forEach(function (item) {
                            scanUtil.setAlias(item.mac, item.alias, function (e) {});
                            _this.rows.forEach(function(selfItem){
                                if(item.mac === selfItem.mac){
                                    selfItem.alias = item.alias;
                                }
                            });
                        });
                        modal.alert({
                            message: '已接收,别名已设置成功！',
                            okTitle: '确定',
                        }, function (value) {});
                    }catch(e){
                        modal.alert({
                            message: '接收的数据不正确，请先复制正确的数据格式。获得数据格式请在另一个设备里点击“发送”复制到剪贴板!',
                            okTitle: '确定',
                        }, function (value) {});
                    };
                });
            },

            initScanUtil: function () {
                var _this = this;
                scanUtil.initScanUtil(function (e) {
                    if(!_this.rows){
                        var tempRows = [];
                        e.forEach(function (item) {
                            let tempItem = {};
                            Vue.set(tempItem, "mac", item.mac);
                            Vue.set(tempItem, "alias", item.alias);
                            Vue.set(tempItem, "distance", item.distance);
                            Vue.set(tempItem, "isFind", item.isFind);
                            if (item.alias === "") {
                                if (item.mac.indexOf(_this.myFilterMsg) >= 0) {
                                    tempRows.push(tempItem);
                                }
                            } else {
                                if (item.alias.indexOf(_this.myFilterMsg) >= 0) {
                                    tempRows.push(tempItem);
                                }
                            }
                        });

                        _this.rows = tempRows;
                        _this.myNumber = _this.rows.length;
                    }

                })
            },

            initAliasRows: function () {
                var _this = this;
                storage.getItem('aliasRows', function (e) {
                    let rows = JSON.parse(e.data);
                    rows.forEach(function (item) {
                        storage.getItem(item.mac, function (e) {
                            Vue.set(_this.aliasRows, item.mac, e.data);
                        });
                    });
                });
            },

            getLastScanDate: function () {
                var _this = this;
                storage.getItem("lastDate", function (e) {
                    if(e.data){
                        _this.myDate = "(还没有进行过扫描)";
                    }else{
                        _this.myDate = e.data;
                    }

                })
            },

            setLastScanDate: function (date) {
                storage.setItem("lastDate", date);
            },

            setAlias: function (mac, index) {
                var _this = this;
                modal.prompt({
                    'message': '请输入别名',
                    'okTitle': '完成',
                    'cancelTitle': '取消'
                }, function (result) {
                    if (result.result === "完成") {
                        var tempAlias = result.data;
                        storage.setItem(mac, tempAlias);
                        Vue.set(_this.aliasRows, mac, result.data);

                        _this.rows[index].alias = result.data;

                        scanUtil.setAlias(mac, result.data, function (e) {
                            if(result.data === ''){
                                modal.toast({'message': '别名已取消'});
                            }else{
                                modal.toast({'message': '别名设置成功'});
                            }

                            var tempRows = [];
                            e.forEach(function (item) {
                                if (item.alias === "") {
                                    if (item.mac.indexOf(_this.myFilterMsg) >= 0) {
                                        tempRows.push(item);
                                    }
                                } else {
                                    if (item.alias.indexOf(_this.myFilterMsg) >= 0) {
                                        tempRows.push(item);
                                    }
                                }
                            });
                            _this.rows = tempRows;
                            _this.myNumber = _this.rows.length;
                        });
                    }
                })
            },

            getAlias: function (item) {
                let myAlias = "init";
                storage.getItem(item.mac, function (e) {
                    myAlias = e.data;
                });
                return myAlias;
            },

            ifHasAlias: function (alias) {
                return alias != "";
            },

            clearList(){
                var _this = this;
                scanUtil.clearList(function (e) {
                    if (e) {
                        _this.rows.splice(0, _this.rows.length);//清空数组
                        _this.myNumber = 0;
                        modal.toast({
                            'message': '列表已清空！',
                            'duration': 1.0
                        })
                    }
                })
            },

            myCopy: function () {
                var _this = this;
                var tempCopyText = _this.myDate + "\n" + "本次共扫描到" + this.myNumber + "个设备，列表如下:" + "\n";
                this.rows.forEach(function (item, index) {
                    tempCopyText = tempCopyText + (index+1) +". MAC: " + item.mac + " 别名: " + item.alias + "\n";
                });
                clipboard.setString(tempCopyText);
                modal.toast({
                    'message': '已复制到剪切版！',
                    'duration': 1.0
                })
            },

            myFilter: function () {
                var _this = this;
                modal.prompt({
                    'message': _this.isFilter ? '当前过滤条件：'+ _this.myFilterMsg : '请输入过滤条件',
                    'okTitle': '完成',
                    'cancelTitle': '取消'
                }, function (result) {
                    if (result.result === "完成") {
                        if(result.data === ""){
                            _this.isFilter = false;
                            modal.toast({
                                'message': '已取消过滤！',
                                'duration': 1.0
                            })
                        }else{
                            _this.isFilter = true;
                            modal.toast({
                                'message': '已设置过滤！',
                                'duration': 1.0
                            })
                        }
                        _this.myFilterMsg = result.data;
                        var tempRows = [];
                        _this.rows.forEach(function (item, index) {
                            if (item.alias === "") {
                                if (item.mac.indexOf(_this.myFilterMsg) >= 0) {
                                    tempRows.push(item);
                                }
                            } else {
                                if (item.alias.indexOf(_this.myFilterMsg) >= 0) {
                                    tempRows.push(item);
                                }
                            }
                        });
                        _this.rows = tempRows;
                        _this.myNumber = _this.rows.length;
                    }
                })
            },

            startScan: function () {
                var _this = this;
                _this.isScan = false;
                modal.toast({
                    'message': '已开始扫描',
                    'duration': 1.0
                });
                scanUtil.startRanging(
                    "start",
                    function (isEnable) {
                        if (!isEnable) {
                            _this.isScan = true;
                            modal.toast({'message': '请打开蓝牙！'})
                        }
                    },
                    function (e) {
                        var tempRows = [];
                        e.forEach(function (item, index) {
                            let tempItem = {};
                            Vue.set(tempItem, "mac", item.mac);
                            Vue.set(tempItem, "alias", item.alias);
                            Vue.set(tempItem, "distance", item.distance);
                            Vue.set(tempItem, "isFind", item.isFind);
                            if (item.alias === "") {
                                if (item.mac.indexOf(_this.myFilterMsg) >= 0) {
                                    tempRows.push(tempItem);
                                }
                            } else {
                                if (item.alias.indexOf(_this.myFilterMsg) >= 0) {
                                    tempRows.push(tempItem);
                                }
                            }
                        });
                        _this.rows = tempRows;
                        _this.myNumber = _this.rows.length;
                        storage.setItem('aliasRows', e);
                    }
                );

                var formatDateTime = function (date) {
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
                    return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
                };
                this.myDate = formatDateTime(new Date);
                this.setLastScanDate(this.myDate);

            },

            stopScan: function () {
                scanUtil.stopRanging(function (e) { });
                this.isScan = true;
                modal.toast({
                    'message': '已停止扫描',
                    'duration': 1.0
                })
            }
        }
    }
</script>

<style scoped>
    .clearIcon {
        font-family: btscanIcon;
        font-size: 50px;
        color: red;
    }

    .sendAndReceive {
        font-size: 30px;
        color: #ffffff;
    }

    .sendAndReceiveDiv{
        width: 100px;
        height: 50px;
        justify-content: center;
        align-items: center;
        background-color: #d489e0;
        border-radius: 15px;
    }
    .sendAndReceiveDiv:active{
        background-color: #8927e0;
    }

    .head {
        flex-direction: row;
        height: 180px;
        margin-top: 20px;
        margin-left: 30px;
        margin-right: 30px;
        justify-content: space-between;
        padding: 20px;
        border-color: #B8B8B8;
        border-width: 1px;
    }

    .clear {
        background-color: #1DB0B8;
        border-radius: 20px;
        padding: 20px;
        align-items: center;
        justify-content: center;
    }

    .clear:active {
        background-color: #16878D;
    }

    .line {
        border-width: 0.5px;
        border-color: gainsboro;
        margin-top: 20px;
        margin-left: 30px;
        margin-right: 30px;
    }

    .copyAndfilter {
        flex-direction: row;
        margin-top: 20px;
        margin-left: 30px;
        margin-right: 30px;
        justify-content: space-between;
        align-items: flex-end;
        height: 90px;
    }

    .myScroller {
        margin-left: 30px;
        margin-right: 30px;
        flex-grow: 1;
    }
    .startScan {
        flex-direction: row;
        background-color: #1DB0B8;
        height: 140px;
        justify-content: center;
        align-items: center
    }

    .stopScan {
        flex-direction: row;
        background-color: #E08031;
        height: 140px;
        justify-content: center;
        align-items: center
    }

    .copy {
        flex-direction: row;
        height: 90px;
        width: 150px;
        margin-left: 70px;
        background-color: #1DB0B8;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
    }

    .copy:active {
        background-color: #16878D;
    }

    .filter {
        flex-direction: row;
        height: 90px;
        width: 150px;
        margin-left: 30px;
        background-color: #1DB0B8;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
    }

    .hasFilter {
        flex-direction: row;
        height: 90px;
        width: 150px;
        margin-left: 30px;
        background-color: #E08031;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
    }

    .row {
        justify-content: space-between;
        height: 100px;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #DDDDDD;
    }
    .row:active{
        background-color: darkgray;
    }

    .text {
        font-size: 35px;
    }

    .image {
        height: 40px;
        width: 40px;
    }

    .myColor{
        font-size: 35px;
        color: #8A8A8A;
    }
</style>