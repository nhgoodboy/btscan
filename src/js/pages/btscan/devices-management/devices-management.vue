<template>
    <div>
        <div class="top-box">
            <button :text="'添加'"></button>
            <button :text="'粘贴CSV'"></button>
            <button :text="'按电量排序'"></button>
        </div>

        <div class="searchBar-box">
            <text class="text-small">共{{devicesLength()}}项</text>
            <search-bar :inputWidth="'400px'" :placeholder="'请输入设备标签或名称'"></search-bar>
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
    import { DevicesMap } from "../utils/utils";

    let devicesMap;

    export default {
        data() {
            return {
                devices: {},
            }
        },

        components: {
            button,
            searchBar
        },

        mounted() {
            devicesMap = new DevicesMap(this);
            this.devices = devicesMap.map;
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
