<template>
    <div class="container">
        <div class="list-main ">
            <div class="list-item ">
                <p>手机号</p>
                <!-- <input type="number" maxlength="11" placeholder="请输入手机号码" placeholder-class='placeholderStyle' v-model="tel">ManagerPhone -->
                <input type="number" maxlength="11" disabled='true' placeholder="请输入手机号码" placeholder-class='placeholderStyle' v-model="tel">
            </div>
            <div class="list-item ">
                <p>验证码</p>
                <input type="number" placeholder="请输入验证码" placeholder-class='placeholderStyle' v-model="code" maxlength="4">
                <!-- <button class="sms_click" plain="true" :disabled='time>0' @click='sendCode'>{{countdownInfo}}</button> -->
                <div class="sms_click" @click='sendCode'>{{countdownInfo}}</div>
            </div>
            <div class="list-item ">
                <p>设置密码</p>
                <input type="number" password='true' maxlength="6" placeholder="6位数字" placeholder-class='placeholderStyle' v-model="password">
            </div>
            <div class="list-item ">
                <p>再次输入</p>
                <input type="number" password='true' maxlength="6" placeholder="请再输入一遍" placeholder-class='placeholderStyle' v-model="againPassword">
            </div>
        </div>
        <div class="btn" :class="{on:isAll}" @click="submit">提交</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                countdownInfo: '获取验证码',
                time: null,
                createTiem: null,
                tel: '',
                code: '',
                password: '',
                againPassword: '',
                type: '',
                shopInfo: {},
                isSend: true
            };
        },
        onShow() {
            if (wx.getStorageSync('purseInfo').ManagerPhone) {
                this.tel = wx.getStorageSync('purseInfo').ManagerPhone;
            }
            clearInterval(this.createTiem)
            this.code = '';
            this.password = '';
            this.againPassword = '';
            this.countdownInfo = '获取验证码';
            this.createTiem = null;
            this.isSend = true;
        },
        mounted() {
            this.type = this.$mp.query.type; /* 1:绑定银行卡进入；2：忘记密码进入 */
            this.shopInfo = wx.getStorageSync('shopInfo');
            if (this.type == 1) {
                wx.setNavigationBarTitle({
                    title: '设置支付密码'
                })
            } else {
                wx.setNavigationBarTitle({
                    title: '修改支付密码'
                })
            }
        },
        methods: {
            sendCode() {
                if (!this.isSend) {
                    return
                }
                if (this.tel == '') {
                    this.msg('手机号不能为空');
                    return;
                }
                var regTel = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!regTel.test(this.tel)) {
                    this.msg('请输入有效手机号')
                    return
                };
                this.time = 60;
                const that = this;
                this.isSend = false;
                this.util.post({
                    url: '/api/Merchant/VerifyCode/SendSmsCode',
                    data: {
                        Mobile: this.tel,
                        BizType: 5,
                        Token: wx.getStorageSync('loginInfo').Token || ''
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.countdownInfo = this.time + 'S后重新获取'
                        this.createTiem = setInterval(function() {
                            that.time--;
                            if (that.time > 0) {
                                that.countdownInfo = that.time + 'S后重新获取'
                            } else {
                                that.isSend = true;
                                clearInterval(that.createTiem);
                                that.countdownInfo = '重新获取';
                            }
                        }, 1000)
                    }
                }).catch(err => {
                    that.isSend = true;
                    this.msg(err.Msg)
                })
            },
            submit() {
                if (this.code.length == 4) {
                    if (this.password.length == 6) {
                        if (this.againPassword.length == 6) {
                            if (this.password != this.againPassword) {
                                this.msg('支付密码输入不一致')
                            } else {
                                this.util.post({
                                    url: '/api/Merchant/VerifyCode/CommitSmsCode',
                                    data: {
                                        Mobile: this.tel,
                                        BizType: 5,
                                        VerifyCode: this.code,
                                        Loction: this.shopInfo.ShopLoc,
                                        CityName: this.shopInfo.ShopCity,
                                        // Token: wx.getStorageSync('loginInfo').Token || '',
                                        PassWord: this.password
                                    }
                                }).then(res => {
                                    if (res.State == 1) {
                                        if (this.type == 1) {
                                            /* 绑定银行卡 */
                                            wx.redirectTo({
                                                url: '/pagesMoney/bond-bank-card'
                                            });
                                        } else {
                                            /* 返回到密码管理页面 */
                                            wx.navigateBack({
                                                delta: 1
                                            });
                                        }
                                    }
                                }).catch(err => {
                                    this.msg(err.Msg)
                                })
                            }
                        } else {
                            this.msg(this.againPassword.length < 6 && this.againPassword.length > 0 ? '再次输入支付密码不完整' : '请再次输入支付密码')
                        }
                    } else {
                        this.msg(this.password.length < 6 && this.password.length > 0 ? '输入支付密码不完整' : '请输入支付密码')
                    }
                } else {
                    this.msg('请输入验证码')
                }
            },
        },
        components: {},
        computed: {
            isAll() {
                return this.tel.length == 11 && this.code.length == 4 && this.password.length == 6 && this.againPassword.length == 6 ? true : false;
            }
        }
    };
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #f5f5f5;
        overflow: hidden;
        .list-main {
            background: #fff;
            padding: 0 35rpx;
            .list-item {
                padding: 35rpx 0;
                display: flex;
                align-items: center;
                position: relative;
                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 0;
                    border-bottom: 1PX solid #ebebeb;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    transform: scaleY(0.5);
                    transform-origin: 0;
                }
                &:last-child {
                    &:after {
                        display: none;
                    }
                }
                p {
                    width: 134rpx;
                    font-size: 28rpx;
                    color: #1a1a1a;
                }
                input {
                    flex: 1;
                    flex: 1;
                    font-size: 28rpx;
                    color: #1a1a1a;
                    padding-right: 20rpx;
                    line-height: 34rpx;
                }
                .placeholderStyle {
                    font-size: 28rpx;
                    color: #ccc;
                    line-height: 34rpx;
                }
                .sms_click {
                    // margin-right: 20rpx;
                    height: 50rpx;
                    line-height: 50rpx;
                    font-size: 24rpx;
                    color: #3c59ee;
                    background: transparent;
                    border: 1rpx solid #3c59ee;
                    border-radius: 6rpx;
                    outline: none;
                    white-space: nowrap;
                    padding: 0 10rpx;
                }
            }
        }
        .btn {
            margin: 0 36rpx;
            height: 88rpx;
            line-height: 88rpx;
            text-align: center;
            font-size: 28rpx;
            color: #fff;
            margin-top: 56rpx;
            background: #ccc;
            &.on {
                background: #0863ee;
            }
        }
    }
</style>
