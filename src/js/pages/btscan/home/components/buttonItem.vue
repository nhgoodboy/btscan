<template>
    <div class="box">
        <text class="title">{{title}}</text>
    </div>

</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            }

        },

        data() {
            return {

            }
        },

        mounted() {

        },

        method: {

        }
    }


</script>

<style lang="sass" src="./buttonItem.scss" scoped></style>
