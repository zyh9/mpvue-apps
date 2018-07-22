<template>
    <div class="admin_my_purse">
        <div class="bgc"></div>
        <div class="small_card">
            <div class="my_purse_top">
                <p>可用余额(元)</p>
                <h1>{{Money}}</h1>
                <!-- <span>低于¥200，您的店铺将自动休息不能接单</span> -->
                <div class="shop_info_list">
                    <div class="withdraw" @click="dadaWallet(1)">充值</div>
                    <div class="withdraw ml20" @click="dadaWallet(2)">钱包明细</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                Money: 0
            };
        },
        onShow() {
            this.dadaDetails()
        },
        methods: {
            dadaDetails() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/DaDaWallet',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID || ''
                    }
                }).then(res => {
                    this.Money = res.Body.Money;
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            dadaWallet(type) {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetDaDaShopDetail',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID || ''
                    }
                }).then(res => {
                    // console.log(res.Body)
                    if (res.Body == null) {
                        this.msg('您需要先到跑腿配置开通达达配送')
                    } else {
                        wx.setStorageSync('dada', res.Body);
                        if (type == 1) {
                            setTimeout(_ => {
                                wx.navigateTo({
                                    url: '/pagesMoney/admin-dd-recharge'
                                })
                            }, 300)
                        } else {
                            setTimeout(_ => {
                                wx.navigateTo({
                                    url: "/pagesMoney/wallet-details?type=2"
                                })
                            }, 300)
                        }
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
        },
        components: {}
    };
</script>

<style lang="less">
    .admin_my_purse {
        height: 100%;
        background: #efeef4;
        overflow-x: hidden;
        overflow-y: scroll;
        padding-top: 20rpx;
        position: relative;
        box-sizing: border-box;
        .small_card {
            margin: 0 24rpx;
            background: #fff;
            z-index: 10;
            position: relative;
        }
        .bgc {
            height: 165rpx;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            background: #e37048;
        }
        .my_purse_top {
            margin: 0 auto 20rpx auto;
            padding: 40rpx 48rpx 23rpx;
            p {
                color: #999;
                font-size: 24rpx;
            }
            h1 {
                color: #1a1a1a;
                font-size: 90rpx;
            }
            span {
                display: block;
                font-size: 24rpx;
                color: #999;
            }
        }
        .shop_info_list {
            padding-top: 30rpx;
            display: flex;
            .withdraw {
                width: 50%;
                height: 101rpx;
                line-height: 74rpx;
                text-align: center;
                margin: 0 auto;
                background: url("../../../static/wallet_button_paotui.png") no-repeat;
                background-size: 100% 100%;
                font-size: 28rpx;
                color: #fff;
            }
            .ml20 {
                margin-left: 20rpx;
            }
        }
        .account {
            display: flex;
            background: #fff;
            padding: 35rpx;
            align-items: center;
            margin-bottom: 20rpx;
            .account-text {
                flex: 1;
                font-size: 30rpx;
                color: #1a1a1a;
            }
            .account-phone {
                font-size: 30rpx;
                color: #999999;
            }
        }
        .withdraw-text {
            display: flex;
            padding: 35rpx;
            font-size: 24rpx;
            color: #999;
            line-height: 32rpx;
        }
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .7);
            z-index: 20;
        }
        .layBox {
            position: absolute;
            top: 217rpx;
            left: 0;
            right: 0;
            margin: 0 auto;
            padding: 38rpx 30rpx 30rpx;
            margin: 0 90rpx;
            background: #fff;
            border-radius: 10rpx;
            box-sizing: border-box;
            z-index: 30;
            img.warn {
                width: 120rpx;
                height: 120rpx;
                margin: 14rpx auto 20rpx;
            }
            h2.title {
                text-align: center;
                font-size: 34rpx;
                color: #333333;
                line-height: 37rpx;
            }
            p {
                font-size: 26rpx;
                color: #666;
                line-height: 48rpx;
                padding-top: 30rpx;
                text-align: center;
            }
            .btn {
                width: 245rpx;
                height: 80rpx;
                background: #3c59ee;
                line-height: 80rpx;
                font-size: 30rpx;
                color: #fff;
                text-align: center;
                border: 1rpx solid #3c59ee;
                margin-top: 45rpx;
                &.on {
                    background: #fff;
                    color: #3c59ee;
                }
            }
            .bigBtn {
                width: 504rpx;
                height: 80rpx;
            }
            &.fail {
                .title {
                    text-align: center;
                    font-size: 34rpx;
                    color: #333333;
                    font-weight: 900;
                }
                p {
                    font-size: 28rpx;
                    color: #999;
                    text-align: center;
                }
            }
        }
    }
</style>
