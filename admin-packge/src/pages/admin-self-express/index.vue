<template>
    <div class="admin-emit-express fade_in">
        <!-- 编辑信息 -->
        <div class="emit">
            <div class="main bannerImg" v-for='(v,i) in PriceList' :key='i'>
                <div class="option other">
                    <div class="label">距离{{i+1}}</div>
                    <div class="item">
                        <i class="icon icon_clear" @click="dealInfo(v,i)"></i>
                    </div>
                </div>
                <div class="option">
                    <div class="label">起送金额</div>
                    <div class="item">
                        <input type="digit" v-model="v.Amount" maxlength="5" placeholder-class='placeholerStyle' placeholder="请输入金额">
                        <span>元</span>
                    </div>
                </div>
                <div class="option">
                    <div class="label">计价范围</div>
                    <div class="item">
                        <input type="digit" v-model="v.Range" maxlength="5" placeholder-class='placeholerStyle' placeholder="请输入距离半径">
                        <span>km</span>
                    </div>
                </div>
                <!-- <div class="option">
                        <div class="label">配送服务</div>
                        <div class="item" @click="selectDis(v,i)">
                            <input type="text" v-model="v.DeliveryName" disabled="true" placeholder-class='placeholerStyle' placeholder="选择配送类型">
                            <i class="icon  icon_arrowRight"></i>
                        </div>
                    </div> -->
                <div class="option">
                    <div class="label">配送费</div>
                    <div class="item">
                        <input type="digit" v-model="v.Freight" maxlength="5" placeholder-class='placeholerStyle' placeholder="请输入金额">
                        <span>元</span>
                    </div>
                </div>
            </div>
            <div class="selfUseAdd" @click="addSelfExpress" v-if="PriceList.length < 10">
                <i class="icon black_add"></i>
                <p>添加配置</p>
            </div>
            <div class="btn on" @click="setInfo">保存</div>
        </div>
        <template v-if="disModal">
                            <div class="modalBg" @click="disCancel">
                            </div>
                            <div class="modalCont modalCont_class">
                                <div class="modalCont_Tit">配送服务选择</div>
                                <div class="modalCont_cont modalCont_cont_class">
                                    <div class="row" v-for="(item,index) in disList" :key="index" @click="selectIndex(index)">
                                        <div class="rowItem">
                                            <div class="audioBox">
                                                <i class="icon icon_adminCheck" :class="{icon_adminChecked:(disIndex ||0) == index}"></i>
                                            </div>
                                            <div class="column1">
                                                <p>{{item.name}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modalCont_btn">
                                    <div class="modalCont_btn_cont">
                                        <div class="modalCont_btn_cont_cancel" @click="disCancel">
                                            取消
                                        </div>
                                        <div class="modalCont_btn_cont_conf" :class="{btn_dis: disIndex == null}" @click="disSave">
                                            确定
                                        </div>
                                    </div>
                                </div>
                            </div>
</template>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                infoList: [],
                emit: -1,
                shopId: '',
                PriceList: [],
                dealList: [],
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
                disIndex: '',
                disModal: false,
                selfIndex: '',
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
            console.log(this.$mp.query.isAdd);
            this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.emit = false;
            this.PriceList = [];
            this.disList = [{
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
            ];
            // 0添加  1编辑
            if (this.$mp.query.isAdd == 0) {
                this.emit = false;
            }
            if (this.$mp.query.isAdd == 1) {
                this.emit = true;
                // this.getSelfUse();
            }
            this.getSelfUse();
        },
        methods: {
            //选择配送方式
            disCancel() {
                this.disIndex = '';
                this.disModal = false;
            },
            disSave() {
                this.disModal = false;
                this.PriceList[this.selfIndex].DeliveryName = this.disList[this.disIndex].name;
                this.PriceList[this.selfIndex].DeliveryType = this.disList[this.disIndex].type;
            },
            selectIndex(index) {
                this.disList.forEach((ele, i) => {
                    if (index == i) {
                        ele.checked = true;
                        this.disIndex = i;
                    } else {
                        ele.checked = false;
                    }
                })
            },
            //选择配送类型
            selectDis(v, i) {
                console.log(v.DeliveryType);
                this.disModal = true;
                this.selfIndex = i;
                this.disList.forEach((ele, key) => {
                    if (ele.type == v.DeliveryType) {
                        ele.checked = true;
                        this.disIndex = key;
                    } else {
                        ele.checked = false;
                    }
                })
            },
            //添加配置
            addSelfExpress() {
                this.PriceList.push({
                    Id: 0,
                    Amount: '',
                    Range: '',
                    DeliveryType: 3,//''
                    Freight: '',
                    State: 0,
                    DeliveryName: ''
                });
            },
            //获取自送配置
            getSelfUse() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopSelfDelivery',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID || ''
                    }
                }).then(res => {
                    console.log(res);
                    if (res.State == 1) {
                        wx.hideLoading()
                        this.block = true;
                        if (res.Body.length == 0) {
                            this.addSelfExpress();
                        } else {
                            // this.PriceList = res.Body;
                            res.Body.forEach(ele => {
                                this.PriceList.push({
                                    Id: ele.ID,
                                    Amount: ele.Amount,
                                    Range: ele.Range,
                                    DeliveryType: 3, //ele.DeliveryType
                                    Freight: ele.Freight,
                                    State: 1,
                                    DeliveryName: this.disList[ele.DeliveryType - 1].name
                                })
                            })
                        }
                    } else {
                        this.msg(res.Msg);
                    }
                }).catch(err => {
                    this.msg(err.Msg);
                })
            },
            goEmit() {
                this.emit = true;
            },
            /* 删除信息 */
            dealInfo(v, i) {
                console.log(v)
                for (let j = 0; j < this.PriceList.length; j++) {
                    if (this.PriceList[j].Id == v.Id && v.Id != 0) {
                        v.State = -1;
                        this.dealList.push(v);
                    }
                }
                this.PriceList.splice(i, 1);
                this.msg('删除成功');
            },
            /* 修改信息 */
            setInfo() {
                console.log(this.PriceList)
                for (let i = 0; i < this.PriceList.length; i++) {
                    // for(var key in this.PriceList[i]) {
                    // console.log(key)
                    // console.log(this.PriceList[i].key)
                    if (this.PriceList[i].Amount.length == 0) {
                        this.msg('请完善费用信息');
                        return
                    }
                    if (this.PriceList[i].Range.length == 0) {
                        this.msg('请完善费用信息');
                        return
                    }
                    // if (this.PriceList[i].DeliveryType.length == 0) {
                    //     this.msg('请完善费用信息');
                    //     return
                    // }
                    // if (this.PriceList[i].DeliveryName.length == 0) {
                    //     this.msg('请完善费用信息');
                    //     return
                    // }
                    if (this.PriceList[i].Freight.length == 0) {
                        this.msg('请完善费用信息');
                        return
                    }
                    if (this.PriceList[i].State.length == 0) {
                        this.msg('请完善费用信息');
                        return
                    }
                    // }
                    // this.PriceList[i].ExpressPrice=Number(this.PriceList[i].ExpressPrice);
                    // this.PriceList[i]=Object.assign({},this.PriceList[i],{State:0});
                }
                let info = this.PriceList.concat(this.dealList);
                this.util.post({
                    url: '/api/Merchant/ShopManage/UpdateShopSelfDelivery',
                    data: {
                        ShopID: this.shopId,
                        SelfDeliveryList: info
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.msg('修改成功');
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 300)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            }
        },
        computed: {},
        components: {},
    }
