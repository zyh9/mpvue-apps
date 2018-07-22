<template>
    <div class="admin_user_info">
        <div class="options">
            <p>头像</p>
            <img :src="loginInfo.Photo?loginInfo.Photo:'https://otherfiles-ali.uupt.com/Stunner/FE/M/46af93a96bf54d7c91d2e0ba52e4da1b_big.png'" alt="">
        </div>
        <div class="options" @click="purse">
            <p>昵称</p>
            <p>{{loginInfo.NickName}}</p>
        </div>
        <div class="options" @click="bindTel">
            <p>绑定手机号</p>
            <div class="edit_tel">
                <span>{{loginInfo.Mobile}}</span>
                <i class="icon icon_arrowRight"></i>
            </div>
        </div>
        <!-- <div class="options" @click="editPassword">
                    <p>修改密码</p>
                    <i class="icon icon_arrowRight"></i>
                </div> -->
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
            // this.loginInfo.Mobile=this.loginInfo.Mobile ? this.loginInfo.Mobile.substr(0, 3).padEnd(7, '*') + this.loginInfo.Mobile.substr(7) : '';
            this.loginInfo.Mobile=this.loginInfo.Mobile?this.loginInfo.Mobile.slice(0,3)+'****'+this.loginInfo.Mobile.slice(7,11):'';
        },
        methods: {
            bindTel() {
                wx.navigateTo({
                    url: '/pagesUser/admin-modify-mobile'
                })
            },
            editPassword() {}
        },
        components: {},
    }
</script>

<style lang="less">
    .admin_user_info {
        height: 100%;
        background: #fff;
        position: relative;
        .options {
            background: #fff;
            margin-left: 36rpx;
            padding: 36rpx 36rpx 36rpx 0;
            box-sizing: border-box;
            min-height: 110rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
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
            p {
                color: #1a1a1a;
                font-size: 30rpx;
            }
            span {
                color: #999;
                font-size: 30rpx;
                margin-right: 20rpx;
            }
            img {
                width: 70rpx;
                height: 70rpx;
                border-radius: 50%;
            }
            .edit_tel {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                p {
                    margin-right: 20rpx;
                }
            }
        }
    }
</style>
