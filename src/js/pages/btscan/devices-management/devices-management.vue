<template>
    <div>
        <div class="top-box">
            <button :text="'添加'"></button>
            <button :text="'粘贴CSV'"></button>
            <button :text="'按电量排序'"></button>
        </div>

        <div class="searchBar-box">
            <text class="text-small">共{{devicesLength()}}项</text>
            <search-bar :inputWidth="'400px'" :placeholder="'请输入设备标签或名称'" @search="search"></search-bar>
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
    import { DevicesMap, alert } from "../utils/utils";

    let _this;
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
            _this = this;
            devicesMap = new DevicesMap(this);
            this.devices = devicesMap.map;
        },

        methods: {
            search(text) {
                this.devices = devicesMap.search(text);
            },

            devicesLength() {
                return Object.keys(this.devices).length;
            },

            deleteDev(key) {
                this.$notice.confirm({
                    title: '温馨提示',
                    message: '删除后记录将消失，是否删除?',
                    okTitle: '是',
                    cancelTitle: '否',
                    okCallback() {
                        Vue.delete(_this.devices, key);
                        devicesMap.deleteByKey(key);
                    },
                    cancelCallback() {}
                });
            }
        }
    }


</script>

<style lang="sass" src="./devices-management.scss" scoped></style>
