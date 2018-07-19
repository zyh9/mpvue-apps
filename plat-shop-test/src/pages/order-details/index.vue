<template>
    <div class="order_details" v-if="block" :class="{hidden:isTracking}">
        <div class="map_details" v-if="mapErr&&mapBlock&&orderInfo.State>=4&&orderInfo.State<10&&orderInfo.ExpressType!= 2" :style="{height:winHeight+'px'}">
            <map id="myMap" :longitude="longitude" :latitude="latitude" scale="15" :markers="markers" include-points=""></map>
        </div>
        <div class="order_details_top">
            <h3 class="title" @click="tracking">{{orderInfo.stateText}}<i v-if='orderInfo.State>3||orderInfo.State<0' class="icon icon_arrowRight"></i></h3>
            <p class='tip' v-if='orderInfo.State>=4&&orderInfo.State<10'>{{tips}}</p>
            <ul class="lis_bottom_btn">
                <li v-if='orderInfo.State==0||orderInfo.State==1||(orderInfo.State==2&&orderInfo.CancelApplyState==0)' @click="cancelOrder">取消订单</li>
                <li @click='againOrder' v-if='orderInfo.State>=2||orderInfo.State<0'>再来一单</li>
                <li class="btn_other" v-if="orderInfo.State==4" @click="okOrder">确认收货</li>
                <li v-if='orderInfo.State==2&&orderInfo.CancelApplyState==1' @click="cancelOrder">已申请取消</li>
                <li class="btn_other" v-if='orderInfo.State==0' @click='OrderRePay'>继续支付</li>
            </ul>
            <!-- 跑腿配送 -->
            <div class="uu_man_info" @click='tel(orderInfo.PaotuiInfo.DriverMobile)' v-if='orderInfo.PaotuiInfo!=null&&orderInfo.ExpressType==1&&(orderInfo.State==4||orderInfo.State==5||orderInfo.State==10)'>
                <div class="info_left">
                    <img :src="orderInfo.PaotuiInfo.DriverPhoto?orderInfo.PaotuiInfo.DriverPhoto:'https://otherfiles-ali.uupt.com/Stunner/FE/C/man.png'" alt="" class="left_icon">
                    <div class="info_text">
                        <p class="company">UU跑腿</p>
                        <p class="uu_man_name">{{orderInfo.PaotuiInfo.DriverName}}为您服务</p>
                    </div>
                </div>
                <i class="icon  icon_tel"></i>
            </div>
            <!-- 快递配送 -->
            <div class="uu_man_info" v-if='orderInfo.ExpressInfo!=null&&orderInfo.ExpressType==2&&(orderInfo.State==4||orderInfo.State==5||orderInfo.State==10)'>
                <div class="info_left">
                    <i class="icon icon_express left_icon"></i>
                    <div class="info_text">
                        <p class="company">{{orderInfo.ExpressInfo.CompanyNamge}}</p>
                        <p class="uu_man_name">{{orderInfo.ExpressInfo.OrderId}}</p>
                    </div>
                    <span class="copy_info" @click='copyInfo(orderInfo.ExpressInfo.OrderId)'>复制</span>
                </div>
            </div>
            <!-- 达达配送 -->
            <div class="uu_man_info" @click='tel(orderInfo.PaotuiInfo.DriverMobile)' v-if='orderInfo.PaotuiInfo!=null&&orderInfo.ExpressType==3&&(orderInfo.State==4||orderInfo.State==5||orderInfo.State==10)'>
                <div class="info_left">
                    <i class="icon icon_dada left_icon"></i>
                    <div class="info_text">
                        <p class="company">达达跑腿</p>
                        <p class="uu_man_name">{{orderInfo.PaotuiInfo.DriverName}}为您服务</p>
                    </div>
                </div>
                <i class="icon  icon_tel"></i>
            </div>
            <div class="line_box" @click="moveMap" v-if="mapErr&&orderInfo.State>=4&&orderInfo.State<10&&orderInfo.ExpressType!= 2">
                <i></i>
                <i></i>
            </div>
        </div>
        <div class="order_details_con">
            <div class="shop_info_sum" @click="openShop">
                <img class="fade_in" :src="orderInfo.ShopLogo+'?x-oss-process=image/resize,w_100/format,jpg'" alt="">
                <p>{{orderInfo.ShopName}}</p>
                <i class="icon icon_right direction small"></i>
            </div>
            <ul class="con_order_list">
                <li v-for="(v,i) in orderInfo.OrderGoods" :key="i" class="con_list_item">
                    <img class="fade_in" :src="v.GoodMasterPic+'?x-oss-process=image/resize,w_100/format,jpg'" alt="">
                    <div class="item">
                        <p class="name">{{v.GoodName}}</p>
                        <p class="spec">{{v.SpecName}}</p>
                        <p class="num">X{{v.GoodNum}}</p>
                    </div>
                    <div class="sum"><span>¥</span>{{v.TotalPrice}}</div>
                </li>
            </ul>
            <div class="consume">
                <p class="consume_l">配送费</p>
                <p class="consume_r"><i v-if="orderInfo.PaotuiMoneyOff">已减{{orderInfo.PaotuiMoneyOff}}元</i><span>¥</span>{{orderInfo.PaotuiMoney}}</p>
            </div>
            <div class="consume">
                <p class="consume_l">打包费</p>
                <p class="consume_r"><span>¥</span>{{orderInfo.PackageMoney}}</p>
            </div>
            <div class="consume" v-if="orderInfo.CouponAmountMoney>0">
                <p class="consume_l">店铺优惠券</p>
                <p class="consume_r color_text">-<span>¥</span>{{orderInfo.CouponAmountMoney}}</p>
            </div>
            <div class="consume_sum">
                <p class="consume_l">小计</p>
                <p class="consume_r"><i v-if="orderInfo.orderSumPrice>0">共节省{{orderInfo.orderSumPrice}}元</i><span>¥</span>{{orderInfo.TotalMoney}}</p>
            </div>
            <div class="shop_info_list">
                <div class="shop_tel" @click="tel(orderInfo.ShopMobile)">
                    <i class="icon icon_shop_tel icon_info"></i>
                    <p>商家电话</p>
                </div>
                <div class="shop_wx" @click="copyInfo(orderInfo.ShopWechat,1)">
                    <i class="icon icon_shop_wx icon_info"></i>
                    <p>商家微信</p>
                </div>
            </div>
        </div>
        <div class="distribution_info">
            <div class="distribution">
                <p>配送信息</p>
            </div>
            <div class="options">
                <p>支付方式</p>
                <p style="color:#1a1a1a;">{{orderInfo.PayType==1?'微信支付':'其他'}}</p>
            </div>
            <div class="options other">
                <p>备注</p>
                <p>{{orderInfo.Remark?orderInfo.Remark:'无'}}</p>
            </div>
            <div class="options">
                <p>配送方式</p>
                <p>{{orderInfo.ExpressType== 2 ? '快递配送' : orderInfo.ExpressType== 4?'商家自送':'跑腿配送'}}</p>
            </div>
            <div class="options other">
                <p>收货地址</p>
                <p>{{orderAdress}}</p>
            </div>
        </div>
        <div class="order_list_info">
            <div class="order_info">
                <p>订单信息</p>
            </div>
            <div class="options">
                <p>订单号</p>
                <div class="options_r">
                    <p>{{orderInfo.OrderID}}</p>
                    <span @click='copyInfo(orderInfo.OrderID)'>复制</span>
                </div>
            </div>
            <div class="options">
                <p>订单时间</p>
                <p>{{orderInfo.OrderCreateTime}}</p>
            </div>
        </div>
        <div class="mask" v-if='isTracking' @click='closeMask'></div>
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
            <div class="close" @click='closeMask'>关闭</div>
        </div>
        <!-- <span class="go_index" @click="goIndex">回到首页</span> -->
    </div>
