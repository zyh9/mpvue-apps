<template>
    <div class="admin_order_details fade_in" :class="{view_hid:isTracking}" v-if="block">
        <div class="order_status">
            <div class="state_title" @click='orderTracking'>{{labelText}}<i v-if='orderInfo.State>3||orderInfo.State<0' class="icon icon_arrowRight"></i></div>
            <p class="tip" @click='orderTracking'>{{tipText}}</p>
            <!-- state=1.待接单 -->
            <div class="hand" v-if='orderInfo.State==1&&orderInfo.status==0'>
                <div class="btn btn1 btnColor" @click='handOrder(2)'>拒单</div>
                <div class="btn btn1" @click='handOrder(1)'>接单</div>
            </div>
            <!-- 用户取消订单 -->
            <div class="hand" v-if='orderInfo.State==2&&orderInfo.CancelApplyState ==1'>
                <div class="btn btn1 btnColor" @click="userCancel(2)">拒绝</div>
                <div class="btn btn1" @click="userCancel(1)">同意取消</div>
            </div>
            <template v-if="(orderInfo.ExpressPriceType==1||orderInfo.ExpressPriceType==3)&&orderInfo.State==2&&orderInfo.CancelApplyState !=1">
                                    <!-- 跑腿订单 -->
                                    <div class="hand" v-if='orderInfo.State==2&&orderInfo.status==1'>
                                        <div v-if="DistributionList.length&&DistributionList.length > 1" class="btn btn1 btnSelect btnSelectBox">
                                            <picker class="pickerBox" mode="selector" range-key="Name" :range="DistributionList" :value="DistributionIndex" @change="DistributionChange">
                                                <div class="picker">
                                                    <input class="text_hidden" type="text" disabled v-model="DistributionList[DistributionIndex].Name" placeholder="请选择配送方式">
                                                </div>
                                            </picker>
                                            <i class="icon icon_arrowBottom"></i>
                                        </div>
                                        <div v-if="DistributionList.length&&DistributionList.length == 1" class="btn btn1 btnSelect text_hidden">{{DistributionList[DistributionIndex].Name}}</div>
                                        <div class="btn btn1" @click='orderPrice'>计算价格</div>
                                    </div>
                                    <div class="hand" v-if='orderInfo.State==2&&orderInfo.status==2'>
                                        <div class="btn" style="flex:1;" @click='submitOrder'>跑腿{{priceInfo}}元，点击发单</div>
                                    </div>
                                    <!-- <div class="hand" v-if='orderInfo.State==2'>
                                        <div class="btn readonly "><i class="icon icon_success"></i>发单成功</div>
                                    </div>
                                    <div class="hand" v-if='orderInfo.State==2'>
                                        <div class="btn readonly set-flex set-center set-align set-grow" @click='submitOrder'><i class="icon icon_success"></i>{{btnText}}</div>
                                    </div> -->
