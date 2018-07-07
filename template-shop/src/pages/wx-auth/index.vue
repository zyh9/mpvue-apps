<template>
    <div class="wx-auth">
        <div class="auth_bg"></div>
        <button open-type="openSetting" @opensetting="setting" plain="true" hover-class="none" class="auth_btn" style="background:#000;color:#fff;">微信授权</button>
        <p v-if="tips">{{tips}}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tips: ''
            }
        },
        onReady() {
            this.tips = '';
            wx.setStorageSync('auth', this.$mp.query.type)
        },
        onShow() {},
        methods: {
            setting(e) {
                console.log(e.mp.detail.authSetting)
                if (e.mp.detail.authSetting['scope.userLocation'] && (wx.getStorageSync('auth') || null) == 1) {
                    this.tips = '';
                    this.msg('授权成功')
                    setTimeout(_ => {
                        wx.redirectTo({
                            url: '/pages/my-store/main'
                        })
                    }, 800)
                } else if (e.mp.detail.authSetting['scope.userInfo'] && (wx.getStorageSync('auth') || null) == 2) {
                    this.tips = '';
                    this.msg('授权成功')
                    setTimeout(_ => {
                        wx.redirectTo({
                            url: '/pages/login/main'
                        })
                    }, 800)
                } else if (e.mp.detail.authSetting['scope.writePhotosAlbum'] && (wx.getStorageSync('auth') || null) == 3) {
                    this.tips = '';
                    this.msg('授权成功')
                    setTimeout(_ => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 800)
                } else {
                    this.tips = '您有未开启授权的选择项';
                }
            },
        },
        components: {},
        onUnload() {
            wx.removeStorageSync('auth')
        }
    }
</script>

<style lang="less">
    .auth_bg {
        margin: 0 36rpx;
        height: 260rpx;
        background-image: url('https://otherfiles-ali.uupt.com/Stunner/FE/C/index-banner.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .auth_btn {
        margin: 30rpx 36rpx 0;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        border: 0;
        font-size: 28rpx;
    }
    p {
        font-size: 26rpx;
        color: #ff4d3a;
        text-align: center;
        margin-top: 20rpx;
    }
</style>
