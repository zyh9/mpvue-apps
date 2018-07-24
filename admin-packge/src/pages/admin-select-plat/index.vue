<template>
    <div class="admin_select_plat select_bg">
        <h3>选择店铺类型</h3>
        <div class="select_item mb40">
            <img class="fade_in" src="../../../static/select-plat.png" alt="">
            <div class="select_plat_btn sleect_btn" @click="plat"></div>
        </div>
        <div class="select_item">
            <img class="fade_in" src="../../../static/select-vip.png" alt="">
            <div class="select_exclusive_btn sleect_btn" @click="exclusive"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                block: false,
            }
        },
        onLoad() {},
        methods: {
            plat() {
                wx.navigateTo({
                    url: `/pages/plat-introduction`
                })
            },
            exclusive() {
                wx.navigateTo({
                    url: `/pages/vip-introduction`
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .admin_select_plat {
        width: 100%;
        height: 100%;
        padding: 0 36rpx;
        box-sizing: border-box;
        background-color: #0963EE;
        background-repeat: no-repeat;
        overflow: hidden;
        h3 {
            font-size: 46rpx;
            color: #fff;
            font-weight: 400;
            margin: 26rpx 0;
        }
        .select_item {
            height: 468rpx;
            position: relative;
            img {
                width: 100%;
                height: 100%;
            }
            .sleect_btn {
                width: 247rpx;
                height: 87rpx;
                position: absolute;
                right: 60rpx;
                bottom: 90rpx;
            }
        }
        .mb40 {
            margin-bottom: 40rpx;
        }
    }
</style>
