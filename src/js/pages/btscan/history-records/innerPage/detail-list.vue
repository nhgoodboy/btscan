<template>
    <div>
        <div class="top-box">
            <text class="task-name">{{taskName}}</text>
        </div>
        <div class="list-head">
            <text class="left-text">设备标签</text>
            <text class="middle-text">设备名称</text>
            <text class="right-text">电量</text>
        </div>

        <list class="list">
            <cell v-for="(item, key, index) in devices" :key="index">
                <div class="cellInnerDiv" :style="{backgroundColor: (index % 2) ? '#90D8FF' : 'white'}">
                    <text class="common-style text-key">{{key}}</text>
                    <text class="common-style text-alias">{{item.alias}}</text>
                    <text class="common-style text-battery" >{{item.battery}}</text>
                </div>
            </cell>
        </list>
    </div>

</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    export default {
        data() {
            return {
                taskName: '',
                devices: {}
            }
        },

        components: {

        },

        bmRouter: {
            viewDidAppear(params) {
                this.taskName = params.taskName;
                this.devices = params.devices;
            }
        },

        mounted() {

        },

        methods: {

        }
    }


</script>

<style lang="sass" src="./detail-list.scss" scoped></style>
