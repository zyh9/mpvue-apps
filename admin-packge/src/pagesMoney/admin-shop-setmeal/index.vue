<template>
    <div class="container" v-if="block">
        <div class="bannerBox_pt" :class="{bannerBox_zx:ifEdition == 2}">
            <div class="bannerDate" :class="{bannerDate2:ifEdition == 2}" v-if="ifOntrial == 1">
                当前服务有效期至{{effectiveDate}}
            </div>
            <div class="bannerTit" v-if="ifEdition == 1">平台版优小U</div>
            <div class="bannerTit2" v-if="ifEdition == 2">专享版优小U</div>
            <div class="bannerText" v-if="ifEdition == 1">
                <span>无需认证</span>
                <span>人人都可开店</span>
            </div>
            <div class="bannerText2" v-if="ifEdition == 2">
                <span>独立店铺</span>
                <span>流量独享</span>
            </div>
        </div>
        <div class="priceBox">
            <div class="priceBoxCont">
                <div class="w41">
                    <div class="priceBoxCont_cont">
                        <div class="priceBoxCont_cont_pad">
                            <div class="originalPrice">原价{{RechargeSections.OriginalPrice}}元/年</div>
                            <div class="currentPrice">
                                现价
                                <span class="currentPriceMoney">{{RechargeSections.Price}}</span> 元/年
                            </div>
                            <div class="setmealBtn">
                                <div v-if="ifEdition == 1" class="red_Btn setmealBtnTop2" @click="pay">
                                    订购平台版
                                </div>
                                <div v-else class="blue_Btn setmealBtnTop" @click="pay">
                                    订购专享版
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="introduceBox">
            <div class="w90">
                <div class="tableHead">
                    <div class="tableHeadTit">优小U店铺平台版</div>
                    <div class="tableHeadCont">
                        {{ifEdition == 1 ? '优小U店铺平台版为在优小U自主平台上的店铺，平台名字为“优小店”，买家可通过优小店小程序快速找到您的店铺，也可以通过扫码直进入您的店铺。' : '优小U店铺专享版是为您单独打造的小程序，在微信中用户可直接通过小程序找到您的店铺，并可以将您的店铺会员卡、公众号等连接打通，形成有效的用户社群群体，让您的生意越做越有。'}}
                    </div>
                    <!-- <div v-if="ifEdition == 2" class="tableHeadCont">
                                    优小U店铺专享版是为您单独打造的小程序，在微信中用户可直接通过小程序找到您的店铺，并可以将您的店铺会员卡、公众号等连接打通，形成有效的用户社群群体，让您的生意越做越有。
                                </div> -->
                </div>
                <div class="tableBody" v-if="ifEdition == 1">
                    <p>
                        <i class="icon icon_trade"></i>
                        <span>订单交易</span>
                    </p>
                    <p>
                        <i class="icon icon_promotion"></i>
                        <span>优惠促销</span>
                    </p>
                    <p>
                        <i class="icon icon_goods"></i>
                        <span>商品管理</span>
                    </p>
                    <p>
                        <i class="icon icon_finance"></i>
                        <span>财务管理</span>
                    </p>
                    <p>
                        <i class="icon icon_checkin"></i>
                        <span>平台入驻</span>
                    </p>
                </div>
                <div class="tableBody" v-if="ifEdition == 2">
                    <p>
                        <i class="icon icon_trade2"></i>
                        <span>订单交易</span>
                    </p>
                    <p>
                        <i class="icon icon_promotion2"></i>
                        <span>优惠促销</span>
                    </p>
                    <p>
                        <i class="icon icon_goods2"></i>
                        <span>商品管理</span>
                    </p>
                    <p>
                        <i class="icon icon_finance2"></i>
                        <span>财务管理</span>
                    </p>
                    <p>
                        <i class="icon icon_checkin2"></i>
                        <span>独立小程序</span>
                    </p>
                    <p>
                        <i class="icon icon_nearby2"></i>
                        <span>附近店铺功能</span>
                    </p>
                    <p>
                        <i class="icon icon_save2"></i>
                        <span>保存入口至桌面</span>
                    </p>
                </div>
                <div class="tableFoot" v-if="shopInfo.Status == 2||shopInfo.Status == -4">
                    <span class="text2" v-if="shopInfo.Status == 2">免费体验时间至<span class="text3" :class="{text:ifEdition == 1}">{{surplusDay}}</span></span>
                    <span class="text2" v-if="shopInfo.Status == -4">免费体验时间<span class="text3" :class="{text:ifEdition == 1}">已过期</span></span>
                </div>
            </div>
        </div>
        <div class="orderRecordBox">
            <div class="w90">
                <div v-if="ifEdition == 1" class="orderRecordBtn2" @click="goOrderRecord">查看订购记录 <i class="icon icon_redArrow"></i></div>
                <div v-if="ifEdition == 2" class="orderRecordBtn" @click="goOrderRecord">查看订购记录 <i class="icon icon_blueArrow"></i></div>
            </div>
        </div>
        <div class="setmealBox">
            <div class="w90">
                <div v-if="ifEdition == 1" class="red_Btn setmealBtn2">
                    <p @click="pay">订购平台版</p>
                </div>
                <div v-if="ifEdition == 2" class="setmealBtn">
                    <p @click="pay">订购专享版</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //店铺信息
                shopInfo: {},
                //判断  平台版/专享版
                ifEdition: -1,
                //判断  试用/订购
                ifOntrial: -1,
                //有效日期
                effectiveDate: '',
                //原价
                // originalPrice: '',
                //现价
                // currentPrice: '',
                //试用总天数
                trialDays: '',
                //剩余天数
                surplusDay: '',
                //充值档位 (包含id  原价  现价'充值金额'  时长  使用天数)
                RechargeSections: {},
                //点击支付
                ifClickPay: false,
                block: false
            }
        },
        onReady() {},
        onLoad() {},
        onShow() {
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.ifClickPay = false;
            this.ifEdition = this.ifOntrial = -1;
            this.getShopInfo();
            // 缓存 获取店铺信息
            this.shopInfo = wx.getStorageSync('shopInfo');
            console.log(this.shopInfo)
            // 判断 版(1平台  2专享)
            if (this.shopInfo.ShopPlatType == 1) {
                this.ifEdition = 1;
            } else {
                this.ifEdition = 2;
            }
            //有效期到期时间
            this.effectiveDate = this.shopInfo.EndDay != "" ? this.util.FmtTime(new Date(this.shopInfo.EndDay), 'yyyy-MM-dd') : this.shopInfo.EndDay;
            //用有效期 判断是否支付过套餐
            // if(this.effectiveDate) {}
            if (this.shopInfo.Status == 1) {
                this.ifOntrial = 1;
            } else if(this.shopInfo.Status == -4) {
                this.ifOntrial = -4;
            } else {
                this.ifOntrial = 2;
            }
            //试用天数
            // this.trialDays = this.shopInfo.ShopProbation;
            //剩余天数
            this.surplusDay = this.shopInfo.EndDay != "" ? this.util.FmtTime(new Date(this.shopInfo.EndDay), 'yyyy-MM-dd') : this.shopInfo.EndDay;
            //获取充值档位
            this.getRechargeSections();
        },
        methods: {
            //店铺信息
            getShopInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopDetail',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID
                    }
                }).then(res => {
                    console.log(res)
                    if (res.State == 1) {
                        wx.setStorageSync('shopInfo', res.Body);
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            //获取充值档位
            getRechargeSections() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetRechargeSections',
                    data: {
                        ShopType: wx.getStorageSync('shopInfo').ShopPlatType,
                        CityName: wx.getStorageSync('shopInfo').ShopCity
                    }
                }).then(res => {
                    console.log(res)
                    if (res.State == 1) {
                        wx.hideLoading();
                        this.block = true;
                        res.Body.RechargeSections.forEach(element => {
                            if (element.Duration == 12) {
                                this.RechargeSections = element
                            }
                        });
                    }
                }).catch(err => {
                    this.msg(err)
                })
            },
            //跳转订购记录
            goOrderRecord() {
                wx.navigateTo({
                    url: '/pagesMoney/order-record'
                });
            },
            //支付
            pay() {
                //防止连续多次点击
                if (this.ifClickPay) {
                    return
                }
                console.log(this.RechargeSections)
                if (!this.RechargeSections) {
                    this.msg('暂无充值档位');
                } else {
                    this.ifClickPay = true;
                    //这里需要判断平台/专享
                    this.util.post({
                        url: '/api/Merchant/ShopManage/RechargeShop',
                        data: {
                            ShopId: wx.getStorageSync('loginInfo').ShopID || '',
                            RechargeSectionId: this.RechargeSections.Id
                        }
                    }).then(res => {
                        console.log(res)
                        if (res.State == 1) {
                            wx.requestPayment({
                                timeStamp: res.Body.wxPayInfo.timeStamp,
                                nonceStr: res.Body.wxPayInfo.nonceStr,
                                package: res.Body.wxPayInfo.package,
                                signType: res.Body.wxPayInfo.signType,
                                paySign: res.Body.wxPayInfo.paySign,
                                success: res => {
                                    this.ifClickPay = false;
                                    wx.navigateTo({
                                        url: '/pagesMoney/admin-order-result'
                                    });
                                },
                                fail: err => {
                                    this.ifClickPay = false;
                                    this.msg('您已取消支付');
                                }
                            })
                        } else {
                            this.msg(res.Msg)
                        }
                    })
                }
            }
        },
        components: {}
    };
