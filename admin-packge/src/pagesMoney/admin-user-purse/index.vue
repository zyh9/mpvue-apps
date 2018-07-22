<template>
    <div class="admin_my_purse">
        <div class="bgc"></div>
        <div class="small_card">
            <div class="my_purse_top">
                <p>{{ShopPlatType=='plat'?'可用余额(元)':'累计收入(元)'}}</p>
                <h1>{{purseInfo.AvailableMoney}}</h1>
                <div class="shop_info_list" v-if="ShopPlatType=='plat'">
                    <div class="recharge" @click="withdraw">提现</div>
                </div>
            </div>
        </div>
        <div class="purse_ul">
            <div class="purse_lis">
                <i class="icon icon_inTransaction"></i>
                <p>交易中</p>
                <span>&yen;{{purseInfo.TradeMoney}}</span>
            </div>
            <div class="purse_lis" v-if="ShopPlatType=='plat'">
                <i class="icon icon_inWithdraw"></i>
                <p>提现中</p>
                <span>&yen;{{purseInfo.WithdrawMoney}}</span>
            </div>
            <div class="purse_lis" @click="walletDetails">
                <i class="icon icon_walletDetails"></i>
                <p>{{ShopPlatType=='plat'?'钱包明细':'交易明细'}}</p>
                <i class="icon icon_arrowRight"></i>
            </div>
        </div>
        <div class="purse_ul" v-if="ShopPlatType=='plat'">
            <div class="purse_lis" @click="password">
                <i class="icon icon_passwordMe"></i>
                <p>支付密码管理</p>
                <i class="icon icon_arrowRight"></i>
            </div>
            <div class="purse_lis" @click="myBankCard">
                <i class="icon icon_bankCard"></i>
                <p>我的银行卡</p>
                <i class="icon icon_arrowRight"></i>
            </div>
            <!-- <div class="purse_siw">
                            <p>优先使用商城余额支付跑腿费</p>
                            <switch @change="businessChange" :checked='PayPaoTuiType==1?true:false' class="witch" />
                        </div> -->
        </div>
        <div class="purse_ul">
            <div class="purse_lis" @click="paotuiWallet">
                <i class="icon icon_paotuiWallet"></i>
                <p>我的跑腿钱包</p>
                <i class="icon icon_arrowRight"></i>
            </div>
            <div class="purse_lis" @click="dadaWallet">
                <i class="icon icon_dadaWallet"></i>
                <p>我的达达钱包</p>
                <i class="icon icon_arrowRight"></i>
            </div>
        </div>
        <div class="purse_ul">
            <div class="purse_lis" @click="shopPackage">
                <i class="icon icon_shop_buy"></i>
                <p>店铺套餐</p>
                <i class="icon icon_arrowRight"></i>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                purseInfo: {
                    AvailableMoney: 0,
                    TradeMoney: 0,
                    WithdrawMoney: 0
                },
                PayPaoTuiType: '',
                isContinue: true,
                ShopPlatType: false
            };
        },
        onShow() {
            this.ShopPlatType = false;
            this.userWallet()
            if (wx.getStorageSync('shopInfo')) {
                this.PayPaoTuiType = wx.getStorageSync('shopInfo').PayPaoTuiType;
                this.ShopPlatType = wx.getStorageSync('shopInfo').ShopPlatType == 1 ? 'plat' : 'vip';
            }
            console.log(this.ShopPlatType)
        },
        mounted() {},
        methods: {
            /* 跳转店铺套餐 */
            shopPackage() {
                wx.navigateTo({
                    url: '/pagesMoney/admin-shop-setmeal'
                })
            },
            /* 去提现 */
            withdraw() {
                if (this.purseInfo.CardNum) {
                    wx.navigateTo({
                        url: "/pagesMoney/admin-user-withdraw"
                    });
                } else {
                    this.msg('你还没有绑定银行卡，请先绑定银行卡')
                }
            },
            password() {
                if (this.purseInfo.CardNum) {
                    wx.navigateTo({
                        url: "/pagesMoney/pay-password-management"
                    });
                } else {
                    this.msg('你还没有绑定银行卡，请先绑定银行卡')
                }
            },
            walletDetails() {
                if (!this.isContinue) {
                    this.msg('店铺未审核，暂不支持操作')
                    return;
                }
                wx.navigateTo({
                    url: "/pagesMoney/wallet-details?type=1"
                });
            },
            myBankCard() {
                if (!this.isContinue) {
                    this.msg('店铺未审核，暂不支持操作')
                    return;
                }
                wx.navigateTo({
                    url: "/pagesMoney/my-bank-card"
                });
            },
            paotuiWallet() {
                wx.navigateTo({
                    url: "/pagesMoney/paotui-wallet"
                });
            },
            dadaWallet() {
                wx.navigateTo({
                    url: "/pagesMoney/dada-wallet"
                });
            },
            userWallet() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/ShopWallet',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID,
                    }
                }).then(res => {
                    this.purseInfo = res.Body;
                    this.isContinue = true;
                    wx.setStorageSync('purseInfo', this.purseInfo)
                }).catch(err => {
                    /* 店铺未审核 */
                    if (err.State == -1005) {
                        this.isContinue = false;
                    }
                    this.msg(err.Msg)
                })
            },
            businessChange(e) {
                let PayPaoTuiType = -1;
                //1商城账号支付 2跑腿自有账号支付
                if (e.target.value) {
                    PayPaoTuiType = 1;
                } else {
                    PayPaoTuiType = 2;
                }
                this.util.post({
                    url: '/api/Merchant/ShopManage/ChangeShopPayPaoTuiType',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID,
                        PayPaoTuiType: PayPaoTuiType
                    }
                }).then(res => {
                    let shopInfo = wx.getStorageSync('shopInfo');
                    shopInfo.PayPaoTuiType = PayPaoTuiType;
                    wx.setStorageSync('shopInfo', shopInfo)
                }).catch(err => {
                    this.msg(err.Msg)
                })
            }
        },
        components: {},
        computed: {}
    };
