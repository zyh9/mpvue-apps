<template>
    <div class="container">
        <scroll-view scroll-y="true" style="height: 100%">
            <p class="no_info" v-if="noInfo">暂无明细信息</p>
            <div class="list-item" v-for="(v,i) in walletList" :key="i" v-if="walletList.length">
                <div class="wallet-info">
                    <div class="info-top">
                        <div class="text">订购内容：{{v.ReordName}}</div>
                        <div class="price" v-if="v.Source == 3">{{v.Price}}</div>
                    </div>
                    <div class="subscriber" v-if="v.Source == 1">订购方：代理代缴</div>
                    <div class="subscriber" v-if="v.Source == 2">订购方：管理员开通</div>
                    <div class="subscriber" v-if="v.Source == 3">订购方：官方直购</div>
                    <div class="time">{{v.CreateTime}}</div>
                </div>
                
            </div>
        </scroll-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                walletList: [], //套餐订购数据
                noInfo: false
            }
        },
        onReady() {
            this.noInfo = false;
            this.walletList = [];
            this.getData();
        },
        onShow() {
            
        },
        methods: {
            getData() {
                this.util.post({
                    url: '/api/Merchant/Orders/GetShopRechargeRecord',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID
                    }
                }).then(res => {
                    console.log(res);
                    if(res.State == 1) {
                        if(res.Body.ShopRechargeRecords.length == 0) {
                            this.noInfo = true;
                        }else {
                            this.noInfo = false;
                        }
                        this.walletList = res.Body.ShopRechargeRecords;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            }
        },
        components: {}
    };
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #fff;
        overflow: hidden;
        .list-item {
            padding: 35rpx 0;
            margin: 0 35rpx;
            display: flex;
            align-items: center;
            border-bottom: 1rpx solid #ebebeb;
            // &:last-child {
            //     border: none;
            // }
            .wallet-info {
                flex: 1;
                .info-top {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    line-height: 1;
                    .text {
                        text-align: left;
                        font-size: 28rpx;
                        color: #1a1a1a;
                        line-height: 1;
                    }
                    .price {
                        text-align: right;
                        font-size: 36rpx;
                        line-height: 1;
                        font-weight: bold;
                    }
                }
                .subscriber {
                    font-size: 22rpx;
                    line-height: 1;
                    margin-top: 11rpx;
                }
                .time {
                    margin-top: 19rpx;
                    font-size: 22rpx;
                    line-height: 22rpx;
                    color: #999;
                }
            }
        }
    }
    .no_info {
        text-align: center;
        font-size: 28rpx;
        color: #666;
        padding-top: 100rpx;
    }
</style>
