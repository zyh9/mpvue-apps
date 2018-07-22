<template>
    <div class="admin-delivery-price fade_in" v-if="block">
        <h3>公用配置</h3>
        <ul class="list">
            <li class="options" v-for="(v,i) in info" :key="i" @click="checkedType(v,i)">
                <!-- <i class="icon icon_adminCheck" :class="{icon_adminChecked:v.checked}" v-if="v.State==1"></i> -->
                <i class="icon icon_adminCheck" :class="{icon_adminChecked:v.checked}"></i>
                <div>
                    
                    <p class="delivery_tit">使用{{v.Name}}直接计费</p>
                    <p class="delivery_cont" v-if="v.Type==1">相关计价可到跑腿设置中查看</p>
                    <p class="delivery_cont" v-if="v.Type==3">相关计价可到达达官网查看</p>
                    <!-- <p class="delivery_cont" v-if="v.Type == 1">
                        <span v-if="v.State != 1">未开通UU跑腿计价规则，限制20km内</span>
                        <span v-if="v.State == 1">UU跑腿计价规则</span>
                    </p>
                    <p class="delivery_cont" v-if="v.Type == 3">
                        <span v-if="v.State != 1">未开通达达跑腿，请先前往跑腿配置开通</span>
                        <span v-if="v.State == 1">未达达跑腿，请先前往跑腿配置开通</span>
                    </p> -->
                </div>
            </li>
        </ul>
        <h3>自用配置</h3>
        <div class="selfUse fade_in">
            <div class="options" @click="revokeSave">
                <i class="icon icon_adminCheck" :class="{icon_adminChecked: isSelfUse}"></i>
                <div>
                    <p class="delivery_tit">使用自己配置的计费规则</p>
                    <p class="delivery_cont" v-if="noInfo=='true'">{{selfUseList.length}}条配置规则</p>
                    <p class="delivery_cont" v-if="noInfo=='false'">您还未配置自己的计费规则</p>
                </div>
                <p class="editBtn" @click.stop="addSelfExpress(1)">
                    <i class="icon black_edit" v-if="selfUseList.length > 0"></i>
                </p>
            </div>
            <ul class="selfUseList">
                <li class="selfUseItem" v-for="(item,index) in selfUseList" :key="index">
                    <div class="selfUseRow1">
                        <p class="selfUseRow1_tit">距离{{index+1}}</p>
                        <p class="selfUseRow1_cont"><span>{{item.Range}}</span>km内</p>
                    </div>
                    <div class="selfUseRow2">
                        <p class="selfUseRow2_tit"> </p>
                        <p class="selfUseRow2_cont"><span>{{item.Amount}}</span>元起送</p>
                    </div>
                    <div class="selfUseRow3">
                        <p class="selfUseRow3_tit">{{item.DeliveryName}}</p>
                        <p class="selfUseRow3_cont"><span>{{item.Freight}}</span>元配送费</p>
                    </div>
                </li>
            </ul>
            <div class="selfUseAdd" @click="addSelfExpress(0)" v-if="noInfo=='false'">
                <div class="selfUseAddCont">
                    <i class="icon black_add"></i>
                    <p>添加配置</p>
                </div>
            </div>
        </div>
        <div class="mask" v-if='modalFlag' @click='revokeCancel'></div>
        <div class="layBox" v-if='modalFlag'>
            <h2 class="title">自用配送规则配置</h2>
            <p>开启您的自用配送规则，让您的订单配送价格更加合理，有效促成交易。</p>
            <div class="modalCont_btn">
                <div class="modalCont_btn_cont">
                    <div class="modalCont_btn_cont_cancel" @click="revokeCancel">
                        稍后再说
                    </div>
                    <div class="modalCont_btn_cont_conf" @click="checkedType(4)">
                        现在就去
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
                modalFlag: false,
                info: [],
                shopInfo: {},
                noValue: false,
                selfUseList: [],
                isSelfUse: false,
                //配送方式
                disList: [{
                        type: 1,
                        name: '跑腿配送',
                        checked: false
                    },
                    {
                        type: 2,
                        name: '快递',
                        checked: false
                    },
                    {
                        type: 3,
                        name: '商家自送',
                        checked: false
                    }
                ],
                block: false,
                noInfo: false
            }
        },
        onShow() {
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            });
            this.modalFlag = false;
            this.info = [];
            this.noInfo = false;
            this.selfUseList = [];
            this.getShopInfo();
        },
        methods: {
            //选择自配二次确认
            revokeCancel() {
                this.modalFlag = false;
            },
            revokeSave() {
                if (this.selfUseList.length > 0) {
                    this.checkedType(4);
                } else {
                    this.modalFlag = true;
                }
            },
            //获取商铺信息
            getShopInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopDetail',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.State == 1) {
                        wx.setStorageSync('shopInfo', res.Body);
                        //快递配置信息
                        this.getInfo();
                    }
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            getInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopSetInfo',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID || ''
                    }
                }).then(res => {
                    // console.log(res)
                    let type = wx.getStorageSync('shopInfo').DefaultPrice;
                    // console.log(type);
                    let arr = res.Body.DispatchList.filter(e => e.Type == type && e.State == 1);
                    // console.log(arr)
                    if (arr.length) {
                        res.Body.DispatchList.forEach(ele => {
                            ele.checked = false;
                            if (ele.Type == type && ele.State == 1) {
                                ele.checked = true;
                                this.isSelfUse = false;
                                //如果 4  选择了自配 
                            } else {
                                ele.checked = false;
                            }
                        })
                    } else {
                        res.Body.DispatchList.forEach(ele => {
                            ele.checked = false;
                            if (ele.Name.indexOf('跑腿') > -1) {
                                ele.checked = true;
                            } else {
                                ele.checked = false;
                            }
                        })
                    }
                    if (type == 4) {
                        // console.log('自选')
                        this.isSelfUse = true;
                        res.Body.DispatchList.forEach(ele => {
                            ele.checked = false;
                        })
                    }
                    // console.log(res.Body.DispatchList)
                    this.info = res.Body.DispatchList;
                    this.getSelfUse();
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            //获取自送配置
            getSelfUse() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopSelfDelivery',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID || ''
                    }
                }).then(res => {
                    // console.log(res);
                    wx.hideLoading();
                    this.block = true;
                    if (res.State == 1) {
                        this.noInfo = res.Body.length ? 'true' : 'false';
                        let type = wx.getStorageSync('shopInfo').DefaultPrice;
                        if (!res.Body.length && type == 4) {
                            let initInfo = {
                                Name: "UU跑腿",
                                State: 1,
                                Type: 1,
                                checked: false,
                            }
                            this.checkedType(initInfo, 0)
                        }
                        res.Body.forEach(ele => {
                            this.selfUseList.push({
                                Id: ele.ID,
                                Amount: ele.Amount,
                                Range: ele.Range,
                                DeliveryType: ele.DeliveryType,
                                Freight: ele.Freight,
                                State: 1,
                                DeliveryName: this.disList[ele.DeliveryType - 1].name
                            })
                        })
                    } else {
                        this.msg(res.Msg);
                    }
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg);
                })
            },
            //添加商家自送配置
            addSelfExpress(v) {
                wx.navigateTo({
                    url: `/pages/admin-self-express?isAdd=${v}`
                })
            },
            checkedType(v, i) {
                if (v.State == 1) {
                    this.util.post({
                        url: '/api/Merchant/ShopManage/SetDefaultPrice',
                        data: {
                            ShopId: wx.getStorageSync('loginInfo').ShopID || '',
                            Type: v.Type, //1：UU跑腿专送 2：UU跑腿快送 3：达达非直拿直送
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.info.forEach(e => {
                                e.checked = false;
                            })
                            this.info[i].checked = true;
                            this.isSelfUse = false;
                            // wx.setStorage({
                            //     key: "charging",
                            //     data: v
                            // })
                            //设置缓存，方便下次读取
                            let shopInfo = Object.assign({}, wx.getStorageSync('shopInfo'), {
                                DefaultPrice: v.Type
                            });
                            wx.setStorageSync('shopInfo', shopInfo)
                            this.msg('设置成功')
                            // setTimeout(_ => {
                            //     wx.navigateBack({
                            //         delta: 1
                            //     })
                            // }, 300)
                        } else {
                            this.msg(res.Msg)
                        }
                    }).catch(err => {
                        this.msg(err.Msg);
                    })
                } else if (v == 4) {
                    this.util.post({
                        url: '/api/Merchant/ShopManage/SetDefaultPrice',
                        data: {
                            ShopId: wx.getStorageSync('loginInfo').ShopID || '',
                            Type: 4, //1：UU跑腿专送 2：UU跑腿快送 3：达达非直拿直送 4:自配
                        }
                    }).then(res => {
                        // console.log(res)
                        if (res.State == 1) {
                            this.info.forEach(e => {
                                e.checked = false;
                            })
                            this.isSelfUse = true;
                            // wx.setStorage({
                            //     key: "charging",
                            //     data: v
                            // })
                            //设置缓存，方便下次读取
                            let shopInfo = Object.assign({}, wx.getStorageSync('shopInfo'), {
                                DefaultPrice: v.Type
                            });
                            wx.setStorageSync('shopInfo', shopInfo)
                            this.modalFlag = false;
                            this.msg('设置成功')
                            // setTimeout(_ => {
                            //     wx.navigateBack({
                            //         delta: 1
                            //     })
                            // }, 300)
                        } else {
                            // this.addSelfExpress(0)
                        }
                    }).catch(err => {
                        // this.msg(err.Msg);
                        if (err.State == -1001) {
                            this.addSelfExpress(0)
                        }
                    })
                } else {
                    if (v.Name.indexOf('达达') > -1) {
                        this.msg('您需要先到跑腿配置开通达达配送')
                    }
                }
            }
        },
        components: {}
    }