</script>

<style lang="less">
    page {
        background: #efeef4;
    }
    .admin_my_purse {
        background: #efeef4;
        overflow-y: scroll;
        box-sizing: border-box;
        padding-top: 20rpx;
        .small_card {
            margin: 0 25rpx;
            background: #fff;
            z-index: 100;
            position: relative;
        }
        .bgc {
            height: 165rpx;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            background: #3c59ee;
        }
        .my_purse_top {
            margin: 0 auto 24rpx;
            padding: 40rpx 48rpx 23rpx;
            p {
                color: #999;
                font-size: 24rpx;
            }
            h1 {
                color: #1a1a1a;
                font-size: 90rpx;
            }
        }
        .shop_info_list {
            padding-top: 30rpx;
            .recharge {
                width: 100%;
                height: 101rpx;
                line-height: 74rpx;
                text-align: center;
                margin: 0 auto;
                background: url("../../../static/wallet_button_shop.png") no-repeat;
                background-size: 100% 100%;
                font-size: 28rpx;
                color: #fff;
            }
        }
        .purse_ul {
            background: #fff;
            margin-bottom: 20rpx;
            &:last-child {
                margin-bottom: 0;
            }
            .purse_lis {
                margin-left: 36rpx;
                padding: 35rpx 32rpx 35rpx 0;
                display: flex;
                align-items: center;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1px solid #ebebeb;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                &:last-child {
                    border: none;
                    &::after {
                        display: none;
                    }
                }
                p {
                    flex: 1;
                    font-size: 30rpx;
                    margin-left: 20rpx;
                    color: #1a1a1a;
                }
                span {
                    font-size: 30rpx;
                    color: #999999;
                }
            }
            .purse_siw {
                background: #fff;
                padding: 35rpx 20rpx 35rpx 35rpx;
                display: flex;
                align-items: center;
                border-bottom: 1rpx solid #ebebeb;
                p {
                    flex: 1;
                    font-size: 30rpx;
                    color: #1a1a1a;
                }
                .witch {
                    transform: scale(0.8);
                }
            }
        }
    }
</style>