</template>

<script>
    import gcoord from 'gcoord';
    export default {
        data() {
            return {
                orderInfo: [],
                isTracking: false,
                trackingList: [],
                block: false,
                timer: null,
                markers: [],
                winHeight: 0,
                scrollTop: 0,
                mapBlockHeight: 0,
                mapBlock: true,
                latitude: 0,
                longitude: 0,
                shopMap: '',
                userMap: '',
                manMap: '',
                tips: '',
                mapErr: true,
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
            console.log(this.$mp.query.type)
            clearInterval(this.timer);
            this.timer = null;
            this.winHeight = this.mapBlockHeight = 0;
            this.mapBlock = true;
            this.mapErr = true;
            this.isTracking = false;
            this.tips = '';
            this.orderDetails()
        },
        onPageScroll(e) {
            // console.log(e.scrollTop)
            this.scrollTop = e.scrollTop;
        },
        methods: {
            /* 订单状态文字 */
            orderLabels(state, CancelApplyState, ExpressType) {
                // console.log(ExpressType)
                let text = '';
                switch (state) {
                    case 0:
                        text = '待支付';
                        break;
                    case 1:
                        text = '等待商家接单';
                        break;
                    case 2:
                        switch (CancelApplyState) {
                            case 0:
                                text = '商家已接单';
                                break;
                            case 1:
                                /* 用户发起申请 */
                                text = '已申请取消，待商家确认';
                                break;
                            case -1:
                                text = '商家已接单';
                                break;
                                // case 2:
                                // /* 商户同意取消 */
                                // break;
                        }
                        break;
                    case 3:
                        text = '正在配货';
                        break;
                    case 4:
                        text = ExpressType == 2 || ExpressType == 4 ? '已发货' : '跑男已接单';
                        break;
                    case 5:
                        text = '跑男已取货';
                        break;
                    case 10:
                        text = '已完成';
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
                }
                return text;
            },
            tel(tel) {
                wx.makePhoneCall({
                    phoneNumber: tel
                })
            },
            copyInfo(info, num) {
                if (num) {
                    console.log('微信')
                    if (info == '') {
                        this.msg('商家未提供微信联系方式')
                    } else {
                        wx.setClipboardData({
                            data: `${info}`,
                            success: res => {
                                this.msg("复制成功")
                            },
                            fail: err => {
                                this.msg("复制失败")
                            }
                        })
                    }
                } else {
                    console.log('非微信')
                    wx.setClipboardData({
                        data: `${info}`,
                        success: res => {
                            this.msg("复制成功")
                        },
                        fail: err => {
                            this.msg("复制失败")
                        }
                    })
                }
            },
            openShop() {
                wx.navigateTo({
                    url: `/pages/my-store/main?ShopId=${this.orderInfo.ShopID}&type=1`
                })
            },
            /* 再次生成订单信息 */
            OrderRePay() {
                this.util.post({
                        url: '/api/Customer/Order/OrderRePay',
                        data: {
                            OrderId: this.orderInfo.OrderID,
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
                                    this.orderDetails()
                                },
                                fail: err => {
                                    this.msg('您已取消支付')
                                }
                            })
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
            },
            async requireImg(ExpressType, State) {
                this.shopMap = await this.util.downImg('https://otherfiles-ali.uupt.com/Stunner/FE/C/mapicon/shop-map.png');
                this.userMap = await this.util.downImg('https://otherfiles-ali.uupt.com/Stunner/FE/C/mapicon/user-map.png');
                this.manMap = await this.util.downImg(ExpressType == 1 ? 'https://otherfiles-ali.uupt.com/Stunner/FE/C/mapicon/uupt-map.png' : 'https://otherfiles-ali.uupt.com/Stunner/FE/C/mapicon/dada-map.png');
                // this.orderInfo.ShopLoc 店铺坐标
                // this.orderInfo.PaotuiInfo.DriverLastLoc 跑实时坐标
                // this.orderInfo.ReceiverLoc 收货人坐标
                let ShopLoc = this.trans({
                    latitude: this.orderInfo.ShopLoc.split(',')[1],
                    longitude: this.orderInfo.ShopLoc.split(',')[0],
                });
                let ReceiverLoc = this.trans({
                    latitude: this.orderInfo.ReceiverLoc.split(',')[1],
                    longitude: this.orderInfo.ReceiverLoc.split(',')[0],
                });
                let DriverLastLoc;
                if (ExpressType == 1) {
                    console.log('跑腿订单');
                    if (this.orderInfo.PaotuiInfo.DriverLastLoc) {
                        DriverLastLoc = this.trans({
                            latitude: this.orderInfo.PaotuiInfo.DriverLastLoc.split(',')[1],
                            longitude: this.orderInfo.PaotuiInfo.DriverLastLoc.split(',')[0],
                        })
                    } else {
                        this.mapErr = false;
                    }
                } else {
                    console.log('达达订单');
                    if (this.orderInfo.PaotuiInfo.DriverLastLoc) {
                        DriverLastLoc = this.gdMap({
                            latitude: this.orderInfo.PaotuiInfo.DriverLastLoc.split(',')[1],
                            longitude: this.orderInfo.PaotuiInfo.DriverLastLoc.split(',')[0],
                        })
                    } else {
                        this.mapErr = false;
                    }
                }
                // console.log(ShopLoc, DriverLastLoc, ReceiverLoc)
                //跑男坐标存在
                if (this.orderInfo.PaotuiInfo.DriverLastLoc) {
                    this.markers = [{
                        iconPath: this.shopMap,
                        id: 0,
                        latitude: ShopLoc.latitude,
                        longitude: ShopLoc.longitude,
                        width: 30,
                        height: 36
                    }, {
                        iconPath: this.manMap,
                        id: 1,
                        latitude: DriverLastLoc.latitude,
                        longitude: DriverLastLoc.longitude,
                        width: 40,
                        height: 50
                    }, {
                        iconPath: this.userMap,
                        id: 2,
                        latitude: ReceiverLoc.latitude,
                        longitude: ReceiverLoc.longitude,
                        width: 30,
                        height: 36
                    }];
                    this.latitude = DriverLastLoc.latitude;
                    this.longitude = DriverLastLoc.longitude;
                    // this.util.QQMap.calculateDistance({
                    //     mode: 'driving',
                    //     from: `${DriverLastLoc.latitude},${DriverLastLoc.longitude}`,
                    //     to: State == 4 ? `${ShopLoc.latitude},${ShopLoc.longitude}` : `${ReceiverLoc.latitude},${ReceiverLoc.longitude}`,
                    //     success: res => {
                    //         this.tips = State == 4 ? `跑男距店${res.result.elements[0].distance}m` : `跑男距您${res.result.elements[0].distance}m`;
                    //     },
                    //     fail: err => {
                    //         this.msg('订单距离计算失败')
                    //     }
                    // });
                    if (State == 4) {
                        let num = Math.floor(this.distance(DriverLastLoc.latitude, DriverLastLoc.longitude, ShopLoc.latitude, ShopLoc.longitude) * 1000);
                        this.tips = `跑男距店${num}m`;
                    } else {
                        let num = Math.floor(this.distance(DriverLastLoc.latitude, DriverLastLoc.longitude, ReceiverLoc.latitude, ReceiverLoc.longitude) * 1000);
                        this.tips = `跑男距您${num}m`;
                    };
                    if (this.mapBlock) {
                        setTimeout(_ => {
                            let query = wx.createSelectorQuery();
                            query.select('.order_details_top').boundingClientRect()
                            query.exec(res => {
                                let height = res[0].height;
                                wx.getSystemInfo({
                                    success: res => {
                                        // console.log(res)
                                        this.winHeight = this.mapBlockHeight = res.windowHeight - height;
                                    }
                                })
                            })
                        }, 200)
                    }
                } else {
                    this.mapErr = false;
                }
            },
            distance(lat1, lng1, lat2, lng2) {
                var radLat1 = lat1 * Math.PI / 180.0;
                var radLat2 = lat2 * Math.PI / 180.0;
                var a = radLat1 - radLat2;
                var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
                var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * 6378.137;
                s = Math.round(s * 10000) / 10000;
                return s * 10
            },
            //订单详情
            orderDetails() {
                this.util.post({
                    url: '/api/Customer/Order/OrderDetail',
                    data: {
                        OrderID: this.$mp.query.orderId
                    }
                }).then(res => {
                    wx.hideLoading();
                    this.block = true;
                    this.orderInfo = Object.assign({}, res.Body, {
                        stateText: this.orderLabels(res.Body.State, res.Body.CancelApplyState, res.Body.ExpressType)
                    })
                    this.orderInfo.orderSumPrice = (Math.round(this.orderInfo.PaotuiMoneyOff * 10000) + Math.round(this.orderInfo.CouponAmountMoney * 10000)) / 10000;
                    // console.log(this.orderInfo.orderSumPrice)
                    //地图所需信息 （不包含快递和商家自送）
                    if (this.orderInfo.State >= 4 && this.orderInfo.State < 10 && this.orderInfo.ExpressType != 2 && this.orderInfo.ExpressType != 4) {
                        // console.log(this.util.downImg)
                        this.requireImg(this.orderInfo.ExpressType, this.orderInfo.State).catch(err => {
                            this.msg('地图信息获取失败')
                        })
                    }
                    //订单跟踪信息 (不包含商家自送)
                    if (this.orderInfo.State > 3 || this.orderInfo.State < 0) {
                        this.orderTracking()
                    }
                    //订单超时取消 => 跳转至订单列表页
                    if (this.orderInfo.State == -1 || this.orderInfo.State == -9) {
                        if (this.$mp.query.type == 1) {
                            setTimeout(_ => {
                                /* 支付成功跳转订单列表 */
                                wx.redirectTo({
                                    url: '/pages/my-order/main'
                                })
                            }, 800)
                        } else {
                            setTimeout(_ => {
                                /* 支付成功跳转订单列表 */
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 800)
                        }
                    }
                    if (this.orderInfo.State == 10) {
                        this.tips = '感谢光临，很高兴为您服务';
                        this.timer = null;
                        clearInterval(this.timer);
                    }
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            //取消订单
            cancelOrder() {
                if (this.orderInfo.CancelApplyState == 1) {
                    this.msg('已申请取消，请耐心等待商户处理');
                    return
                }
                this.util.post({
                    url: '/api/Customer/Order/CancelOrder',
                    data: {
                        OrderId: this.$mp.query.orderId
                    }
                }).then(res => {
                    this.orderDetails();
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            //确认订单
            okOrder() {
                this.util.post({
                    url: '/api/Customer/Order/FinishOrder',
                    data: {
                        OrderId: this.$mp.query.orderId
                    }
                }).then(res => {
                    console.log(res)
                    this.msg('您已确认收货');
                    this.orderDetails();
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 订单跟踪 */
            orderTracking() {
                this.util.post({
                    url: '/api/Customer/Order/OrderStateTrace',
                    data: {
                        OrderID: this.$mp.query.orderId
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.trackingList = res.Body;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 再来一单 */
            againOrder() {
                wx.navigateTo({
                    url: '/pages/submit-order/main?orderId=' + this.$mp.query.orderId
                });
            },
            tracking() {
                if (this.orderInfo.State > 3 || this.orderInfo.State < 0) {
                    this.winHeight = 0;
                    this.mapBlock = false;
                    this.isTracking = true;
                }
            },
            closeMask() {
                this.isTracking = false;
                // if (this.orderInfo.State >= 4 && this.orderInfo.State < 10 && this.orderInfo.ExpressType != 2) {
                //     console.log('关闭')
                //     this.mapBlock = true;
                //     this.winHeight = this.mapBlockHeight;
                //     console.log(this.mapBlock, this.winHeight)
                // }
            },
            moveMap() {
                if (this.mapBlock && this.winHeight > 0) {
                    this.winHeight = 0;
                    this.mapBlock = false;
                } else {
                    this.mapBlock = true;
                    this.winHeight = this.mapBlockHeight;
                }
            },
            goIndex() {
                wx.switchTab({
                    url: '/pages/nearby-shop/main'
                })
            },
            trans(pos) {
                // console.log(pos)
                let {
                    latitude,
                    longitude
                } = pos;
                var result = gcoord.transform(
                    [latitude, longitude], // 经纬度坐标
                    gcoord.BD09, // 当前坐标系
                    gcoord.WGS84, // 目标坐标系
                );
                let location = {
                    latitude: String(result[0]),
                    longitude: String(result[1])
                }
                // console.log(location)
                return location;
            },
            gdMap(pos) {
                // console.log(pos)
                let {
                    latitude,
                    longitude
                } = pos;
                var result = gcoord.transform(
                    [latitude, longitude], // 经纬度坐标
                    gcoord.GCJ02, // 当前坐标系
                    gcoord.WGS84, // 目标坐标系
                );
                let location = {
                    latitude: String(result[0]),
                    longitude: String(result[1])
                }
                // console.log(location)
                return location;
            }
        },
        components: {},
        computed: {
            orderAdress: function() {
                return this.orderInfo.ReceiveAddress ? this.orderInfo.ReceiveAddress.split('($)').join(' ') : '';
            }
        },
        watch: {
            block: function(newVal, oldVal) {
                if (newVal) {
                    this.timer = setInterval(_ => {
                        this.orderDetails();
                    }, 7000)
                }
            },
            scrollTop: function(newVal, oldVal) {
                newVal > this.winHeight && (this.mapBlock = false, this.winHeight = 0);
                // console.log(newVal, this.mapBlock)
            }
        },
        onUnload() {
            clearInterval(this.timer)
            this.timer = null;
        }
    }
</script>

<style lang="less">
    .bor_t {
        position: relative;
        &:after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            border-bottom: 1px solid #ebebeb;
            position: absolute;
            top: 0;
            left: 0;
            transform: scaleY(0.5);
            transform-origin: 0 0;
        }
    }
    .order_details {
        background: #ebebeb;
        position: relative;
        .map_details {
            height: 820rpx;
            transition: all 0.2s ease;
            map {
                height: 100%;
                width: 100%;
            }
        }
        .order_details_top {
            margin-bottom: 20rpx;
            background: #fff;
            overflow: hidden;
            position: relative;
            .title {
                font-size: 36rpx;
                color: #000;
                font-weight: 700;
                height: 60rpx;
                line-height: 60rpx;
                padding: 0 35rpx;
                text-align: center;
                margin-top: 46rpx;
                margin-bottom: 4rpx;
                .icon {
                    margin-right: -25rpx;
                }
            }
            .tip {
                text-align: center;
                font-size: 22rpx;
                color: #adadad;
                line-height: 30rpx;
                margin-bottom: 6rpx;
            }
            .uu_man_info {
                display: flex;
                padding: 20rpx 0;
                margin: 0 35rpx;
                align-items: center;
                justify-content: space-between;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1px solid #ebebeb;
                    position: absolute;
                    top: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                .info_left {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    .left_icon {
                        width: 80rpx;
                        height: 80rpx;
                        margin-right: 30rpx;
                    }
                    .info_text {
                        flex: 1;
                        .company {
                            font-size: 28rpx;
                            color: #555;
                        }
                        .uu_man_name {
                            font-size: 30rpx;
                            color: #000;
                        }
                    }
                    .copy_info {
                        font-size: 22rpx;
                        color: #ff4d3a;
                        border: 1rpx solid #ff4d3a;
                        line-height: 36rpx;
                        height: 36rpx;
                        width: 62rpx;
                        text-align: center;
                        transform: translateY(16rpx);
                    }
                }
                .uu_man_tel {
                    width: 34rpx;
                    height: 34rpx;
                }
            }
            .lis_bottom_btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20rpx 120rpx 30rpx;
                margin: 0 35rpx;
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
            .line_box {
                position: absolute;
                left: 50%;
                top: 4rpx;
                transform: translateX(-50%);
                padding: 16rpx;
                z-index: 2;
                i {
                    width: 46rpx;
                    height: 3rpx;
                    border-radius: 1.5rpx;
                    background: #e4e4e4;
                    margin-bottom: 6rpx;
                }
            }
        }
        .order_details_con {
            margin-bottom: 20rpx;
            background: #fff;
            .shop_info_sum {
                background: #fff;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 33rpx 0;
                margin: 0 35rpx;
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1px solid #ebebeb;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                img {
                    width: 40rpx;
                    height: 40rpx;
                    margin-right: 20rpx;
                    border-radius: 10rpx;
                }
                p {
                    // flex: 1;
                    max-width: 80%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: #383838;
                    font-size: 26rpx;
                }
                .small {
                    margin-left: 10rpx;
                    width: 25rpx;
                    height: 25rpx;
                }
            }
            .con_order_list {
                .con_list_item {
                    padding: 30rpx 35rpx;
                    display: flex;
                    justify-content: flex-start;
                    img {
                        width: 96rpx;
                        height: 96rpx;
                        margin-right: 20rpx;
                        border-radius: 10rpx;
                    }
                    flex: 1;
                    .item {
                        flex: 1;
                        padding-left: 18rpx;
                        display: flex;
                        flex-direction: column;
                        align-content: space-between;
                        height: 96rpx;
                        .name {
                            font-size: 28rpx;
                            color: #1d1d1d;
                            line-height: 30rpx;
                            width: 426rpx;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .spec {
                            font-size: 22rpx;
                            color: #b2b2b2;
                            line-height: 46rpx;
                            height: 46rpx;
                            width: 426rpx;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .num {
                            font-size: 22rpx;
                            color: #b2b2b2;
                            line-height: 22rpx;
                        }
                    }
                    .sum {
                        font-size: 28rpx;
                        color: #999;
                        line-height: 28rpx;
                        span {
                            font-size: 24rpx;
                        }
                    }
                }
            }
            .consume {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 27rpx 0;
                margin: 0 35rpx;
                .bor_t;
                .consume_l {
                    font-size: 28rpx;
                    white-space: nowrap;
                    color: #1d1d1d;
                }
                .consume_r {
                    font-size: 28rpx;
                    white-space: nowrap;
                    color: #999;
                    span {
                        font-size: 24rpx;
                        display: inline-block;
                    }
                    &.color_text {
                        color: #ff4d3a;
                        span {
                            color: #ff4d3a;
                        }
                    }
                    i {
                        font-size: 24rpx;
                        color: #ff4d3a;
                        display: inline-block;
                        margin-right: 16rpx;
                    }
                }
            }
            .consume_sum {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24rpx 0;
                margin: 0 35rpx;
                .bor_t;
                .consume_l {
                    font-size: 28rpx;
                    white-space: nowrap;
                    color: #1d1d1d;
                }
                .consume_r {
                    font-size: 36rpx;
                    white-space: nowrap;
                    color: #1d1d1d;
                    span {
                        font-size: 24rpx;
                    }
                    i {
                        font-size: 24rpx;
                        color: #b2b2b2;
                        display: inline-block;
                        margin-right: 16rpx;
                    }
                }
            }
            .shop_info_list {
                display: flex;
                padding: 20rpx 35rpx 35rpx;
                align-items: center;
                .shop_tel,
                .shop_wx {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f5f5;
                    padding: 20rpx;
                    border-radius: 8rpx;
                    .icon_info {
                        width: 30rpx;
                        height: 30rpx;
                        margin-right: 10rpx;
                    }
                    p {
                        font-size: 24rpx;
                        color: #666;
                    }
                }
                .shop_wx {
                    margin-left: 20rpx;
                }
            }
        }
        .distribution_info,
        .order_list_info {
            margin-bottom: 20rpx;
            background: #fff;
            padding: 0 35rpx;
            .distribution,
            .order_info {
                padding: 20rpx 0;
                .bor_t;
                p {
                    font-size: 36rpx;
                    color: #010101;
                }
            }
            .options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 27rpx 0;
                .bor_t;
                &.other {
                    align-items: flex-start;
                }
                &>p:nth-of-type(1) {
                    font-size: 28rpx;
                    width: 140rpx;
                    text-align: left;
                    white-space: nowrap;
                    margin-right: 30rpx;
                    color: #000;
                }
                &>p:nth-of-type(2) {
                    font-size: 28rpx;
                    flex: 1;
                    text-align: right;
                    color: #999;
                    display: -webkit-box !important;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
                .options_r {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    p {
                        font-size: 28rpx;
                        flex: 1;
                        text-align: right;
                        color: #999;
                        margin-right: 0;
                        margin-right: 20rpx;
                    }
                    span {
                        font-size: 28rpx;
                        color: #ff4d3a;
                        padding-left: 25rpx;
                        position: relative;
                        &:after {
                            content: '';
                            display: block;
                            width: 1rpx;
                            height: 16rpx;
                            background: #d2d2d2;
                            position: absolute;
                            left: 0;
                            top: 14rpx;
                        }
                    }
                }
            }
        }
        .order_list_info {
            margin-bottom: 0;
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
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    border-bottom: 1px solid #ebebeb;
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
                        &::before {
                            content: '';
                            display: block;
                            width: 100%;
                            height: 0;
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            border-bottom: 1px solid #ebebeb;
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
                                background: #ff4d3a;
                            }
                            &::before {
                                display: none;
                            }
                            .text {
                                color: #ff4d3a;
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
                        }
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
    }
    .go_index {
        font-size: 26rpx;
        color: #fff;
        position: fixed;
        right: 30rpx;
        bottom: 30rpx;
        z-index: 10;
        background: #ff4d3a;
        padding: 10rpx 16rpx;
        border-radius: 4rpx;
    }
    .hidden {
        overflow: hidden !important;
        height: 100%;
    }
</style>
