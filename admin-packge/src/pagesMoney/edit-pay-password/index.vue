<template>
    <div class="container">
        <div v-if='!isNew'>
            <div class="list-main">
                <div class="list-item ">
                    <p class=".label">原密码</p>
                    <input  type="number" password='true' maxlength="6" placeholder-class='placeholderStyle' placeholder="请输入原密码" v-model="oldPassword">
                </div>
            </div>
            <div class="btn" :class="{on:oldPassword.length==6}" @click='next'>下一步</div>
        </div>
        <div v-else>
            <div class="list-main">
                <div class="list-item ">
                    <p class=".label">设置密码</p>
                    <input  type="number" password='true' maxlength="6" placeholder-class='placeholderStyle' placeholder="6位数字" v-model="newPassword">
                </div>
                <div class="list-item ">
                    <p class=".label">再次输入</p>
                    <input  type="number" password='true' maxlength="6" placeholder-class='placeholderStyle' placeholder="请再输入一遍" v-model="againPassword">
                </div>
            </div>
            <div class="btn" :class="{on:newPassword.length==6&&againPassword.length==6}" @click='submit'>提交</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isNew: false,
                oldPassword: '',
                newPassword: '',
                againPassword: '',
                token: ''
            };
        },
        onShow() {
            this.isNew = false;
            this.oldPassword = '';
            this.newPassword = '';
            this.againPassword = '';
        },
        mounted() {},
        methods: {
            next() {
                if (this.oldPassword.length == 6) {
                    this.util.post({
                        url: '/api/Merchant/Personal/VerifyTradersPwd',
                        data: {
                            TradersPwd: this.oldPassword
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.isNew = true;
                            this.token = res.Body.Token;
                            wx.setNavigationBarTitle({
                                title: '新支付密码'
                            })
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
                }
            },
            submit() {
                if (this.newPassword.length == 6 && this.againPassword.length == 6) {
                    if (this.newPassword != this.againPassword) {
                        this.msg('两次密码不一致，请重新输入');
                        return;
                    }
                    var pattern = /^([0-9]{6})$/;
                    if (!pattern.test(this.newPassword)) {
                        this.msg('密码为6位数字');
                        return;
                    }
                    this.util.post({
                        url: '/api/Merchant/Personal/ChangeTradersPwd',
                        data: {
                            TradersPwd: this.newPassword,
                            Token: this.token
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.msg('密码修改成功');
                            setTimeout(function() {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }, 300)
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                    })
                }
            },
            editPass() {
                wx.navigateTo({
                    url: "/pages/edit-new-pay-password/main"
                });
            },
        },
        components: {}
    };
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #efeef4;
        overflow: hidden;
        .list-main {
            background: #fff;
            padding: 0 35rpx;
            .list-item {
                padding: 35rpx 0;
                display: flex;
                align-items: center;
                position: relative;
                &::after{
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1PX solid #ebebeb;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0 0;
                }
                &:last-child{
                    &::after{
                        display: none;
                    }
                }
                .label {
                    font-size: 28rpx;
                    width: 134rpx;
                    color: #1a1a1a;
                }
                input {
                    flex: 1;
                    font-size: 28rpx;
                    color: #1a1a1a;
                    line-height: 34rpx;
                }
                .placeholderStyle {
                    font-size: 28rpx;
                    color: #ccc;
                    line-height: 34rpx;
                }
            }
        }
        .btn {
            margin: 56rpx 36rpx 0;
            background: #ccc;
            text-align: center;
            line-height: 88rpx;
            height: 88rpx;
            font-size: 28rpx;
            color: #fff;
            &.on {
                background: #0863ee;
            }
        }
    }
</style>
