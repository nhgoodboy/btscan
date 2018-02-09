<template>
    <div :class="[status ? 'searchButton' : 'searchButton2']">
        <text class="scanIcon" ref="scanIcon">&#xe64a;</text>
        <text class="title">{{title}}</text>
    </div>

</template>

<script>
    const animation = weex.requireModule('animation');

    export default {
        data() {
            return {
                refreshRotate: 0
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
            this.$event.on('startAnimation', (flag)=> {
                this.startAnimation(flag);
            })
        },

        methods: {
            startAnimation(flag) {
                let scanIcon = this.$refs.scanIcon;
                this.refreshRotate = flag ? this.refreshRotate + 100000 : 0;
                animation.transition(scanIcon, {
                    styles: {
                        transform: 'rotate(' + this.refreshRotate + 'deg)',
                    },
                    duration: 1000*60*10, // 默认持续10分钟
                    timingFunction: 'linear',
                    needLayout:false,
                    delay: 0 //ms
                }, () => {})
            },
        }
    }


</script>

<style lang="sass" src="./scanButton.scss" scoped></style>
