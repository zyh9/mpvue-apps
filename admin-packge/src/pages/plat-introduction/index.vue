<template>
    <div class="plat_introduction" v-if="block">
        <div class="scroll">
            <h3>平台版简介</h3>
            <p>优小U店铺平台版为在优小U自主平台上的店铺，平台名字为“优小店”，买家可通过优小店小程序快速找到您的店铺，也可以通过扫码直进入您的店铺。</p>
            <div class="orange" v-if="day>0">推广期 免费{{day}}天试用</div>
            <img class="img_url fade_in" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/plat-display.png" alt="" />
            <h3>平台版店铺开通说明</h3>
            <p class="mb30">平台版店铺无需您具备营业执照，不需要您具备小程序，可以直接开店，随时随地开始您的生意。</p>
        </div>
        <div class="guide_btn">
            <div class="next_btn" @click="nextBtn">{{day>0?day+'天 立即免费体验':'确认开通平台版'}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                day: 0,
                block: false
            }
        },
        onLoad() {
            this.block = false;
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            this.experience()
        },
        methods: {
            experience() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/GetShopProbation',
                    data: {
                        ShopType: 1,
                        CityName: wx.getStorageSync('QQmap').city
                    }
                }).then(res => {
                    wx.hideLoading();
                    this.block = true;
                    console.log(res)
                    this.day = res.Body.ProbationDay;
                }).catch(err => {
                    wx.hideLoading();
                    this.msg(err.Msg)
                })
            },
            nextBtn() {
                this.util.post({
                    url: '/api/Merchant/ShopManage/EditManageModel',
                    data: {
                        ShopID: wx.getStorageSync('loginInfo').ShopID || '',
                        MangageModel: 1, //1：平台
                    }
                }).then(res => {
                    console.log(res)
                    wx.navigateTo({
                        url: '/pages/admin-mask'
                    })
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .plat_introduction {
        position: relative;
        height: 100%;
        padding-bottom: 118rpx;
        box-sizing: border-box;
        overflow: hidden;
        .scroll {
            overflow-x: hidden;
            overflow-y: scroll;
            height: 100%;
            padding: 0 36rpx;
        }
        h3 {
            padding-top: 60rpx;
            font-size: 34rpx;
            color: #656782;
            text-align: center;
            font-weight: 700;
        }
        p {
            margin: 60rpx 0;
            font-size: 28rpx;
            color: #656782;
            line-height: 48rpx;
        }
        .img_url {
            width: 100%;
            height: 750rpx;
            border: 1rpx solid #656782;
        }
        .orange {
            width: 100%;
            height: 128rpx;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-image: url('../../../static/orange.png');
            margin-bottom: 60rpx;
            color: #fff6ed;
            font-size: 46rpx;
            line-height: 128rpx;
            text-align: center;
        }
        .guide_btn {
            position: absolute;
            width: 100%;
            height: 118rpx;
            left: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-top: 1px solid #ebebeb;
                position: absolute;
                left: 0;
                top: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            .next_btn {
                position: absolute;
                left: 36rpx;
                right: 36rpx;
                height: 88rpx;
                background: #3c59ee;
                color: #fff;
                font-size: 30rpx;
                line-height: 88rpx;
                text-align: center;
            }
        }
        .mb30 {
            margin-bottom: 30rpx;
        }
    }
</style>
