<style lang="sass" src="./detail-list.scss"></style>
<template>
   <div>

        <div class="titleDiv">

            <text class="returnIcon" @click="back">&#xe63b;</text>
            <div class="navi-title" >
                <text class="titleText">详细清单</text>
            </div>

        </div>

         <div class="buttonDiv">
             <text class="text40">{{task.taskName}}</text>
        </div>


        <div class="listHead"> 
                <text class="textLabel ">设备标签</text>
                <text class="textName " >设备名称</text>
                <text class="textBattery " >电量</text>
        </div>

        <list class="listBox" >
            <cell v-for="item in task.deviceList">
                <div class="cricleDev">
                    <div class="cellDiv1" >
                        <div class="labelDiv"><text class="text30 ">{{item.mac}}</text></div>
                        <div class="labelDiv"> <text class="text30" >{{item.alias}}</text> </div>
                        <div class="batteryDiv"><text class="text30 ">{{item.battery}}%</text></div>
                    </div>
                </div>                
            </cell>
        </list>        

    </div>
</template>



<script>
    // import 'Config'
    var modal = weex.requireModule('modal');
    var router = weex.requireModule('bmRouter')
    export default{
        data:{
            task:{},
        },
        mounted:function(){
            this.getParams();
        },
        methods:{
            getParams(){
                var _this = this;
                router.getParams(function(params){
                            // 获取参数信息
                    _this.task = params.task;
                    // modal.toast({
                    //     message:params,
                    //     duration:0.5
                    // });
                });
            },
            back(){
                this.$router.back();
            },
        }
    }
</script>