<template>
    <div :class="[status ? 'searchButton' : 'searchButton2']" @click="turnStatus()">
        <text class="scanIcon">&#xe64a;</text>
        <text class="title">{{title}}</text>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                status: true,
                title: '开始扫描'
            }
        },

        props: {
            // status: {
            //     type: Boolean,
            //     default: true
            // },
            // title: {
            //     type: String,
            //     default: '开始扫描'
            // }
        },

        computed: {

        },

        mounted() {

        },

        methods: {
            turnStatus() {
                this.status = !this.status;
                this.title = this.status ? '开始扫描' : '停止扫描';
            }
        }
    }


</script>

<style lang="sass" src="./scanButton.scss" scoped></style>
