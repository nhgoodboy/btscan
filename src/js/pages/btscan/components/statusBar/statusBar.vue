<template>
    <div :style="{height: statusBarHeight, backgroudColor: backgroudColor}"></div>
</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

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

