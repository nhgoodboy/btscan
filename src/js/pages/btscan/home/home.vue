<template>
    <div>
        <text class="title">室内设备管理</text>

        <div class="buttons">
            <buttonItem title="设备清点" icon="&#xe603;" @click.native="goTo('devices-check')"></buttonItem>
            <buttonItem title="设备搜寻" icon="&#xe960;" @click.native="goTo('devices-search')"></buttonItem>
            <buttonItem title="设备管理" icon="&#xe64e;" @click.native="goTo('devices-management')"></buttonItem>
            <buttonItem title="历史记录" icon="&#xe609;" @click.native="goTo('history-records')"></buttonItem>
            <buttonItem title="关于" icon="&#xe677;" @click.native="goTo('about')"></buttonItem>
        </div>
    </div>

</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { goTo } from "../utils/utils";
    import buttonItem from './components/buttonItem';

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
            goTo(name) {
                goTo(this, name);
            },
        }
    }


</script>

<style lang="sass" src="./home.scss" scoped></style>
