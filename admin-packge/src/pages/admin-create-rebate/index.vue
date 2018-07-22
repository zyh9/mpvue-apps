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
                        <p>折扣商品内容配置</p>
                    </div>
                </div>
                <div class="rebate_config_choice">
                    <div class="w90" @click="choice_goods">
                        <p class="rebate_config_choice_text">商品选择</p>
                        <p class="rebate_config_choice_xz">
                            <input type="text" placeholder-style="color:#cccccc" :class="{inp:create == 2}" disabled v-model="goodsName" placeholder="您需要先添加商品才能做折扣活动">
                            <i class="icon  icon_arrowRight" :class="{n:create == 2}"></i>
                        </p>
                    </div>
                </div>
                <div class="rebate_config_cont">
                    <div class="rebate_config_cont_spec">
                        <div class="rebate_config_cont_spec_item" v-for="(item,index) in specList" :key="index">
                            <div class="rebate_config_cont_name_item_cont">
                                <div class="rebate_config_cont_name_item_cont_c">
                                    <div class="w90">
                                        <div class="label">规格名称</div>
                                        <div class="cont text_hidden">
                                            {{item.SpecName}}
                                        </div>
                                    </div>
                                </div>
                                <div class="rebate_config_cont_name_item_cont_c">
                                    <div class="w90">
                                        <div class="label">商品原价</div>
                                        <div class="cont">
                                            <input type="digit" placeholder-style="color:#cccccc" v-model="OriginalPrice" :disabled="create == 2" placeholder="请输入商品原价">
                                            <p>元/份</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="rebate_config_cont_name_item_cont_c">
                                    <div class="w90">
                                        <div class="label">商品售价</div>
                                        <div class="cont">
                                            <input type="digit" placeholder-style="color:#cccccc" v-model="SalesPrice" :disabled="create == 2" placeholder="请输入商品售价">
                                            <p>元/份</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="rebate_config_cont_name_item_cont_c">
                                    <div class="w90">
                                        <div class="label">商品库存</div>
                                        <div class="cont cont_kc">
                                            <input type="number" placeholder-style="color:#cccccc" v-model="stockAmount" :disabled="isStock" maxlength="5" placeholder="请输入商品库存">
                                            <div @click="clickStock(item)" class="kc_btn" :class="{kc_active:isStock}">库存无限量 <i></i></div>
                                            <p>份</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rebate_people">
                <div class="rebate_buy_choice">
                    <div class="w90">
                        <p class="rebate_buy_choice_text">购买规则</p>
                        <p class="rebate_buy_choice_xz">
                            <picker class="rebate_buy_choice_xz_s" :disabled="create == 2" mode="selector" range-key="cont" :range="buySpecSelect" :value="buySpecIndex" @change="bindBuySpecChange">
                                <div class="picker">
                                    <input type="text" placeholder-style="color:#cccccc" disabled v-model="buySpecSelect[buySpecIndex].cont" placeholder="请选择购买规则">
                                </div>
                            </picker>
                            <i class="icon  icon_arrowRight" :class="{n:create == 2}"></i>
                        </p>
                    </div>
                </div>
            </div>
            <div class="rebate_limit">
                <div class="w90">
                    <p class="rebate_limit_text">使用限制</p>
                    <p class="rebate_limit_hc">
                        <picker class="rebate_limit_hc_s" :disabled="create == 2" mode="selector" range-key="cont" :range="limitSelect" :value="limitIndex" @change="bindLimitChange">
                            <div class="picker">
                                <input type="text" placeholder-style="color:#cccccc" disabled v-model="limitSelect[limitIndex].cont" placeholder="请选择使用限制">
                            </div>
                        </picker>
                        <i class="icon  icon_arrowRight" :class="{n:create == 2}"></i>
                    </p>
                </div>
            </div>
        </div>
        <div class="btn">
            <div class="w90">
                <button class="btn_revoke" :class="{btn_revoke_b:create == 2}" v-if="!createNum" @click="revoke" plain="true">停止活动</button>
                <button @click="saveGo" plain="true" :class="{btn_dis:ifCreateSave}">保存并发布</button>
            </div>
        </div>
        <div class="mask" v-if='modalFlag' @click='revokeCancel'></div>
        <div class="layBox" v-if='modalFlag'>
            <h2 class="title">请您确认</h2>
            <p>您确定要中途停止折扣活动？</p>
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
                query: {},
                modalFlag: false,
                ifCreateSave: true,
                startDate: '',
                startDateLimit: '', //限制开始时间
                endDate: '',
                endTime: '2018-12-31',
                goodsName: '',
                OriginalPrice: '',
                SalesPrice: '',
                isStock: true,
                stockAmount: '无限',
                buySpecIndex: 0,
                buySpecSelect: [{
                        value: 1,
                        cont: '每人限一份'
                    },
                    {
                        value: 2,
                        cont: '每单限一份'
                    }
                ],
                limitIndex: 0,
                limitSelect: [{
                        value: 1,
                        cont: '与其他活动互斥'
                    },
                    {
                        value: 2,
                        cont: '与其他活动同时使用'
                    }
                ],
                specList: [],
                selectGoodsItem: null, //创建使用
                goodsItem: null, //每条折扣商品 编辑使用
                //创建折扣开关
                isSave: false
            }
        },
        // created() {
        //     this.create = true;
        // },
        onUnload() {
            if (this.query.create == 'true') {
                // console.log('onunload-remove');
                wx.removeStorage({
                    key: 'goodsSelect',
                    success: function(res) {
                        // console.log(res)
                    }
                });
                wx.removeStorage({
                    key: 'timer',
                    success: function(res) {
                        // console.log(res)
                    }
                });
            }
            this.modalFlag = false;
        },
        onLoad() {
            this.ifCreateSave = true;
            //保存开关
            this.isSave = false;
            this.create = -1;
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
        },
        onShow() {
            let that = this;
            //限制选择开始时间
            this.startDateLimit = that.util.getDateTime();
            //限制结束时间
            let endTimer = new Date(this.startDateLimit)
            endTimer.setMonth(endTimer.getMonth() + 2);
            this.endTime = this.util.FmtTime(new Date(endTimer), 'yyyy-MM-dd');
            this.query = this.$root.$mp.query;
            if (this.query.flag == 'true' && this.query.create == 'true') {
                //创建
                // console.log('创建');
                //获取时间
                let that = this;
                that.startDate = '';
                that.endDate = '';
                that.buySpecIndex = 0;
                that.limitIndex = 0;
                that.isStock = true;
                that.stockAmount = '无限';
                wx.getStorage({
                    key: 'timer',
                    success: function(res) {
                        // console.log(res.data)
                        that.startDate = res.data.start ? res.data.start : '';
                        that.endDate = res.data.end ? res.data.end : '';
                    }
                })
                this.goodsName = '';
                this.specList = [];
                wx.getStorage({
                    key: 'goodsSelect',
                    success: function(res) {
                        // console.log(res)
                        that.selectGoodsItem = res.data;
                        that.goodsName = res.data.GoodName;
                        that.specList = res.data.specList;
                        that.OriginalPrice = res.data.specList[0].OriginalPrice;
                        that.SalesPrice = res.data.specList[0].SalesPrice;
                        that.isStock = res.data.specList[0].ResidueCount > 99999 ? true : false;
                        that.stockAmount = res.data.specList[0].ResidueCount > 99999 ? '无限' : res.data.specList[0].ResidueCount;
                    }
                })
                this.ifCreateSave = true;
            }
            if (this.query.flag == 'true' && this.query.create == 'false') {
                // console.log('编辑')
                wx.showLoading({
                    title: '加载中',
                    mask: true,
                })
                wx.setNavigationBarTitle({
                    title: '编辑折扣商品'
                })
                //折扣活动信息回填
                wx.getStorage({
                    key: 'goodsItem',
                    success: function(res) {
                        // console.log(res.data.MinSpecGoodsStock > 99999, typeof res.data.MinSpecGoodsStock);
                        that.goodsItem = res.data;
                        that.startDate = res.data.StartTime;
                        that.endDate = res.data.EndTime;
                        that.goodsName = res.data.GoodName;
                        // 控制规则picker
                        that.buySpecIndex = res.data.PriceOffRule.DiscountRule - 1;
                        that.limitIndex = res.data.PriceOffRule.UseLimit - 1;
                        that.specList = [];
                        that.specList.push({
                            SpecName: res.data.SpecName,
                            OriginalPrice: res.data.OriginalPrice,
                            SalesPrice: res.data.SalesPrice,
                            MinSpecGoodsStock: res.data.MinSpecGoodsStock,
                            stockAmount: res.data.MinSpecGoodsStock > 99999 ? '无限' : res.data.MinSpecGoodsStock,
                            isStock: res.data.MinSpecGoodsStock > 99999 ? true : false
                        })
                        that.OriginalPrice = res.data.OriginalPrice;
                        that.SalesPrice = res.data.SalesPrice;
                        that.stockAmount = res.data.MinSpecGoodsStock > 99999 ? '无限' : res.data.MinSpecGoodsStock;
                        that.isStock = res.data.MinSpecGoodsStock > 99999 ? true : false;
                        //按钮解禁
                        that.ifCreateSave = false;
                        setTimeout(() => wx.hideLoading(), 500);
                    }
                })
                this.ifCreateSave = false;
            }
        },
        watch: {
            startDate: function(val) {
                this.ifForm();
            },
            endDate: function(val) {
                this.ifForm();
            },
            OriginalPrice: function(val) {
                let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
                let valStr = val.toString();
                if (reg.test(valStr)) {
                    this.titMsg('请输入合法金额');
                }
                let v = valStr.replace(reg, "");
                this.OriginalPrice = v;
                this.specList[0].OriginalPrice = v;
                this.ifForm();
            },
            SalesPrice: function(val) {
                let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
                let valStr = val.toString();
                if (reg.test(valStr)) {
                    this.titMsg('请输入合法金额');
                }
                let v = valStr.replace(reg, "");
                this.SalesPrice = v;
                this.specList[0].SalesPrice = v;
                this.ifForm();
            }
        },
        methods: {
            clickStock(item) {
                //如果是编辑  不可点击
                // if(this.create == 2) return
                this.isStock = !this.isStock;
                this.stockAmount = this.isStock ? '无限' : '';
            },
            revoke() {
                // console.log(this.goodsItem.GoodId);
                this.modalFlag = true;
            },
            revokeCancel() {
                this.modalFlag = false;
            },
            revokeSave() {
                // console.log(this.goodsItem.GoodId);
                let arrId = [];
                arrId.push(this.goodsItem.GoodId);
                this.util.post({
                    url: '/api/Merchant/Goods/ChangeGoodsState',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID,
                        GoodIds: arrId,
                        State: 2
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.State == 1) {
                        this.msg('停售成功');
                        this.modalFlag = false;
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 500)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
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
                if (this.startDate && this.endDate && this.goodsName && this.specList.length && this.specList[0].OriginalPrice && this.specList[0].SalesPrice) {
                    this.ifCreateSave = false;
                    if (/\.$/.test(this.OriginalPrice)) {
                        this.ifCreateSave = true;
                        this.titMsg('请输入合法原价');
                        return
                    } else {
                        this.ifCreateSave = false;
                    }
                    if (/\.$/.test(this.SalesPrice)) {
                        this.ifCreateSave = true;
                        this.titMsg('请输入合法售价');
                        return
                    } else {
                        this.ifCreateSave = false;
                    }
                } else {
                    this.ifCreateSave = true;
                }
            },
            //选择配置规则
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
                if (this.startDate && this.endDate && this.goodsName && this.specList.length && this.specList[0].OriginalPrice && this.specList[0].SalesPrice) {
                    this.ifCreateSave = false;
                }
            },
            bindEndDateChange(e) {
                var date = new Date(this.startDate);
                if (!this.startDate) {
                    this.msg('请选择开始时间');
                    return
                }
                if (this.timeTrans(e.target.value) >= this.timeTrans(this.startDate)) {
                    this.endDate = e.target.value;
                } else {
                    this.msg('请选择正确时间');
                }
                if (this.startDate && this.endDate && this.goodsName && this.specList.length && this.specList[0].OriginalPrice && this.specList[0].SalesPrice) {
                    this.ifCreateSave = false;
                }
            },
            timeTrans(date) {
                return new Date(date).getTime();
            },
            choice_goods() {
                //如果是编辑不可选
                // console.log(this.create, typeof this.query.create, this.query.create)
                if (this.query.create == 'false') {
                    return;
                }
                let timerObj = {
                    start: this.startDate,
                    end: this.endDate
                }
                wx.setStorage({
                    key: "timer",
                    data: timerObj
                })
                wx.navigateTo({
                    url: '/pages/admin-commodity-manage?flag=true&create=true'
                })
            },
            //创建
            saveGo() {
                if (!this.startDate) {
                    this.msg('请选择开始时间');
                    this.isSave = false;
                    return
                }
                if (!this.endDate) {
                    this.msg('请选择结束时间');
                    this.isSave = false;
                    return
                }
                if (!this.goodsName) {
                    this.msg('您需要先添加商品才能做折扣活动');
                    this.isSave = false;
                    return
                }
                if (!this.OriginalPrice) {
                    this.msg('请输入原价');
                    this.isSave = false;
                    return
                }
                if (!this.SalesPrice) {
                    this.msg('请输入销售价');
                    this.isSave = false;
                    return
                }
                if (!this.stockAmount) {
                    this.msg('请输入库存');
                    this.isSave = false;
                    return
                }
                if (this.isSave) {
                    return
                }
                this.isSave = true;
                let selectGoodsItem = this.selectGoodsItem;
                this.specList[0].Id = 0;
                this.specList[0].InitStock = this.isStock ? 99999999 : Number(this.stockAmount);
                this.specList[0].PriceOffRule = {
                    DiscountRule: this.buySpecSelect[this.buySpecIndex].value,
                    UseLimit: this.limitSelect[this.limitIndex].value
                };
                // console.log(this.specList)
                let obj;
                if (this.query.create == 'true') {
                    obj = {
                        'ShopId': wx.getStorageSync('loginInfo').ShopID,
                        'GoodId': 0,
                        'GoodName': selectGoodsItem.GoodName,
                        'StartTime': this.startDate,
                        'EndTime': this.endDate,
                        'GoodMasterPic': selectGoodsItem.MasterPic,
                        'GoodType': -1,
                        'GoodBrief': selectGoodsItem.GoodBrief,
                        'ThirdPartyPlatType': 0,
                        'ThirdPartyPlatId': 0,
                        'GoodSpecs': this.specList,
                        'GoodPics': selectGoodsItem.GoodPics
                    }
                    this.util.post({
                        url: '/api/Merchant/Goods/CreateDiscountGoodInfo',
                        data: obj
                    }).then(res => {
                        if (res.State == 1) {
                            let that = this;
                            wx.removeStorage({
                                key: 'goodsSelect',
                                success: function(res) {
                                    that.msg('创建成功');
                                    setTimeout(() => {
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }, 500)
                                }
                            });
                            wx.removeStorage({
                                key: 'timer',
                                success: function(res) {
                                    // console.log(res)
                                }
                            })
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                        wx.removeStorage({
                            key: 'goodsSelect',
                            success: function(res) {}
                        });
                        wx.removeStorage({
                            key: 'timer',
                            success: function(res) {}
                        });
                    })
                } else {
                    obj = {
                        'ShopId': wx.getStorageSync('loginInfo').ShopID,
                        'GoodId': this.goodsItem.GoodId,
                        'StartTime': this.startDate,
                        'EndTime': this.endDate,
                        'Stock': this.isStock ? 999999999 : Number(this.stockAmount)
                    }
                    this.util.post({
                        url: '/api/Merchant/Goods/UpdateDiscountGoodInfo',
                        data: obj
                    }).then(res => {
                        if (res.State == 1) {
                            let that = this;
                            wx.removeStorage({
                                key: 'goodsItem',
                                success: function(res) {
                                    that.msg('修改成功');
                                    setTimeout(() => {
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }, 500)
                                }
                            })
                            wx.hideLoading()
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                        wx.hideLoading()
                        wx.removeStorage({
                            key: 'goodsItem',
                            success: function(res) {
                                // that.msg('修改成功');
                                setTimeout(() => {
                                    // wx.navigateBack({
                                    //     delta: 1
                                    // })
                                }, 500)
                            }
                        })
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
            justify-content: flex-start;
            .create_time_tit {
                width: 100%;
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
                width: 100%;
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
                            width: 450rpx;
                            input {
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
                        flex: 0.05;
                    }
                }
            }
        }
        .rebate_config {
            width: 100%;
            font-size: 25rpx;
            .rebate_config_tit {
                width: 100%;
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
                        flex: 1;
                        font-family: PingFangSC-Regular;
                        font-size: 28rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #cccccc;
                    }
                    .inp {
                        color: #1a1a1a;
                    }
                    i {
                        flex: 0.05;
                    }
                }
            }
            .rebate_config_cont {
                width: 100%;
                background: #ffffff;
                .rebate_config_cont_spec {
                    width: 100%;
                    .rebate_config_cont_spec_item {
                        width: 100%;
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
                                font-size: 28rpx;
                                position: relative;
                                .w90 {
                                    p {
                                        width: 100%;
                                        text-align: right;
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
                                text-align: left;
                                position: relative;
                                .w90 {
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
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
                                    .cont_kc {
                                        input {
                                            flex: 1;
                                        }
                                        .kc_btn {
                                            width: 164rpx;
                                            height: 48rpx;
                                            border: solid 1px #cccccc;
                                            font-size: 24rpx;
                                            color: #999999;
                                            text-align: center;
                                            line-height: 48rpx;
                                            margin-right: 22rpx;
                                            position: relative;
                                        }
                                        .kc_active {
                                            border: solid 1px #3c59ee;
                                            font-family: PingFangSC-Regular;
                                            font-size: 24rpx;
                                            color: #3c59ee;
                                            text-align: center;
                                            line-height: 48rpx;
                                            i {
                                                position: absolute;
                                                width: 0;
                                                height: 0;
                                                bottom: -20rpx;
                                                right: -20rpx;
                                                border-width: 20rpx;
                                                border-style: solid;
                                                border-color: transparent transparent transparent #3c59ee;
                                                transform: rotate(45deg);
                                            }
                                        }
                                        p {
                                            flex: 0.1;
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
                        flex: 0.05;
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
            background: #ffffff;
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
                    flex: 0.05;
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
                border: none;
                box-shadow: 0;
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
