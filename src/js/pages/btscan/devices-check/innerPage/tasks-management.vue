<template>
    <div>
        <div class="taskTopDiv">
            <div class="taskTopFirstDiv">
                <text class="text-small">任务名称</text>
                <input class="taskInput" type="text" v-model="taskName" maxlength="20"/>
            </div>
            <div class="taskTopSecondDiv">
                <text class="text-small">设备清单</text>
                <div class="countRightDiv">
                    <text class="text-small">共计 {{checkedDevicesLength()}} 项</text>
                </div>
            </div>
        </div>

        <list-top></list-top>

        <list class="list">
            <cell v-for="(item, key, index) in checkedDevices" :key="index">
                <div class="cellInnerDiv" :style="{backgroundColor: (index % 2) ? '#F2DFDD' : '#D5FFF1'}">
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


        <div class="button-box">
            <text class="text-normal colorWhite">确认提交</text>
        </div>
    </div>
</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { alert } from "../../utils/utils";
    import { listTop } from '../../components/index';

    let _this;

    export default {
        data() {
            return {
                taskName: '',
                checkedDevices: {},
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
                        _this.checkedDevices[key] = undefined;
                        _this.$router.refresh;
                        alert(_this, _this.checkedDevices);
                        // delete _this.checkedDevices[key];
                        // if(_this.devArray[_this.checkedArray[index].mac]){
                        //     _this.devArray[_this.checkedArray[index].mac].checked = false;
                        // }
                        //
                        // _this.checkedArray.splice(index, 1);
                    },
                    cancelCallback() {}
                })
            },
        }
    }


</script>

<style lang="sass" src="./tasks-management.scss" scoped></style>
