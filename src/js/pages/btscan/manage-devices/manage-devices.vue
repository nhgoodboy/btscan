<style lang="sass" src="./manage-devices.scss"></style>
<template>
    <div>
        <div class="titleDiv">

            <text class="returnIcon" @click="back">&#xe63b;</text>
            <div class="navi-title" @click="debug()">
                <text class="titleText">管理设备</text>
            </div>

        </div>

        <div class="buttonDiv">
            <div>
                <wxc-button text="添加"  class="button"  :textStyle="wxcButtonTextStyle"
                            @wxcButtonClicked="buttonClicked"></wxc-button>
                <wxc-popup width="750" height="390"
                        pos="top"
                        :show="isShow"
                        @wxcPopupOverlayClicked="overlayClicked">

                            <div class="popupDiv" >
                                <div v-if="is_modify" class = "popupChildDiv">
                                    <text class= "text32">设备标签</text>
                                    <input  type="text" v-model="devLabel" class="popupDisInput " disabled=true />
                                </div>

                                <div v-else class = "popupChildDiv ">
                                    <text class= "text32">设备标签</text>
                                    <input  type="text" v-model="devLabel" class="popupInput " />
                                </div>

                                <div class = "popupChildDiv ">
                                    <text class= "text32">设备名称</text>
                                    <input type="text" v-model="devName" class="popupInput " />
                                </div>

                                <div  class = "popupChildDiv ">

                                    <div v-if="is_modify">
                                        <div @click="modifyDev" class="popupConfrimDiv"><text class= "text32">修改</text></div>
                                    </div>
                                    <div v-else>
                                        <div @click="submit" class="popupConfrimDiv"><text class= "text32">添加</text></div>
                                    </div>

                                    <div  @click="reset" class="popupConfrimDiv"><text class= "text32">取消</text></div>

                                </div>
                            </div>
                        </wxc-popup>
                </div>

            <div class="button" @click="orderByElect"><text class="text32 colorWhite">按电量</text></div>
            <div class="button2" @click="copyCSV"><text class="text32 colorWhite">粘贴CSV</text></div>

            <input  placeholder="搜索标签/名称" type="text" v-model="findByNameOrLabel" class="search-feild" />
            <div class="findButtonDiv" @click="findDev"><text class="findIcon" >&#xe960;</text></div>

        </div>

        <div class="listHead">
                <text class="textLabel ">设备标签</text>
                <text class="textName " >设备名称</text>
                <text class="textBattery " >电量</text>
        </div>

        <list class="listBox" >
            <cell v-for="(item,index) in showDevLists" :key="index">

                <div class="cricleDev">
                    <div class="cellDiv1" @click="buttonClicked2(item)">

                        <div class="labelDiv"><text class="text30 ">{{item.mac}}</text></div>
                        <div class="labelDiv"> <text class="text30" >{{item.alias}}</text> </div>
                        <div class="batteryDiv">
                            <div v-if="item.battery <= 100 && item.battery >= 0">
                                <text class="text30 ">{{item.battery}}%</text>
                            </div>
                            <div v-else><text class="text30 ">---</text></div>
                        </div>

                    </div>

                    <div class="iconDiv"><text  class="deleteIcon" @click="deleteDev(item.mac)">&#xe634;</text></div>
                </div>
            </cell>
        </list>

</div>
</template>

