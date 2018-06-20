<template>
    <div class="myCoupon">
        <template v-if='nullCouponList.length||couponList.length'>
            <div class="title" v-if="couponList.length"><span>可用优惠券{{couponList.length}}张</span></div>
            <ul class="list" v-if="couponList.length">
                <li v-for="(v,i) in couponList" :key="i">
                    <div class="coupon" :class="{shopCoupon:type==1}"  @click='check(v)'>
                        <div class="info">
                            <div class="item">
                                <div class="money"><span class="num">{{v.Amount}}</span><span>元</span></div>
                                <p class="tip">满{{v.MinimumAmount}}可用</p>
                            </div>
                            <div class="detail">
                                <div class="type">店铺优惠券</div>
                                <p class="tip">有效期至{{v.ExpireDate}}</p>
                            </div>
                        </div>
                        <i v-if='isHandler' class="icon icon_check" :class="{icon_checked:couponId==v.CouponID}"></i>
                    </div>
                    <div class="shopInfo"  v-if='type==1'>
                        <i class="icon icon_shop"></i> 
                        <div class="shopName">{{v.ShopName}}</div>
                        <i class="icon icon_arrowRight"></i>
                    </div>
                </li>
            </ul>
            <div class="title" v-if='nullCouponList.length'><span>不可用优惠券{{nullCouponList.length}}张</span></div>
            <ul class="list nullList" v-if='nullCouponList.length'>
                <li v-for="(v,i) in nullCouponList" :key="i">
                    <div class="coupon">
                    <div class="info">
                        <div class="item">
                            <div class="money"><span class="num">{{v.Amount}}</span><span>元</span></div>
                            <p class="tip">满{{v.MinimumAmount}}可用</p>
                        </div>
                        <div class="detail">
                            <div class="type">店铺优惠券</div>
                            <p class="tip">有效期至{{v.ExpireDate}}</p>
                            <p class="tip color_text">不可用原因</p>
                            <p class="tip other">{{v.UnavailableReason==1?'商品费+打包费未达到额度':v.UnavailableReason==2?'不可与其他优惠同时使用':'已过期'}}</p>
                        </div>
                    </div>
                    </div>
                </li>
            </ul>
            <div class="noMore">没有更多优惠券了</div>
