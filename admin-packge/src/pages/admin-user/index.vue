<template>
    <div class="admin_user">
        <div class="user_info  set-flex set-align ">
            <div class="head"><img :src="loginInfo.Photo?loginInfo.Photo:'https://otherfiles-ali.uupt.com/Stunner/FE/M/46af93a96bf54d7c91d2e0ba52e4da1b_big.png'" alt="" class="user_img"></div>
            <div class="info">
                <div class="user_name">{{loginInfo.NickName}}</div>
                <!-- <div class="user_tel">{{loginInfo.UserMobile}}</div> -->
            </div>
        </div>
        <div class="main">
            <div class="options" @click="goLink(0)">
                <div>
                    <i class="icon icon_userinfo"></i>
                    <p>个人信息</p>
                </div>
            </div>
            <div class="options" @click="goLink(1)">
                <div>
                    <i class="icon  icon_wallet"></i>
                    <p>我的钱包</p>
                </div>
            </div>
            <div class="options" @click="goLink(2)">
                <div>
                    <i class="icon icon_qr"></i>
                    <p>我的收款码</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loginInfo: [],
            }
        },
        onShow() {
            this.loginInfo = wx.getStorageSync('loginInfo')
        },
        methods: {
            goLink(type) {
                let link = '';
                switch (type) {
                    case 0:
                        link = '/pagesUser/admin-user-info';
                        break;
                    case 1:
                        link = '/pagesMoney/admin-user-purse';
                        break;
                    case 2:
                        link = '/pagesUser/admin-collection-code';
                        break;
                }
                wx.navigateTo({
                    url: link
                })
            },
            //退出登录
            logOut() {
                this.util.post({
                    url: '/api/Merchant/Login/Logout'
                }).then(res => {
                    console.log(res)
                }).catch(err => {
                    this.msg(err.Msg)
                })
            }
        },
        components: {},
    }
</script>

<style lang="less">
    .admin_user {
        height: 100%;
        background: #fff;
        position: relative;
        .user_info {
            padding: 0 0 30rpx 30rpx;
            background: #3c59ee;
            .head {
                width: 97rpx;
                height: 97rpx;
                border: 3rpx solid #648bef;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 22rpx;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .info {
                .user_name {
                    font-size: 34rpx;
                    color: #fff;
                }
                .user_tel {
                    font-size: 26rpx;
                    color: rgba(255, 255, 255, 0.8);
                }
            }
        }
        .main {
            padding-left: 36rpx;
        }
        .options {
            width: 100%; // border-bottom: 1rpx solid #e6e6e6;
            height: 111rpx;
            padding-right: 33rpx;
            box-sizing: border-box;
            position: relative;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1px solid #ebebeb;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            div {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                background: url('../../../static/icon_arrowRight.png') no-repeat center right;
                background-size: 25rpx 25rpx;
            }
            .icon {
                margin-right: 20rpx;
            }
            p {
                color: #1a1a1a;
                font-size: 30rpx;
            }
            img {
                width: 40rpx;
                height: 40rpx;
            }
        }
    }
</style>
