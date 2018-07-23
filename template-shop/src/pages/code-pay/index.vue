<template>
    <div class="code_pay" v-if="block">
        <p class="title">付款给商户</p>
        <div class="pay_info">
            <p class="pay_title">支付金额</p>
            <div class="pay_money">
                <i>¥</i>
                <div class="input_val">
                    <p v-if="!val">请输入要支付的金额</p>
                    <input type="digit" v-model="val" maxlength="7" />
                </div>
            </div>
            <p class="pay_shop">您的款项将直接支付给：<span>{{ShopName}}</span></p>
        </div>
        <div class="pay_btn" :class="{payOk:val}" @click="payCode">确认付款</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                val: '',
                mapInfo: {},
                ShopId: '', //店铺id
                scene: '', //二维码信息获取
                block: false,
                ShopName: '',
                payOnoff: true,
            }
        },
        onLoad(options) {
            //options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
            this.scene = options.scene;
            wx.setStorageSync('scene', this.scene);
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.payOnoff = true;
            this.val = '';
            this.util.qqMapInfo().then(res => {
                console.log(res)
                this.mapInfo = wx.getStorageSync('QQmap')
                if (this.scene) {
                    this.sceneInfo()
                }
            }).catch(err => {
                console.log(err)
            })
        },
        methods: {
            //二维码信息获取
            sceneInfo() {
                this.util.post({
                    url: '/api/Customer/Browse/GetSceneInfo',
                    data: {
                        Scene: this.scene
                    }
                }).then(res => {
                    this.block = true;
                    wx.hideLoading();
                    this.ShopId = res.Body.ShopId;
                    wx.setStorageSync('ShopId', this.ShopId)
                    this.shopInfo()
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            shopInfo() {
                this.util.post({
                    url: '/api/Customer/Browse/GetShopInfo',
                    data: {
                        shopId: this.ShopId || '',
                    }
                }).then(res => {
                    this.ShopName = res.Body.ShopName;
                    // console.log(this.scene)
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            authMoney(val) {
                let reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
                return reg.test(val) ? true : false;
            },
            payCode() {
                // wx.redirectTo({
                //     url: `/pages/pay-error/main?money=${this.val}&shopId=${this.ShopId}`
                // })
                // return
                if (this.val) {
                    if (this.authMoney(this.val) && Number(this.val) > 0) {
                        if (this.payOnoff) {
                            this.payOnoff = false;
                            this.util.post({
                                url: '/api/Customer/Browse/CustomerPayment',
                                data: {
                                    ShopId: this.ShopId || '',
                                    Money: this.val || ''
                                }
                            }).then(res => {
                                wx.requestPayment({
                                    timeStamp: res.Body.wxPayInfo.timeStamp,
                                    nonceStr: res.Body.wxPayInfo.nonceStr,
                                    package: res.Body.wxPayInfo.package,
                                    signType: res.Body.wxPayInfo.signType,
                                    paySign: res.Body.wxPayInfo.paySign,
                                    success: payres => {
                                        this.payOnoff = true;
                                        console.log(payres)
                                        wx.redirectTo({
                                            url: `/pages/pay-ok/main?money=${this.val}&shopName=${this.ShopName}&shopId=${this.ShopId}`
                                        })
                                    },
                                    fail: error => {
                                        this.payOnoff = true;
                                        console.log(error.errMsg)
                                        if (error.errMsg == 'requestPayment:fail cancel') {
                                            this.msg('您已取消支付')
                                        } else { //支付失败
                                            wx.redirectTo({
                                                url: `/pages/pay-error/main?money=${this.val}&shopName=${this.ShopName}&shopId=${this.ShopId}`
                                            })
                                        }
                                    }
                                })
                            }).catch(err => {
                                this.payOnoff = true;
                                console.log(err)
                                this.msg(err.Msg)
                            })
                        }
                    } else {
                        this.val = '';
                        this.msg('请输入合法的金额')
                    }
                } else {
                    this.msg('您还没有输入支付金额哦')
                }
            }
        },
        components: {},
    }
</script>

<style lang="less">
    page {
        background: #eeeef4;
    }
    .code_pay {
        .title {
            height: 72rpx;
            font-size: 24rpx;
            line-height: 72rpx;
            color: #999999;
            padding-left: 36rpx;
        }
        .pay_info {
            background: #fff;
            padding: 30rpx 36rpx 0;
            .pay_title {
                font-size: 28rpx;
                line-height: 40rpx;
                color: #1a1a1a;
                margin-bottom: 55rpx;
            }
            .pay_money {
                position: relative;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                i {
                    font-size: 40rpx;
                    line-height: 80rpx;
                    color: #1a1a1a;
                }
                .input_val {
                    height: 80rpx;
                    flex: 1;
                    position: relative;
                    p {
                        font-size: 28rpx;
                        color: #999;
                        position: absolute;
                        top: 50%;
                        left: 20rpx;
                        transform: translateY(-50%);
                    }
                    input {
                        height: 80rpx;
                        padding-left: 20rpx;
                        font-size: 60rpx;
                        line-height: 80rpx;
                        color: #1a1a1a;
                        font-weight: 700;
                    }
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
            }
            .pay_shop {
                font-size: 24rpx;
                line-height: 88rpx;
                color: #999;
                span {
                    color: #1a1a1a;
                }
            }
        }
        .pay_btn {
            margin: 56rpx 36rpx 0;
            height: 88rpx;
            color: #fff;
            background: #ccc;
            font-size: 30rpx;
            line-height: 88rpx;
            text-align: center;
            border-radius: 6rpx;
        }
        .payOk {
            background-color:#ff4d3a;
        }
    }
</style>
