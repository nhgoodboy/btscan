<style lang="sass" src="./history-results.scss"></style>

<template>
    <div>
        <div class="titleDiv">

            <text class="returnIcon" @click="back">&#xe63b;</text>
            <div class="navi-title" >
                <text class="titleText">历史结果</text>
            </div>

        </div>

         <div class="buttonDiv">

            <div class="button" @click="inMonth"><text class="text30 colorWhite">30天内</text></div>
            <div class="button" @click="outMonth"><text class="text30 colorWhite">30天前</text></div>

            <input  placeholder="搜索任务名称" type="text" v-model="findTaskByName" class="search-feild" />
            <div class="findButtonDiv" @click="findTask"><text class="findIcon" >&#xe960;</text></div>

        </div>

        <div class="listHead">
                <text class="taskName ">设备名称</text>
                <text class="taskTime " >清点时间</text>
                <text class="devCount " >设备数</text>
        </div>

            <list  class="listBox">
                <cell v-for="task in showTaskList">
                    <div  class="cricleDev">
                        <div class="cellDiv1" @click="go(task)">
                            <div class="taskNameDiv"><text class="text30 ">{{task.taskName}}</text></div>
                            <div class="taskTimeDiv"> <text class="text30" >{{formatDateTime(new Date(task.time))}}</text> </div>
                            <div class="DevCountDiv"> <text class="text30 ">{{task.devNum}}</text></div>
                        </div>

                        <div class="iconDiv"><text  class="copyIcon" @click="copyInfo(task)">&#xe85e;</text></div>
                    </div>
                </cell>
            </list>
    </div>
</template>

