<template>
    <div class="admin-rebate fade_in" :class="{bg:listFlag}" v-if="block">
        <ul class="rebate_tit">
            <ul class="rebate_tit">
                <li v-for="(v,i) in rebateTit" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav($event,v.state)">
                    <span :class="{active:i==currentTab}">{{v.name}}</span>
                </li>
            </ul>
        </ul>
        <div class="rebate_List">
            <!-- <div v-if="rebateList.length == 0" class="no_rebate">listFlag -->
            <div v-if="listFlag" class="no_rebate">
                <div>
                    <i v-if="listFlag && state == 1" class="icon icon_disc"></i>
                    <!-- <i v-else class="icon icon_spec_end"></i> -->
                    <!-- <img src="../../static/spec.png" alt=""> -->
                </div>
                <p v-if="listFlag && state == 1">快速引流顾客没优惠券怎么行</p>
                <p v-if="listFlag && state == 1">最多同时3个优惠券生效</p>
                <p v-if="listFlag && state == 2">当前没有已经结束的优惠券</p>
            </div>
            <!-- <div v-else class="rebate_cont" :style="{height:winHeight-botHeight+'px'}"> -->
            <div v-else class="rebate_cont">
                <!-- <scroll-view scroll-y="true" style="height:100%;"  @scrolltolower='scrolltolower'> -->
                <!-- <div class="rebate_cont_box" @scroll="scrollTop"> -->
                <div class="rebate_cont_box">
                    <div v-for="(item, index) in discountList" :key="index" class="rebate_item">
                        <div class="item_tit">
                            <div class="w90">
                                <div class="start_time">时间：<span>{{item.FromDate}}至{{item.EndDate}}</span></div>
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
                                        <p class="roundIcon1"></p>
                                        <p class="roundIcon2"></p>
                                        <div class="item_cont_t_l">
                                            <div class="item_cont_t_l_l">
                                                <p class="amount">
                                                    <span class="num">{{item.Amount}}</span>
                                                    <span class="company">元</span>
                                                </p>
                                                <p class="remarks">
                                                    （满{{item.MinimumAmount}}可用）
                                                </p>
                                            </div>
                                            <div class="item_cont_t_l_r">
                                                <div class="name">
                                                    <span class="name_l">进店券</span>
                                                    <span class="name_r">共{{item.Total}}张</span>
                                                </div>
                                                <div class="rule">
                                                    <p>
                                                        <i></i> {{item.Limit == '1' ? '通用' : '与活动互斥'}}
                                                    </p>
                                                    <p class="rule_b" v-if="item.Status == '0' && state == 1">
                                                        <i></i> 领取后{{item.ExpireTime}}天有效
                                                    </p>
                                                    <p class="rule_b" v-if="item.Status == '1'">
                                                        <i></i> 已领取
                                                    </p>
                                                    <p class="rule_b" v-if="item.Status == '2'">
                                                        <i></i> 已抢光
                                                    </p>
                                                    <p class="rule_b" v-if=" state == 2">
                                                        <i></i> 已失效
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="item_cont_spec">
                                        <div class="item_cont_spec_cont">
                                            <div>
                                                <p class="item_cont_spec_cont_t">领取数量</p>
                                                <p>{{item.GetCnt}}<span>张</span></p>
                                            </div>
                                            <div>
                                                <p class="item_cont_spec_cont_t">使用数量</p>
                                                <p style="text-align:center;">{{item.UsedCnt}}<span>张</span></p>
                                            </div>
                                            <div>
                                                <p class="item_cont_spec_cont_t">失效数量</p>
                                                <p style="text-align:center;">{{item.DisableCnt}}<span>张</span></p>
                                            </div>
                                            <div>
                                                <p class="item_cont_spec_cont_t">总计金额</p>
                                                <p style="text-align:right;">{{item.TotalOrderMoney}}<span>元</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="state == 1 && discountList.length > 0" :class="{item_bottom: discountList.length > 0}">
                        <p>最多同时3个优惠券生效</p>
                    </div>
                    <div v-if="state == 1 && discountList.length > 0" :class="{item_bottom_b : CanCreateNew}"></div>
                </div>
                <!-- </scroll-view> -->
            </div>
        </div>
        <div class="rebate_btn" v-if=" state == 1 && blockGreat">
            <!-- <p>最多同时3个优惠券生效</p> -->
            <button @click="createGo" :class="{dis:!CanCreateNew}">创建优惠券</button>
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
                PageSize: 20,
                isOver: false,
                winHeight: 0,
                botHeight: 0,
                //折扣活动列表
                discountList: [],
                CanCreateNew: false,
                domH: [],
                blockGreat: false,
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
            this.blockGreat = false;
            this.currentTab = 0;
            this.state = 1;
            this.page = 1;
            this.getData(this.state);
        },
        methods: {
            //优惠券数据
            getData(state) {
                this.state = state;
                this.util.post({
                    url: '/api/Merchant/Coupon/CouponList',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID,
                        State: state,
                        PageSize: this.PageSize,
                        PageIndex: this.page
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.State == 1) {
                        wx.hideLoading()
                        this.block = true;
                        this.discountList = [];
                        this.CanCreateNew = res.Body.CanCreateNew;
                        if (this.CanCreateNew == false) {
                            this.blockGreat = false;
                        } else {
                            this.blockGreat = true;
                        }
                        res.Body.List.forEach((element, index) => {
                            element.FromDate = this.util.FmtTime(new Date(element.FromDate), 'yyyy-MM-dd');
                            element.EndDate = this.util.FmtTime(new Date(element.EndDate), 'yyyy-MM-dd');
                            this.discountList.push(element)
                        });
                        //判断数据是否为空
                        if (this.discountList.length == 0) {
                            this.listFlag = true;
                        } else {
                            this.listFlag = false;
                        }
                    }
                }).catch(err => {
                    wx.hideLoading()
                    this.msg(err.Msg)
                })
            },
            // 点击切换
            swichNav(e, state) {
                if (this.currentTab === e.currentTarget.dataset.current) return;
                this.currentTab = e.currentTarget.dataset.current;
                // 判断是否点击当前
                if (state != this.state) {
                    this.blockGreat = false;
                    this.discountList = [];
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
                if (!this.CanCreateNew) {
                    this.msg('不可创建')
                    return
                }
                wx.navigateTo({
                    url: `/pages/admin-create-discount?flag=true&create=true`
                })
            },
            //编辑
            edit(item) {
                if (!item) return
                wx.navigateTo({
                    url: `/pages/admin-create-discount?flag=true&create=false&id=${item.ID}`
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
                    line-height: 80rpx; // margin-bottom: 1rpx;
                    .w90 {
                        background: #ffffff;
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
                        background-color: #ffffff; // padding: 25rpx 0rpx;
                        padding-bottom: 34rpx;
                    }
                    .item_cont_t {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between; // border-bottom: 1rpx dashed rgb(197, 195, 195);
                        // padding-bottom: 30rpx;
                        border: 0.5px solid #cccccc;
                        position: relative;
                        .roundIcon1 {
                            width: 19rpx;
                            height: 38rpx;
                            border-radius: 0 38rpx 38rpx 0;
                            border: 0.5px solid #cccccc;
                            border-left: none;
                            position: absolute;
                            top: 50%;
                            margin-top: -19rpx;
                            left: -1rpx;
                            background: #ffffff;
                        }
                        .roundIcon2 {
                            width: 19rpx;
                            height: 38rpx;
                            border-radius: 38rpx 0 0 38rpx;
                            border: 0.5px solid #cccccc;
                            border-right: none;
                            position: absolute;
                            top: 50%;
                            margin-top: -19rpx;
                            right: -1rpx;
                            background: #ffffff;
                        }
                        .item_cont_t_l {
                            flex: 1;
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            line-height: 1;
                            padding: 35rpx 0rpx;
                            .item_cont_t_l_l {
                                flex: 0.6;
                                position: relative; // padding: 35rpx 0rpx;
                                display: flex;
                                flex-direction: column;
                                justify-content: flex-start;
                                border-right: 1rpx solid #ebebeb;
                                &:after {
                                    content: '';
                                    display: block;
                                    width: 100%;
                                    height: 0;
                                    border-right: 1PX solid #ebebeb;
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    transform: scaleY(0.5);
                                    transform-origin: 0 0;
                                }
                                .amount {
                                    margin-top: 10rpx;
                                    color: #ee5e46;
                                    text-align: center;
                                    .num {
                                        font-family: PingFangSC-Semibold;
                                        font-size: 72rpx;
                                        font-weight: normal;
                                        line-height: 1;
                                    }
                                    .company {
                                        font-size: 28rpx;
                                        margin-left: 6rpx;
                                    }
                                }
                                .remarks {
                                    text-align: center;
                                    font-family: PingFangSC-Regular;
                                    font-size: 22rpx;
                                    font-weight: normal;
                                    font-stretch: normal;
                                    letter-spacing: 0px;
                                    color: #cccccc;
                                    margin-top: 20rpx;
                                }
                            }
                            .item_cont_t_l_r {
                                flex: 1; // padding: 35rpx 0rpx;
                                padding-left: 55rpx;
                                display: flex;
                                flex-direction: column;
                                justify-content: flex-start;
                                .name {
                                    margin-top: 10rpx;
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
                                    .name_l {
                                        font-family: PingFangSC-Medium;
                                        font-size: 40rpx;
                                        font-weight: normal;
                                        font-stretch: normal;
                                        letter-spacing: 0px;
                                        color: #1a1a1a;
                                    }
                                    .name_r {
                                        padding: 5rpx 6rpx;
                                        font-family: PingFangSC-Regular;
                                        font-size: 18rpx;
                                        font-weight: normal;
                                        font-stretch: normal;
                                        letter-spacing: 0px;
                                        color: #ee5e46;
                                        border: solid 0.5px #ee5e46;
                                        margin-left: 10rpx;
                                        height: 18rpx;
                                        line-height: 1;
                                    }
                                }
                                .rule {
                                    margin-top: 17rpx;
                                    font-family: PingFangSC-Regular;
                                    font-size: 22rpx;
                                    font-weight: normal;
                                    font-stretch: normal;
                                    letter-spacing: 0px;
                                    color: #cccccc;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: space-between;
                                    p {
                                        display: flex;
                                        flex-direction: row;
                                        justify-content: flex-start;
                                        align-items: center;
                                        i {
                                            width: 6rpx;
                                            height: 6rpx;
                                            border-radius: 50%;
                                            background: #cccccc;
                                            margin-right: 10rpx;
                                        }
                                    }
                                    .rule_b {
                                        margin-top: 12rpx;
                                    }
                                }
                            }
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
                        padding-top: 40rpx;
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
            .item_bottom {
                width: 100%;
                height: 60rpx;
                p {
                    text-align: center;
                    font-family: PingFangSC-Regular;
                    font-size: 22rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0;
                    color: #cccccc;
                    margin-top: 30rpx;
                }
            }
            .item_bottom_b {
                height: 120rpx;
                width: 100%;
            }
            .bottom_dis {
                height: 60rpx;
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
                background: #0863ee;
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
            .dis {
                background: #cccccc;
                border: 0;
            }
        }
    }
</style>

