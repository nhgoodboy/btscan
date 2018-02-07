<template>
    <div class="box">
        <input class="input" :style="{width: inputWidth}" type="text" v-model="text" :placeholder="placeholder" maxlength="20"/>
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
            },
            inputWidth: {
                type: String,
                default: '515px'
            }
        },

        mounted() {

        },

        methods: {
            search() {
                let text = this.text;
                this.$emit('search', text);
            },
        }
    }
</script>

<style lang="sass" src="./searchBar.scss" scoped></style>
