<template>
    <div class="user">
        <div class="user_info set-flex set-align" @click="login">
            <div class="head">
                <img :src="userInfo.HeadImg" alt="" v-if="userInfo.HeadImg">
                <i v-if="!userInfo.HeadImg" class="icon icon_head"></i>
            </div>
            <div class="info" v-if="!isBindPhone">
                <p class="user_name">{{userInfo.NickName?userInfo.NickName:''}}</p>
                <p class="user_tel">{{userInfo.UserMobile?userInfo.UserMobile:''}}</p>
            </div>
            <div class="info" v-else>
                <p class="user_name">登录</p>
            </div>
        </div>
        <div class="options" @click="order">
            <i class="icon icon_userOrder"></i>
            <p>我的订单</p>
        </div>
        <div class="options" @click="address">
            <i class="icon icon_userAddress"></i>
            <p>我的地址</p>
        </div>
    </div>
</template>

<script>
    // import login from '../../components/Login';
    export default {
        data() {
            return {
                userInfo: {},
                isBindPhone: true,
            }
        },
        onReady() {},
        onShow() {
            // this.userInfo = {};
            // 判断是否已绑定手机号
            this.isBindPhone = wx.getStorageSync('loginInfo').IsBindPhone == 1 ? false : true;
            if (!this.isBindPhone && !this.userInfo.HeadImg) {
                this.userData()
            }
        },
        methods: {
            setting(e) {
                console.log(e.mp.detail.authSetting["scope.userLocation"])
            },
            address() {
                if(this.isBindPhone){
                    this.msg('您还没有登录哦')
                    return;
                }
                wx.navigateTo({
                    url: '/pages/my-address/main?type=2'
                })
            },
            order() {
                if(this.isBindPhone){
                    this.msg('您还没有登录哦')
                    return;
                }
                wx.navigateTo({
                    url: '/pages/my-order/main'
                })
            },
            userData() {
                if (wx.getStorageSync('loginInfo')) {
                    this.util.post({
                            url: '/api/Customer/PersonerCenter/UserCenter',
                            data: {},
                            headers: {
                                appid: '1',
                                token: wx.getStorageSync('loginInfo').Token || '',
                                qrcode: this.$store.state.mutations.qrcode || ''
                            }
                        })
                        .then(res => {
                            if (res.State == 1) {
                                this.userInfo = res.Body;
                                this.userInfo.UserMobile = this.userInfo.UserMobile.substr(0, 3).padEnd(7, '*') + this.userInfo.UserMobile.substr(7);
                                this.userInfo.NickName = this.userInfo.NickName.length > 8 ? this.userInfo.NickName.slice(0, 8) + '...' : this.userInfo.NickName;
                                // console.log(this.userInfo)
                            }
                        }).catch(err => {
                            this.msg(err.Msg)
                        })
                }
            },
            //用户退出
            userOut() {
                this.util.post({
                        url: '/api/Customer/PersonerCenter/Logout',
                        data: {},
                        headers: {
                            appid: '1',
                            token: wx.getStorageSync('loginInfo').Token || '',
                            qrcode: this.$store.state.mutations.qrcode || ''
                        }
                    })
                    .then(res => {
                        if (res.State == 1) {
                            console.log(res)
                            this.msg(res.Msg)
                            wx.removeStorageSync('loginInfo')
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
            },
            login() {
                if (!this.userInfo.HeadImg) {
                    wx.navigateTo({
                        url: '/pages/login/main'
                    })
                }
            }
        },
        computed: {},
    }
</script>

<style lang="less">
    .user {
        height: 100%;
        background: #fff;
        position: relative;
        padding: 40rpx 36rpx 0;
        box-sizing: border-box;
        .user_info {
            width: 670rpx;
            height: 230rpx;
            background: url('https://otherfiles-ali.uupt.com/Stunner/FE/C/myUserCard.png') no-repeat top left;
            background-size: 100%;
            margin-bottom: 40rpx;
            .head {
                width: 118rpx;
                height: 118rpx;
                border-radius: 50%;
                border: 4rpx solid #fff;
                margin: 0 32rpx 0 46rpx;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
                i {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .info {
                .user_name {
                    color: #fff;
                    font-size: 32rpx;
                    margin-bottom: 10rpx;
                }
                .user_tel {
                    font-size: 26rpx;
                    color: #999;
                }
            }
        }
        &>.options {
            background: url('https://otherfiles-ali.uupt.com/Stunner/FE/C/icon_arrowRight.png') no-repeat right center;
            background-size: 25rpx 25rpx;
            height: 108rpx;
            display: flex;
            align-items: center;
            p {
                color: #000;
                font-size: 30rpx;
            }
            .icon {
                margin-right: 16rpx;
            }
        }
        .bor {
            border-bottom: 1px solid #ebebeb;
        }
    }
</style>
