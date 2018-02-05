<template>
    <div>
        <text class="title">室内设备管理</text>

        <div class="buttons">
            <buttonItem :title="'设备清点'" @click.native="goTo('devices-check')"></buttonItem>
            <buttonItem :title="'设备搜寻'" @click.native="goTo('devices-search')"></buttonItem>
            <buttonItem :title="'设备管理'" @click.native="goTo('devices-management')"></buttonItem>
            <buttonItem :title="'历史记录'" @click.native="goTo('history-records')"></buttonItem>
            <buttonItem :title="'关于'" @click.native="goTo('about')"></buttonItem>
            <buttonItem :title="'index'" @click.native="goTo('index')"></buttonItem>
        </div>
    </div>

</template>

<script>
    import "Config";
    import * as buttonItem from './components/buttonItem';

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
                this.$router.open({
                    name: name,
                    type: 'PUSH',
                })
            },


        }
    }


</script>

<style lang="sass" src="./home.scss" scoped></style>
