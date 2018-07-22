<template>
    <div class="container">
        <div class="bannerBox">
            <div class="w90">
                <div class="bannerImg">
                    <i class="icon icon_successHome"></i>
                    <div class="bannerSuc">订购成功</div>
                    <div class="bannerDate">您的店铺有效日期至{{effectiveDate}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                effectiveDate: '',
            }
        },
        onLoad() {
            this.getShopInfo();
            // this.effectiveDate = wx.getStorageSync('shopInfo').EndDay;
        },
        onShow() {
            
        },
        methods: {
            getShopInfo() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopDetail',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID
                    }
                }).then(res => {
                    console.log(res)
                    if (res.State == 1) {
                        this.effectiveDate = res.Body.EndDay!=""?this.util.FmtTime(new Date(res.Body.EndDay), 'yyyy-MM-dd'):res.Body.EndDay;
                        wx.setStorageSync('shopInfo', res.Body);
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
        },
        components: {}
    };
</script>

<style lang="less">
    .w90 {
        padding: 0 36rpx;
    }
    .container {
        height: 100%;
        background: #fff;
        overflow: hidden;
        .bannerBox {
            width: 100%;
            .bannerImg {
                margin: 0 auto;
                margin-top: 150rpx;
                width: 500rpx;
                height: 448rpx;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                text-align: center;
                i {
                    margin: 0 auto;
                    // margin-top: 105rpx;
                }
                .bannerSuc {
                    font-size: 36rpx;
                    font-weight: bold;
                    color: #3c59ee;
                    text-align: center;
                    align-items: center;
                    margin-top: 40rpx;
                    line-height: 1;
                }
                .bannerDate {
                    font-size: 28rpx;
                    font-weight: normal;
                    color: #1a1a1a;
                    text-align: center;
                    align-items: center;
                    margin-top: 25rpx;
                    line-height: 1;
                }
            }
        }
    }
</style>
