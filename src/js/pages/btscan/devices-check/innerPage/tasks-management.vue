<template>
    <div>
        <div class="taskTopDiv">
            <div class="taskTopFirstDiv">
                <text class="text-small">任务名称</text>
                <input class="taskInput" type="text" v-model="taskName" maxlength="20"/>
            </div>
            <div class="taskTopSecondDiv">
                <text class="text-small">设备清单</text>
                <text class="text-small">共计 {{checkedDevicesLength()}} 项</text>
            </div>
        </div>

        <list-top></list-top>

        <list class="list">
            <cell v-for="(item, key, index) in checkedDevices" :key="index">
                <div class="cellInnerDiv" :style="{backgroundColor: (index % 2) ? '#90D8FF' : 'white'}">
                    <div class="cellLeftDiv">
                        <text class="devIcon">&#xe600;</text>
                        <text class="text-small width360">{{item.alias}}</text>
                    </div>
                    <div class="cellRightDiv">
                        <text class="text-small">{{computeDistance(item.distance)}}</text>
                        <text class="text-small">{{item.battery}}%</text>
                        <text class="deleteIcon" @click="deleteCheckedDevices(item, key)">&#xe634;</text>
                    </div>
                </div>
            </cell>
        </list>


        <div class="button-box" @click="commit()">
            <text class="text-normal colorWhite">确认提交</text>
        </div>
    </div>
</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { goTo, back, DevicesMap, Device, Task, TasksList } from "../../utils/utils";
    import { listTop } from '../../components/index';

    let _this;
    let devicesMap;
    let tasksList;

    export default {
        data() {
            return {
                taskName: '临时任务',
                checkedDevices: {},
                taskDate: {}
            }
        },

        bmRouter: {
            viewDidAppear(params) {
                this.checkedDevices = params;
            }
        },

        components: {
            listTop
        },

        mounted() {
            _this = this;
            this.$nextTick(() => {
                devicesMap = new DevicesMap(this);
                tasksList = new TasksList(this);
            })
        },

        methods: {
            checkedDevicesLength() {
                return Object.keys(this.checkedDevices).length;
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

            deleteCheckedDevices(item, key){
                this.$notice.confirm({
                    title: '温馨提示',
                    message: '是否确认删除？',
                    okTitle: '是',
                    cancelTitle: '否',
                    okCallback() {
                        Vue.delete(_this.checkedDevices, key);
                        _this.$event.emit('updateDevices', key);
                    },
                    cancelCallback() {}
                })
            },

            commit() {
                if(this.checkedDevicesLength() > 0){
                    //提交到设备管理
                    for(let key in this.checkedDevices){
                        let device = new Device(key, this.checkedDevices[key].alias, this.checkedDevices[key].battery);
                        if(devicesMap.containsKey(device.mac)){
                            devicesMap.updateBattery(device.mac, device.battery);
                        }else{
                            devicesMap.put(device);
                        }
                    }
                    devicesMap.save();

                    //提交到历史记录
                    let task = new Task(this.taskName, this.checkedDevices);
                    tasksList.add(task);
                    tasksList.save();

                    this.checkedDevices = {};  //清空已选列表
                    this.$event.emit('hadCommitTask');   //给清点页面发送停止搜寻信号

                    this.$notice.alert({
                        title: '温馨提示',
                        message: '本次任务已提交',
                        okTitle: '返回首页',
                        callback() {
                            back(_this, 2);
                        }
                    })
                }else{
                    this.$notice.toast({
                        message: '请先添加设备'
                    })
                }
            }
        }
    }
</script>

<style lang="sass" src="./tasks-management.scss" scoped></style>