</script>

<style lang="less">
    .w90 {
        padding: 0 36rpx;
    }
    .w41 {
        padding: 0 41rpx;
    }
    .container {
        // height: 100%;
        background: #fafafa; // overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .bannerBox_pt {
            background-image: url('https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/red-img.png');
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            height: 456rpx;
            background-size: 100% 100%;
            .bannerDate {
                width: 348rpx;
                height: 48rpx;
                background-color: #e30303;
                border-radius: 0px 24rpx 24rpx 0px;
                font-size: 22rpx;
                font-weight: normal;
                color: #ffc7a8;
                text-align: center;
                line-height: 48rpx;
                top: 26rpx;
                left: 0;
                position: absolute;
            }
            .bannerDate2 {
                background-color: #232c68;
                color: #939fca;
            }
            .bannerTit {
                font-family: PingFangSC-Semibold;
                font-size: 72rpx;
                font-weight: bold;
                letter-spacing: 1px;
                color: #fff0ea;
                text-align: center;
                line-height: 72rpx;
                margin-top: 110rpx;
            }
            .bannerTit2 {
                font-family: PingFangSC-Medium;
                font-size: 48rpx;
                font-weight: normal;
                letter-spacing: 0px;
                color: #e3c384;
                text-align: center;
                line-height: 48rpx;
                margin-top: 110rpx;
                span:last-child {
                    margin-left: 30rpx;
                }
            }
            .bannerText {
                font-family: PingFangSC-Medium;
                font-size: 48rpx;
                font-weight: normal;
                letter-spacing: 0px;
                color: #ffb2b2;
                text-align: center;
                line-height: 48rpx;
                margin-top: 38rpx;
                span:last-child {
                    margin-left: 30rpx;
                }
            }
            .bannerText2 {
                font-family: PingFangSC-Medium;
                font-size: 48rpx;
                font-weight: normal;
                letter-spacing: 0px;
                color: #7a90cc;
                text-align: center;
                line-height: 48rpx;
                margin-top: 38rpx;
                span:last-child {
                    margin-left: 30rpx;
                }
            }
        }
        .bannerBox_zx {
            background-image: url('https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/blue-img.png');
            background-size: 100% 100%;
        }
        .priceBox {
            position: relative;
            width: 100%;
            height: 332rpx;
            text-align: center;
            .priceBoxCont {
                position: absolute;
                top: -105rpx;
                width: 100%;
                height: 408rpx;
                .priceBoxCont_cont {
                    background: #fff;
                    padding: 24rpx;
                    box-shadow: 0px 10px 11px #ebebeb;
                    .priceBoxCont_cont_pad {
                        border: solid 1px #e3c384;
                        height: 360rpx;
                        .originalPrice {
                            font-family: PingFangSC-Regular;
                            font-size: 28rpx;
                            font-weight: normal;
                            font-stretch: normal;
                            line-height: 28rpx;
                            letter-spacing: 0px;
                            color: #656782;
                            margin-top: 54rpx;
                        }
                        .currentPrice {
                            margin-top: 25rpx;
                            font-family: PingFangSC-Regular;
                            font-size: 30rpx;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 0px;
                            color: #656782;
                            .currentPriceMoney {
                                font-family: PingFangSC-Semibold;
                                font-size: 84rpx;
                                font-weight: normal;
                                font-stretch: normal;
                                letter-spacing: 0px;
                                color: #363b4c;
                                line-height: 84rpx;
                            }
                        }
                        .setmealBtn {
                            margin-top: 45rpx;
                            .setmealBtnTop {
                                width: 400rpx;
                                height: 102rpx; // background-image: url('../../static/blue-btn.png');
                                background-size: 100% 100%;
                                font-size: 30rpx;
                                font-weight: normal;
                                font-stretch: normal;
                                letter-spacing: 0px;
                                color: #ffffff;
                                text-align: center;
                                line-height: 88rpx;
                                margin: 0 auto;
                            }
                            .setmealBtnTop2 {
                                width: 400rpx;
                                height: 102rpx; // background-image: url('../../static/red-btn.png');
                                background-size: 100% 100%;
                                font-size: 30rpx;
                                font-weight: normal;
                                font-stretch: normal;
                                letter-spacing: 0px;
                                color: #ffffff;
                                text-align: center;
                                line-height: 88rpx;
                                margin: 0 auto;
                            }
                        }
                    }
                }
            }
        }
        .introduceBox {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            .tableHead {
                margin-top: 30rpx;
                .tableHeadTit {
                    font-family: PingFangSC-Medium;
                    font-size: 34rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #363b4d;
                    text-align: center;
                    line-height: 34rpx;
                    font-weight: bold;
                }
                .tableHeadCont {
                    margin-top: 35rpx;
                    font-family: PingFangSC-Regular;
                    font-size: 26rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 48rpx;
                    letter-spacing: 0px;
                    color: #5e6185;
                    text-align: left;
                }
            }
            .tableBody {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                flex-wrap: wrap;
                margin-top: 60rpx;
                p {
                    width: 327rpx;
                    height: 104rpx;
                    background-color: #ffffff;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    line-height: 104rpx;
                    align-items: center;
                    margin-bottom: 25rpx;
                    i {
                        align-items: center;
                        margin-left: 22rpx;
                    }
                    span {
                        align-items: center;
                        font-family: PingFangSC-Medium;
                        font-size: 28rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #656782; // line-height: 28rpx;
                        margin-left: 30rpx;
                    }
                }
            }
            .tableFoot {
                width: 347rpx;
                height: 64rpx;
                line-height: 64rpx;
                background-color: #ffffff;
                border-radius: 32rpx;
                margin: 0 auto;
                text-align: center;
                margin-top: 56rpx;
                .text1 {
                    font-family: PingFangSC-Regular;
                    font-size: 24rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 24rpx;
                    letter-spacing: 0px;
                    color: #363b4c;
                }
                .text2 {
                    font-family: PingFangSC-Regular;
                    font-size: 24rpx;
                    font-weight: normal;
                    letter-spacing: 0px;
                    color: #363b4c;
                }
                .text3 {
                    font-family: PingFangSC-Semibold;
                    font-size: 24rpx;
                    font-weight: normal;
                    letter-spacing: 0px;
                    color: #3c59ee;
                }
                .text {
                    color: #ee5e46;
                }
            }
        }
        .orderRecordBox {
            .orderRecordBtn {
                font-family: PingFangSC-Regular;
                font-size: 24rpx;
                font-weight: normal;
                font-stretch: normal;
                line-height: 24rpx;
                letter-spacing: 0px;
                color: #3c59ee;
                text-align: center;
                padding-top: 20rpx;
                span {
                    margin-left: 7rpx;
                    line-height: 24rpx;
                }
            }
            .orderRecordBtn2 {
                font-family: PingFangSC-Regular;
                font-size: 24rpx;
                font-weight: normal;
                font-stretch: normal;
                line-height: 24rpx;
                letter-spacing: 0px;
                color: #d24028;
                text-align: center;
                padding-top: 20rpx;
                span {
                    margin-left: 7rpx;
                    line-height: 24rpx;
                }
            }
        }
        .setmealBox {
            padding: 60rpx 0;
            .setmealBtn {
                p {
                    height: 88rpx;
                    background-color: #3c59ee;
                    font-family: PingFangSC-Regular;
                    font-size: 28rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 88rpx;
                    letter-spacing: 0px;
                    color: #ffffff;
                    text-align: center;
                }
            }
            .setmealBtn2 {
                p {
                    text-align: center;
                    height: 88rpx;
                    font-family: PingFangSC-Regular;
                    font-size: 28rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 88rpx;
                    letter-spacing: 0px;
                    color: #ffffff;
                    background-size: 100% 100%;
                }
            }
        }
    }
</style>
