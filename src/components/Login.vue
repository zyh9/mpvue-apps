<template>
    <div class="login">
        <div class="login_body">
            <div class="options">
                <input type="text" placeholder="请输入您的手机号" maxlength="11" v-model="authTel">
            </div>
            <div class="password">
                <input type="text" placeholder="请输入验证码" v-model="authVal" maxlength="4">
                <button class="sms_click" plain="true" @click="sendSms" :disabled="countdown>0?true:false" :class="countdown>0?'disabled':''">{{countdownInfo}}</button>
            </div>
            <div class="btn_login" @click="commitSms">登录</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                authTel: '',
                authVal: '',
                currentTab: 0,
                countdown: null,
                countdownInfo: '获取验证码',
                countdownTimer: null,
                userInfo: {},
            }
        },
        onShow() { //页面渲染就会触发
        },
        mounted() {
            this.userInfo = wx.getStorageSync('userInfo')
            // console.log(this.userInfo)  
        },
        methods: {
            //发送验证码
            sendSms() {
                if (this.phone(this.authTel)) {
                    this.util.post({
                        url: '/api/Customer/Base/SendSmsCode',
                        data: {
                            Mobile: this.authTel,
                            BizType: 1
                        },
                        headers: {
                            appid: '1',
                            token: wx.getStorageSync('loginInfo').Token || ''
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.countdown = 60;
                            this.countdownInfo = `${this.countdown}s后重新获取`;
                            this.countdownTimer = setInterval(() => {
                                this.countdown--;
                                this.countdownInfo = `${this.countdown}s后重新获取`;
                                if (this.countdown <= 0) {
                                    clearInterval(this.countdownTimer)
                                    this.countdownInfo = '重新获取';
                                }
                            }, 1000)
                        } else {
                            this.msg(res.Msg)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            },
            commitSms() {
                //测试$emit
                let BMap = wx.getStorageSync('BMap');
                // console.log(BMap)
                // this.$emit('log-in',true)
                if (this.phone(this.authTel) && this.smsCoding(this.authVal)) {
                    this.util.post({
                        url: '/api/Customer/Base/CommitSmsCode',
                        data: {
                            Mobile: this.authTel,
                            BizType: 1,
                            VerifyCode: this.authVal,
                            Loction: JSON.stringify({
                                longitude: BMap.longitude,
                                latitude: BMap.latitude
                            })
                        },
                        headers: {
                            appid: '1',
                            token: wx.getStorageSync('loginInfo').Token || ''
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.$emit('log-in', true)
                        } else {
                            this.msg(res.Msg)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            },
            //检测手机号
            phone(tel) {
                let reg = /^[1][3,4,5,6,7,8,9]\d{9}$/;
                if (reg.test(tel)) {
                    return true;
                } else {
                    if (tel != '') {
                        this.msg('请输入正确的手机号')
                    } else {
                        this.msg('请输入手机号')
                    }
                    return false;
                }
            },
            smsCoding(val) { //短信4位
                let reg = /^\d{4}$/;
                if (reg.test(val)) {
                    return true;
                } else {
                    if (val != '') {
                        this.msg('请输入完整的短信验证码')
                    } else {
                        this.msg('请输入短信验证码')
                    }
                    return false;
                }
            },
        },
        watch: {
            authTel: function(newVal, oldVal) {
                this.authTel = newVal.replace(/[^\d]/g, '');
            },
            authVal: function(newVal, oldVal) {
                this.authVal = newVal.replace(/[^\d]/g, '');
            },
        },
        beforeDestroy() { //清除定时器
            clearInterval(this.countdownTimer)
        },
    }
</script>

<style lang="less">
    .login {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        background: rgba(0, 0, 0, .6);
        z-index: 100;
        .login_body {
            position: absolute;
            width: 500rpx;
            left: 50%;
            top: 40%;
            background: #fff;
            transform: translate(-50%, -50%);
            border-radius: 10rpx;
            z-index: 10;
            padding: 50rpx;
        }
        .options {
            background: #fff;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 20rpx;
            border-bottom: 1rpx solid #e6e6e6;
            p {
                font-size: 24rpx;
                color: #333;
                width: 140rpx;
                text-align: left;
                transform: translateY(3rpx);
            }
            input {
                flex-grow: 1;
                font-size: 24rpx;
                color: #666;
            }
        }
        .password {
            background: #fff;
            padding: 20rpx;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            position: relative;
            border-bottom: 1rpx solid #e6e6e6;
            p {
                font-size: 24rpx;
                color: #333;
                width: 140rpx;
                text-align: left;
                transform: translateY(3rpx);
            }
            input {
                flex-grow: 1;
                font-size: 24rpx;
                color: #666;
                padding-right: 20rpx;
            }
            .clear {
                width: 30rpx;
                height: 30rpx;
                border-radius: 50%;
                background: #999;
                color: #666;
                font-size: 28rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(45deg);
                position: absolute;
                right: 50rpx;
                z-index: 2;
            }
            .sms_click {
                height: 50rpx;
                line-height: 50rpx;
                font-size: 24rpx;
                color: #ff8b03;
                background: transparent;
                border: 1rpx solid #ff8b03;
                border-radius: 6rpx;
                outline: none;
                white-space: nowrap;
                padding: 0 10rpx;
            }
            .disabled {
                color: #999;
                border: 1rpx solid #999;
            }
        }
        .btn_login {
            background: skyblue;
            margin-top: 40rpx;
            text-align: center;
            height: 80rpx;
            line-height: 80rpx;
            border-radius: 8rpx;
            color: #fff;
            font-size: 30rpx;
        }
    }
</style>
