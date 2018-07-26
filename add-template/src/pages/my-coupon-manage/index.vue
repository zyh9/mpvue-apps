<template>
    <div class="couponList">
        <div class="coupon">
            <div v-if="couponList.length">
                <div class="title_text">
                    <i class="icon icon_coupon"></i>
                    <span>优惠券</span>
                </div>
                <ul class="list">
                    <li v-for='(v,i) in couponList' :key='i' :class="'couponStatus'+v.Status" @click='receiveCoupon(v)'>
                        <p>满{{v.MinimumAmount}}元减</p>
                        <div class="money"><span class="number">{{v.Amount}}</span><span>元</span></div>
                    </li>
                </ul>
                <div class="tip">优惠券规则：商品费与打包费达到满减额度方能使用优惠券，部分优惠券无法与折扣商品共同使用。</div>
            </div>
            <!-- <div v-if="shopInfoList.PaotuiPriceRule">
                                <div class="title_text">
                                    <i class="icon icon_set"></i><span>减免配送费</span>
                                </div>
                                <div class="text">{{shopInfoList.PaotuiPriceRule}}</div>
                                <div class="tip">配送费满减规则：商品费与打包费达到满减额度方能使用配送费满减，配送费满减不与其他任何活动冲突，可直接享受。</div>
                            </div> -->
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isBindPhone: true,
                couponList: [],
                //优惠券文字
                CouponText: '',
            }
        },
        onLoad() {},
        onReady() { //进入页面触发，回退不触发
            this.isBindPhone = wx.getStorageSync('loginInfo').IsBindPhone == 1 ? false : true;
            this.getCoupon();
        },
        methods: {
            /* 获取优惠券列表 */
            getCoupon() {
                this.util.post({
                    url: '/api/Customer/Browse/ShopIndexCouponList',
                    data: {
                        // ShopID: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                        ShopID: 1817162813555718
                    }
                }).then(res => {
                    let getCouponText = res.Body.map(e => {
                        return `满${e.MinimumAmount}元减${e.Amount}元；`;
                    })
                    this.CouponText = getCouponText.join('').slice(0, -1);
                    // console.log(this.CouponText)
                    this.couponList = res.Body;
                }).catch(err => {
                    this.msg(error.Msg)
                })
            },
            /* 领取优惠券 */
            receiveCoupon(v) {
                if (this.isBindPhone) {
                    this.msg('您还没有登录哦')
                    setTimeout(_ => {
                        wx.navigateTo({
                            url: '/pages/login/main'
                        })
                    }, 1000)
                } else {
                    // console.log(v)
                    if (v.Status == 0) {
                        this.util.post({
                            url: '/api/Customer/Coupon/GetCoupon',
                            data: {
                                CouponID: v.ID,
                            }
                        }).then(res => {
                            this.msg('领取成功')
                            //更新领取状态
                            this.util.post({
                                url: '/api/Customer/Browse/ShopIndexCouponList',
                                data: {
                                    // ShopID: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
                                    ShopID: 1817162813555718
                                }
                            }).then(result => {
                                this.couponList = result.Body;
                            }).catch(error => {
                                this.msg(error.Msg)
                            })
                        }).catch(err => {
                            this.msg(err.Msg)
                        })
                    } else {
                        this.msg('您已经领取过了哦')
                    }
                }
            }
        },
        computed: {},
    }
</script>

<style lang="less">
    .couponList {
        background: #fff;
        .top {
            margin: 0 36rpx 8rpx;
            position: relative;
            padding: 40rpx 0;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-top: 1px solid #ebebeb;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: scaleY(.5);
                transform-origin: 0 0;
            }
            h2.title {
                font-size: 36rpx;
                color: #1a1a1a;
                text-align: center;
                font-weight: 900;
                line-height: 36rpx;
                margin-bottom: 14rpx;
            }
            p {
                font-size: 24rpx;
                color: #666;
                text-align: center;
                line-height: 24rpx;
            }
        }
        .coupon {
            margin: 0 36rpx;
            padding-bottom: 40rpx;
            max-height: 560rpx;
            overflow-y: scroll;
            .title {
                font-size: 30rpx;
                color: #1a1a1a;
                padding: 30rpx 0;
                margin-top: 12rpx;
                .icon {
                    margin-right: 10rpx;
                }
            }
            .title_text {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 30rpx 0 16rpx;
                span {
                    color: #1a1a1a;
                    font-size: 30rpx;
                }
                .icon {
                    margin-right: 10rpx;
                    width: 32rpx;
                    height: 32rpx;
                }
            }
            ul.list {
                li {
                    width: 214rpx;
                    height: 109rpx;
                    background-image: url('../../../static/couponBg.png');
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 100%;
                    margin-bottom: 17rpx;
                    display: inline-block;
                    &.couponStatus1 {
                        background-image: url('../../../static/couponBg1.png');
                    }
                    &.couponStatus2 {
                        background-image: url('../../../static/couponBg2.png');
                    }
                    &:nth-child(3n-1) {
                        margin: 0 16rpx 17rpx;
                    }
                    p {
                        text-align: left;
                        font-size: 18rpx;
                        color: rgba(255, 255, 255, 0.7);
                        padding-left: 12rpx;
                        line-height: 23rpx;
                        padding-top: 7rpx;
                    }
                    .money {
                        width: 146rpx;
                        text-align: center;
                        line-height: 65rpx;
                        span {
                            font-size: 24rpx;
                            color: #fff;
                            &.number {
                                font-size: 65rpx;
                            }
                        }
                    }
                }
            }
            .tip {
                font-size: 24rpx;
                color: #999;
                line-height: 36rpx;
            }
            .text {
                font-size: 26rpx;
                color: #ff4d3a;
                line-height: 36rpx;
                padding-bottom: 8rpx;
            }
        }
    }
</style>
