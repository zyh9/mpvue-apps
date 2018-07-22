<template>
    <div class="admin-emit-express" v-if="block">
        <!-- 已有配置信息 -->
        <div class="list" v-if="!emit">
            <div class="main ">
                <div class="option" v-if='infoList.length==0'>
                    <div class="item">
                        <div class="title">不开通快递配置</div>
                        <div class="tip">依据跑腿费配置进行购买区域限制</div>
                    </div>
                </div>
                <div class="option" v-if='infoList.length>0'>
                    <div class="item">
                        <div class="title">快递配送费配置</div>
                        <div class="tip"><span v-for='(v,i) in infoList' :key='i'>{{v.RegionalismID=='-1'?'全国':v.RegionalismID=='-2'?'同省':'同城'}}{{v.ExpressPrice}}元</span></div>
                    </div>
                    <i class="icon  icon_edit" @click="emit=true,PriceList=infoList"></i>
                </div>
            </div>
            <div class="emitAdd" @click="goEmit" v-if='infoList.length==0'>
                <i class="icon icon_emitAdd"></i>
                <div class="label">添加费用配置</div>
            </div>
        </div>
        <!-- 编辑信息 -->
        <div class="emit" v-if='emit'>
            <div class="main bannerImg">
                <div class="option other">
                    <div class="label">配置</div>
                    <div class="item">
                        <i class="icon icon_clear" @click="dealInfo" v-if='infoList.length>0'></i>
                    </div>
                </div>
                <div class="option" v-for='(v,i) in PriceList' :key='i'>
                    <div class="label">{{v.RegionalismID==-1?'全国':v.RegionalismID==-2?'同省':'同城'}}</div>
                    <div class="item">
                        <input type="digit" v-model="v.ExpressPrice" placeholder-class='placeholerStyle' placeholder="费用">
                        <span>元</span>
                    </div>
                </div>
            </div>
            <div class="btn on" @click="setInfo">保存</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                emit: false,
                infoList: [],
                emit: false,
                shopId: '',
                PriceList: [{
                    Id: 0,
                    RegionalismID: '-1',
                    ExpressPrice: '',
                }, {
                    Id: 0,
                    RegionalismID: '-2',
                    ExpressPrice: ''
                }, {
                    Id: 0,
                    RegionalismID: '-3',
                    ExpressPrice: ''
                }],
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
            this.emit = false;
            this.PriceList = [{
                Id: 0,
                RegionalismID: '-1',
                ExpressPrice: '',
            }, {
                Id: 0,
                RegionalismID: '-2',
                ExpressPrice: ''
            }, {
                Id: 0,
                RegionalismID: '-3',
                ExpressPrice: ''
            }];
        },
        mounted() {
            this.shopId = wx.getStorageSync('loginInfo').ShopID || '';
            this.getInfo();
        },
        methods: {
            goEmit() {
                this.emit = true;
            },
            /* 获取信息 */
            getInfo() {
                this.infoList = [];
                this.PriceList = [{
                    Id: 0,
                    RegionalismID: '-1',
                    ExpressPrice: '',
                }, {
                    Id: 0,
                    RegionalismID: '-2',
                    ExpressPrice: ''
                }, {
                    Id: 0,
                    RegionalismID: '-3',
                    ExpressPrice: ''
                }];
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopExpressPrice',
                    data: {
                        ShopID: this.shopId
                    }
                }).then(res => {
                    if (res.State == 1) {
                        wx.hideLoading()
                        this.block = true;
                        this.infoList = res.Body;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 删除信息 */
            dealInfo() {
                for (let i = 0; i < this.PriceList.length; i++) {
                    this.PriceList[i] = Object.assign({}, this.PriceList[i], {
                        State: -1
                    })
                }
                this.util.post({
                    url: '/api/Merchant/ShopManage/UpdateShopExpressPrice',
                    data: {
                        ShopID: this.shopId,
                        PriceList: this.PriceList
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.msg('修改成功');
                        setTimeout(() => {
                            this.getInfo();
                            this.emit = false;
                        }, 300)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            /* 修改信息 */
            setInfo() {
                for (let i = 0; i < this.PriceList.length; i++) {
                    if (this.PriceList[i].ExpressPrice === '') {
                        this.msg('请完善费用信息');
                        return
                    }
                    this.PriceList[i].ExpressPrice = Number(this.PriceList[i].ExpressPrice);
                    this.PriceList[i] = Object.assign({}, this.PriceList[i], {
                        State: 0
                    });
                }
                this.util.post({
                    url: '/api/Merchant/ShopManage/UpdateShopExpressPrice',
                    data: {
                        ShopID: this.shopId,
                        PriceList: this.PriceList
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.msg('修改成功');
                        setTimeout(() => {
                            this.getInfo();
                            this.emit = false;
                        }, 300)
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            }
        },
        computed: {
        },
        components: {},
    }
</script>

<style lang="less">
    .admin-emit-express {
        background: #eeeef4;
        padding-bottom: 102rpx;
        height: 100%;
        overflow-y: scroll;
        box-sizing: border-box;
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
                    }
                    .label {
                        width: 90rpx;
                    }
                }
                .other {
                    .label {
                        font-weight: 900;
                        font-size: 30rpx;
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
            .emitAdd {
                background: #fff;
                margin-bottom: 20rpx;
                display: flex;
                padding: 36rpx;
                padding-left: 25rpx;
                .label {
                    font-size: 28rpx;
                    line-height: 28rpx;
                    color: #1a1a1a;
                    margin-left: 25rpx;
                }
            }
        }
    }
</style>
