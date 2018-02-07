<template>
    <div>
        <div class="top-box">
            <button :text="'添加'"></button>
            <button :text="'粘贴CSV'"></button>
            <button :text="'按电量排序'"></button>
        </div>

        <search-bar></search-bar>

        <div class="search-bar-box">

        </div>
    </div>

</template>

<script>
    if (process.env.NODE_ENV === 'development') require('Config');

    import { button, searchBar } from '../components/index';

    export default {
        data() {
            return {

            }
        },

        components: {
            button,
            searchBar
        },

        mounted() {

        },

        methods: {
            searchbarCancelClick(){

            },
            searchbarInputOninput(){

            },
            searchbarCloseClick(){

            },
            searchbarInputOnfocus(){

            },
            searchbarInputOnblur(){

            }
        }
    }


</script>

<style lang="sass" src="./devices-management.scss" scoped></style>
