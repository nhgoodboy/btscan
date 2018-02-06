<template>
    <div :class="[status ? 'searchButton' : 'searchButton2']">
        <text class="scanIcon">&#xe64a;</text>
        <text class="title">{{title}}</text>
    </div>

</template>

<script>
    export default {
        data() {
            return {

            }
        },

        props: {
            status: {
                type: Boolean,
                default: true
            },
        },

        computed: {
            title(){
                if(this.status) {
                    return '开始扫描';
                }else {
                    return '停止扫描';
                }
            }
        },

        mounted() {

        },

        methods: {

        }
    }


</script>

<style lang="sass" src="./scanButton.scss" scoped></style>
