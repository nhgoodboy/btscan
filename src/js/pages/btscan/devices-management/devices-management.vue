<template>
    <div>
        <div class="top-box">
            <button :text="'添加'"></button>
            <button :text="'粘贴CSV'"></button>
            <button :text="'按电量排序'"></button>
        </div>

        <div class="searchBar-box">
            <text class="text-small">共{{devicesLength()}}个</text>
            <search-bar :inputWidth="'400px'"></search-bar>
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
                    <text class="common-style text-alias" >{{item.alias}}</text>
                    <text class="common-style text-battery">{{item.battery}}%</text>
                    <text class="common-style delete-icon" @click="deleteDev(key)">&#xe634;</text>
                </div>
            </cell>
        </list>


    </div>
</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { button, searchBar } from '../components/index';

    export default {
        data() {
            return {
                devices: {'10:13:14:15:16:17': {alias: '1', battery: 98},
                    '11:13:14:15:16:17': {alias: '1', battery: 98},
                    '12:13:14:15:16:17': {alias: '1', battery: 98},
                    '13:13:14:15:16:17': {alias: '1', battery: 98},
                    '14:13:14:15:16:17': {alias: '1', battery: 98},
                    '15:13:14:15:16:17': {alias: '1', battery: 98},
                    '16:13:14:15:16:17': {alias: '1', battery: 98},
                    '17:13:14:15:16:17': {alias: '1', battery: 98},
                    '18:13:14:15:16:17': {alias: '1', battery: 98},
                    '19:13:14:15:16:17': {alias: '1', battery: 98},
                    '20:13:14:15:16:17': {alias: '1', battery: 98},
                    '21:13:14:15:16:17': {alias: '1', battery: 98},
                    '22:13:14:15:16:17': {alias: '1', battery: 98},
                    '23:13:14:15:16:17': {alias: '1', battery: 98},
                    '24:13:14:15:16:17': {alias: '1', battery: 98},
                    '25:13:14:15:16:17': {alias: '1', battery: 98},
                },
            }
        },

        components: {
            button,
            searchBar
        },

        mounted() {

        },

        methods: {
            devicesLength() {
                return Object.keys(this.devices).length;
            },

            deleteDev() {

            }
        }
    }


</script>

<style lang="sass" src="./devices-management.scss" scoped></style>
