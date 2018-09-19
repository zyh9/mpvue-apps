<template>
    <div>
        <h3 @click="other">去其他页面</h3>
        <h3 @click="addNum">点击增加</h3>
        <h3>{{state}}</h3>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                state: 0
            }
        },
        onLoad() {//用于数据重置
            this.state = 0;
        },
        onReady() {},
        onShow() {},//页面渲染就会触发
        methods: {
            other() {
                wx.navigateTo({
                    url: '/pagesOther/other'
                });
            },
            addNum() {
                this.state++;
                this.$store.dispatch('add', this.state)
            }
        },
        computed: {},
        watch: {},
        components: {}
    }
</script>

<style lang="less">

</style>
