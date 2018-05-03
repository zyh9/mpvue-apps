<template>
    <div class="admin_user_info">
        <div class="options">
            <p>头像</p>
            <img :src="userInfo.avatarUrl" alt="">
        </div>
        <div class="options" @click="purse">
            <p>昵称</p>
            <p>昵称昵称</p>
        </div>
        <div class="options" @click="bindTel">
            <p>绑定手机号</p>
            <div class="edit_tel">
                <p>13333333333</p>
                <img src="../../../static/userImg.png" alt="">
            </div>
        </div>
        <div class="options" @click="editPassword">
            <p>修改密码</p>
            <img src="../../../static/userImg.png" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                userInfo: []
            }
        },
        mounted() {
            this.userInfo = wx.getStorageSync('userInfo')
            console.log(this.userInfo)
        },
        methods: {
            bindTel() {
                wx.navigateTo({
                    url: '/pages/admin-modify-mobile/main'
                })
            },
            editPassword() {
                wx.navigateTo({
                    url: '/pages/admin-modify-password/main'
                })
            }
        },
        components: {},
    }
</script>

<style lang="less">
    .admin_user_info {
        height: 100%;
        background: #f5f5f5;
        position: relative;
        .options {
            background: #fff;
            padding: 20rpx 30rpx;
            height: 60rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1rpx solid #e6e6e6;
            p {
                color: #666;
                font-size: 24rpx;
            }
            img {
                width: 50rpx;
                height: 50rpx;
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
