<template>
    <div class="rebate_cont">
        <div class="cont_scroll">
            <div class="create_time">
                <div class="create_time_tit">
                    <div class="w90">
                        <p>优惠活动时间段配置</p>
                    </div>
                </div>
                <div class="create_time_cont create_time_start">
                    <div class="w90">
                        <p class="create_time_cont_text">开始时间</p>
                        <p class="create_time_cont_time">
                            <picker mode="date" fields="day" :value="startDate" :disabled="create==2" :start="startDateLimit" :end="endTime" @change="bindStartDateChange">
                                <div class="picker">
                                    <input type="text" placeholder-style="color:#cccccc" disabled v-model="startDate" placeholder="请选择开始时间">
                                    <!-- {{startDate}} -->
                                </div>
                            </picker>
                            <i class="icon  icon_arrowRight" :class="{n:create==2}"></i>
                        </p>
                    </div>
                </div>
                <div class="create_time_cont create_time_end">
                    <div class="w90">
                        <p class="create_time_cont_text">结束时间</p>
                        <p class="create_time_cont_time">
                            <picker mode="date" fields="day" :value="endDate" :start="startDate" :end="endTime" @change="bindEndDateChange">
                                <div class="picker">
                                    <input type="text" placeholder-style="color:#cccccc" disabled v-model="endDate" placeholder="请选择结束时间">
                                    <!-- {{endDate}} -->
                                </div>
                            </picker>
                            <i class="icon  icon_arrowRight"></i>
                        </p>
                    </div>
                </div>
            </div>
            <div class="rebate_config">
                <div class="rebate_config_tit">
                    <div class="w90">
                        <p>优惠券内容配置</p>
                    </div>
                </div>
                <div class="rebate_config_choice">
                    <div class="w90">
                        <p class="rebate_config_choice_text">消费金额</p>
                        <p class="rebate_config_choice_xz">
                            <input type="number" placeholder-style="color:#cccccc" :disabled="create==2" v-model="MinimumAmount" placeholder="请输入消费金额">
                            <span>元</span>
                            <!-- <i class="icon  icon_arrowRight" :class="{n:!create}"></i> -->
                        </p>
                    </div>
                </div>
                <div class="rebate_config_choice">
                    <div class="w90">
                        <p class="rebate_config_choice_text">减免金额</p>
                        <p class="rebate_config_choice_xz">
                            <input type="number" placeholder-style="color:#cccccc" :disabled="create==2" v-model="Amount" placeholder="请输入减免金额">
                            <span>元</span>
                            <!-- <i class="icon  icon_arrowRight" :class="{n:!create}"></i> -->
                        </p>
                    </div>
                </div>
                <div class="rebate_config_choice">
                    <div class="w90">
                        <p class="rebate_config_choice_text">发放数量</p>
                        <p class="rebate_config_choice_xz">
                            <!-- <input type="text" :class="{inp:!create}" disabled v-model="Total" placeholder="请输入发放数量"> -->
                            <input type="number" placeholder-style="color:#cccccc" :disabled="create==2" v-model="Total" placeholder="请输入发放数量">
                            <span>张</span>
                            <!-- <i class="icon  icon_arrowRight" :class="{n:!create}"></i> -->
                        </p>
                    </div>
                </div>
                <div class="rebate_config_choice" v-if="create==2">
                    <div class="w90">
                        <p class="rebate_config_choice_text">增发数量</p>
                        <p class="rebate_config_choice_xz">
                            <!-- <input type="text" :class="{inp:!create}" disabled v-model="Total" placeholder="请输入发放数量"> -->
                            <input type="number" placeholder-style="color:#cccccc" v-model="AddMore" placeholder="请输入要增加发放的数量">
                            <span>张</span>
                            <!-- <i class="icon  icon_arrowRight"></i> -->
                        </p>
                    </div>
                </div>
            </div>
            <div class="rebate_people">
                <div class="rebate_buy_choice">
                    <div class="w90">
                        <p class="rebate_buy_choice_text">其他配置</p>
                        <p class="rebate_buy_choice_xz">
                            <picker class="rebate_buy_choice_xz_s" :disabled="create==2" mode="selector" range-key="cont" :range="buySpecSelect" :value="buySpecIndex" @change="bindBuySpecChange">
                                <div class="picker">
                                    <input type="text" placeholder-style="color:#cccccc" disabled v-model="buySpecSelect[buySpecIndex].cont" placeholder="请选择有效时间">
                                </div>
                            </picker>
                            <i class="icon  icon_arrowRight" :class="{n:create==2}"></i>
                        </p>
                    </div>
                </div>
            </div>
            <div class="rebate_limit">
                <div class="w90">
                    <p class="rebate_limit_text">使用限制</p>
                    <p class="rebate_limit_hc">
                        <picker class="rebate_limit_hc_s" :disabled="create==2" mode="selector" range-key="cont" :range="limitSelect" :value="limitIndex" @change="bindLimitChange">
                            <div class="picker">
                                <input type="text" placeholder-style="color:#cccccc" disabled v-model="limitSelect[limitIndex].cont" placeholder="请选择使用限制">
                            </div>
                        </picker>
                        <i class="icon  icon_arrowRight" :class="{n:create==2}"></i>
                    </p>
                </div>
            </div>
        </div>
        <div class="btn">
            <div class="w90">
                <button class="btn_revoke" :class="{btn_revoke_b:create==2}" @click="revoke" plain="true">撤销</button>
                <button @click="saveGo" plain="true" :class="{btn_dis:ifCreateSave}">保存</button>
            </div>
        </div>
        <div class="mask" v-if='modalFlag' @click='revokeCancel'></div>
        <div class="layBox" v-if='modalFlag'>
            <h2 class="title">活动停止确认</h2>
            <p>您确定取消此活动么？</p>
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
                //判断入口
                flag: false,
                create: -1,
                modalFlag: false,
                query: {},
                ifCreateSave: true,
                startDate: '',
                startDateLimit: '', //限制开始时间
                endDate: '',
                endTime: '2018-12-31',
                MinimumAmount: '',
                Amount: '',
                ExpireTime: '',
                Limit: '',
                Total: '',
                AddMore: '',
                buySpecIndex: 0,
                buySpecSelect: [{
                        value: 1,
                        cont: '领取后1天有效'
                    },
                    {
                        value: 3,
                        cont: '领取后3天有效'
                    },
                    {
                        value: 5,
                        cont: '领取后5天有效'
                    },
                    {
                        value: 7,
                        cont: '领取后7天有效'
                    }
                ],
                limitIndex: 0,
                limitSelect: [{
                        value: 1,
                        cont: '通用'
                    },
                    {
                        value: 2,
                        cont: '与活动互斥'
                    }
                ],
                selectGoodsItem: null, //创建使用
                goodsItem: null, //每条折扣商品 编辑使用
                isSave: false
            }
        },
        onLoad() {
            this.ifCreateSave = true;
            this.modalFlag = false;
            //保存开关
            this.isSave = false;
            this.query = this.$root.$mp.query;
            // console.log(this.query)
            if (this.query.create == 'true') {
                this.ifCreateSave = true;
                this.create = 1;
            } else {
                this.ifCreateSave = false;
                this.create = 2;
            }
            if (this.query.flag == 'true') {
                this.flag = true;
            } else {
                this.flag = false;
            }
            //限制选择开始时间
            this.startDateLimit = this.util.getDateTime();
            if (this.query.flag == 'true' && this.query.create == 'true') {
                //创建
                this.startDate = '';
                this.endDate = '';
                this.MinimumAmount = '';
                this.Amount = '';
                this.ExpireTime = '';
                this.Limit = '';
                this.Total = '';
                this.AddMore = '';
                this.buySpecIndex = 0;
                this.limitIndex = 0;
            }
            if (this.query.create == 'false') {
                wx.showLoading({
                    title: '加载中',
                    mask: true,
                })
                wx.setNavigationBarTitle({
                    title: '编辑优惠券'
                })
                //优惠券信息回填
                this.getDiscountItem(this.query.id);
            }
        },
        onShow() {},
        watch: {
            startDate: function(val) {
                this.ifForm();
            },
            endDate: function(val) {
                this.ifForm();
            },
            MinimumAmount: function(val) {
                let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
                let valStr = val.toString();
                if (reg.test(valStr)) {
                    this.titMsg('请输入合法金额');
                }
                let v = valStr.replace(reg, "");
                this.MinimumAmount = v;
                this.ifForm();
            },
            Amount: function(val) {
                // console.log(val > this.MinimumAmount)
                let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
                let valStr = val.toString();
                if (reg.test(valStr)) {
                    this.titMsg('请输入合法金额');
                }
                let v = valStr.replace(reg, "");
                this.Amount = v;
                // if(val < this.MinimumAmount ) {
                //     this.titMsg('减免金额不可大于消费金额');
                //     return
                // }
                this.ifForm();
            },
            Total: function(val) {
                this.ifForm();
            },
            AddMore: function(val) {
                if (/^[^\d]$/g.test(val)) {
                    this.titMsg('请输入合法金额');
                    this.ifCreateSave = true;
                } else {
                    this.ifCreateSave = false;
                }
            }
        },
        methods: {
            //停止
            revoke() {
                // console.log(this.goodsItem.GoodId);
                this.modalFlag = true;
            },
            revokeCancel() {
                this.modalFlag = false;
            },
            revokeSave() {
                this.util.post({
                    url: '/api/Merchant/Coupon/StopCoupon',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID,
                        ID: this.query.id
                    }
                }).then(res => {
                    // console.log(res)
                    this.msg('撤销成功');
                    this.modalFlag = false;
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 500)
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            //编辑 => id => 获取数据
            getDiscountItem(id) {
                this.util.post({
                    url: '/api/Merchant/Coupon/CouponDetail',
                    data: {
                        'ID': id,
                        'ShopId': wx.getStorageSync('loginInfo').ShopID
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.startDate = this.util.FmtTime(new Date(res.Body.FromDate), 'yyyy-MM-dd');
                        this.endDate = this.util.FmtTime(new Date(res.Body.EndDate), 'yyyy-MM-dd');
                        this.MinimumAmount = res.Body.MinimumAmount;
                        this.Amount = res.Body.Amount;
                        this.ExpireTime = res.Body.ExpireTime;
                        this.Limit = res.Body.Limit;
                        this.Total = res.Body.Total;
                        this.AddMore = '';
                        switch (res.Body.ExpireTime) {
                            case 1:
                                this.buySpecIndex = 0;
                                break;
                            case 3:
                                this.buySpecIndex = 1;
                                break;
                            case 5:
                                this.buySpecIndex = 2;
                                break;
                            case 7:
                                this.buySpecIndex = 3;
                                break;
                        }
                        switch (res.Body.Limit) {
                            case 1:
                                this.limitIndex = 0;
                                break;
                            case 2:
                                this.limitIndex = 1;
                                break;
                        }
                        wx.hideLoading()
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                    wx.hideLoading()
                })
            },
            titMsg(text) {
                wx.showToast({
                    title: text,
                    icon: 'none',
                    duration: 1200,
                })
            },
            //创建时判断表单填写是否有空
            ifForm() {
                if (this.startDate && this.endDate && this.MinimumAmount && this.Amount && this.Total) {
                    this.ifCreateSave = false;
                    if (/\.$/.test(this.MinimumAmount)) {
                        this.ifCreateSave = true;
                        this.titMsg('请输入合法金额');
                        return
                    } else {
                        this.ifCreateSave = false;
                    }
                    if (/\.$/.test(this.Amount)) {
                        this.ifCreateSave = true;
                        this.titMsg('请输入合法金额');
                        return
                    } else {
                        this.ifCreateSave = false;
                    }
                } else {
                    this.ifCreateSave = true;
                }
            },
            //选择有效时间
            bindBuySpecChange(e) {
                this.buySpecIndex = e.mp.detail.value;
            },
            //选择使用限制
            bindLimitChange(e) {
                this.limitIndex = e.mp.detail.value;
            },
            //选择时间
            bindStartDateChange(e) {
                this.startDate = e.target.value;
                //限制结束时间
                let endTimer = new Date(this.startDateLimit);
                //使用时间戳+90天的毫秒数
                let myDate = new Date(new Date(this.startDate).getTime() + 90 * 24 * 3600 * 1000);
                let n = myDate.getFullYear();
                let y = myDate.getMonth() + 1;
                let r = myDate.getDate();
                let yy = y.toString().replace(/^\d{1}$/, '0' + y);
                let rr = r.toString().replace(/^\d{1}$/, '0' + r);
                this.endTime = `${n}-${yy}-${rr}`;
                // console.log(this.endTime)
                // endTimer.setMonth(endTimer.getMonth()+2);
                // this.endTime = this.util.FmtTime(new Date(endTimer),'yyyy-MM-dd');
                this.ifForm();
            },
            bindEndDateChange(e) {
                var date = new Date(this.startDate);
                if (!this.startDate) {
                    this.titMsg('请选择开始时间');
                    return
                }
                if (this.timeTrans(e.target.value) >= this.timeTrans(this.startDate)) {
                    this.endDate = e.target.value;
                } else {
                    this.titMsg('请选择正确时间');
                }
                this.ifForm();
            },
            timeTrans(date) {
                return new Date(date).getTime();
            },
            //创建
            saveGo() {
                //开关
                if (this.isSave) {
                    return
                }
                this.isSave = true;
                if (!this.startDate) {
                    this.titMsg('请选择开始时间');
                    this.isSave = false;
                    return
                }
                if (!this.endDate) {
                    this.titMsg('请选择结束时间');
                    this.isSave = false;
                    return
                }
                if (!this.MinimumAmount) {
                    this.titMsg('请输入优惠券消费金额');
                    this.isSave = false;
                    return
                }
                if (!this.Amount) {
                    this.titMsg('请输入优惠券金额');
                    this.isSave = false;
                    return
                }
                if (!this.Total) {
                    this.titMsg('请输入发放数量');
                    this.isSave = false;
                    return
                }
                if (Number(this.Amount) >= Number(this.MinimumAmount)) {
                    this.titMsg('减免金额不可大于消费金额');
                    this.isSave = false;
                    return
                }
                if (this.query.create == 'true') {
                    this.util.post({
                        url: '/api/Merchant/Coupon/CreateCoupon',
                        data: {
                            'ShopId': wx.getStorageSync('loginInfo').ShopID,
                            'FromDate': this.startDate,
                            'EndDate': this.endDate,
                            'MinimumAmount': this.MinimumAmount,
                            'Amount': this.Amount,
                            'ExpireTime': this.buySpecSelect[this.buySpecIndex].value,
                            'Total': this.Total,
                            'Limit': this.limitSelect[this.limitIndex].value,
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.msg('创建成功');
                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 500)
                        }else {
                            this.msg(res.Msg);
                            this.isSave = false;
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                        this.isSave = false;
                    })
                } else {
                    if (!this.AddMore) {
                        this.titMsg('请输入增发数量');
                        return
                    }
                    this.util.post({
                        url: '/api/Merchant/Coupon/EditCoupon',
                        data: {
                            'ID': this.query.id,
                            'ShopId': wx.getStorageSync('loginInfo').ShopID,
                            'EndDate': this.endDate,
                            'AddMore': this.AddMore,
                        }
                    }).then(res => {
                        this.isSave = false;
                        setTimeout(_ => {
                            if (res.State == 1) {
                                this.msg('修改成功');
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        }, 500)
                    }).catch(err => {
                        this.msg(err.Msg)
                        this.isSave = false;
                    })
                }
            }
        }
    }
</script>

<style lang="less">
    .time {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
    page {
        background: #eeeef4;
        ;
    }
    .n {
        display: none;
    }
    .text_hidden {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .w90 {
        width: 90%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .cont_scroll {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        box-sizing: border-box;
        padding-bottom: 138rpx;
    }
    .rebate_cont {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .create_time {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start; // background: #ffffff;
            .create_time_tit {
                width: 100%; // border: 1rpx solid rgb(216, 213, 213);
                position: relative; // &:after {
                //     content: '';
                //     display: block;
                //     width: 100%;
                //     height: 0;
                //     border-bottom: 1px solid #e6e6e6;
                //     position: absolute;
                //     bottom: 0;
                //     left: 0;
                //     transform: scaleY(0.5);
                //     transform-origin: 0 0;
                // }
                p {
                    width: 100%;
                    height: 72rpx;
                    line-height: 72rpx;
                    text-align: left;
                    font-size: 24rpx;
                    font-family: PingFangSC-Regular;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #999999;
                }
            }
            .create_time_start {
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1px solid #e6e6e6;
                    position: absolute;
                    bottom: 0;
                    left: 5%;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
            }
            .create_time_cont {
                width: 100%; // border: 1rpx solid rgb(223, 218, 218);
                font-size: 27rpx;
                height: 100.5rpx;
                line-height: 100.5rpx;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background: #ffffff;
                .create_time_cont_text {
                    flex: 0.3;
                    text-align: left;
                    font-family: PingFangSC-Regular;
                    font-size: 28rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #1a1a1a;
                }
                .create_time_cont_time {
                    flex: 1;
                    text-align: left;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    line-height: 100rpx;
                    align-items: center;
                    picker {
                        flex: 1;
                        height: 100%;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        .picker {
                            width: 450rpx; // height: 100rpx;
                            // margin-top: 25rpx;
                            input {
                                // margin-top:22rpx;
                                font-family: PingFangSC-Regular;
                                font-size: 28rpx;
                                font-weight: normal;
                                font-stretch: normal;
                                letter-spacing: 0px;
                                color: #1a1a1a;
                            }
                        }
                    }
                    i {
                        flex: 0.06; // margin-top:37rpx;
                        // margin:auto 0;
                    }
                }
            }
        }
        .rebate_config {
            width: 100%; // margin-top: 30rpx;
            // background: #ffffff;
            // border-top: 1rpx solid rgb(223, 218, 218);
            // border-bottom: 1rpx solid rgb(223, 218, 218);
            font-size: 25rpx;
            .rebate_config_tit {
                width: 100%; // border-bottom: 1rpx solid rgb(223, 218, 218);
                p {
                    width: 100%;
                    height: 72rpx;
                    line-height: 72rpx;
                    text-align: left;
                    font-family: PingFangSC-Regular;
                    font-size: 24rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #999999;
                }
            }
            .rebate_config_choice {
                width: 100%;
                font-size: 27rpx;
                height: 100.5rpx;
                line-height: 100.5rpx;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                background: #ffffff;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-top: 1PX solid #e6e6e6;
                    position: absolute;
                    top: 0;
                    left: 5%;
                    transform: scaleY(0.5);
                    transform-origin: 0 0
                }
                .rebate_config_choice_text {
                    flex: 0.3;
                    text-align: left;
                    font-family: PingFangSC-Regular;
                    font-size: 28rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #1a1a1a;
                }
                .rebate_config_choice_xz {
                    flex: 1;
                    text-align: left;
                    line-height: 100.5rpx;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    input {
                        flex: 1; // margin-top:37rpx;
                        font-family: PingFangSC-Regular;
                        font-size: 28rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #1a1a1a;
                    }
                    .inp {
                        color: #1a1a1a;
                    }
                    i {
                        flex: 0.06;
                    }
                }
            }
            .rebate_config_cont {
                width: 100%;
                background: #ffffff;
                .rebate_config_cont_spec {
                    width: 100%;
                    .rebate_config_cont_spec_item {
                        width: 100%; // border-bottom: 1rpx solid rgb(223, 218, 218);
                        .rebate_config_cont_name_item_cont {
                            width: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            .rebate_config_cont_name_item_cont_c {
                                width: 100%;
                                height: 100.5rpx;
                                line-height: 100.5rpx;
                                text-align: left;
                                font-size: 28rpx; // border-bottom: 1rpx solid #e6e6e6;
                                position: relative;
                                .w90 {
                                    p {
                                        width: 100%;
                                        text-align: left;
                                        font-size: 28rpx;
                                        color: #1a1a1a;
                                    }
                                }
                            }
                            .rebate_config_cont_name_item_cont_c:after {
                                content: '';
                                display: block;
                                width: 100%;
                                height: 0;
                                border-top: 1PX solid #e6e6e6;
                                position: absolute;
                                top: 0;
                                left: 5%;
                                transform: scaleY(0.5);
                                transform-origin: 0 0
                            }
                            .rebate_config_cont_name_item_cont_c {
                                width: 100%;
                                height: 100.5rpx;
                                line-height: 100.5rpx;
                                text-align: left; // border-bottom: 1rpx solid #e6e6e6;
                                position: relative;
                                .w90 {
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start; // line-height:50rpx;
                                    .label {
                                        flex: 0.3;
                                        font-size: 28rpx;
                                        color: #1a1a1a;
                                    }
                                    .cont {
                                        flex: 1;
                                        display: flex;
                                        flex-direction: row;
                                        justify-content: flex-start;
                                        position: relative;
                                        align-items: center;
                                        input {
                                            flex: 1; // margin-top:25rpx;
                                        }
                                        p {
                                            flex: 0.2;
                                            font-size: 28rpx;
                                            color: #1a1a1a;
                                        }
                                        .dis {
                                            color: #cfcaca;
                                            position: absolute;
                                            top: 5rpx;
                                            left: 150rpx;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .rebate_people {
            width: 100%;
            margin-top: 20rpx;
            background: #ffffff;
            font-size: 25rpx;
            position: relative;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1PX solid #e6e6e6;
                position: absolute;
                bottom: 0;
                left: 5%;
                transform: scaleY(0.5);
                transform-origin: 0 0
            }
            .rebate_people_tit {
                width: 100%;
                border-bottom: 1rpx solid rgb(223, 218, 218);
                p {
                    width: 100%;
                    height: 90rpx;
                    line-height: 90rpx;
                    text-align: left;
                }
            }
            .rebate_people_bx {
                width: 100%;
                height: 100rpx;
                line-height: 100rpx;
                border-bottom: 1rpx solid rgb(223, 218, 218);
                p {
                    width: 100%;
                    text-align: left;
                    font-size: 27rpx;
                }
            }
            .rebate_people_xr {
                width: 100%;
                height: 100rpx;
                line-height: 100rpx;
                border-bottom: 1rpx solid rgb(223, 218, 218);
                p {
                    width: 100%;
                    text-align: left;
                    font-size: 27rpx;
                }
            }
            .rebate_buy_choice {
                width: 100%;
                font-size: 27rpx;
                height: 100.5rpx;
                line-height: 100.5rpx;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .rebate_buy_choice_text {
                    flex: 0.3;
                    text-align: left;
                    font-family: PingFangSC-Regular;
                    font-size: 28rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #1a1a1a;
                }
                .rebate_buy_choice_xz {
                    flex: 1;
                    text-align: left;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    .rebate_buy_choice_xz_s {
                        height: 100%;
                        flex: 1;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        .picker {
                            width: 450rpx;
                            align-items: center;
                            input {
                                width: 100%;
                                font-family: PingFangSC-Regular;
                                font-size: 28rpx;
                                font-weight: normal;
                                font-stretch: normal;
                                letter-spacing: 0px;
                                color: #1a1a1a;
                            }
                        }
                    }
                    i {
                        flex: 0.06; // margin-top:55rpx;
                    }
                }
            }
        }
        .rebate_limit {
            width: 100%;
            font-size: 27rpx;
            height: 100.5rpx;
            line-height: 100.5rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background: #ffffff; // margin-top: 30rpx;
            // border-top: 1rpx solid rgb(223, 218, 218);
            // border-bottom: 1rpx solid rgb(223, 218, 218);
            .rebate_limit_text {
                flex: 0.3;
                text-align: left;
                font-family: PingFangSC-Regular;
                font-size: 28rpx;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #1a1a1a;
            }
            .rebate_limit_hc {
                flex: 1;
                text-align: left;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                .rebate_limit_hc_s {
                    height: 100%;
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    .picker {
                        width: 450rpx;
                        align-items: center;
                        input {
                            width: 100%;
                            font-family: PingFangSC-Regular;
                            font-size: 28rpx;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 0px;
                            color: #1a1a1a;
                        }
                    }
                }
                i {
                    flex: 0.06;
                }
            }
        }
        .btn {
            width: 100%;
            height: 118rpx;
            background-color: #ffffff;
            position: absolute;
            bottom: 0;
            z-index: 10;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-top: 1PX solid #e6e6e6;
                position: absolute;
                top: 0;
                left: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0
            }
            .w90 {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
            button {
                flex: 1;
                width: 678rpx;
                height: 80rpx;
                background-color: #0863ee;
                margin: 0 auto;
                font-family: PingFangSC-Regular;
                font-size: 26rpx;
                font-weight: normal;
                font-stretch: normal;
                line-height: 80rpx;
                letter-spacing: 0px;
                color: #ffffff;
                margin-top: 19rpx;
                border: 0;
                border-radius: 0;
            }
            .btn_dis {
                background: #cccccc;
            }
            button[class="btn_dis"]::after {
                border: 0;
            }
            .btn_revoke {
                flex: 0.4;
                background: #ee5e46;
                margin-right: 24rpx;
                display: none;
            }
            .btn_revoke_b {
                display: block;
            }
        }
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .7);
            z-index: 20;
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
            z-index: 30;
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
</style>
