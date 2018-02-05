<template>
    <div>
        <div class="topTextDiv">
            <div class="firstDiv">
                <div class="leftDiv">
                    <text class="text36">已发现 </text>
                    <text class="text80">0</text>
                    <text class="text32"> 个设备</text>
                </div>
                <div class="clearListDiv" @click="clearList">
                    <text class="clearIcon">&#xe61d;</text>
                    <text class="text32 colorWhite">清空列表</text>
                </div>
            </div>
        </div>

        <list-top></list-top>

        <div class="bottomFirstDiv">
            <div class="bottomLeftDiv">
                <text class="countIcon">&#xe612;</text>
                <text class="text32">已确认清点 </text>
                <text class="text36">0</text>
                <text class="text32"> 个设备</text>
            </div>
            <div class="bottomRightDiv" @click="goToCommitView">
                <text class="text32">去更改/提交</text>
                <text class="goIcon">&#xe615;</text>
            </div>
        </div>

        <scanButton></scanButton>
    </div>

</template>

<script>
    import "Config";
    import { listTop, scanButton } from '../components/index';

    export default {
        data() {
            return {

            }
        },

        components: {
            listTop,
            scanButton
        },

        mounted() {

        },

        methods: {
            clearList(){

            }
        }
    }


</script>

<style lang="sass" src="./devices-check.scss" scoped></style>