</script>

<style lang="less">
    .modalBg {
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99999;
    }
    .modalCont {
        position: absolute;
        z-index: 999999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 562rpx;
        height: 490rpx;
        border-radius: 18rpx;
        padding-top: 30rpx;
        padding-bottom: 30rpx;
        background: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .modalCont_Tit {
            // height: 50rpx;
            line-height: 80rpx;
            text-align: center;
            font-family: PingFangSC-Medium;
            font-size: 35rpx;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #333333;
            padding-left: 28rpx;
            padding-right: 28rpx;
        }
        .modalCont_head {
            font-size: 30rpx;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            padding-top: 40rpx;
            padding-bottom: 30rpx;
            padding-left: 28rpx;
            padding-right: 28rpx;
            .audioBox {
                flex: 0.3;
                text-align: center;
            }
            .column1 {
                flex: 1;
                text-align: center;
                font-family: PingFangSC-Regular;
                font-size: 24rpx;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #999999;
            }
            .column2 {
                flex: 1;
                text-align: center;
                font-family: PingFangSC-Regular;
                font-size: 24rpx;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #999999;
            }
            .column3 {
                flex: 1;
                text-align: center;
                font-family: PingFangSC-Regular;
                font-size: 24rpx;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #999999;
            }
        }
        .modalCont_cont {
            height: 300rpx;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding-left: 28rpx;
            padding-right: 28rpx;
            .row {
                font-size: 26rpx;
                width: 100%;
                height: 100rpx;
                line-height: 100rpx;
                width: 100%;
                font-size: 24rpx;
                color: #1a1a1a;
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    border-bottom: 1PX solid #ebebeb;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                .rowItem {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    position: relative;
                    .audioBox {
                        position: absolute;
                        width: 100rpx;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100rpx;
                    }
                    .column1 {
                        flex: 1;
                        text-align: left;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        text-align: center;
                        p {
                            width: 100%;
                            text-align: center;
                        }
                    }
                    .column2 {
                        flex: 1;
                        text-align: center;
                        p {
                            width: 100%;
                            text-align: center;
                        }
                    }
                    .column3 {
                        flex: 1;
                        text-align: center;
                        p {
                            width: 100%;
                            text-align: center;
                        }
                    }
                    div {
                        font-family: PingFangSC-Regular;
                        font-size: 24rpx;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        color: #1a1a1a;
                    }
                }
            }
        }
        .modalCont_cont_class {
            height: 500rpx;
        }
        .modalCont_btn {
            overflow: hidden;
            padding-left: 30rpx;
            padding-right: 30rpx;
            .modalCont_btn_cont {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                font-size: 26rpx;
                margin-top: 30rpx;
                .modalCont_btn_cont_cancel {
                    text-align: center;
                    width: 245rpx;
                    height: 72rpx;
                    border: 1px solid #3c59ee;
                    font-family: PingFangSC-Regular;
                    font-size: 26rpx;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 72rpx;
                    letter-spacing: 0px;
                    color: #3c59ee;
                }
                .modalCont_btn_cont_conf {
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
                    border: 1px solid #3c59ee;
                    margin-left: 24rpx;
                }
                .btn_dis {
                    border: 1px solid #cccccc;
                    background: #cccccc;
                }
            }
        }
    }
    .modalCont_class {
        height: 680rpx;
        .modalCont_btn {
            position: relative;
            &::after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-top: 1PX solid #ebebeb;
                position: absolute;
                top: 0;
                left: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
        }
    }
    .admin-emit-express {
        background: #eeeef4;
        padding-bottom: 102rpx;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
        .selfUseAdd {
            padding-left: 36rpx;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            height: 88rpx;
            align-items: center;
            background-color: #ffffff;
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
            p {
                font-size: 28rpx;
                color: #1a1a1a;
                margin-left: 10rpx;
            }
        }
        .main {
            background: #fff;
            margin-bottom: 20rpx;
            .option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 36rpx; // border-bottom: 1rpx solid #ebebeb;
                padding: 36rpx 0;
                box-sizing: border-box;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1PX solid #ebebeb;
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
                .label {
                    font-size: 28rpx;
                    line-height: 28rpx;
                    color: #1a1a1a;
                    width: 136rpx;
                }
                .item {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-right: 34rpx;
                    input {
                        flex: 1;
                        font-size: 28rpx;
                        color: #1a1a1a;
                        line-height: 34rpx;
                    }
                    .placeholerStyle {
                        font-size: 28rpx;
                        color: #ccc;
                        line-height: 34rpx;
                    }
                    textarea {
                        flex: 1;
                        font-size: 28rpx;
                        color: #1a1a1a;
                        line-height: 34rpx;
                        width: 100%;
                        height: auto;
                        min-height: 34rpx;
                    }
                    span {
                        font-size: 28rpx;
                        color: #1a1a1a;
                    }
                }
            }
            &.bannerImg {
                .option {
                    .item {
                        justify-content: flex-end;
                    } // .label{
                    //     width: 90rpx;
                    // }
                }
                .other {
                    .label {
                        // font-weight: 900; 
                        font-size: 32rpx;
                    }
                }
            }
        }
        .btn {
            margin: 43rpx 36rpx 0;
            text-align: center;
            line-height: 88rpx;
            background: #ccc;
            font-size: 28rpx;
            color: #fff;
            &.on {
                background: #4b6df8;
            }
        }
        .list {
            .main {
                .option {
                    padding: 36rpx 36rpx 36rpx 0;
                    margin-left: 36rpx;
                    .item {
                        display: block;
                        flex: 1;
                        padding-right: 55rpx;
                        .title {
                            font-size: 32rpx;
                            color: #1a1a1a;
                            line-height: 40rpx;
                            font-weight: 900;
                            margin-bottom: 10rpx;
                        }
                        .tip {
                            font-size: 28rpx;
                            color: #444;
                            line-height: 34rpx;
                            span {
                                font-size: 28rpx;
                                color: #444;
                                line-height: 34rpx;
                                margin-right: 10rpx;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
