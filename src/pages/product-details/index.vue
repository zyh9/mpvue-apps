<template>
    <div class="product-details">
        <scroll-view scroll-y="true" style="height: 100%" lower-threshold="60" @scrolltolower="scrollHandler">
            <div class="shop_top">
                <img src="../../../static/jp.jpg" alt="" class="shop_img">
                <img src="../../../static/userImg.png" alt="" class="share" @click="share">
            </div>
        </scroll-view>
        <div class="share_mask" v-if="isActive" @click="isActive = false"></div>
        <div class="share_card" :class="{share_card_active:isActive}">
            <div class="share_card_btn">
                <div class="btn_item">
                    <img src="../../../static/userImg.png" alt="">
                    <p>发给好友</p>
                    <button class="btn_send" plain="true" open-type="share"></button>
                </div>
                <div class="btn_item">
                    <img src="../../../static/userImg.png" alt="">
                    <p>二维码分享</p>
                </div>
            </div>
            <div class="cancel" @click="isActive = false">取消</div>
        </div>
        <login v-if="true" @log-in="loginEmit"></login>
    </div>
</template>

<script>
import login from '../../components/Login';
    export default {
        data() {
            return {
                isActive: false
            }
        },
        onShareAppMessage(res) {
            if (res.from === 'button') {
                // console.log(res)
                return {
                    title: '自定义转发标题',
                    path: '/page/user?id=123',
                    success: res => {
                        this.msg('转发成功')
                        this.isActive = false;
                    },
                    fail: err => {
                        this.msg('转发失败')
                    }
                }
            }
        },
        mounted() {
            // console.log(this.util,this.msg)
        },
        methods: {
            share() {
                this.isActive = true;
            },
            loginEmit(val) {
                // console.log(val)
            },

        },
        components: {
            login
        }
    }
</script>

<style lang="less">
    .product-details {
        background: #f5f5f5;
        height: 100%;
        position: relative;
        overflow: hidden;
        .shop_top {
            width: 100%;
            height: 520rpx;
            position: relative;
            .shop_img {
                width: 100%;
                height: 100%;
            }
            .share {
                position: absolute;
                bottom: 20rpx;
                right: 20rpx;
                width: 60rpx;
                height: 60rpx;
            }
        }
        .share_mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10;
            transition: all 0.1s ease;
        }
        .share_card {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            background: #ccc;
            transform: translateY(100%);
            transition: transform 0.4s ease;
            z-index: 20;
            .share_card_btn {
                display: flex;
                align-items: center;
                justify-content: space-around;
                padding: 30rpx;
                box-sizing: border-box;
                .btn_item {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    img {
                        width: 80rpx;
                        height: 80rpx;
                    }
                    p {
                        color: #666;
                        font-size: 24rpx;
                        text-align: center;
                        padding: 5rpx 0;
                    }
                    .btn_send {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        border: none;
                    }
                }
            }
            .cancel {
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                text-align: center;
                color: #666;
                font-size: 28rpx;
                background: #fff;
            }
        }
        .share_card_active {
            transform: translateY(0);
        }
    }
    .button-hover {
        background: transparent;
    }
</style>
