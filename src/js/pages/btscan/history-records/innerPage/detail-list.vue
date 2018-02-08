<template>
    <div>
        <text>{{}}</text>

        <div class="list-head">
            <text class="left-text">设备标签</text>
            <text class="middle-text">设备名称</text>
            <text class="right-text">电量</text>
        </div>

        <!--<list class="list">-->
            <!--<cell v-for="(item, index) in tasks" :key="index" @click="goTo(item)">-->
                <!--<div class="cellInnerDiv" :style="{backgroundColor: (index % 2) ? '#90D8FF' : 'white'}">-->
                    <!--<text class="common-style text-taskName">{{item.taskName}}</text>-->
                    <!--<text class="common-style text-time">{{item.time}}</text>-->
                    <!--<text class="common-style text-devNum" >{{item.devNum}}</text>-->
                    <!--<text class="common-style copy-icon" @click="copyDev(item)">&#xe85e;</text>-->
                <!--</div>-->
            <!--</cell>-->
        <!--</list>-->
    </div>

</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');


    export default {
        data() {
            return {
                task: {}
            }
        },

        components: {

        },

        bmRouter: {
            viewDidAppear(params) {
                this.task = params
            }
        },

        mounted() {

        },

        methods: {

        }
    }


</script>

<style lang="sass" src="./detail-list.scss" scoped></style>
