<template>
    <div class="admin_shop_index ">
        <img src="https://otherfiles-ali.uupt.com/Stunner/FE/M/shopBg.png" alt="" class="index_bg fade_in">
        <div class="index_btn_img index_btn">
            <p @click="openShop">打开我的店铺</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                code: '',
                IsBindPhone: null,
                shopId: null,
                timer: null,
                pollingVal: 1,
                audioContext: null,
                ShopPlatType: null,
                scene: ''
            }
        },
        onLoad(options) {
            //options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
            this.scene = options.scene;
            wx.setStorageSync('scene', this.scene);
            this.util.qqMapInfo().then(res => {
                let objInfo = res.Body;
                // 会覆盖掉原来该 key 对应的内容
                wx.setStorageSync('loginInfo', objInfo)
                console.log(objInfo)
                this.IsBindPhone = res.Body.IsBindPhone;
                this.shopId = res.Body.ShopID;
                this.ShopPlatType = res.Body.ShopPlatType;
                if (res.Body.ShopID > 0) { //有店铺
                    //走轮询
                    this.timer = setInterval(_ => {
                        this.polling()
                    }, 6000)
                }
            }).catch(err => {
                console.log(err.Msg)
            });
        },
        onShow() {},
        mounted() {},
        methods: {
            //轮询接口
            polling() {
                this.util.post({
                    url: '/api/Merchant/Polling/PollingNewOrder',
                    data: {
                        ShopID: this.shopId
                    }
                }).then(res => {
                    console.log(res.Body)
                    if (res.Body == 1) { //有新订单
                        console.log('首页轮询', this.pollingVal)
                        this.$store.dispatch('polling', {
                            polling: this.pollingVal++
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            openShop() {
                console.log(this.IsBindPhone, this.shopId, this.ShopPlatType)
                // return;
                //后续可根据token是否存在做页面跳转处理
                if (this.IsBindPhone == 1 && this.shopId == 0) { //已绑定手机号，未创建店铺
                    //新手引导页
                    wx.navigateTo({
                        url: '/pages/admin-guide'
                    })
                } else if (this.IsBindPhone == 0 && this.shopId == 0) { //未绑定手机号
                    wx.redirectTo({
                        url: '/pages/admin-shop-login'
                    })
                } else if (this.IsBindPhone == 1 && this.shopId > 0) { //绑定手机号，店铺已创建
                    if (this.ShopPlatType != 0) { //平台已选择
                        wx.switchTab({
                            url: '/pages/admin-index'
                        })
                    } else {
                        wx.navigateTo({
                            url: '/pages/admin-select-plat'
                        })
                    }
                } else {
                    // this.msg('网络拥挤，请稍后重试')
                }
            },
        },
        components: {},
        watch: {
            pollingVal: function(newVal, oldVal) {
                const innerAudioContext = wx.createInnerAudioContext()
                innerAudioContext.autoplay = true
                innerAudioContext.src = 'https://otherfiles-ali.uupt.com/Stunner/FE/M/neworderremind.mp3';
                innerAudioContext.onPlay(() => {
                    console.log('开始播放')
                })
                innerAudioContext.onError((res) => {
                    console.log(res.errMsg)
                    console.log(res.errCode)
                })
            }
        }
    }
</script>

<style lang="less">
    .admin_shop_index {
        // height: 100%;
        position: relative;
        background-color: #fff;
        .index_bg {
            width: 100%;
            height: 1000rpx;
        }
        .index_btn_img {
            width: 500rpx;
            height: 108rpx;
            margin: 60rpx auto;
            p {
                text-align: center;
                height: 108rpx;
                line-height: 90rpx;
                color: #965b05;
                font-size: 28rpx;
                font-weight: 700;
            }
        }
    }
</style>