</template>
        <div class="noData" v-if='!nullCouponList.length&&!couponList.length'>
            <img src="../../../static/noCoupon.png" alt="">
            <p v-if='type==1'>您还没有领取任何优惠券<br>关注店铺活动获得更多优惠哟</p>
            <p v-else>您还没有领取本店任何优惠券<br>快返回首页去看看有哪些优惠吧</p>
        </div>
        <cover-view v-if='isHandler' class="btn" @click="nonuse">不使用优惠券</cover-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                /* 选择优惠券 */
                isHandler: true,
                /* 选中的优惠券 */
                couponId: '',
                /* 可用优惠券列表 */
                couponList: [{
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:100,

                    ShopID:1770070357492740,
                    ShopName:'小吃店',
                    ShopLogo:'',

                    CouponID: 1,
                    UnavailableReason:''
                    },
                    {
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:200,

                    ShopID:1770070357492740,
                    ShopName:'小吃店',
                    ShopLogo:'',

                    CouponID: 2,
                    UnavailableReason:''

                    },
                ],
                /* 不可用优惠券列表 */
                nullCouponList: [{
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:200,
                    CouponID: 1,
                    UnavailableReason:1
                    },{
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:200,
                    CouponID: 1,
                    UnavailableReason:2
                    },{
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:200,
                    CouponID: 1,
                    UnavailableReason:3
                    }
                ],
                type: ''
            }
        },
        onShow() {
            this.couponId = '';
            /* 1:我的优惠券，全部展示,显示店铺名； 2：店铺优惠券；3：下单选择,选择优惠券 */
            this.type = this.$root.$mp.query.type;
            this.isHandler = this.type == 3 ? true : false;
            this.couponList=[];
            this.nullCouponList=[];
            if(this.type==3){
                this.getCouponChoose();
            }else{
                this.getCouponPersonal();
            }  
        },
        onPullDownRefresh() { //下拉刷新
            setTimeout(function(){
                wx.stopPullDownRefresh()
            },1000)
        },
        methods: {
            /* 选择优惠券 */
            check(v) {
                if(this.type==3){
                    /* 选择优惠券 */
                    this.couponId = v.CouponID;
                    setTimeout(_ => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 200)
                }else if(this.type==1){
                    /* 查看店铺 */
                    wx.navigateTo({
                        url: `/pages/my-store/main?ShopId=${v.ShopID}&type=1`
                    })
                }
                
            },
            /* 不使用优惠券 */
            nonuse() {
                this.couponId='';
                wx.navigateBack({
                    delta: 1
                });
            },
            /* 个人中心进入-获取优惠券 */
            getCouponPersonal(){
                this.util.post({
                    url: '/api/Customer/Coupon/PersonalCenterCoupon',
                    data: {}
                }).then(res => {
                    this.couponList=res.Body;
                    this.couponList=[{
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:100,

                    ShopID:1770070357492740,
                    ShopName:'小吃店',
                    ShopLogo:'',

                    CouponID: 1,
                    UnavailableReason:''
                    },
                    {
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:200,

                    ShopID:1770070357492740,
                    ShopName:'小吃店',
                    ShopLogo:'',

                    CouponID: 2,
                    UnavailableReason:''

                    },
                ];
                   
                }).catch(err => {
                    console.log(err)
                    this.msg(err.Msg)
                })
            },
            /* 提交订单进入-获取优惠券 */
            getCouponChoose(){
                this.util.post({
                    url: '/api/Customer/Coupon/ChooseCouponForOrder',
                    data: {
                        ShopID:'',
                        OrderPrice:'',/* 订单总价 */
                        IsOrderHasAcivity:'',/* 订单中是否包含活动 */
                    }
                }).then(res => {
                    this.couponList=res.Body.AvailableCoupons;
                    this.nullCouponList=res.Body.UnAvailableCoupons;

                    /* 模拟数据 */
                    this.couponList=[{
                        ExpireDate:'2018-08-12',
                        Amount:20,
                        MinimumAmount:100,

                        ShopID:1770070357492740,
                        ShopName:'小吃店',
                        ShopLogo:'',

                        CouponID: 1,
                        UnavailableReason:''
                        },
                        {
                        ExpireDate:'2018-08-12',
                        Amount:20,
                        MinimumAmount:200,

                        ShopID:1770070357492740,
                        ShopName:'小吃店',
                        ShopLogo:'',

                        CouponID: 2,
                        UnavailableReason:''

                        },
                    ];
                    this.nullCouponList= [{
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:200,
                    CouponID: 1,
                    UnavailableReason:1
                    },{
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:200,
                    CouponID: 1,
                    UnavailableReason:2
                    },{
                    ExpireDate:'2018-08-12',
                    Amount:20,
                    MinimumAmount:200,
                    CouponID: 1,
                    UnavailableReason:3
                    }
                ];
                   
                }).catch(err => {
                    console.log(err)
                    this.msg(err.Msg)
                })
            },
        },
        components: {}
    }
</script>

