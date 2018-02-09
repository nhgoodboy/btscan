<template>
    <div class="box" @click="buttonClick()">
        <div class="inner-box">
            <text class="icon colorWhite">{{transIcon(icon)}}</text>
            <text class="title colorWhite">{{title}}</text>
        </div>
    </div>

</template>

<script>
    import { transIcon } from "../../utils/utils";

    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            icon: {
                type: String,
                default: '&#xe603;'
            }
        },

        data() {
            return {

            }
        },

        mounted() {

        },

        methods: {
            transIcon(icon) {
                return transIcon(icon);
            },

            buttonClick() {
                this.$emit('buttonClick', this.title);
            }

        }
    }


</script>

<style lang="sass" src="./buttonItem.scss" scoped></style>
