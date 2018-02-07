<template>
    <div>
        <div class="top-box">
            <button :text="'添加'"></button>
            <button :text="'粘贴CSV'"></button>
            <button :text="'按电量'"></button>
        </div>
    </div>

</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { button } from '../components/index';

    export default {
        data() {
            return {

            }
        },

        components: {
            button
        },

        mounted() {

        },

        methods: {

        }
    }


</script>

<style lang="sass" src="./devices-management.scss" scoped></style>
