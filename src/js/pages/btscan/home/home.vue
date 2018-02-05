<template>
    <div>
        <text class="title">室内设备管理</text>

        <div class="buttons">
            <buttonItem :title="'设备清点'"></buttonItem>
            <buttonItem :title="'设备搜寻'"></buttonItem>
            <buttonItem :title="'设备管理'"></buttonItem>
            <buttonItem :title="'历史记录'"></buttonItem>
            <buttonItem :title="'关于'"></buttonItem>
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

        method: {

        }
    }


</script>

<style lang="sass" src="./home.scss" scoped></style>