</template>
<template v-if="orderInfo.State==2&&orderInfo.ExpressPriceType==4&&orderInfo.CancelApplyState !=1">
    <!-- 自配订单 -->
    <div class="hand selfMatch" v-if='orderInfo.State==2&&(orderInfo.status==1||orderInfo.status==2)'>
        <div v-if="DistributionList.length&&DistributionList.length > 1" class="btn btn1 btnSelect btnSelectBox">
            <picker class="pickerBox" mode="selector" range-key="Name" :range="DistributionList" :value="DistributionIndex" @change="DistributionChange">
                <div class="picker">
                    <input class="text_hidden" type="text" disabled v-model="DistributionList[DistributionIndex].Name" placeholder="请选择配送方式">
                </div>
            </picker>
            <i class="icon  icon_arrowBottom"></i>
        </div>
        <div v-if="DistributionList.length&&DistributionList.length == 1" class="btn btn1 btnSelect text_hidden">{{DistributionList[DistributionIndex].Name}}</div>
        <!-- {{orderInfo.State}}{{orderInfo.status}}{{DistributionList[DistributionIndex].Type}} -->
        <div class="btn btn1" v-if='orderInfo.State==2&&orderInfo.status==1&&(DistributionList[DistributionIndex].Type==1||DistributionList[DistributionIndex].Type==3)' @click='orderPrice'>计算价格</div>
        <div class="btn btn1" v-if='orderInfo.State==2&&DistributionList[DistributionIndex].Type==4' @click="selfMatchOrder">点击发单</div>
        <div class="btn btn1" v-if='orderInfo.State==2&&orderInfo.status==2&&(DistributionList[DistributionIndex].Type==1||DistributionList[DistributionIndex].Type==3)' @click='submitOrder'>跑腿{{priceInfo}}元，点击发单</div>
        <div class="btn btn1" v-if='orderInfo.State==2&&DistributionList[DistributionIndex].Type==2' @click='isLay=true'><i class="icon icon_emit1"></i>点击输入快递单号</div>
    </div>
    <!-- <div class="hand selfMatch" v-if='orderInfo.State==2&&orderInfo.status==2&&(DistributionList[DistributionIndex].Type==1||DistributionList[DistributionIndex].Type==3)'>
                                        <div class="btn  " style="flex:1;" @click='submitOrder'>跑腿{{priceInfo}}元，点击发单</div>
                                    </div>
                                    <div class="hand selfMatch" v-if='orderInfo.State==2&&DistributionList[DistributionIndex].Type==2'>
                                        <div class="btn  " @click='isLay=true'><i class="icon icon_emit1"></i>点击输入快递单号</div>
                                    </div> -->
    <!-- {{'state-2'+orderInfo.State}}{{'status-1'+orderInfo.status}}{{'can'+orderInfo.CancelApplyState}}{{'选择'+DistributionList[DistributionIndex].Type}} -->
</template>
            <!-- 跑腿订单。跑男已接单，订单已完成 -->
            <div class="info set-flex set-align set-between" @click='tel(orderInfo.PaotuiInfo.DriverMobile)' v-if="orderInfo.PaotuiInfo!=null&&orderInfo.ExpressPriceType==1&&(orderInfo.State==4||orderInfo.State==10)">
                <div class="item set-flex set-align">
                    <div class="head"><img :src="orderInfo.PaotuiInfo.DriverPhoto?orderInfo.PaotuiInfo.DriverPhoto:'https://otherfiles-ali.uupt.com/Stunner/FE/M/man.png'" alt=""></div>
                    <div>
                        <div class="name">UU跑腿</div>
                        <div class="tip">{{orderInfo.PaotuiInfo.DriverName}}为您服务</div>
                    </div>
                </div>
                <div class="tel" @click='tel(orderInfo.PaotuiInfo.DriverMobile)'>联系跑男</div>
            </div>
            <!-- 快递订单 -->
<template v-if="orderInfo.ExpressPriceType==2">
    <!-- 订单待发货 -->
    <div class="hand hand_center" v-if='orderInfo.State==2&&orderInfo.CancelApplyState !=1'>
        <div class="btn" @click='isLay=true'><i class="icon icon_emit1"></i>点击输入快递单号</div>
    </div>
    <!-- 商家已发货 -->
    <div class="info set-flex set-align set-between" v-if="orderInfo.ExpressInfo!=null&&(orderInfo.State==4||orderInfo.State==10)">
        <div class="item set-flex set-align">
            <div class="head"><img src="https://otherfiles-ali.uupt.com/Stunner/FE/M/e85a4ba7e63246be92b8f4b5246a2285_big.png" alt=""></div>
            <div>
                <div class="name">{{orderInfo.ExpressInfo.CompanyNamge}}</div>
                <div class="tip">单号{{orderInfo.ExpressInfo.OrderId}}</div>
            </div>
        </div>
        <div class="tel" @click='copy(orderInfo.ExpressInfo.OrderId)'>复制</div>
    </div>
