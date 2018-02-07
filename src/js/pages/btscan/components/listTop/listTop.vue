<template>
    <div class="listTopDiv">
        <text class="leftText">设备名称</text>
        <text class="rightText1" :style="{marginLeft: marginLeft}">距离 / </text>
        <text class="rightText2">电量</text>
    </div>

</template>

<script>
    export default {
        data() {
            return {

            }
        },

        props: {
            marginLeft: {
                type: String,
                default: '300px'
            }
        },

        mounted() {

        },

        methods: {

        }
    }


</script>

<style lang="sass" src="./listTop.scss" scoped></style>
