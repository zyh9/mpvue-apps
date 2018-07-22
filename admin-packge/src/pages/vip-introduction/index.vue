<template>
    <div class="vip_introduction" v-if="block">
        <div class="scroll">
            <h3>专享版简介</h3>
            <p>优小U店铺专享版是为您单独打造的小程序，在微信中用户可直接通过小程序找到您的店铺，并可以将您的店铺会员卡、公众号等连接打通，形成有效的用户社群群体，让您的生意越做越有。</p>
            <div class="orange" v-if="day>0">推广期 免费{{day}}天试用</div>
            <img class="img_url fade_in" src="https://otherfiles-ali.uupt.com/Stunner/FE/M/NoviceGuide/vip-display.png" alt="">
            <h3>专享版店铺开通说明</h3>
            <p class="mb30">1.您需要具备小程序。<br/>2.您需要具备微信支付。<br/>3.您需要将小程序授权给我方进行开发。</p>
            <div class="help" @click="adminHelp"><i class="icon_help"></i><span>我需要帮助</span></div>
        </div>
        <div class="guide_btn">
            <div class="next_btn" @click="nextBtn">{{day>0?day+'天 立即免费体验':'确认开通专享版'}}</div>
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
                        ShopType: 2,
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
                wx.navigateTo({
                    url: '/pages/admin-auth'
                })
            },
            adminHelp() {
                wx.navigateTo({
                    url: '/pages/admin-help'
                })
            }
        },
        components: {}
    }
</script>

<style lang="less">
    .vip_introduction {
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
            height: 800rpx;
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
        .help {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 30rpx;
            padding: 10rpx;
            padding-left: 0;
            width: 200rpx;
            span {
                margin-left: 10rpx;
                font-size: 26rpx;
                color: #0863ee;
            }
        }
        .mb30 {
            margin-bottom: 30rpx;
        }
    }
</style>