<script>
    import 'Config'
    const moment = require('../utils/moment'); //yjz

    var clipboard = weex.requireModule("clipboard");
    var router = weex.requireModule('bmRouter')
    var modal = weex.requireModule("modal");

    //设备持久化实体类++++++++++++++++++++++++++++++++++++++++
    function Device(macAddr,alias,battery){
        this.alias = alias? alias:"unknowed";
        this.mac = macAddr;
        this.battery = battery ? battery : 100;
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
            this.page.showTaskList = this.toList();
        })

    }
    TaskList.prototype.toList = function () {
        var list = [];
        this.list.forEach(item =>{
            var countDays = moment().diff(moment(item.time), 'hours') / 24;
            if(countDays <= 30){
                list.push(item);
            }
        })
        return list;
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
    TaskList.prototype.alert = function (msg) {
        this.page.$notice.alert({
            title: '存储提示1',
            message: msg,
            okTitle: '确认',
            callback() {
                // 点击确认按钮的回调
            }
        })
    }

    //——————数据存储类定义完毕——————
    var deviceMap;
    var history;

    export default{
        data:{
            taskName:'',
            userName: "admin",
            taskTime:"",
            findTaskByName:"",
            showTaskList:"",
            myDate:"",
            taskList:[
                {
                    taskName:'2017-10-22 19:18:17',
                    taskTime:'10-22 19:18',
                    taskDev:[
                        {
                        label: "1dfa3dfasd",
                        name: "多路温度巡检仪SPPS-0101",
                        distance: 1,
                        elect: 90
                        },
                    ]
                },
                {
                    taskName:'这个任务修改了名称',
                    taskTime:'10-22 19:18',
                    taskDev:[
                        {
                        label: "fdasf134dfd",
                        name: "多路温度巡检仪SPPS-0101",
                        distance: 1,
                        elect: 90
                    },
                    {
                        label: "fasfe31",
                        name: "多路温度巡检仪SPPS-0101",
                        distance: 1,
                        elect: 90
                    },
                    ]
                },
                {
                    taskName:'这个任务修改了名称',
                    taskTime:'09-22 19:18',
                    taskDev:[
                        {
                        label: "1",
                        name: "多路温度巡检仪SPPS-0101",
                        distance: 1,
                        elect: 90
                    },
                    {
                        label: "1dfasdf",
                        name: "多路温度巡检仪SPPS-0101",
                        distance: 1,
                        elect: 90
                    },
                    ]
                },
            ],
            task:{
                taskName:'admin 2017-10-22 19:18:17',
                taskTime:'2017-10-22 19:18:17',
                countDev:[
                    {
                        label: "fasdfe1",
                        name: "多路温度巡检仪SPPS-0101",
                        distance: 1,
                        elect: 90
                    },

                ],
            },
        },

        created() {
            this.$nextTick(function () {
                history = new TaskList(this);
//                this.inMonth();
            });
        },

        computed:{
            // showTaskList:function(){
            //     var items = this.taskList;
            //     var message = this.findTaskByName;
            //     var showItem = [];
            //     if(message.trim() == "" || message == null){
            //         return items;
            //     }
            //     for (var i = 0; i < items.length; i++) {
            //         if (items[i].taskName.indexOf(message) >= 0) {
            //         showItem.push(items[i]);
            //         }
            //     }
            //     return showItem;
            // },
        },
        methods:{
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

            calDate(time) {
                var timearr1 = time.split(" ");
                var timearr = timearr1[0].split("-");
                var scanTime = new Date();
                var month;
                if(timearr[0][0] == '0'){
                    month = timearr[0][1];
                }else{
                    month = timearr[0];
                }
                scanTime.setMonth(month-1,timearr[1]);
                var now = new Date();
                var differ = now.getTime() - scanTime.getTime();
                var days=Math.floor(differ/(24*3600*1000));
                if(days > 30){
                    return false;
                }
                return true;
            },

            opChange() {
                var items = this.devItems;
                var message = this.filterMessage;
                this.filterItems = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].name.indexOf(message) >= 0) {
                    this.filterItems.push(items[i]);
                    }
                }
            },
            findTask(){
//                var items = this.taskList;
//                var message = this.findTaskByName;
//                var showItem = [];
//                if(message.trim() == "" || message == null){
//                    this.showTaskList =  items;
//                }
//                for (var i = 0; i < items.length; i++) {
//                    if (items[i].taskName.indexOf(message) >= 0) {
//                    showItem.push(items[i]);
//                    }
//                }
//                this.showTaskList = showItem;

                //yjz
                this.showTaskList = [];
                history.list.forEach(item =>{
                    if(item.taskName.indexOf(this.findTaskByName) >= 0){
                        this.showTaskList.push(item);
                    }
                })
            },
            back(){
                this.$router.back();
            },
            go(task){
                // modal.toast({
                //     message:task,
                //     duration:0.5,
                // });
                this.$router.open({
                name:'iBeacon.detail-list',
                params:{task},
              });
            },
            inMonth(){
                // modal.toast({
                //     message:'30天前',
                //     duration:0.5
                // });
//                var lists = this.taskList;
//                var showItem = [];
//                for (var i = 0; i < lists.length; i++) {
//
//                    if ( this.calDate(lists[i].taskTime) ) {
//                        showItem.push(lists[i]);
//                    }
//                }

                //yjz
                var tempList = [];
                history.list.forEach(item =>{
                    var countDays = moment().diff(moment(item.time), 'hours') / 24;
                    if(countDays <= 30){
                        tempList.push(item);
                    }
                })
                this.showTaskList = tempList;


            },
            outMonth(){
//                var lists = this.taskList;
//                var showItem = [];
//                for (var i = 0; i < lists.length; i++) {
//
//                    if ( ! this.calDate(lists[i].taskTime) ) {
//                        showItem.push(lists[i]);
//                    }
//                }
//                this.showTaskList = showItem;

                //yjz
                var tempList = [];
                history.list.forEach(item =>{
                    var countDays = moment().diff(moment(item.time), 'hours') / 24;
                    if(countDays > 30){
                        tempList.push(item);
                    }
                })
                this.showTaskList = tempList;

            },

            copyInfo(task){

//              var self = this;
//              var txt = "%";
//              var tempCopyText =
//                self.myDate + "\n" + "本次共扫描到" + task.taskDev.length + "个设备，列表如下:" + "\n";
//              task.taskDev.forEach(function(item, index) {
//                tempCopyText =
//                  tempCopyText +
//                  (index + 1) +
//                  ". 标签: " +
//                  item.label +
//                  " 名称: " +
//                  item.name +
//                  " 电量："+
//                  item.elect +
//                  "%" +
//                  "\n";
//              });
//              clipboard.setString(tempCopyText);
//              modal.toast({
//                message:tempCopyText,
//                duration: 1.0
//              });

                //yjz
                var copyCSV = '';
//                for(var index in task.deviceList){
//                    if(index < task.deviceList.length-1){
//                        copyCSV = copyCSV + item.mac + ',' + item.alias + ',' + item.battery + '\r\n';
//                    }else{
//                        copyCSV = copyCSV + item.mac + ',' + item.alias + ',' + item.battery;
//                    }
//                }
                var count = 0;
                task.deviceList.forEach(item => {
                    count++;
                    if(count < task.deviceList.length){
                        copyCSV = copyCSV + item.mac + ',' + item.alias + ',' + item.battery + '\r\n';
                    }else{
                        copyCSV = copyCSV + item.mac + ',' + item.alias + ',' + item.battery;
                    }
                })
                clipboard.setString(copyCSV);
                this.$notice.alert({
                    message: copyCSV
                })
            },
        }
    }
</script>