</template>
        </div>
        <div class="admin_order_details_con">
            <div class="user_info_sum">
                <div class="user_info">
                    <!-- <img :src="orderInfo.CustomerPhoto?orderInfo.CustomerPhoto:'https://otherfiles-ali.uupt.com/Stunner/FE/M/1efaf0fd28ab467e9b8afd3fbb09ac83_big.png'" alt=""> -->
                    <p>{{orderInfo.ReceiverName}}</p>
                </div>
                <i class="icon icon_tel" @click='tel(orderInfo.ReceiverMobile)'></i>
            </div>
            <ul class="con_order_list">
                <li v-for="(v,i) in orderInfo.Goods" :key="i" class="con_list_item">
                    <img :src="v.GoodImg+'?x-oss-process=image/resize,h_100'" alt="">
                    <div class="li_info set-grow">
                        <div class="top">
                            <div class="name">{{v.GoodName}}</div>
                            <div class="sum"><span>&yen;</span>{{v.SubTotalPrice}}</div>
                        </div>
                        <p class="spec text_hidden">{{v.SpecName}}</p>
                        <p class="num">X {{v.GoodNum}}</p>
                    </div>
                </li>
            </ul>
            <div class="consume">
                <p>配送费</p>
                <p><span class="coin">&yen;</span>{{orderInfo.CusPaoTuiPrice}}</p>
            </div>
            <div class="consume">
                <p>打包费</p>
                <p><span class="coin">&yen;</span>{{orderInfo.CusPackagePrice}}</p>
            </div>
            <div class="consume">
                <p>小计</p>
                <p><span class="coin crude">&yen;</span><span class="crudeNum">{{orderInfo.CusPayMoney}}</span></p>
            </div>
        </div>
        <div class="admin_order_details_con">
            <div class="consume">
                <p>下单时间</p>
                <p class="textColor">{{orderInfo.CreateTime}}</p>
            </div>
            <div class="consume other">
                <p>收货地址</p>
                <p  class="textColor">{{orderInfo.ReceiverAddress}}</p>
            </div>
        </div>
        <div class="admin_order_details_con">
            <div class="consume">
                <p>支付方式</p>
                <p>微信支付</p>
            </div>
            <div class="consume">
                <p>备注</p>
                <p class="textColor">{{orderInfo.Remark?orderInfo.Remark:'无'}}</p>
            </div>
            <div class="consume">
                <p>配送方式</p>
                <p class="textColor">{{orderInfo.ExpressPriceType==1?'UU专送 立即配送':orderInfo.ExpressPriceType == 2? '快递配送' : orderInfo.ExpressPriceType == 3 ? '达达专送':'商家自送'}}</p>
            </div>
            <div class="consume">
                <p>订单号</p>
                <p class="textColor">{{orderInfo.OrderID}}
                    <span class="copy" @click='copy(orderInfo.OrderID)'>复制</span>
                </p>
            </div>
            <div class="consume">
                <p>下单人</p>
                <div class="consumeText">
                    <div>
                        <p class="consumeName">{{orderInfo.CustomerNickName}}</p>
                        <img :src="orderInfo.CustomerPhoto?orderInfo.CustomerPhoto:'https://otherfiles-ali.uupt.com/Stunner/FE/M/1efaf0fd28ab467e9b8afd3fbb09ac83_big.png'" alt="">
                    </div>
                    <p class="tel" @click='tel(orderInfo.CustomerMobile)'><span>{{orderInfo.CustomerMobile}}</span></p>
                </div>
                
            </div>
        </div>
        <div class="mask" v-if='isTracking||isLay '  catchtouchmove="true" @click='isTracking=false,isLay=false'></div>
        <div class="orderTracking" v-if='isTracking'>
            <h2 class="title">订单状态跟踪</h2>
            <div class="main">
                <ul>
                    <li v-for='(v,i) in trackingList' :key='i'>
                        <div class="text">{{v.StateName}}</div>
                        <div class="time">{{v.StateTime}}</div>
                    </li>
                </ul>
            </div>
            <div class="close" @click='isTracking=false'>关闭</div>
        </div>
        <div class="form" v-if='isLay'>
            <h2 class="title">请输入快递信息</h2>
            <div class="inp">
                <p>运单号:</p>
                <input type="number" v-model="ExpressOrderCode" placeholder="请输入运单号">
            </div>
            <div class="inp">
                <p>公司:</p>
                <input type="text" v-model="ExpressName" placeholder="请输入快递公司">
            </div>
            <div class="set-flex set-between">
                <div class="btn on" @click='isLay=false'>稍后</div>
                <div class="btn" @click="subOrderNum">确定</div>
            </div>
        </div>
        <!-- 二次确认 -->
        <div class="mask" v-if='modalFlag' @click='revokeCancel'></div>
        <div class="layBox" v-if='modalFlag'>
            <h2 class="title">拒单确认</h2>
            <p>您确定拒接此订单么？</p>
            <div class="modalCont_btn">
                <div class="modalCont_btn_cont">
                    <div class="modalCont_btn_cont_cancel" @click="revokeCancel">
                        取消
                    </div>
                    <div class="modalCont_btn_cont_conf" @click="revokeSave">
                        确定
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //配送方式
                DistributionIndex: 0,
                DistributionList: [],
                orderId: '',
                orderInfo: {
                    /* 商品列表 */
                    Goods: [],
                },
                /* 快递公司 */
                ExpressName: '',
                /* 快递单号 */
                ExpressOrderCode: '',
                /* 订单跟踪弹窗 */
                isTracking: false,
                /* 输入订单号弹窗 */
                isLay: false,
                labelText: '',
                tipText: '',
                btnText: '跑腿发单',
                priceInfo: 0, //订单价格计算
                PaoTuiServiceType: '', //1:专送；2：快送
                trackingList: [],
                //二次确认
                modalFlag: false,
                orderType: '',
                isRefusal: false,
                block: false
            }
        },
        onLoad() {
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
        },
        onReady() {
            this.orderInfo = {
                /* 商品列表 */
                Goods: [],
            };
            this.DistributionList = [];
            this.DistributionIndex = 0;
            this.isTracking = false;
            // this.DistributionIndex = wx.getStorageSync('distribution') ? wx.getStorageSync('distribution') : 0;
            this.DistributionList = wx.getStorageSync('orderItem').DistributionList ? wx.getStorageSync('orderItem').DistributionList : [];
            this.DistributionIndex = wx.getStorageSync('orderItem').DistributionIndex ? wx.getStorageSync('orderItem').DistributionIndex : 0;
            // console.log(this.DistributionList)
            this.getOrderInfo();
        },
        methods: {
            // 配送方式
            DistributionChange(e) {
                this.DistributionIndex = e.mp.detail.value;
                // console.log(this.DistributionList[this.DistributionIndex].Type)
                let type = this.DistributionList[this.DistributionIndex].Type;
                // console.log(type)
                if (type == 1 || type == 3) {
                    this.orderInfo.State = 2;
                    this.orderInfo.status = 1;
                }
                if (type == 2) {
                    this.orderInfo.State = 2;
                }
                if (type == 4) {
                    // console.log(1111111)
                    this.orderInfo.State = 2;
                }
            },
            //商家自配订单发单
            selfMatchOrder() {
                console.log(1231564)
                this.util.post({
                    url: '/api/Merchant/Orders/PublishSelfDeliveryOrder',
                    data: {
                        OrderID: this.orderInfo.OrderID //订单ID
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.msg('发单成功')
                        // this.newOrder.forEach(e => {
                        //     if (e.OrderID == item.OrderID) {
                        //         //隐藏计算价格，显示跑腿费
                        //         e.status = 2;
                        //     }
                        // })
                        setTimeout(_ => {
                            console.log(11123123311123)
                            this.getOrderInfo();
                        }, 400)
                    } else if (res.State == -12) {
                        this.msg(res.Msg)
                        // item.status = 0;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 获取订单信息 */
            getOrderInfo() {
                this.orderId = this.$mp.query.orderId;
                this.util.post({
                    url: '/api/Merchant/Orders/OrderDetail',
                    data: {
                        OrderID: this.orderId,
                    }
                }).then(res => {
                    this.block = true;
                    wx.hideLoading();
                    // console.log(res)
                    if (res.State == 1) {
                        if (res.Body.State == 1) {
                            res.Body.status = 0;
                        } else if (res.Body.State == 2) {
                            res.Body.status = 1;
                        }
                        this.orderInfo = res.Body;
                        //订单状态
                        this.orderLabel(res.Body.State);
                    }
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            /* 跑腿发单 */
            submitOrder() {
                if (this.btnText == '跑腿发单') {
                    this.btnText = '计价中...';
                    this.orderPrice();
                    return;
                }
                this.util.post({
                    url: '/api/Merchant/Orders/PublishPaoTuiOrder',
                    data: {
                        OrderID: this.orderId,
                        PayPaoTuiType: wx.getStorageSync('shopInfo').PayPaoTuiType,
                        /* 跑腿的支付方式： 1商城账号支付 2跑腿自有账号支付 */
                        // PaoTuiServiceType: this.PaoTuiServiceType /* 跑腿类型 1专送 2快送 */
                        PaoTuiServiceType: this.DistributionList[this.DistributionIndex].Type
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.msg('跑腿发单成功')
                        // this.orderInfo.status = 3;
                        this.getOrderInfo();
                    } else if (res.State == -12) {
                        this.msg(res.Msg)
                        this.orderInfo.status == 1;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 计算价格 */
            orderPrice() {
                // console.log('配送方式'+this.DistributionList[this.DistributionIndex].Type)
                wx.showLoading({
                    title: '计算价格中',
                    mask: true
                })
                this.util.post({
                    url: '/api/Merchant/Orders/GerPaoTuiPrice',
                    data: {
                        OrderID: this.orderId,
                        // PaoTuiServiceType: this.PaoTuiServiceType /* 跑腿类型 1专送 2快送 */
                        PaoTuiServiceType: this.DistributionList[this.DistributionIndex].Type
                    }
                }).then(res => {
                    wx.hideLoading();
                    if (res.State == 1) {
                        this.btnText = '跑腿' + res.Body.TotalPrice + '元，点击发单';
                        this.priceInfo = res.Body.TotalPrice;
                        this.orderInfo.status = 2;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 拒单/接单 */
            handOrder(type) {
                this.orderType = type;
                if (type == 2) {
                    this.modalFlag = true;
                    return
                }
                this.util.post({
                    url: '/api/Merchant/Orders/DealOrder',
                    data: {
                        OrderID: this.orderId,
                        OperateType: type,
                    }
                }).then(res => {
                    if (type == 1) {
                        this.orderInfo.status = 1;
                        //更新订单状态
                        this.getOrderInfo();
                    } else {
                        this.orderInfo.status = -1;
                        this.getOrderInfo();
                    }
                    this.msg(type == 1 ? '接单成功' : '拒单成功');
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            //拒单二次确认
            revokeCancel() {
                this.modalFlag = false;
            },
            revokeSave() {
                let type = this.orderType;
                if (this.isRefusal) {
                    return
                }
                this.isRefusal = true;
                this.util.post({
                    url: '/api/Merchant/Orders/DealOrder',
                    data: {
                        OrderID: this.orderId,
                        OperateType: this.orderType,
                    }
                }).then(res => {
                    if (type == 1) {
                        this.orderInfo.status = 1;
                        //更新订单状态
                        this.revokeCancel();
                        this.getOrderInfo();
                    } else {
                        this.orderInfo.status = -1;
                        this.revokeCancel();
                        this.getOrderInfo();
                    }
                    this.msg(type == 1 ? '接单成功' : '拒单成功');
                    this.isRefusal = false;
                }).catch(err => {
                    this.msg(err.Msg)
                    this.isRefusal = false;
                })
            },
            /* 填写快递单号 */
            subOrderNum() {
                if (this.ExpressOrderCode == '') {
                    this.msg('您还没有填写运单号哦')
                } else if (this.ExpressName == '') {
                    this.msg('你还没有填写快递公司名字哦')
                } else {
                    this.util.post({
                        url: '/api/Merchant/Orders/FillinExpressOrderCode',
                        data: {
                            OrderID: this.orderId,
                            ExpressOrderCode: this.ExpressOrderCode,
                            ExpressName: this.ExpressName
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.msg('订单号填写成功')
                            this.isLay = false;
                            this.getOrderInfo();
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
                }
            },
            /* 状态文字 */
            orderLabel(state) {
                switch (state) {
                    case 1:
                        this.labelText = '待接单';
                        this.tipText = '请您尽快处理';
                        break;
                    case 2:
                        this.labelText = '待发货';
                        this.tipText = '请您尽快处理';
                        break;
                    case 3:
                        this.labelText = '为用户配货';
                        this.tipText = '正在为您派单';
                        break;
                    case 4:
                        this.labelText = '进行中';
                        this.tipText = '订单状态跟踪';
                        break;
                    case 10:
                        this.labelText = '已完成';
                        this.tipText = '订单状态跟踪';
                        break;
                    case -1:
                    case -2:
                    case -3:
                    case -4:
                        this.labelText = '已取消';
                        this.tipText = '订单状态跟踪';
                        break;
                }
            },
            tel(tel) {
                // console.log(tel)
                wx.makePhoneCall({
                    phoneNumber: tel
                })
            },
            copy(info) {
                wx.setClipboardData({
                    data: `${info}`,
                    success: res => {
                        this.msg("复制成功")
                    },
                    fail: err => {
                        this.msg("复制失败")
                    }
                })
            },
            orderTracking() {
                if (this.orderInfo.State > 3 || this.orderInfo.State < 0) {
                    this.isTracking = true;
                    this.util.post({
                        url: '/api/Merchant/Orders/OrderStateTrace',
                        data: {
                            OrderID: this.orderId
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.trackingList = res.Body;
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
                }
            },
            userCancel(type) {
                this.util.post({
                    url: '/api/Merchant/Orders/DealCancelApply',
                    data: {
                        OrderID: this.orderId,
                        OperateType: type
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.getOrderInfo();
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
        },
        components: {}
    }
</script>

<style lang="less">
    .text_hidden {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .admin_order_details {
        height: 100%;
        background: #efeef4;
        overflow-x: hidden;
        padding: 20rpx 24rpx 0;
        box-sizing: border-box;
        position: relative;
        .order_status {
            background: #fff;
            text-align: center;
            margin-bottom: 20rpx;
            .state_title {
                font-size: 36rpx;
                color: #000;
                line-height: 36rpx;
                font-weight: 900;
                padding: 60rpx 0 30rpx;
            }
            .tip {
                font-size: 28rpx;
                color: #666;
                line-height: 28rpx;
                padding-bottom: 36rpx;
            }
            .hand {
                padding: 0 121rpx 46rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .btn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 0.8;
                    width: 220rpx;
                    height: 70rpx;
                    line-height: 70rpx;
                    font-size: 28rpx;
                    color: #fff;
                    text-align: center;
                    background: #4b6df8;
                    &.btnColor {
                        background: #ee5e46;
                    }
                    &.btnSelect {
                        background: #fff;
                        border: solid 1rpx #2D77F7;
                        height: 68rpx;
                        width: 184rpx;
                        color: #2D77F7;
                        input {
                            text-align: center;
                        }
                        .icon_arrowBottom {
                            width: 55rpx;
                            height: 15rpx;
                            margin: 0;
                            margin-right: 25rpx;
                        }
                    }
                    &.readonly {
                        background: #e5e9ff;
                        color: #3c59ee;
                    }
                    &.btn1 {
                        flex: none; // display: block;
                    }
                    .icon {
                        margin: 0 20rpx;
                    }
                    &.btnSelectBox {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        .pickerBox {
                            width: 140rpx;
                        }
                        i {
                            width: 25rpx;
                            height: 15rpx;
                            margin: 0;
                        }
                    }
                }
            }
            .hand_center {
                justify-content: center;
            }
            .selfMatch {
                padding: 0 36rpx 36rpx;
                .btnSelect {
                    width: 180rpx;
                }
                .btn {
                    width: 430rpx;
                }
            }
            .info {
                margin: 0 25rpx;
                height: 146rpx;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-top: 1px solid #ebebeb;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                .head {
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: 20rpx;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .item {
                    .inp {
                        input {
                            text-align: left;
                            font-size: 28rpx;
                            color: #1a1a1a;
                            line-height: 34rpx;
                        }
                        .placeholderStyle {
                            font-size: 28rpx;
                            color: #ccc;
                            line-height: 34rpx;
                        }
                    }
                    .name {
                        font-size: 28rpx;
                        color: #1a1a1a;
                        text-align: left;
                    }
                    .tip {
                        font-size: 28rpx;
                        color: #1a1a1a;
                        text-align: left;
                        margin: 0;
                        padding-bottom: 0;
                    }
                    .tipColor {
                        color: #ccc;
                    }
                    .copy {
                        display: inline-block;
                        font-size: 22rpx;
                        color: #4b6df8;
                        text-align: center;
                        padding: 5rpx 7rpx;
                        border: solid 1px #4b6df8;
                    }
                }
                .tel {
                    width: 152rpx;
                    height: 55rpx;
                    line-height: 55rpx;
                    border: 1rpx solid #9f9fff;
                    font-size: 24rpx;
                    color: #4b6df8;
                    text-align: center;
                }
            }
        }
        .admin_order_details_con {
            margin-bottom: 24rpx;
            padding: 0 24rpx;
            background: #fff;
            .user_info_sum {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx 0;
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
                .user_info {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    img {
                        width: 53rpx;
                        height: 53rpx;
                        margin-right: 14rpx;
                        border-radius: 50%;
                    }
                    p {
                        white-space: nowrap;
                        color: #1a1a1a;
                        font-size: 30rpx;
                    }
                }
                .user_tel {
                    width: 50rpx;
                    height: 50rpx;
                }
            }
            .con_order_list {
                background: #fff;
                .con_list_item {
                    padding: 30rpx 0;
                    display: flex;
                    align-items: center;
                    img {
                        width: 97rpx;
                        height: 97rpx;
                        margin-right: 23rpx;
                    }
                    .li_info {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 97rpx;
                        .top {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .name {
                                font-size: 30rpx;
                                color: #1d1d1d;
                                font-weight: 900;
                                line-height: 30rpx;
                                max-width: 380rpx; // overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .sum {
                                font-size: 28rpx;
                                span {
                                    font-size: 24rpx;
                                }
                            }
                        }
                        p.spec {
                            font-size: 22rpx;
                            color: #b2b2b2;
                        }
                        p.num {
                            font-size: 20rpx;
                            color: #939393;
                            line-height: 20rpx;
                        }
                    }
                }
            }
            .consume {
                display: flex;
                justify-content: space-between; // align-items: center;
                padding: 21rpx 0;
                position: relative;
                &.other {
                    align-items: flex-start;
                }
                &:after {
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
                &:first-child {
                    &::after {
                        display: none;
                    }
                }
                p {
                    font-size: 27rpx;
                    color: #1d1d1d;
                    font-weight: 900;
                    &:last-child {
                        font-size: 28rpx;
                        text-align: right;
                        flex: 1;
                        font-weight: normal;
                        padding-left: 42rpx;
                        word-break: break-all;
                    }
                    span.copy {
                        display: inline-block;
                        line-height: 32rpx;
                        height: 32rpx;
                        font-size: 22rpx;
                        color: #4b6df8; // padding: 2rpx 7rpx 0;
                        margin-left: 20rpx;
                        position: relative;
                        box-sizing: border-box;
                        width: 58rpx;
                        text-align: center;
                        &::after {
                            content: '';
                            display: block;
                            width: 200%;
                            height: 200%;
                            border: 1rpx solid #4b6df8;
                            position: absolute;
                            top: 0;
                            left: 0;
                            transform: scale(0.5);
                            transform-origin: 0 0;
                            box-sizing: border-box;
                        }
                    }
                    .coin {
                        font-size: 24rpx;
                    }
                    .crude {
                        font-weight: 700;
                    }
                    .crudeNum {
                        font-weight: 700;
                        font-size: 32rpx;
                        color: #1a1a1a;
                    }
                }
                .textColor {
                    color: #999;
                }
                .consumeText {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    div {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-end;
                        .consumeName {
                            margin-right: 16rpx;
                        }
                        p {
                            font-size: 28rpx;
                            color: #999999;
                            font-weight: normal;
                            line-height: 53rpx;
                        }
                        img {
                            width: 53rpx;
                            height: 53rpx;
                            border-radius: 50%;
                        }
                    }
                    .tel {
                        font-size: 28rpx;
                        color: #4b6df8;
                        margin-top: 15rpx;
                        span {
                            border-bottom: 1px solid #4b6df8;
                        }
                    }
                }
            }
        }
        .mask {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .7);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
        }
        .orderTracking {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0 auto;
            background: #fff;
            z-index: 20;
            h2.title {
                font-size: 30rpx;
                color: #1a1a1a;
                text-align: center;
                line-height: 98rpx;
                font-weight: 900;
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
            }
            .main {
                padding: 0 48rpx 0 72rpx;
                max-height: 600rpx;
                overflow: scroll;
                ul {
                    border-left: 1rpx #ebebeb dashed;
                    li {
                        padding: 36rpx 0;
                        margin-left: 33rpx;
                        position: relative;
                        &:before {
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
                        &:after {
                            content: '';
                            display: block;
                            width: 18rpx;
                            height: 18rpx;
                            border-radius: 50%;
                            background: #ccc;
                            position: absolute;
                            top: 43rpx;
                            left: -40rpx;
                        }
                        &:last-child {
                            border: none;
                            &:after {
                                background: #3c59ee;
                            }
                            &::before {
                                display: none;
                            }
                            .text {
                                color: #3c59ee;
                            }
                        }
                        .text {
                            font-size: 28rpx;
                            color: #1a1a1a;
                            line-height: 28rpx;
                            margin-bottom: 19rpx;
                        }
                        .time {
                            font-size: 22rpx;
                            color: #999;
                            line-height: 22rpx;
                        } //  &.on{
                        //     &:after{
                        //         background: #3c59ee;
                        //     }
                        //     .text{
                        //         color:#3c59ee;
                        //     }
                        // }
                    }
                }
            }
            .close {
                font-size: 30rpx;
                color: #1a1a1a;
                text-align: center;
                line-height: 98rpx;
                border-top: 1rpx solid #ebebeb;
            }
        }
        .form {
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
            z-index: 11;
            h2.title {
                text-align: center;
                font-size: 34rpx;
                color: #333333;
                line-height: 37rpx;
            }
            .inp {
                border-bottom: 1rpx solid #ebebeb;
                padding: 32rpx 0;
                p {
                    line-height: 50rpx;
                    font-size: 28rpx;
                    color: #1a1a1a;
                    padding-bottom: 17rpx;
                }
                input {
                    font-size: 28rpx;
                    color: #333;
                    line-height: 40rpx;
                }
                 ::-webkit-input-placeholder {
                    font-size: 28rpx;
                    color: #ccc;
                    line-height: 40rpx;
                }
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
        }
        .layBox {
            position: absolute;
            top: 350rpx;
            left: 0;
            right: 0;
            padding: 87rpx 30rpx 30rpx;
            margin: 0 90rpx;
            background: #fff;
            border-radius: 16rpx;
            box-sizing: border-box;
            z-index: 130;
            h2.title {
                line-height: 37rpx;
                font-size: 34rpx;
                color: #656782;
                text-align: center;
                width: 502rpx;
            }
            p {
                font-size: 28rpx;
                color: #656782;
                line-height: 28rpx;
                padding-top: 33rpx;
                text-align: center;
                width: 502rpx;
            }
            .modalCont_btn {
                // width: 100%; 
                overflow: hidden;
                position: relative;
                width: 502rpx;
                .modalCont_btn_cont {
                    width: 100%;
                    display: flex;
                    flex-direction: row; // justify-content: space-between;
                    font-size: 26rpx;
                    margin-top: 81rpx;
                    .modalCont_btn_cont_cancel {
                        // flex: 1;
                        text-align: center;
                        width: 245rpx;
                        height: 72rpx;
                        border: solid 1rpx #3c59ee;
                        font-family: PingFangSC-Regular;
                        font-size: 26rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 72rpx;
                        letter-spacing: 0px;
                        color: #3c59ee;
                    }
                    .modalCont_btn_cont_conf {
                        // flex: 1;
                        text-align: center;
                        color: #0863ee;
                        width: 245rpx;
                        height: 72rpx;
                        background-color: #3c59ee;
                        font-family: PingFangSC-Regular;
                        font-size: 26rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        line-height: 72rpx;
                        letter-spacing: 0px;
                        color: #ffffff;
                        border: 1rpx solid #3c59ee;
                        margin-left: 24rpx;
                    }
                    .btn_dis {
                        border: 1rpx solid #cccccc;
                        background: #cccccc;
                    }
                }
            }
        }
    }
    .view_hid {
        overflow: hidden;
    }
</style>
