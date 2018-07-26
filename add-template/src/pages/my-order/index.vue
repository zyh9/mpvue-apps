<template>
    <div class="my_order" v-if="block">
        <div class="my_order_select">
            <h3 class="title">我的订单</h3>
            <p class="label">全部</p>
        </div>
        <ul class="my_order_list">
            <li class="order_item" v-for="(item,index) in newOrder" :key="index">
                <div class="lis_top" @click='goShop(item)'>
                    <img :src="item.ShopLogo+'?x-oss-process=image/resize,w_100/format,jpg'" alt="" class="icon fade_in">
                    <div class="shop_name_right">
                        <div class="shop_name">
                            <p class="name_info">{{item.ShopName}}</p>
                            <i class="icon icon_right direction"></i>
                        </div>
                        <p class="shop_info">{{item.stateText}}</p>
                    </div>
                </div>
                <div class="lis_center" @click="orderDetails(item.OrderId)">
                    <ul class="order_shop_list">
                        <li class="list_lis_info" v-for="(goods,I) in item.Goods" :key='I'>
                            <p>{{goods.GoodName}}</p>
                            <p class="num">X{{goods.GoodNum}}</p>
                        </li>
                    </ul>
                    <div class="order_time_price">
                        <p class="time">{{item.CreateTime}}</p>
                        <p class="order_money">总价:<span><i>¥</i>{{item.OrderMoney}}</span></p>
                    </div>
                </div>
                <div class="lis_bottom">
                    <ul class="lis_bottom_btn">
                        <!-- 取消订单：商家未接单，商家已接单未发货 -->
                        <li v-if='item.State==0||item.State==1||(item.State==2&&item.CancelApplyState ==0)' @click="cancelOrder(item)">取消订单</li>
                        <li v-if='item.State==2&&item.CancelApplyState ==1' @click="cancelOrder(item)">已申请取消</li>
                        <li class="btn_other" v-if='item.State==0' @click="OrderRePay(item)">继续支付</li>
                        <!-- 再来一单  -->
                        <li @click="againOrder(item.OrderId)" v-if='item.State>=2||item.State<0'>再来一单</li>
                        <li class="btn_other" v-if='item.State==4' @click="okOrder(item)">确认收货</li>
                    </ul>
                </div>
            </li>
            <div class="no_more" v-if="nomore">没有更多订单了</div>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,
                newOrder: [],
                page: 1,
                quest: true,
                nomore: false,
                block: false,
            }
        },
        onLoad() {
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
        },
        onReady() { //页面渲染就会触发
            this.page = 1;
            this.quest = true;
            this.newOrder = [];
            this.nomore = false;
            this.orderInfo()
        },
        onPullDownRefresh() { //下拉刷新
            this.page = 1;
            this.nomore = false;
            this.orderInfo(this.page)
        },
        onReachBottom() { //触底事件
            if (this.quest) {
                this.page++;
                this.orderInfo()
            }
        },
        methods: {
            //点击切换
            swichNav(e) {
                if (this.currentTab === e.currentTarget.dataset.current) return;
                this.currentTab = e.currentTarget.dataset.current;
                // this.orderInfo();
            },
            //滑动切换
            bindChange(e) {
                this.currentTab = e.target.current
            },
            scrollHandler() {
                if (this.quest) {
                    this.page++;
                    this.orderInfo()
                }
            },
            orderInfo(pg) {
                this.util.post({
                    url: '/api/Customer/Order/UserOrders',
                    data: {
                        OrderState: 0,
                        PageSize: 10,
                        PageIndex: this.page
                    }
                }).then(res => {
                    wx.hideLoading()
                    this.block = true;
                    wx.stopPullDownRefresh()
                    if (res.Body.length == 0 && this.page == 1) {
                        this.msg('您还没有订单哦')
                    } else if (!res.Body.length && this.page > 1) {
                        this.quest = false;
                        this.nomore = true;
                    } else if (res.Body.length > 1 && res.Body.length < 10 && this.page > 1) {
                        this.quest = false;
                        this.nomore = true;
                    }
                    if (pg == 1) {
                        res.Body.forEach(e => {
                            e.stateText = this.orderLabels(e)
                        })
                        this.newOrder = res.Body;
                        this.quest = true;
                        this.nomore = false;
                    } else {
                        res.Body.forEach(e => {
                            e.stateText = this.orderLabels(e)
                        })
                        this.newOrder.push(...res.Body)
                    }
                }).catch(err => {
                    wx.hideLoading();
                    // this.msg(err.Msg)
                    console.log(err)
                })
            },
            orderDetails(id) {
                wx.navigateTo({
                    url: `/pages/order-details/main?orderId=${id}&type=2`
                })
            },
            /* 订单状态文字 */
            orderLabels(e) {
                let text = '';
                switch (e.State) {
                    case 0:
                        text = '待支付';
                        break;
                    case -1:
                    case -2:
                    case -3:
                    case -4:
                    case -5:
                    case -6:
                    case -7:
                    case -8:
                    case -9:
                        text = '已取消';
                        break;
                    case 1:
                        text = '等待商家接单';
                        break;
                    case 2:
                        if (e.CancelApplyState == 1) {
                            text = '已申请取消';
                        } else {
                            text = '商家已接单';
                        }
                        break;
                    case 3:
                        text = '正在配货';
                        break;
                    case 4:
                    case 5:
                        text = e.ExpressType == 2 ? '已发货' : '配送中';
                        break;
                    case 10:
                        text = '已完成';
                        break;
                    default:
                }
                return text
            },
            /* 再次生成订单信息 */
            OrderRePay(item) {
                this.util.post({
                        url: '/api/Customer/Order/OrderRePay',
                        data: {
                            OrderId: item.OrderId,
                        }
                    })
                    .then(res => {
                        if (res.State == 1) {
                            wx.requestPayment({
                                timeStamp: res.Body.timeStamp,
                                nonceStr: res.Body.nonceStr,
                                package: res.Body.package,
                                signType: res.Body.signType,
                                paySign: res.Body.paySign,
                                success: payres => {
                                    setTimeout(_ => {
                                        wx.navigateTo({
                                            url: '/pages/order-details/main?orderId=' + item.OrderId
                                        })
                                    }, 300)
                                },
                                fail: err => {
                                    this.msg('您已取消支付')
                                    setTimeout(_ => {
                                        wx.navigateTo({
                                            url: '/pages/order-details/main?orderId=' + item.OrderId
                                        })
                                    }, 300)
                                }
                            })
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
            },
            //取消订单
            cancelOrder(item) {
                if (item.State == 2 && item.CancelApplyState == 1) {
                    this.msg('已申请取消，请耐心等待商户处理');
                    return
                }
                this.util.post({
                    url: '/api/Customer/Order/CancelOrder',
                    data: {
                        OrderId: item.OrderId
                    }
                }).then(res => {
                    setTimeout(() => {
                        this.msg(res.Msg)
                    }, 400)
                    this.page = 1;
                    this.nomore = false;
                    this.orderInfo(this.page);
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            //确认订单
            okOrder(item) {
                this.util.post({
                    url: '/api/Customer/Order/FinishOrder',
                    data: {
                        OrderId: item.OrderId
                    }
                }).then(res => {
                    console.log(res)
                    this.msg('您已确认收货')
                    setTimeout(_ => {
                        this.page = 1;
                        this.nomore = false;
                        this.orderInfo(this.page);
                    }, 800)
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 再来一单  */
            againOrder(orderId) {
                wx.removeStorageSync('selectAddress');
                wx.navigateTo({
                    url: `/pages/submit-order/main?orderId=${orderId}`
                });
            },
            goShop(item) {
                wx.navigateTo({
                    url: `/pages/my-store/main?ShopId=${item.ShopId}&type=1`
                });
            }
        },
        computed: {
            tips: function() {
                return this.newOrder.length ? true : false;
            }
        },
        components: {}
    }
</script>

<style lang="less">
    page {
        background: #ebebeb;
    }
    .my_order {
        background: #fff;
        .my_order_select {
            background: #fff;
            position: absolute;
            box-shadow: 0px 17rpx 29rpx 6rpx rgba(245, 245, 245, 0.9);
            width: 100%;
            z-index: 5;
            .title {
                font-size: 42rpx;
                color: #000;
                font-weight: 700;
                padding: 30rpx 35rpx 0;
            }
            .label {
                display: inline-block;
                font-size: 28rpx;
                color: #4c4c4c;
                border-bottom: 4rpx solid #ff4d3a;
                line-height: 68rpx;
                margin: 25rpx 0 0 35rpx;
            }
        }
    }
    .my_order_top {
        display: flex;
        justify-content: space-around;
        align-items: center;
        li {
            flex-flow: 1;
            width: 100%;
            text-align: center;
            height: 70rpx;
            position: relative;
            z-index: 1;
            span {
                line-height: 70rpx;
                color: #4d4d4d;
                font-size: 28rpx;
                position: relative;
                z-index: -1;
                box-sizing: border-box;
                display: inline-block;
                height: 100%;
            }
        }
        .li_select {
            span {
                color: #1d1d1d;
                border-bottom: 4rpx solid #ff4d3a;
            }
        }
    }
    .no_order {
        text-align: center;
        font-size: 28rpx;
        color: #666;
        margin-top: 100rpx;
    }
    .my_order_list {
        background: #ebebeb;
        padding-top: 188rpx;
        overflow-x: hidden;
        .order_item {
            background: #fff;
            margin-top: 20rpx;
            padding: 32rpx 0 20rpx;
            &:first-child {
                margin-top: 0;
                padding-top: 50rpx;
            }
            .lis_top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 35rpx 32rpx;
                .icon {
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 20rpx;
                    border-radius: 10rpx;
                }
                .shop_name_right {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .shop_name {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        .name_info {
                            font-size: 30rpx;
                            color: #333;
                            max-width: 80%;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-weight: 900;
                        }
                        .direction {
                            width: 24rpx;
                            height: 24rpx;
                            margin-left: 12rpx;
                            transform: translateY(1rpx);
                        }
                    }
                }
                .shop_info {
                    color: #5e5e5e;
                    font-size: 28rpx;
                }
            }
            .lis_center {
                margin-left: 56rpx;
                margin: 0 35rpx 0 92rpx;
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1px solid #ebebeb;
                    position: absolute;
                    top: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                .order_shop_list {
                    padding-top: 20rpx;
                    .list_lis_info {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 12rpx 0;
                        p {
                            font-size: 28rpx;
                            color: #5e5e5e;
                        }
                        p.num {
                            font-size: 24rpx;
                        }
                    }
                }
                .order_time_price {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12rpx 0 33rpx;
                    .time {
                        font-size: 24rpx;
                        color: #939393;
                    }
                    .order_money {
                        font-size: 24rpx;
                        color: #5e5e5e;
                        span {
                            font-size: 32rpx;
                            color: #000;
                            font-weight: 900;
                            i {
                                font-size: 28rpx;
                                color: #000;
                                font-weight: 900;
                                display: inline-block;
                            }
                        }
                    }
                }
            }
            .lis_bottom {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 20rpx 35rpx 0;
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1px solid #ebebeb;
                    position: absolute;
                    top: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                p {
                    font-size: 24rpx;
                    color: #666;
                }
                .lis_bottom_btn {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    li {
                        width: 184rpx;
                        height: 64rpx;
                        background: #ebebeb;
                        color: #1a1a1a;
                        border-radius: 6rpx;
                        font-size: 26rpx;
                        margin-left: 20rpx;
                        line-height: 64rpx;
                        text-align: center;
                        &.btn_other {
                            background: #ff4d3a;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
    .no_more {
        height: 70rpx;
        width: 100%;
        line-height: 70rpx;
        font-size: 20rpx;
        color: #999;
        text-align: center;
        background: #ebebeb;
    }
</style>
