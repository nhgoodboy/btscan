<template>

    <div>
        <image class="image" :style="{height:realHeight}" src="bmlocal://assets/background.jpg"></image>
        <div class="div1">
            <text class="title">仓储设备管理</text>
            <div class="buttons">
                <buttonItem title="设备清点" icon="&#xe603;" @buttonClick="goTo"></buttonItem>
                <buttonItem title="设备搜寻" icon="&#xe960;" @buttonClick="goTo"></buttonItem>
                <buttonItem title="设备管理" icon="&#xe64e;" @buttonClick="goTo"></buttonItem>
                <buttonItem title="历史记录" icon="&#xe609;" @buttonClick="goTo"></buttonItem>
                <buttonItem title="关于" icon="&#xe677;" @buttonClick="goTo"></buttonItem>
            </div>
        </div>
    </div>

</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import buttonItem from './components/buttonItem';
    import {goTo} from "../utils/utils";

    export default {
        data() {
            return {
                realHeight: 0
            }
        },

        components: {
            buttonItem
        },

        mounted() {
            this.realHeight = weex.config.eros.realDeviceHeight;
            // this.$notice.toast(this.realHeight);
        },

        methods: {
            goTo(title) {
                let urlName = '';
                switch (title) {
                    case '设备清点':
                        urlName = 'devices-check';
                        break;
                    case '设备搜寻':
                        urlName = 'devices-search';
                        break;
                    case '设备管理':
                        urlName = 'devices-management';
                        break;
                    case '历史记录':
                        urlName = 'history-records';
                        break;
                    case '关于':
                        urlName = 'about';
                        break;
                }
                goTo(this, urlName);
            },
        }
    }


</script>

<style lang="sass" src="./home.scss" scoped></style>
