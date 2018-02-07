<template>
    <div class="box">
        <input class="input" type="text" v-model="text" :placeholder="placeholder" maxlength="20"/>
        <div class="search-box" @click="search()">
            <text class="search-icon">&#xe960;</text>
        </div>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                text: ''
            }
        },

        props: {
            placeholder: {
                type: String,
                default: '请输入要搜索的内容'
            }

        },

        mounted() {

        },

        methods: {
            search() {
                this.$emit('search', this.text);
            },
        }
    }
</script>

<style lang="sass" src="./searchBar.scss" scoped></style>