<style lang="less">
    page {
        background: #f3f3f3
    }
    .myCoupon {
        background: #f3f3f3;
        padding-bottom: 30rpx;
        
        .title {
            margin: 0 36rpx;
            height: 100rpx;
            text-align: center;
            position: relative;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-top: 1px solid #cccccc;
                position: absolute;
                top: 50rpx;
                left: 0;
                transform: scaleY(.5);
                transform-origin: 0 0;
                z-index: 1;
            }
            span {
                font-size: 24rpx;
                color: #1a1a1a;
                line-height: 100rpx;
                padding: 0 38rpx;
                background: #f3f3f3;
                position: relative;
                z-index: 2;
            }
        }
        ul.list {
            li {
                margin: 0 36rpx 24rpx;
                .coupon {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 228rpx;
                    background: #fff;
                    position: relative;
                    &:after,
                    &:before {
                        content: '';
                        display: block;
                        width: 38rpx;
                        height: 38rpx;
                        border-radius: 50%;
                        background: #f3f3f3;
                        position: absolute;
                        top: 95rpx;
                    }
                    &:after {
                        left: -19rpx;
                    }
                    &:before {
                        right: -19rpx;
                    }
                    &.shopCoupon{
                        height: 196rpx;
                        &:after,&:before{
                            top: 83rpx;
                        }
                    }
                    .info {
                        display: flex;
                        p.tip {
                            font-size: 20rpx;
                            color: #999;
                            // line-height: 36rpx;
                            line-height: 22rpx;
                            margin-top: 12rpx;
                            &.color_text {
                                color: #ff4d3a;
                            }
                            &.other {
                                position: relative;
                                padding-left: 15rpx;
                                &:after {
                                    content: '';
                                    display: block;
                                    width: 6rpx;
                                    height: 6rpx;
                                    border-radius: 50%;
                                    background: #ccc;
                                    position: absolute;
                                    top: 12rpx;
                                    left: 0;
                                }
                            }
                        }
                        .item {
                            width: 210rpx;
                            margin-right: 38rpx;
                            text-align: center;
                            position: relative;
                            &:after {
                                content: '';
                                display: block;
                                width: 0;
                                height: 83rpx;
                                border-right: 1px solid #ebebeb;
                                transform: scaleX(.5);
                                transform-origin: 0 0;
                                position: absolute;
                                right: 0;
                                top: 35rpx;
                            }
                            .money {
                                span {
                                    font-size: 28rpx;
                                    font-weight: 700;
                                    color:#ff4d3a;
                                    &.num {
                                        font-size: 72rpx;
                                    }
                                }
                            }
                        }
                        .detail {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            .type {
                                font-size: 30rpx;
                                color: #1a1a1a;
                                font-weight: 700;
                                margin-bottom: 20rpx;
                            }
                        }
                    }
                    i.icon {
                        margin-right: 60rpx;
                    }
                }
                .shopInfo {
                    height: 60rpx;
                    padding: 0 30rpx;
                    background: #fff;
                    display: flex;
                    flex: 1;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    &:after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-top: 1px solid #ebebeb;
                        position: absolute;
                        top: 0;
                        left: 0;
                        transform: scaleY(.5);
                        transform-origin: 0 0;
                    }
                    .shopName {
                        flex: 1;
                        font-size: 20rpx;
                        color: #1a1a1a;
                        font-weight: 700;
                    }
                    .icon_shop {
                        margin-right: 10rpx;
                    }
                }
                &:last-child {
                    margin-bottom: 0;
                }
            }
            &.nullList {
                li {
                    .info {
                        p.tip {
                            color: #ccc;
                        }
                        .detail {
                            .type {
                                color: #ccc;
                                margin-bottom: 0;
                            }
                        }
                        .item {
                            .money {
                                span {
                                    color: #ccc;
                                }
                            }
                        }
                    }
                }
            }
        }
        .noData {
            background: #fff;
            overflow: hidden;
            position: absolute;
            top: 0;
            left:  0;
            width: 100%;
            height: 100%;
            
            img {
                width: 200rpx;
                height: 200rpx;
                margin: 103rpx auto 10rpx;
            }
            p {
                font-size: 22rpx;
                color: #ccc;
                line-height: 36rpx;
                text-align: center;
            }
        }
        .noMore {
            font-size: 20rpx;
            color: #999;
            text-align: center;
            line-height: 96rpx;
        }
        .btn {
            width: 100%;
            height: 88rpx;
            text-align: center;
            font-size: 30rpx;
            color: #1a1a1a;
            line-height: 88rpx;
            background: #fff;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 10;
        }
    }
</style>

