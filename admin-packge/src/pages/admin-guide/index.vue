<template>
    <div class="admin_guide">
        <div class="guide_bg">
            <h3>您开过美团或饿了么等线上外卖平台么？</h3>
        </div>
        <div class="guide_item">
            <div class="title"><i class="icon_happy"></i>
                <p>我开过</p>
            </div>
            <p class="info">如果您做过美团外卖和饿了么等外卖平台，您可以选择直接填写所有店铺信息，以节省您的时间。</p>
            <div class="ok_btn" @click="infoInp">直接开店</div>
        </div>
        <div class="guide_item item_height">
            <div class="title"><i class="icon_sad"></i>
                <p>我没有开过</p>
            </div>
            <p class="info">如果您是第一次开设网络商铺，建议您跟随引导开店，了解一下店铺管理的功能，方便您对店铺的管理和操作。</p>
            <div class="no_btn" @click="openGuide">引导开店</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                shopId: 0
            };
        },
        onReady() {
            if (wx.getStorageSync('shopInfo')) {
                wx.removeStorageSync('shopInfo');
            }
        },
        onShow() {
            this.shopId = wx.getStorageSync('loginInfo').ShopID;
        },
        methods: {
            openGuide() {
                wx.navigateTo({
                    url: '/pages/admin-name-guide'
                })
            },
            infoInp() {
                if (this.shopId > 0) {
                    wx.navigateTo({
                        url: '/pages/admin-select-plat'
                    })
                } else {
                    wx.navigateTo({
                        url: '/pages/admin-shop-info'
                    })
                }
            }
        },
        components: {}
    };
</script>

<style lang="less">
    .admin_guide {
        position: relative;
        height: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: scroll;
        .guide_bg {
            width: 100%;
            height: 290rpx;
            position: relative;
            h3 {
                position: absolute;
                left: 36rpx;
                top: 84rpx;
                width: 338rpx;
                height: 84rpx;
                font-size: 34rpx;
                color: #656782;
                font-weight: 700;
            }
        }
        .guide_item {
            height: 356rpx;
            padding: 0 36rpx;
            box-sizing: border-box;
            margin-top: 24rpx;
            position: relative;
            .title {
                padding-top: 30rpx;
                display: flex;
                align-items: center;
                p {
                    font-size: 30rpx;
                    color: #3c59ee;
                }
            }
            .info {
                color: #656782;
                font-size: 28rpx;
                padding: 36rpx 0;
            }
            .ok_btn,
            .no_btn {
                position: absolute;
                left: 36rpx;
                right: 36rpx;
                bottom: 36rpx;
                height: 88rpx;
                border: 1rpx solid #3c59ee;
                color: #3c59ee;
                font-size: 30rpx;
                line-height: 88rpx;
                text-align: center;
            }
        }
        .item_height {
            height: 394rpx;
        }
    }
</style>
