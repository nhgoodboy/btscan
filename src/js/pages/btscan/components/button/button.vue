<template>
    <div class="box" @click="buttonClick()">
        <text class="text-small colorWhite">{{text}}</text>
    </div>

</template>

<script>
    export default {
        data() {
            return {

            }
        },

        props: {
            text: {
                type: String,
                default: 'button'
            },

        },

        mounted() {

        },

        methods: {
            buttonClick() {
                this.$emit('buttonClick');
            }
        }
    }


</script>

<style lang="sass" src="./button.scss" scoped></style>