</script>

<style lang="less">
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
        padding: 56rpx 30rpx 30rpx;
        margin: 0 auto;
        background: #fff;
        border-radius: 16rpx;
        box-sizing: border-box;
        z-index: 30;
        width: 563rpx;
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
            line-height: 42rpx;
            padding-top: 60rpx;
            text-align: left;
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
                flex-direction: row;
                justify-content: space-between;
                font-size: 26rpx;
                margin-top: 67rpx;
                .modalCont_btn_cont_cancel {
                    // flex: 1;
                    text-align: center;
                    width: 240rpx;
                    height: 72rpx;
                    border: solid 1rpx #3c59ee;
                    font-size: 26rpx;
                    line-height: 72rpx;
                    color: #3c59ee;
                }
                .modalCont_btn_cont_conf {
                    // flex: 1;
                    text-align: center;
                    color: #0863ee;
                    width: 240rpx;
                    height: 72rpx;
                    background-color: #3c59ee;
                    font-size: 26rpx;
                    line-height: 72rpx;
                    color: #ffffff;
                    border: 1rpx solid #3c59ee;
                }
                .btn_dis {
                    border: 1rpx solid #cccccc;
                    background: #cccccc;
                }
            }
        }
    }
    .admin-delivery-price {
        height: 100%;
        background: #eeeef4;
        h3 {
            padding-left: 36rpx;
            line-height: 72rpx;
            font-size: 24rpx;
            color: #999;
            font-weight: normal;
        }
        .selfUse {
            padding-left: 36rpx;
            background: #fff;
            .options {
                &:after {
                    border: none;
                }
            }
            .editBtn {
                height: 100rpx;
                width: 120rpx;
                text-align: center;
                line-height: 100rpx;
            }
            .selfUseAdd {
                padding-left: 55rpx;
                height: 88rpx;
                .selfUseAddCont {
                    position: relative;
                    height: 100%;
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    &::after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-top: 1px solid #e6e6e6;
                        position: absolute;
                        top: 0;
                        left: 0;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                    p {
                        font-size: 28rpx;
                        color: #1a1a1a;
                        margin-left: 10rpx;
                    }
                }
            }
            .selfUseList {
                padding-left: 55rpx;
                .selfUseItem {
                    height: 160rpx;
                    padding-right: 36rpx;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    position: relative;
                    &::after {
                        content: '';
                        display: block;
                        width: 100%;
                        height: 0;
                        border-top: 1px solid #e6e6e6;
                        position: absolute;
                        top: 0;
                        left: 0;
                        transform: scaleY(0.5);
                        transform-origin: 0 0;
                    }
                    .selfUseRow1 {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        .selfUseRow1_tit {
                            font-size: 24rpx;
                            color: #cccccc;
                            margin-top: 40rpx;
                            line-height: 24rpx;
                        }
                        .selfUseRow1_cont {
                            font-size: 24rpx;
                            color: #444444;
                            margin-top: 30rpx;
                            line-height: 36rpx;
                        }
                    }
                    .selfUseRow2 {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        .selfUseRow2_cont {
                            font-size: 24rpx;
                            color: #444444;
                            margin-top: 90rpx;
                            line-height: 36rpx;
                        }
                    }
                    .selfUseRow3 {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        .selfUseRow3_tit {
                            font-size: 24rpx;
                            color: #444444;
                            margin-top: 40rpx;
                            line-height: 24rpx;
                            text-align: right;
                        }
                        .selfUseRow3_cont {
                            font-size: 24rpx;
                            color: #444444;
                            margin-top: 30rpx;
                            line-height: 36rpx;
                        }
                    }
                    span {
                        font-size: 36rpx;
                        color: #444444;
                    }
                }
            }
        }
        .list {
            padding-left: 36rpx; // padding-right: 36rpx;
            background: #fff;
        }
        .options {
            background: #fff;
            height: 160rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
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
            &:last-child {
                &::after {
                    display: none;
                }
            }
            div {
                margin-left: 23rpx;
                flex: 1;
                text-align: left;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .delivery_tit {
                    color: #1a1a1a;
                    font-size: 32rpx;
                    line-height: 32rpx;
                    font-weight: 700;
                }
                .delivery_cont {
                    color: #444444;
                    font-size: 28rpx;
                    line-height: 28rpx;
                    margin-top: 17rpx;
                }
            }
            img {
                width: 40rpx;
                height: 40rpx;
            }
        }
    }
</style>