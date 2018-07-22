<template>
    <div class="container">
        <scroll-view scroll-y="true" lower-threshold="60" @scrolltolower="scrollHandler" style="height: 100%">
            <p class="no_info" v-if="noInfo">暂无明细信息</p>
            <div class="list-item" v-for="(v,i) in walletList" :key="i" v-if="walletList.length">
                <div class="wallet-info">
                    <div class="text">{{v.SubjectName}}</div>
                    <div class="time">{{v.TradeTime}}</div>
                </div>
                <div class="price">
                    {{v.TradeMoney}}
                </div>
            </div>
        </scroll-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                walletList: [], //钱包明细数组
                quest: true,
                page: 1,
                PageSize: 10,
                noInfo: false
            }
        },
        onReady() {
        },
        onShow() {
            wx.setNavigationBarTitle({
                title: this.$mp.query.type == 1 ? wx.getStorageSync('shopInfo').ShopPlatType == 1 ? '商城钱包明细' : '交易明细' : '达达跑腿钱包明细'
            });
            this.noInfo = false;
            this.walletList = [];
            this.quest = true;
            this.page = 1;
            this.getData();
        },
        methods: {
            getData() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/ShopTradeList',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID,
                        PageSize: this.PageSize,
                        PageIndex: this.page,
                        Type: this.$mp.query.type
                    }
                }).then(res => {
                    if (res.Body.length < this.PageSize && this.page > 1) {
                        this.quest = false;
                        this.msg('已经没有更多信息了')
                    } else if (!res.Body.length && this.page == 1) {
                        this.noInfo = true;
                    }
                    this.walletList.push(...res.Body)
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            scrollHandler() {
                if (this.quest) {
                    this.page++;
                    this.getData()
                }
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
            &:last-child {
                border: none;
            }
            .wallet-info {
                flex: 1;
                .text {
                    font-size: 28rpx;
                    line-height: 22rpx;
                    color: #1a1a1a;
                }
                .time {
                    margin-top: 16rpx;
                    font-size: 22rpx;
                    line-height: 22rpx;
                    color: #999;
                }
            }
            .price {
                font-size: 36rpx;
                color: #1a1a1a;
                &.add {
                    color: #ee5e46
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
