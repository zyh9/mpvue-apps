<template>
    <div class="my_vip">
        <div class="no_vip" v-if="false">
            <div class="vip_con">
                <img class="vip_bg" src="../../../static/red-vip.png" alt="">
                <div class="vip_card_info">
                    <img src="" alt="">
                    <p>什么鬼</p>
                </div>
            </div>
            <div class="vip_btn">立即成为会员</div>
        </div>
        <div class="is_vip">
            <div class="vip_card_con">
                <div class="vip_con">
                    <img class="vip_bg" src="../../../static/red-vip.png" alt="">
                    <div class="vip_card_info">
                        <img src="" alt="">
                        <p>什么鬼</p>
                    </div>
                </div>
                <img class="qrcode" src="" alt="">
                <p class="qrcode_num">4656-4546-4565-13256</p>
                <div class="pay_vip">
                    <i class="icon icon_price"></i>
                    <p>余额支付</p>
                    <i class="icon icon_red_pay"></i>
                </div>
            </div>
            <div class="vip_card_bot" :class="{vip_card_bot_active:active}">
                <p class="rmb">456</p>
                <div class="pay_cart_money">
                    <p>卡内余额(元)</p>
                    <i class="icon icon_money_right"></i>
                </div>
                <div class="recharge">充值</div>
                <div class="options">
                    <p>我的会员卡</p>
                </div>
                <img src="../../../static/qrcode.png" alt="" @click="rotate" :class="{rotate_deg:active}">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                active: false
            }
        },
        onShow() {},
        methods: {
            rotate() {
                this.active = !this.active;
            }
        },
        computed: {},
    }
</script>

<style lang="less">
    page {
        background: #fff;
    }
    .my_vip {
        height: 100%;
        position: relative;
        .no_vip,
        .is_vip {
            height: 100%;
            padding: 36rpx;
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: scroll;
            .vip_con {
                width: 100%;
                height: 380rpx;
                position: relative;
                .vip_bg {
                    width: 100%;
                    height: 380rpx;
                }
                .vip_card_info {
                    position: absolute;
                    top: 36rpx;
                    left: 36rpx;
                    width: 400rpx;
                    height: 72rpx;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    img {
                        width: 72rpx;
                        height: 72rpx;
                        margin-right: 12rpx;
                    }
                    p {
                        font-size: 40rpx;
                        line-height: 72px;
                        color: #fff;
                    }
                }
            }
            .vip_btn {
                height: 88rpx;
                position: absolute;
                bottom: 0;
                left: 36rpx;
                right: 36rpx;
                margin-bottom: 36rpx;
                background-color: #f63910;
                border-radius: 6rpx;
                font-size: 30rpx;
                line-height: 88rpx;
                text-align: center;
                color: #fff;
            }
        }
        .is_vip {
            padding: 0;
        }
        .vip_card_con {
            background: #fafafa;
            padding: 36rpx 36rpx 0;
            overflow: hidden;
            position: relative;
            z-index: -1;
            display: flex;
            flex-direction: column;
            align-items: center;
            .qrcode {
                width: 358rpx;
                height: 154rpx;
                margin-top: 50rpx;
            }
            .qrcode_num {
                line-height: 30rpx;
                font-size: 28rpx;
                color: #666;
                text-align: center;
                height: 30rpx;
            }
            .pay_vip {
                height: 36rpx;
                display: flex;
                align-items: center;
                margin: 56rpx 0;
                p {
                    font-size: 28rpx;
                    color: #f63910;
                }
            }
        }
        .vip_card_bot {
            box-shadow: 0 -6rpx 20rpx rgba(184, 184, 184, 0.2);
            transition: margin 0.5s ease;
            margin-top: -572rpx;
            background: #fff;
            padding: 36rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            .rmb {
                font-size: 72rpx;
                color: #1a1a1a;
            }
            .pay_cart_money {
                height: 36rpx;
                display: flex;
                align-items: center;
                margin-bottom: 36rpx;
                p {
                    font-size: 24rpx;
                    color: #999;
                }
            }
            .recharge {
                width: 478rpx;
                height: 88rpx;
                background-color: #f63910;
                border-radius: 6px;
                font-size: 30rpx;
                color: #fff;
                line-height: 88rpx;
                text-align: center;
                margin-bottom: 56rpx;
            }
            .options {
                background: url('../../../static/black-right.png') no-repeat right center;
                background-size: 15rpx 25rpx;
                height: 140rpx;
                display: flex;
                align-items: center;
                width: 100%;
                position: relative;
                margin-bottom: 80rpx;
                p {
                    color: #1a1a1a;
                    font-size: 28rpx;
                }
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1px solid #ebebeb;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                    z-index: 10;
                }
                &:before {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1px solid #ebebeb;
                    position: absolute;
                    left: 0;
                    top: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                    z-index: 10;
                }
            }
            img {
                width: 138rpx;
                height: 138rpx;
                position: absolute;
                right: 40rpx;
                top: -69rpx;
                transform-origin: center;
                transform: rotate(0deg);
                transition: transform 0.5s ease;
            }
            .rotate_deg {
                transform: rotate(180deg);
            }
        }
        .vip_card_bot_active {
            margin-top: 0;
        }
    }
</style>
