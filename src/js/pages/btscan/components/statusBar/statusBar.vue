<template>
    <div :style="{height: statusBarHeight, backgroudColor: backgroudColor}"></div>
</template>

<script>
    import "Config";

    export default {
        data() {
            return {
                statusBarHeight: WxEnvironment.statusBarHeight,
                backgroudColor: 'yellow'
            }
        },

        mounted() {

        },

        methods: {

        }
    }
</script>

