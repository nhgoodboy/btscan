<template>
    <div>
        <text class="title">室内设备管理</text>

        <div class="buttons">
            <buttonItem title="设备清点" icon="&#xe603;" @buttonClick="goTo"></buttonItem>
            <buttonItem title="设备搜寻" icon="&#xe960;" @buttonClick="goTo"></buttonItem>
            <buttonItem title="设备管理" icon="&#xe64e;" @buttonClick="goTo"></buttonItem>
            <buttonItem title="历史记录" icon="&#xe609;" @buttonClick="goTo"></buttonItem>
            <buttonItem title="关于" icon="&#xe677;" @buttonClick="goTo"></buttonItem>
        </div>
    </div>

</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import buttonItem from './components/buttonItem';
    import { goTo } from "../utils/utils";

    export default {
        data() {
            return {

            }
        },

        components: {
            buttonItem
        },

        mounted() {

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
