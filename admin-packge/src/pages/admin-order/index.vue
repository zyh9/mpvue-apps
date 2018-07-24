<template>
    <div class="admin_order" :class="{boxHidden:modalFlag||isLay}">
        <ul class="admin_order_top">
            <li v-for="(v,i) in info" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav($event,v.state)"><span>{{v.name}}</span></li>
        </ul>
        <div class="adminOrderList fade_in" v-if="block">
            <p class="no_order" v-if="!newOrder.length && noData">暂无订单记录</p>
            <ul class="admin_order_list">
                <li class="order_item" v-for="(item,index) in newOrder" :key="index">
                    <div class="lis_top" @click="goDetail(item)">
                        <div class="user set-flex set-between set-align">
                            <div class="userInfo">
                                <p class="name">{{item.CustomerNickName}}</p>
                                <p class="tel">{{item.CustomerMobile}}</p>
                            </div>
                            <div class="orderState set-grow">
                                <p class="state">{{item.stateInfo}}</p>
                                <p class="time">{{item.CreateTime}}</p>
                            </div>
                        </div>
                        <ul class="order_shop_list">
                            <li class="list_lis_info" v-for="(ele,ind) in item.Goods" :key="ind">
                                <p>{{ele.GoodName}}</p>
                                <p>X{{ele.GoodNum}}</p>
                            </li>
                        </ul>
                        <div class="order_time_price set-flex set-align set-between">
                            <div class="text">共{{item.totalNum}}件商品，订单收入:<span>&yen;{{item.CusPayMoney}}</span><span class="tip">(配送费:&yen;{{item.CusPaoTuiPrice}})</span></div>
                        </div>
                    </div>
                    <!-- 计算价格 -->
                    <!-- {{item.ExpressPriceType==1&&item.State==2&&item.status==0&&item.CancelApplyState !=1}}
                                    {{item.ExpressPriceType}}{{item.State}}{{item.status}}{{item.CancelApplyState}} -->
                    <!-- item.ExpressPriceType  方式 -->
                    <div class="lis_bottom" v-if="(item.ExpressPriceType==1||item.ExpressPriceType==3)&&item.State==2&&item.status==0&&item.CancelApplyState !=1">
                        <div v-if="item.DistributionList&&item.DistributionList.length > 1" class="btn btnSelect btnSelectBox">
                            <picker class="pickerBox" mode="selector" range-key="Name" :range="item.DistributionList" :value="item.DistributionIndex" :data-index="index" @change="DistributionChange">
                                <div class="picker">
                                    <input class="text_hidden" type="text" disabled v-model="item.DistributionList[item.DistributionIndex].Name" placeholder="请选择配送方式">
                                </div>
                            </picker>
                            <i class="icon  icon_arrowBottom"></i>
                        </div>
                        <div class="btn btnSelect" v-if="item.DistributionList&&item.DistributionList.length == 1">
                            <p class="text_hidden">{{item.DistributionList[0].Name}}</p>
                        </div>
                        <div class="btn btnBig" @click="countPrice(item)">计算价格</div>
                    </div>
                    <div class="lis_bottom" v-if="item.ExpressPriceType==4&&item.State==2&&(item.status==0||item.status==1)&&item.CancelApplyState !=1">
                        <div v-if="item.DistributionList&&item.DistributionList.length > 1" class="btn btnSelect btnSelectBox">
                            <picker class="pickerBox" mode="selector" range-key="Name" :range="item.DistributionList" :value="item.DistributionIndex" :data-index="index" @change="selfMatchingChange">
                                <div class="picker">
                                    <input class="text_hidden" type="text" disabled v-model="item.DistributionList[item.DistributionIndex].Name" placeholder="请选择配送方式">
                                </div>
                            </picker>
                            <i class="icon  icon_arrowBottom"></i>
                        </div>
                        <div class="btn btnSelect" v-if="item.DistributionList&&item.DistributionList.length == 1">
                            <p class="text_hidden">{{item.DistributionList[0].Name}}</p>
                        </div>
                        <div class="btn btnBig" v-if="item.ExpressPriceType==4&&item.State==2&&item.status==0&&item.CancelApplyState !=1&&(item.DistributionList[item.DistributionIndex].Type == 1||item.DistributionList[item.DistributionIndex].Type == 3)" @click="countPrice(item)">计算价格</div>
                        <div class="btn btnBig" v-if="item.ExpressPriceType==4&&item.State==2&&item.status==0&&item.CancelApplyState !=1&&item.DistributionList[item.DistributionIndex].Type == 4" @click="selfMatchOrder(item)">点击发单</div>
                        <div class="btn btnBig" v-if="item.ExpressPriceType==4&&item.State==2&&item.CancelApplyState !=1&&item.DistributionList[item.DistributionIndex].Type == 2" @click="blockMask(item.OrderID)"><i class="icon icon_emit1"></i>点击输入运单号</div>
                        <div class="btn btnBig" v-if="item.ExpressPriceType==4&&item.State==2&&item.status==1&&item.CancelApplyState !=1&&(item.DistributionList[item.DistributionIndex].Type == 1||item.DistributionList[item.DistributionIndex].Type == 3)" @click="ptOrder(item)">跑腿{{item.ptPrice}}元，点击发单</div>
                    </div>
                    <!-- <div class="lis_bottom" v-if="item.State==2">
                                                    <div class="btn btnBig readonly">计价中
                                                        <div class="bouncing-loader">
                                                            <i></i><i></i><i></i>
                                                        </div>
                                                    </div>
                                                </div> -->
                    <!-- 计价成功 -->
                    <!-- 这里需要(item.ExpressPriceType==1||item.ExpressPriceType==3)还原item.ExpressPriceType==1 -->
                    <!-- 自配订单 -->
                    <!-- <div class="lis_bottom" v-if="item.ExpressPriceType==4&&item.State==2&&item.status==1&&item.CancelApplyState !=1">
                                        <div class="btn btnBig" @click="selfMatchOrder(item)">点击发单</div>
                                    </div>
                                    <div class="lis_bottom" v-if="item.ExpressPriceType==4&&item.State==2&&item.CancelApplyState !=1">
                                        <div class="btn btnBig" @click='blockMask(item.OrderID)'>点击输入运单号</div>
                                    </div> -->
                    <div class="lis_bottom" v-if="(item.ExpressPriceType==1||item.ExpressPriceType==3)&&item.State==2&&item.status==1&&item.CancelApplyState !=1">
                        <div class="btn btnBig" @click="ptOrder(item)">跑腿{{item.ptPrice}}元，点击发单</div>
                    </div>
                    <!-- <div class="lis_bottom" v-if="item.State==2">
                                                <div class="btn btnBig readonly"><i class="icon icon_success"></i>发单成功</div>
                                            </div> -->
                    <!-- 快递订单，输入订单号 商家已结单代发货，state=2-->
                    <div class="lis_bottom" v-if="item.ExpressPriceType==2&&item.State==2&&item.CancelApplyState !=1">
                        <div class="btn btnBig btnInp" @click='blockMask(item.OrderID)'>点击输入运单号</div>
                    </div>
                    <!-- 两个按钮 -->
                    <div class="lis_bottom " v-if="item.State==1">
                        <div class="btn btnSmall" @click="orderOperate(2,item.OrderID)">拒单</div>
                        <div class="btn btnBig " @click="orderOperate(1,item.OrderID)">接单</div>
                    </div>
                    <!-- 用户取消订单 -->
                    <div class="lis_bottom" v-if='item.CancelApplyState ==1'>
                        <div class="btn btnSmall" @click="userCancel(2,item.OrderID)">拒绝</div>
                        <div class="btn btnBig" @click="userCancel(1,item.OrderID)">同意取消</div>
                    </div>
                    <!-- 进行中跑男信息 -->
                    <div class="lis_bottom" @click="copyTel(item.PaotuiInfo.DriverMobile)" v-if='item.PaotuiInfo!=null&&item.ExpressPriceType==1&&(item.State==4||item.State==10)'>
                        <div class="info set-flex">
                            <div class="head"><img :src="item.PaotuiInfo.DriverPhoto?item.PaotuiInfo.DriverPhoto:'https://otherfiles-ali.uupt.com/Stunner/FE/M/man.png'" alt=""></div>
                            <div>
                                <div class="name">UU跑腿</div>
                                <div class="tip">{{item.PaotuiInfo.DriverName}}为您服务</div>
                            </div>
                        </div>
                        <i class="icon icon_tel"></i>
                    </div>
                    <!-- 快递 -->
                    <div class="lis_bottom " v-if='item.ExpressInfo!=null&&item.ExpressPriceType==2&&item.State>3'>
                        <div class="info set-flex">
                            <div class="head"><img src="https://otherfiles-ali.uupt.com/Stunner/FE/M/e85a4ba7e63246be92b8f4b5246a2285_big.png" alt=""></div>
                            <div>
                                <div class="name">{{item.ExpressInfo.CompanyNamge}}</div>
                                <div class="tip" @click="copyExpress(item.ExpressInfo.OrderId)">{{item.ExpressInfo.OrderId}}</div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- <i class="icon goTop icon_top" v-if='scrollTop>=winHeight' @click='goTop'></i> -->
        <div class="mask" v-if='isLay' @click='isLay=false'></div>
        <div class="form" v-if='isLay'>
            <h2 class="title">请输入快递信息</h2>
            <div class="inp">
                <p>运单号:</p>
                <input type="number" placeholder="请输入运单号" v-model="expressNum">
            </div>
            <div class="inp">
                <p>公司:</p>
                <input type="text" placeholder="请输入快递公司" v-model="expressName">
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
    import {
        mapGetters
    } from 'vuex';
    export default {
        data() {
            return {
                //列表无数据时
                noData: false,
                //配送方式
                DistributionIndex: 0,
                DistributionList: [],
                info: [{
                        name: '全部',
                        state: 0,
                    }, {
                        name: '待接单',
                        state: 1,
                    }, {
                        name: '待发货',
                        state: 2,
                    }, {
                        name: '进行中',
                        state: 4,
                    },
                    {
                        name: '已完成',
                        state: 10,
                    },
                    {
                        name: '已取消',
                        state: -1,
                    }
                ],
                newOrder: [],
                winWidth: 0,
                winHeight: 0,
                // tab切换  
                currentTab: 0,
                scrollTop: 0,
                // scrollHeight:0
                isLay: false,
                expressNum: '', //快递单号
                expressName: '', //快递公司名称
                OrderState: 0, //全部订单
                quest: true,
                page: 1,
                curId: '', //运单信息填写订单id
                shopSet: {},
                orderOnoff: true,
                //二次确认
                modalFlag: false,
                itemRefusal: {},
                block: false,
            }
        },
        onShow() {
            this.block = false;
            this.DistributionIndex = 0;
            this.DistributionList = [];
            this.orderOnoff = true;
            // this.currentTab = 0;
            this.quest = true;
            let history = wx.getStorageSync('history') || [];
            this.itemRefusal = {}; //拒单商品
            this.newOrder = [];
            this.page = 1;
            this.getInfo();
            // let query = wx.createSelectorQuery();
            // query.select('.admin_order_top').boundingClientRect();
            // query.exec(res => {
            //     // console.log(res)
            //     let height = res[0].height;
            //     wx.getSystemInfo({
            //         success: res => {
            //             this.winWidth = res.windowWidth;
            //             //减去上方的高度
            //             this.winHeight = res.windowHeight - height;
            //         }
            //     })
            // })
        },
        methods: {
            arrayFilter(item) {
                return item.State == 1;
            },
            // 配送方式
            DistributionChange(e) {
                //e.mp.target.dataset.index 订单列表 每一条 索引
                this.newOrder[e.mp.target.dataset.index].DistributionIndex = e.mp.detail.value;
            },
            //商家自配选择
            selfMatchingChange(e) {
                // console.log('自配选择')
                this.newOrder[e.mp.target.dataset.index].DistributionIndex = e.mp.detail.value;
                let item = this.newOrder[e.mp.target.dataset.index];
                let type = item.DistributionList[this.newOrder[e.mp.target.dataset.index].DistributionIndex].Type;
                // console.log(type)
                if (type == 1 || type == 3) {
                    item.State = 2;
                    item.status = 0;
                }
                if (type == 2) {
                    item.State = 2;
                }
                if (type == 4) {
                    item.State = 2;
                    item.status = 0;
                }
            },
            getInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopSetList',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID || ''
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.State == 1) {
                        this.DistributionList = [];
                        res.Body.forEach(element => {
                            element.DispatchList.filter(this.arrayFilter);
                            // console.log(element);
                            this.DistributionList.push(element);
                        });
                        wx.setStorageSync('shopSet', this.DistributionList);
                        // this.shopSet = res.Body.DispatchList.filter(this.arrayFilter);
                        // wx.setStorageSync('shopSet', this.shopSet);
                        // this.DistributionList = res.Body.DispatchList.filter(this.arrayFilter);
                        this.newOrder = [];
                        this.getOrderList(this.info[this.currentTab].state);
                        // console.log('DistributionIndex'+this.DistributionIndex,this.DistributionList)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            copyTel(val) {
                wx.makePhoneCall({
                    phoneNumber: val
                })
            },
            copyExpress(val) {
                wx.setClipboardData({
                    data: val,
                    success: res => {
                        this.msg("复制成功")
                    },
                    fail: err => {
                        this.msg("复制失败")
                    }
                })
            },
            scrollHandler() {
                if (this.quest) {
                    this.page++;
                    this.getOrderList(this.info[this.currentTab].state);
                }
            },
            //订单列表
            getOrderList(val) {
                wx.showLoading({
                    title: '加载中',
                    mask: true
                })
                this.util.post({
                    url: '/api/Merchant/Orders/ShopOrderList',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID,
                        OrderState: val,
                        PageSize: 10,
                        PageIndex: this.page
                    }
                }).then(res => {
                    this.block = true;
                    wx.hideLoading();
                    // console.log(res)
                    //控制无订单提示显示
                    if (res.Body.length == 0 && this.newOrder.length == 0) {
                        this.noData = true;
                    } else {
                        this.noData = false;
                    }
                    if (res.Body.length < 10 && this.page > 1) {
                        this.quest = false;
                        this.msg('已经没有更多订单信息了')
                    }
                    res.Body.forEach(e => {
                        e.status = 0;
                        e.stateInfo = this.orderLabels(e.State);
                        e.ptPrice = 0;
                        e.totalNum = e.Goods.reduce(function(prev, cur) {
                            return cur.GoodNum + prev;
                        }, 0);
                        let value = wx.getStorageSync('charging');
                        // console.log('配送方式length' + this.DistributionList.length)
                        //判断配送配置项的length
                        if (this.DistributionList.length > 1) {
                            // console.log(value)
                            //判断离线缓存
                            if (value) {
                                // console.log('ifvalue')
                                this.DistributionList = this.DistributionList.filter(function(v) {
                                    // console.log('fliter')
                                    return v.Type != wx.getStorageSync('charging').Type;
                                });
                                this.DistributionList.unshift(value);
                            } else {}
                        }
                        //每一天订单 添加配送选项
                        this.DistributionList.forEach(item => {
                            // console.log(e.ExpressPriceType == item.Type)
                            if (e.ExpressPriceType == item.Type) {
                                // console.log(item)
                                e.DistributionList = item.DispatchList;
                                e.DistributionIndex = this.DistributionIndex;
                            }
                        })
                        // console.log(e)
                        // e.DistributionList = this.DistributionList;
                        // e.DistributionIndex = this.DistributionIndex;
                        // console.log(this.DistributionList)
                        wx.setStorageSync('shopSet', this.DistributionList);
                        this.newOrder.push(e)
                    })
                    wx.stopPullDownRefresh()
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            //点击切换
            swichNav(e, state) {
                if (this.currentTab === e.currentTarget.dataset.current) return;
                this.currentTab = e.currentTarget.dataset.current;
                this.block = false;
                this.newOrder = [];
                this.page = 1;
                this.quest = true;
                this.getOrderList(this.info[this.currentTab].state)
            },
            /* 跳转订单详情 */
            goDetail(item) {
                // console.log(item);
                wx.setStorage({
                    key: "distribution",
                    data: item.DistributionIndex
                })
                wx.setStorage({
                    key: "orderItem",
                    data: item
                })
                wx.navigateTo({
                    url: '/pages/admin-order-details?orderId=' + item.OrderID
                })
            },
            blockMask(orderId) {
                this.isLay = true;
                this.curId = orderId;
            },
            //填写快递单号
            subOrderNum() {
                if (this.expressNum == '') {
                    this.msg('您还没有填写运单号哦')
                } else if (this.expressName == '') {
                    this.msg('你还没有填写快递公司名字哦')
                } else {
                    this.util.post({
                        url: '/api/Merchant/Orders/FillinExpressOrderCode',
                        data: {
                            OrderID: this.curId, //订单号
                            ExpressOrderCode: this.expressNum, //快递单号
                            ExpressName: this.expressName //快递公司 
                        }
                    }).then(res => {
                        this.msg('信息填写成功')
                        this.isLay = false;
                        this.page = 1;
                        this.newOrder = [];
                        this.getOrderList(this.info[this.currentTab].state);
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
                }
            },
            //接单拒单
            orderOperate(id, odId) {
                // console.log(id,odId)
                this.itemRefusal = {
                    id: id,
                    odId: odId
                }
                // console.log(this.itemRefusal)
                if (id == 2) {
                    this.modalFlag = true;
                    return
                }
                if (this.orderOnoff) {
                    this.orderOnoff = false;
                    this.util.post({
                        url: '/api/Merchant/Orders/DealOrder',
                        data: {
                            OrderID: odId, //订单编号
                            OperateType: id, //1 接单 2 拒单
                        }
                    }).then(res => {
                        this.orderOnoff = true;
                        this.msg(id == 1 ? '接单成功' : '拒单成功');
                        /* 1.在全部列表，操作后请求数据刷新页面，在代发货订单直接改变状态，不刷新 */
                        setTimeout(_ => {
                            if (this.currentTab == 0) {
                                this.page = 1;
                                this.newOrder = [];
                                this.getOrderList(this.info[this.currentTab].state);
                            } else {
                                this.newOrder = this.newOrder.filter(e => e.OrderID != odId)
                            }
                        }, 400)
                    }).catch(err => {
                        this.orderOnoff = true;
                        this.msg(err.Msg)
                    })
                }
            },
            //拒单二次确认
            revokeCancel() {
                this.modalFlag = false;
                this.itemRefusal = {}
            },
            revokeSave() {
                // console.log(this.itemRefusal);
                if (this.orderOnoff) {
                    this.orderOnoff = false;
                    this.util.post({
                        url: '/api/Merchant/Orders/DealOrder',
                        data: {
                            OrderID: this.itemRefusal.odId, //订单编号
                            OperateType: this.itemRefusal.id, //1 接单 2 拒单
                        }
                    }).then(res => {
                        this.orderOnoff = true;
                        this.msg(this.itemRefusal.id == 1 ? '接单成功' : '拒单成功');
                        this.revokeCancel();
                        /* 1.在全部列表，操作后请求数据刷新页面，在代发货订单直接改变状态，不刷新 */
                        setTimeout(_ => {
                            if (this.currentTab == 0) {
                                this.page = 1;
                                this.newOrder = [];
                                this.getOrderList(this.info[this.currentTab].state);
                            } else {
                                this.newOrder = this.newOrder.filter(e => e.OrderID != this.itemRefusal.odId)
                            }
                        }, 400)
                    }).catch(err => {
                        this.orderOnoff = true;
                        this.msg(err.Msg)
                    })
                }
            },
            //计算跑腿费用
            countPrice(item) {
                console.log(item)
                wx.showLoading({
                    title: '计算价格中',
                    mask: true
                })
                // console.log('计费' + item.OrderID, item.DistributionList[item.DistributionIndex].Type)
                this.util.post({
                    url: '/api/Merchant/Orders/GerPaoTuiPrice',
                    data: {
                        OrderID: item.OrderID, //订单ID
                        // PaoTuiServiceType: wx.getStorageSync('shopSet').DefaultServiceType, //1 专送 2 快送
                        PaoTuiServiceType: item.DistributionList[item.DistributionIndex].Type,
                    }
                }).then(res => {
                    wx.hideLoading();
                    // console.log(res)
                    if (res.State == 1) {
                        this.newOrder.forEach(e => {
                            if (e.OrderID == item.OrderID) {
                                // console.log(e.OrderID)
                                e.ptPrice = res.Body.TotalPrice;
                                //隐藏计算价格，显示跑腿费
                                e.status = 1;
                            }
                        })
                    }
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg);
                })
            },
            //跑腿订单发单
            ptOrder(item) {
                this.util.post({
                    url: '/api/Merchant/Orders/PublishPaoTuiOrder',
                    data: {
                        OrderID: item.OrderID, //订单ID
                        PayPaoTuiType: wx.getStorageSync('shopInfo').PayPaoTuiType, //跑腿的支付方式： 1商城账号支付 2跑腿自有账号支付
                        // PaoTuiServiceType: wx.getStorageSync('shopSet').DefaultServiceType //跑腿类型 1专送 2快送 
                        PaoTuiServiceType: item.DistributionList[item.DistributionIndex].Type,
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.msg('发单成功')
                        this.newOrder.forEach(e => {
                            if (e.OrderID == item.OrderID) {
                                //隐藏计算价格，显示跑腿费
                                e.status = 2;
                            }
                        })
                        setTimeout(_ => {
                            this.page = 1;
                            this.newOrder = [];
                            this.getOrderList(this.info[this.currentTab].state)
                        }, 400)
                    } else if (res.State == -12) {
                        this.msg(res.Msg)
                        item.status = 0;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            //商家自配订单发单
            selfMatchOrder(item) {
                this.util.post({
                    url: '/api/Merchant/Orders/PublishSelfDeliveryOrder',
                    data: {
                        OrderID: item.OrderID //订单ID
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
                            this.page = 1;
                            this.newOrder = [];
                            this.getOrderList(this.info[this.currentTab].state)
                        }, 400)
                    } else if (res.State == -12) {
                        this.msg(res.Msg)
                        // item.status = 0;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 订单状态文字 */
            orderLabels(state) {
                let text = '';
                switch (state) {
                    case 1:
                        text = '待接单';
                        break;
                    case 2:
                        text = '待发货';
                        break;
                    case 3:
                        text = '正在为您派单';
                        break;
                    case 4:
                        text = '进行中';
                        break;
                    case 10:
                        text = '已完成';
                        break;
                    case -1:
                    case -2:
                    case -3:
                    case -4:
                        text = '已取消';
                        break;
                }
                return text;
            },
            userCancel(type, OrderID) {
                this.util.post({
                    url: '/api/Merchant/Orders/DealCancelApply',
                    data: {
                        OrderID: OrderID,
                        OperateType: type
                    }
                }).then(res => {
                    if (res.State == 1) {
                        if (type == 1) {
                            this.msg('订单取消成功')
                        } else if (type == 2) {
                            this.msg('拒绝用户取消订单')
                        }
                        setTimeout(() => {
                            this.page = 1;
                            this.newOrder = [];
                            this.getOrderList(this.info[this.currentTab].state);
                        }, 400)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
        },
        onPullDownRefresh() {
            //下拉刷新
            this.block = false;
            this.page = 1;
            this.newOrder = [];
            this.quest = true;
            this.getInfo();
            // this.getOrderList(this.info[this.currentTab].state);
        },
        onReachBottom() {
            /* 上拉触底 */
            this.scrollHandler();
        },
        computed: { ...mapGetters([
                'polling'
            ])
        },
        watch: {
            polling: function(newVal, oldVal) {
                console.log('您有新订单了')
                this.polling = newVal;
            }
        },
        components: {}
    }
</script>

<style lang="less">
    page {
        background: #efeef6;
    }
    .text_hidden {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .boxHidden {
        // height: 100%;
        overflow: hidden;
    }
    .admin_order {
        background: #efeef6;
        position: relative;
        padding-top: 80rpx;
        height: 100%;
        box-sizing: border-box;
        .goTop {
            position: absolute;
            bottom: 100rpx;
            right: 100rpx;
        }
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .7);
            z-index: 110;
        }
        .form {
            position: fixed;
            top: 217rpx;
            left: 0;
            right: 0;
            margin: 0 auto;
            padding: 38rpx 30rpx 30rpx;
            margin: 0 90rpx;
            background: #fff;
            border-radius: 10rpx;
            box-sizing: border-box;
            z-index: 111;
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
    .admin_order_top {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: #fff;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        li {
            font-size: 24rpx;
            flex-flow: 1;
            width: 100%;
            text-align: center;
            padding: 0 16rpx;
            height: 80rpx;
            span {
                font-size: 28rpx;
                color: #999999;
                display: inline-block;
                line-height: 76rpx;
            }
        }
        .li_select {
            span {
                color: #444;
                border-bottom: 4rpx solid #4b6df8;
                font-weight: 900;
            }
        }
    }
    .admin_order_list {
        overflow: hidden;
        .order_item {
            background: #fff;
            margin-top: 20rpx;
            .lis_top {
                padding: 0 36rpx;
                .user {
                    display: flex;
                    align-items: center;
                    justify-content: space-between; // border-bottom: 1rpx solid #e6e6e6;
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
                    height: 127rpx;
                    .userInfo {
                        .name {
                            font-size: 34rpx;
                            color: #1a1a1a;
                            line-height: 46rpx;
                            font-weight: 900;
                        }
                        .tel {
                            font-size: 24rpx;
                            color: #999;
                            line-height: 34rpx;
                        }
                    }
                    .orderState {
                        text-align: right;
                        .state {
                            font-size: 28rpx;
                            color: #3c59ee;
                            line-height: 46rpx;
                        }
                        .time {
                            font-size: 22rpx;
                            color: #999;
                            line-height: 34rpx;
                        }
                    }
                }
            }
            .order_shop_list {
                padding-top: 16rpx;
                .list_lis_info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 58rpx;
                    p {
                        padding: 12rpx 0;
                        font-size: 28rpx;
                        color: #5e5e5e;
                        &:last-child {
                            font-size: 24rpx;
                        }
                    }
                }
            }
            .order_time_price {
                line-height: 66rpx;
                .text {
                    padding: 12rpx 0 29rpx;
                    font-size: 24rpx;
                    line-height: 24rpx;
                    color: #000;
                    font-weight: 900;
                    span {
                        font-size: 32rpx;
                        font-weight: normal;
                    }
                    span.tip {
                        display: inline-block;
                        padding: 0 5rpx;
                        font-size: 24rpx;
                        color: #999;
                        font-weight: normal;
                    }
                }
            }
            .lis_bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20rpx 36rpx; // border-top: 1rpx solid #e5e5e5;
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
                /* 按钮 */
                .btn {
                    font-size: 28rpx;
                    color: #fff;
                    line-height: 74rpx;
                    text-align: center;
                    background: #4b6df8;
                    flex: 1;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    .icon {
                        margin: 0 10rpx;
                    }
                    &.btnSmall {
                        background: #ee5e46;
                        width: 184rpx;
                        margin-right: 20rpx;
                        flex: none;
                        input {
                            width: 100%;
                            height: 75rpx;
                        }
                    }
                    &.btnSelect {
                        background: #fff;
                        margin-right: 20rpx;
                        flex: none;
                        border: solid 0.5rpx #2D77F7;
                        height: 70rpx;
                        font-family: PingFangSC-Regular;
                        font-size: 28rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #2D77F7;
                        width: 184rpx;
                        input {
                            text-align: center;
                        }
                        .icon_arrowBottom {
                            width: 90rpx;
                            height: 15rpx;
                            margin: 0;
                            margin-right: 25rpx;
                        }
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
                    &.btnInp {
                        background: transparent;
                        font-size: 28rpx; // color: #4b6df8;
                        color: #2D77F7;
                        border: 1rpx solid #9aaeff;
                    }
                    &.readonly {
                        background: #e5e9ff;
                        color: #3c59ee;
                    }
                }
                /* 跑腿，快递信息栏目 */
                .info {
                    .head {
                        width: 80rpx;
                        height: 80rpx;
                        border-radius: 50%;
                        overflow: hidden;
                        margin-right: 17rpx;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .name {
                        font-size: 24rpx;
                        color: #1a1a1a;
                    }
                    .tip {
                        font-size: 28rpx;
                        color: #1a1a1a; // span {
                        //     font-size: 24rpx;
                        //     color: #999;
                        // }
                    }
                }
            }
        }
        .order_item:nth-last-of-type(1) {
            margin-bottom: 20rpx;
        }
    }
    @keyframes bouncing-loader {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        50% {
            opacity: 0.5;
            transform: translateY(10rpx);
        }
        to {
            opacity: 0.1;
            transform: translateY(-10rpx);
        }
    }
    .bouncing-loader {
        display: flex;
        justify-content: center;
    }
    .bouncing-loader>i {
        width: 10rpx;
        height: 10rpx;
        margin: 0 8rpx;
        background: #8385aa;
        border-radius: 50%;
        animation: bouncing-loader 0.6s infinite alternate;
    }
    .bouncing-loader>i:nth-child(2) {
        animation-delay: 0.2s;
    }
    .bouncing-loader>i:nth-child(3) {
        animation-delay: 0.4s;
    }
    .no_order {
        text-align: center;
        font-size: 28rpx;
        color: #666;
        padding-top: 100rpx;
    }
</style>
