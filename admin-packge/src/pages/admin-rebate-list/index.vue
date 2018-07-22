<template>
    <div class="admin-rebate fade_in" :class="{bg:listFlag}">
        <ul class="rebate_tit">
            <li v-for="(v,i) in rebateTit" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav($event,v.state)">
                <span :class="{active:i==currentTab}">{{v.name}}</span>
            </li>
        </ul>
        <div class="rebate_List" v-if="block">
            <!-- <div v-if="rebateList.length == 0" class="no_rebate">listFlag -->
            <div v-if="listFlag" class="no_rebate">
                <div>
                    <i v-if="listFlag && state == 1" class="icon icon_spec"></i>
                    <!-- <i v-else class="icon icon_spec_end"></i> -->
                    <!-- <img src="../../static/spec.png" alt=""> -->
                </div>
                <p v-if="listFlag && state == 1">您还没有创建折扣商品</p>
                <p v-if="listFlag && state == 1">点击按钮创建一个吧</p>
                <p v-if="listFlag && state == 2">当前没有已经结束的活动</p>
            </div>
            <!-- <div v-else class="rebate_cont" :style="{height:winHeight-botHeight+'px'}"> -->
            <div v-else class="rebate_cont">
                <!-- <scroll-view scroll-y="true" style="height:100%;"  @scrolltolower='scrolltolower'> -->
                <!-- <div class="rebate_cont_box" @scroll="scrollTop"> -->
                <div class="rebate_cont_box">
                    <div v-for="(item, index) in rebateList" :key="index" class="rebate_item">
                        <div class="item_tit">
                            <div class="w90">
                                <div class="start_time">时间：<span>{{item.StartTime}}至{{item.EndTime}}</span></div>
                                <!-- <div class="end_time">结束时间：</div> -->
                                <div v-if="state == 1" class="edit" @click="edit(item)">
                                    <div class="editCont">
                                        <i class="icon icon_adminEmit"></i>
                                        <span>编辑</span>
                                    </div>
                                </div>
                                <div v-else class="edit ending">已结束</div>
                            </div>
                        </div>
                        <div class="item_cont" @click="buyGo(item)">
                            <div class="w90">
                                <div class="cont">
                                    <div class="item_cont_t">
                                        <div class="item_cont_t_l">
                                            <p class="item_cont_t_l_t">{{item.GoodName}}</p>
                                            <div class="item_cont_t_sp">
                                                <div>规格：{{item.SpecName}}</div>
                                                <div>售价：{{item.SalesPrice}}元/件<span>{{item.OriginalPrice}}元/件</span></div>
                                                <div class="rule">
                                                    <span>{{item.PriceOffRule.DiscountRule == '1' ? '每人限一份' : '每单限一份'}}</span>
                                                    <span>{{item.PriceOffRule.UseLimit == '1' ? '与其他活动互斥' : '与其他活动同时使用'}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="item_cont_spec">
                                        <div class="item_cont_spec_cont">
                                            <div>
                                                <p class="item_cont_spec_cont_t">库存数量</p>
                                                <p>{{item.MinSpecGoodsStock>99999?'无限':item.MinSpecGoodsStock}}</p>
                                            </div>
                                            <div>
                                                <p class="item_cont_spec_cont_t">售出数量</p>
                                                <p style="text-align:center;">{{item.SalesNum}} <span>件</span></p>
                                            </div>
                                            <div>
                                                <p class="item_cont_spec_cont_t">订单总金额</p>
                                                <p style="text-align:right;">{{item.SalesOrderMoney}} <span>元</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="width:100%;height:118rpx;"></div>
                </div>
                <!-- </scroll-view> -->
            </div>
        </div>
        <div class="rebate_btn" v-if="state == 1">
            <!-- <p>最多同时3个优惠券生效</p> -->
            <button @click="createGo">创建折扣商品</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                state: 1,
                listFlag: false,
                rebateTit: [{
                    name: '进行中',
                    state: 1,
                }, {
                    name: '已结束',
                    state: 2,
                }],
                currentTab: 0,
                page: 1,
                PageSize: 10,
                isOver: false,
                winHeight: 0,
                botHeight: 0,
                //折扣活动列表
                rebateList: [],
                domH: [],
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
        onShow() {
            this.currentTab = 0;
            this.state = 1;
            this.page = 1;
            this.rebateList = [];
            this.getData(this.state);
        },
        mounted() {
            let query = wx.createSelectorQuery();
            query.select('.rebate_tit').boundingClientRect();
            query.exec(res => {
                let height = res[0].height;
                wx.getSystemInfo({
                    success: res => {
                        this.winWidth = res.windowWidth;
                        //减去上方的高度
                        this.winHeight = res.windowHeight - height;
                    }
                })
            })
            query.select('.rebate_btn').boundingClientRect()
            query.exec(res => {
                this.botHeight = res[1].height;
            })
        },
        onPullDownRefresh() { //下拉刷新
            this.page = 1;
            this.rebateList = [];
            this.getData(this.state);
        },
        onReachBottom() { //触底事件
            if (this.isOver) {
                return
            }
            this.page++;
            this.getData(this.state);
        },
        methods: {
            //上拉加载
            scrolltolower() {
                if (this.isOver) {
                    return
                }
                this.page++;
                this.getData(this.state);
            },
            //折扣活动数据
            getData(state) {
                this.state = state;
                this.util.post({
                    url: '/api/Merchant/Goods/GoodList',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID,
                        GoodState: state,
                        GoodType: -1,
                        PageSize: this.PageSize,
                        PageIndex: this.page
                    }
                }).then(res => {
                    console.log(res.Body);
                    if (res.State == 1) {
                        wx.hideLoading()
                        this.block = true;
                        res.Body.forEach((element, index) => {
                            element.StartTime = this.util.FmtTime(new Date(element.StartTime), 'yyyy-MM-dd');
                            element.EndTime = this.util.FmtTime(new Date(element.EndTime), 'yyyy-MM-dd');
                            this.rebateList.push(element)
                        });
                        //判断数据是否为空
                        if (this.rebateList.length == 0) {
                            this.listFlag = true;
                        } else {
                            this.listFlag = false;
                        }
                        if (res.Body.length < this.PageSize) {
                            this.isOver = true;
                            if (this.page > 1) {
                                this.msg('没有更多信息~')
                            }
                        }
                    }
                    wx.stopPullDownRefresh()
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            // 点击切换
            swichNav(e, state) {
                if (this.currentTab === e.currentTarget.dataset.current) return;
                this.currentTab = e.currentTarget.dataset.current;
                // 判断是否点击当前
                if (state != this.state) {
                    this.rebateList = [];
                    this.state = state;
                    this.page = 1;
                    this.quest = true;
                    this.getData(state, this.page)
                }
            },
            //进入购买列表
            buyGo(item) {
                // wx.navigateTo({
                //     url: `/pages/admin-buy-list/main`
                // })
            },
            //进入创建折扣商品
            createGo() {
                wx.navigateTo({
                    url: `/pages/admin-create-rebate?flag=true&create=true`
                })
            },
            //编辑
            edit(item) {
                //编辑本地保存当条数据
                wx.setStorage({
                    key: "goodsItem",
                    data: item,
                    success: function() {
                        wx.navigateTo({
                            url: `/pages/admin-create-rebate?flag=true&create=false`
                        })
                    },
                    fail: function() {
                        this.msg('程序开了小差，请重试');
                    }
                })
            }
        }
    }
</script>

<style lang="less">
    page {
        background: #f3f3f3;
    }
    .bg {
        height: 100%;
        background: #ffffff;
    }
    .w90 {
        width: 90%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }
    .admin-rebate {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .rebate_tit {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            background: #ffffff;
            position: relative;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1px solid #e6e6e6;
                position: absolute;
                bottom: -2rpx;
                left: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            li {
                font-size: 25rpx;
                flex: 1;
                text-align: center;
                height: 100%;
                line-height: 80rpx;
                font-family: PingFangSC-Regular;
                font-size: 28px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 30px;
                letter-spacing: 0px;
            }
            span {
                height: 76rpx;
                line-height: 80rpx;
                display: block;
                width: 90rpx;
                margin: 0 auto;
                font-family: PingFangSC-Medium;
                font-size: 28rpx;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #999999;
            }
            .active {
                border-bottom: 4rpx solid #0863ee;
                color: #4c4c4c;
                font-weight: 900;
            }
        }
        .rebate_List {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            .rebate_cont {
                height: 100%;
                .rebate_cont_box {
                    width: 100%;
                    height: 100%;
                }
            }
            .rebate_item {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                font-size: 23rpx;
                margin: 0rpx auto;
                margin-top: 20rpx;
                background: #ffffff;
                .item_tit {
                    // border-bottom: 1rpx solid rgb(197, 195, 195);
                    height: 80rpx;
                    line-height: 80rpx;
                    margin-bottom: 1rpx;
                    .w90 {
                        background: #ffffff;
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
                    .start_time {
                        flex: 1;
                        font-family: PingFangSC-Regular;
                        font-size: 24rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #cccccc; // margin-left: 30rpx;
                        span {
                            color: #666666;
                        }
                    }
                    .start_end {
                        flex: 1;
                    }
                    .edit {
                        flex: 0.3;
                        text-align: right;
                        font-family: PingFangSC-Regular;
                        font-size: 24rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #1D79EA;
                        align-items: center;
                        .editCont {
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-end;
                            align-items: center;
                            span {
                                margin-left: 5rpx;
                            }
                        }
                    }
                    .ending {
                        color: #999999;
                    }
                }
                .item_cont {
                    width: 100%;
                    .cont {
                        width: 100%;
                        height: 100%;
                        background-color: #ffffff;
                        padding: 25rpx 0rpx;
                        padding-bottom: 36rpx;
                    }
                    .item_cont_t {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between; // border-bottom: 1rpx dashed rgb(197, 195, 195);
                        padding-bottom: 30rpx;
                        position: relative;
                        &:after {
                            content: '';
                            display: block;
                            width: 100%;
                            height: 0;
                            border-bottom: 1px solid #e6e6e6;
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            transform: scaleY(0.5);
                            transform-origin: 0 0;
                        }
                        .item_cont_t_l {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            line-height: 1;
                            .item_cont_t_l_t {
                                font-weight: bold;
                                font-family: PingFangSC-Medium;
                                font-size: 40rpx;
                                font-stretch: normal;
                                letter-spacing: 0px;
                                color: #1a1a1a;
                            }
                            .item_cont_t_sp {
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                margin-top: 27rpx;
                                div {
                                    // flex: 1;
                                    text-align: left;
                                    font-family: PingFangSC-Regular;
                                    font-size: 24rpx;
                                    font-weight: normal;
                                    font-stretch: normal;
                                    letter-spacing: 0px;
                                    color: #1a1a1a;
                                    margin-bottom: 27rpx;
                                    span {
                                        font-family: PingFangSC-Regular;
                                        font-size: 22rpx;
                                        font-weight: normal;
                                        font-stretch: normal;
                                        letter-spacing: 0px;
                                        color: #cccccc;
                                        text-decoration: line-through;
                                    }
                                }
                                .rule {
                                    height: 56rpx;
                                    line-height: 55rpx;
                                    margin-bottom: 9rpx; // overflow: hidden;
                                    span {
                                        font-family: PingFangSC-Regular;
                                        font-size: 22rpx;
                                        font-weight: normal;
                                        font-stretch: normal;
                                        letter-spacing: 0px;
                                        color: #1a1a1a;
                                        text-decoration: none;
                                        border: solid 1rpx #999999;
                                        padding: 10rpx 15rpx;
                                        margin-right: 15rpx;
                                    }
                                }
                            }
                        }
                        .item_cont_t_r {
                            flex: 0.5;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-around;
                            p {
                                text-align: right;
                                margin-top: 5rpx;
                                font-family: PingFangSC-Regular;
                                font-size: 24rpx;
                                font-weight: normal;
                                font-stretch: normal;
                                letter-spacing: 0px;
                                color: #cccccc;
                            }
                        }
                    }
                    .item_cont_spec {
                        width: 100%;
                        padding-top: 35rpx;
                        .item_cont_spec_t {
                            font-family: PingFangSC-Medium;
                            font-size: 30rpx;
                            font-weight: normal;
                            font-stretch: normal;
                            line-height: 70rpx;
                            letter-spacing: 0px;
                            color: #cccccc;
                            border-bottom: 1rpx solid #ebebeb;
                        } // border-bottom: 1rpx solid rgb(197, 195, 195);
                        .item_cont_spec_cont {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            width: 100%;
                            div {
                                // flex: 1;
                                font-family: PingFangSC-Regular;
                                font-size: 28rpx;
                                font-weight: normal;
                                font-stretch: normal; // line-height: 70rpx;
                                letter-spacing: 0px;
                                color: #1a1a1a; // margin-top: 20rpx;
                                text-align: left;
                                p {
                                    font-family: PingFangSC-Regular;
                                    font-size: 32rpx;
                                    font-weight: normal;
                                    font-stretch: normal; // line-height: 70rpx;
                                    letter-spacing: 0px;
                                    color: #1a1a1a;
                                    span {
                                        font-size: 19rpx;
                                    }
                                }
                                .item_cont_spec_cont_t {
                                    font-family: PingFangSC-Regular;
                                    font-size: 23rpx;
                                    font-weight: normal;
                                    font-stretch: normal; // line-height: 70rpx;
                                    letter-spacing: 0px;
                                    color: #cccccc;
                                    text-align: center;
                                }
                            }
                            .item_cont_spec_cont_l {
                                text-align: left;
                            }
                            .item_cont_spec_cont_r {
                                text-align: right;
                            }
                            .item_cont_spec_cont_t {
                                font-family: PingFangSC-Regular;
                                font-size: 24rpx;
                                font-weight: normal;
                                font-stretch: normal; // line-height: 70rpx;
                                letter-spacing: 0px;
                                color: #999999;
                            }
                        }
                    }
                }
            }
            .no_rebate {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                margin-top: 100rpx;
                div {
                    width: 100%;
                    text-align: center;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    img {
                        width: 350rpx;
                        height: 350rpx;
                    }
                }
                p {
                    text-align: center;
                    line-height: 50rpx;
                    font-family: PingFangSC-Regular;
                    font-size: 22rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 36rpx;
                    letter-spacing: 0px;
                    color: #cccccc;
                }
            }
        }
        .rebate_btn {
            width: 100%;
            position: fixed;
            bottom: 0;
            height: 118rpx;
            background-color: #ffffff;
            p {
                text-align: center;
                font-size: 24rpx;
                line-height: 50rpx;
            }
            button {
                width: 678rpx;
                height: 80rpx;
                background-color: #0863ee;
                line-height: 80rpx;
                text-align: center;
                margin: 0 auto;
                margin-top: 19rpx;
                font-family: PingFangSC-Regular;
                font-size: 26rpx;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #ffffff;
            }
        }
    }
</style>

