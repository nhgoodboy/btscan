<template>
    <div class="box">
        <div class="text-box">
            <text class="text-normal">appVersion:  </text>
            <text class="text-normal">1.0.0</text>
        </div>
        <div class="text-box">
            <text class="text-normal">designBy:  </text>
            <text class="text-normal">叶杰中</text>
        </div>
        <div class="text-box">
            <text class="text-normal">email:  </text>
            <text class="text-normal">evan.yjz@gmail.com</text>
        </div>
    </div>
</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    export default {
        data() {
            return {

            }
        },

        components: {

        },

        mounted() {

        },

        methods: {

        }
    }


</script>

<style lang="sass" src="./about.scss" scoped></style>
