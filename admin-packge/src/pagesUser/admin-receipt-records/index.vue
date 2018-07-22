<template>
    <div class="admin_receipt_records">
        <scroll-view scroll-y="true" lower-threshold="60" @scrolltolower="scrollHandler" style="height: 100%" class="recordList">
            <p class="no_info" v-if="noInfo">暂无明细信息</p>
            <div v-for="(v,i) in infoList" :key="i" class="record_item">
                <div class="record_left">
                    <p>线下收款：</p>
                    <span>{{v.AddTime}}</span>
                </div>
                <i class="num_value">+{{v.Money}}</i>
            </div>
        </scroll-view>
        <!-- <div class="go_top icon icon_top" v-if="topBtn" @click="goTop"></div> -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                winHeight: 0,
                topBtn: false,
                scrollTop: 0,
                noInfo: false,
                infoList: [],
                page: 1,
                PageSize: 10,
                quest: true,
            }
        },
        onPageScroll(e) {
            // console.log(e.scrollTop)
            this.scrollTop = e.scrollTop;
        },
        onLoad() {
            this.page = 1;
            this.quest = true;
            this.infoList = [];
            this.noInfo = false;
            this.getList()
        },
        mounted() {
            wx.getSystemInfo({
                success: res => {
                    this.winHeight = res.windowHeight;
                    // console.log(this.winHeight)
                }
            })
        },
        methods: {
            scrollHandler() {
                if (this.quest) {
                    this.page++;
                    this.getList()
                }
            },
            getList() {
                this.util.post({
                    url: '/api/Merchant/Orders/GetCustomeryPaymentRecord',
                    data: {
                        ShopId: wx.getStorageSync('loginInfo').ShopID,
                        PageSize: this.PageSize,
                        PageIndex: this.page,
                    }
                }).then(res => {
                    res.Body.CustomerPaymentRecords.forEach(e => {
                        e.AddTime = this.util.FmtTime(new Date(e.AddTime), 'yyyy/MM/dd hh:mm:ss')
                    })
                    if (res.Body.CustomerPaymentRecords.length < this.PageSize && this.page > 1) {
                        this.quest = false;
                        this.msg('已经没有更多信息了')
                    } else if (!res.Body.CustomerPaymentRecords.length && this.page == 1) {
                        this.noInfo = true;
                    }
                    this.infoList.push(...res.Body.CustomerPaymentRecords)
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            goTop() { // 一键回到顶部
                if (wx.pageScrollTo) {
                    wx.pageScrollTo({
                        scrollTop: 0
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                    })
                }
            }
        },
        components: {},
        watch: {
            scrollTop: function(newVal, oldVal) {
                this.topBtn = this.scrollTop >= this.winHeight ? true : false;
            }
        }
    }
</script>

<style lang="less">
    .admin_receipt_records {
        background: #fff;
        .no_info {
            text-align: center;
            font-size: 28rpx;
            color: #666;
            padding-top: 100rpx;
        }
        .recordList {
            overflow: hidden;
            padding: 0 36rpx;
            width: 100%;
            box-sizing: border-box;
            // margin-bottom: 30rpx;
            .record_item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 28rpx 0;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1px solid #ebebeb;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                    z-index: 10;
                }
                .record_left {
                    flex: 1;
                    p {
                        color: #1a1a1a;
                        font-size: 28rpx;
                        line-height: 42rpx;
                    }
                    span {
                        color: #9999;
                        font-size: 22rpx;
                        line-height: 38rpx;
                    }
                }
                .num_value {
                    color: #ee5e46;
                    font-size: 36rpx;
                    font-weight: 900;
                }
            }
            .record_item:nth-last-child(1) {
                &:after {
                    display: none !important;
                }
            }
        }
        .go_top {
            position: fixed;
            right: 30rpx;
            bottom: 30rpx;
            z-index: 10;
        }
    }
</style>