<script>
    import 'Config'
    // import { WxcButton, WxcPopup } from 'weex-ui';
    var clipboard = weex.requireModule("clipboard");
    import { WxcButton, WxcPopup } from 'weex-ui/index';
    var modal = weex.requireModule("modal");

    //——————数据存储类定义——————

    //设备持久化实体类++++++++++++++++++++++++++++++++++++++++
    function Device(macAddr,alias,battery){
        this.alias = alias? alias:"unknowed";
        this.mac = macAddr;
        this.battery = (battery<=100 && battery >= 0)? battery : -1;
        this.lastChangeTime = new Date().toISOString();
    }
    Device.prototype.updateTime = function () {
        this.lastChangeTime = new Date().toISOString();
    };
    Device.prototype.setAlias = function (alias) {
        this.alias = alias;
        this.updateTime();
    };
    Device.prototype.updateBattery = function (b) {
        this.battery = b;
        this.updateTime();
    };

    //DeviceMap类（本地用）+++++++++++++++++++++++++++++++++++
    function DeviceMap(_this) {
        this.page = _this;
        this.init(this.page);
    }
    //弹窗测试方法
    DeviceMap.prototype.alert = function (msg) {
        this.page.$notice.alert({
            title: '数据库提示',
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
    DeviceMap.prototype.put = function (device) {
        if(!this.containsKey(device.mac)){
            this.map[device.mac] = device;
            return '';
        } else {
            return 'mac:' + device.mac  + '   设备已存在！\n';
        }
    }
    DeviceMap.prototype.update= function (device) {
        if(this.containsKey(device.mac)){
            this.map[device.mac] = device;
        } else {
            this.alert('设备不存在！')
        }
    }
    DeviceMap.prototype.deleteByMac = function (mac) {
        delete this.map[mac];
    }
    DeviceMap.prototype.init = function () {
        //原来then里面也可以调用this的
        this.page.$storage.get('deviceMap').then(resData => {
            this.map = resData?resData:{};
            //fly：仅仅这个页面才能这样使用
            this.page.showDevLists = this.toList();
        })

    }
    DeviceMap.prototype.toList = function () {
        var list = [];
        for(var key in this.map){
            list.push(this.map[key]);
        }
        return list;
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


    //——————数据存储类定义完毕——————
    var deviceMap;


    export default{
        components: { WxcButton, WxcPopup },
        data:{
            fontSize: '32px',
            color: '#FFFFFF',
            isShow: false,
            taskName:'',
            userName: "admin",
            taskTime:"",
            devLabel:'',
            devName:'',
            battery:undefined,
            is_modify:false,
            devModel:{
                label:"",
                name:"",
                elect:'101',
                distance: 0,
            },
            findByNameOrLabel:"",
            showDevLists:[],
            devLists: [
                {
                label: "19180e1633e1",
                name: "多路温度巡检仪SPPS-0101",
                distance: 1,
                elect: 90
                },
                {
                label: "19180e1633e2",
                name: "多路温度巡检仪SPPS-0102",
                distance: 2,
                elect: 10
                },
                {
                label: "19180e1633e3",
                name: "多路温度巡检仪SPPS-0103",
                distance: 3,
                elect: 50
                },
                {
                label: "19180e1633e4",
                name: "多路温度巡检仪SPPS-0156",
                distance: 4,
                elect: 40
                },
                {
                label: "19180e1633e6",
                name: "多路温度巡检仪SPPS-0141",
                distance: 5,
                elect: 40
                },
                {
                label: "19180e1633e7",
                name: "多路温度巡检仪SPPS-0551",
                distance: 6,
                elect: 40
                },
                {
                label: "19180e1633e8",
                name: "多路温度巡检仪SPPS-6401",
                distance: 7,
                elect: 40
                },
                {
                label: "19180e1633e9",
                name: "多路温度巡检仪SPPS-0541",
                distance: 8,
                elect: 40
                },
                {
                label: "19180e163310",
                name: "多路温度巡检仪SPPS-0121",
                distance: 9,
                elect: 40
                },
                {
                label: "19180e163311",
                name: "多路温度巡检仪SPPS-0107",
                distance: 10,
                elect: 40
                },
                {
                label: "19180e1633e0",
                name: "多路温度巡检仪SPPS-0108",
                distance: 11,
                elect: 40
                }
            ],
        },
        created:function(){
//            var list = this.devLists;
//            this.showDevLists = list;
            deviceMap = new DeviceMap(this);
        },

        computed:{
            wxcButtonTextStyle () {
                const { fontSize, color } = this;
                const customStyle = {};
                if (fontSize) {
                    customStyle.fontSize = fontSize;
                }
                if (color) {
                    customStyle.color = color;
                }
                return {
                    fontSize, color
                }
            },
        },

        methods:{
            debug(){
                deviceMap.alert(deviceMap.map);
                deviceMap.alert(this.showDevLists);
            },
            initData(){
                for(var key in this.devLists){
                    deviceMap.put(new Device(this.devLists[key].label,this.devLists[key].name,this.devLists[key].elect));
                }
                deviceMap.save();
                deviceMap.alert("预置数据成功");
            },
            buttonClicked () {
                this.devLabel = "";
                this.devName = "";
                this.isShow = true;
            },
            buttonClicked2 (item) {
                this.devLabel = item.mac;
                this.devName = item.alias;
                this.battery = item.battery;
                this.is_modify = true;
                this.isShow = true;
            },
            overlayClicked () {
              this.is_modify = false;
                this.isShow2 = false;
                this.isShow = false;
            },
            findDev(){
                var message = this.findByNameOrLabel;
                if(message.trim() == "" || message == null){
                    this.showDevLists =  deviceMap.toList();
                } else {
                    this.showDevLists = deviceMap.search(message);
                }
            },
            back(){
                this.$router.back();
            },
            orderByElect(){
                var lists = this.showDevLists;
                //yjz
                this.showDevLists = lists.sort(function(a,b){
                    var x = a['battery'];
                    var y = b['battery'];
                    return x - y;
                })
            },
            deleteDev(mac){
                let _this = this;
                this.$notice.confirm({
                    title: '确认删除',
                    message: '删除后记录将消失，是否删除',
                    okTitle: '确认',
                    cancelTitl: '取消',
                    okCallback() {
                        deviceMap.deleteByMac(mac);
                        _this.showDevLists = deviceMap.toList();
                        deviceMap.save();
                    },
                    cancelCallback() {
                        // 点击取消按钮的回调
                    }

                });
            },
            copyCSV(){
                var _this= this;
                let tempReceive = [];
                var flag = true;
                var devModel = this.devModel;
                clipboard.getString(ret => {
                    if(ret.result=='success' && ret.data.trim() != ''){

                        var data = ret.data.split('\r\n')
                        var msg = '';
                        for(var key in data){
                            var arr = data[key].split(',');
                            msg += deviceMap.put(new Device(arr[0],arr[1],arr[2]));
                        }
                        if(msg == ''){
                            msg += '全部导入成功';
                        }
                        deviceMap.alert(msg)
                        _this.showDevLists = deviceMap.toList();
                        deviceMap.save();
                    }else{
                        _this.$notice.alert({
                            message: '格式错误，请重新获取正确的数据再粘贴'
                        })
                    }

//                    try {
//
//                    JSON.parse(ret.data);
//                    var receiveRows = JSON.parse(ret.data);
//                    var lists = receiveRows.dev;
//                    // modal.toast({
//                    //     message:lists,
//                    //     duration:1.0,
//                    // });
//                    lists.forEach(function(item) {
//                        // json 格式
//                        //{
//                        //     "dev": [
//                        //         {
//                        //             "label": "dodao",
//                        //             "name": "daodao"
//                        //         }
//                        //     ]
//                        // }
//                        for(var i = 0; i < self.devLists.length; i++){
//                            if(self.devLists[i].label == item.label){
//                                modal.toast({
//                                    message: item.label + ' 标签名已存在,批量添加失败',
//                                    duration:0.5,
//                                });
//                                flag = false;
//                            }
//                        }
//
//                    });
//                    if(!flag){
//                        return;
//                    }
//                    lists.forEach(function(item) {
//                        devModel.name = item.name;
//                        devModel.label = item.label;
//                        self.devLists.push(devModel);
//                    });
//
//                    modal.alert(
//                        {
//                        message: "已接收,别名已设置成功！",
//                        okTitle: "确定"
//                        },
//                        function(value) {}
//                    );
//                    } catch (e) {
//                    modal.alert(
//                        {
//                        message: "接收的数据不正确，请用正确的数据格式。{\"dev\"{\"label\":\"\",\"name\":\"\"}}",
//                        okTitle: "确定"
//                        },
//                        function(value) {}
//                    );
//                    }
                });
            },
            submit(){
                if(this.devLabel.length != 12){
                    deviceMap.alert("请输入正确的设备标签,正确的标签应该为12位，有可能你看到的是6个两位英文字母组成的以“：”分隔的序列号");
                    return;
                }
                deviceMap.put(new Device(this.devLabel, this.devName));
                deviceMap.save();
                this.showDevLists = deviceMap.toList();
                this.isShow = false;
            },
            modifyDev(){
                deviceMap.update(new Device(this.devLabel, this.devName, this.battery));
                deviceMap.save();
                this.showDevLists = deviceMap.toList();
                this.isShow = false;
            },
            reset(){
                this.isShow = false;
                this.is_modify = false;
            },

        }
    }
</script>
