<template>
    <div class="admin_shop_login">
        <div class="bg">
            <h1 class="title">欢迎您！</h1>
        </div>
        <div class="main">
            <div class="options">
                <p>手机号</p>
                <input type="number" placeholder-class='placeholderStyle' placeholder="请输入您的手机号" maxlength="11" v-model="tel">
            </div>
            <div class="options">
                <p>验证码</p>
                <div class="item">
                    <input type="number" placeholder-class='placeholderStyle' placeholder="请输入验证码" v-model="code" maxlength="4">
                    <!-- <button class="sms_click" plain="true" @click="sendSms" :disabled="countdown>0?true:false" :class="countdown>0?'disabled':''">{{countdownInfo}}</button> -->
                    <div class="sms_click" @click="sendSms" :class="countdown>0?'disabled':''">{{countdownInfo}}</div>
                </div>
            </div>
            <button class="btn on" plain="true" hover-class="none" open-type="getUserInfo" @getuserinfo="getInfo" style="color:#fff;">登录</button>
        </div>
        <!-- <div class="mask">
                                                                                <div class="mask_info">
                                                                                    <p>完善店铺信息</p>
                                                                                    <span>店铺信息完善后才能正式发布</span>
                                                                                    <div>现在去</div>
                                                                                </div>
                                                                            </div> -->
    </div>
</template>

<script>
    import gcoord from 'gcoord';
    export default {
        data() {
            return {
                tel: '',
                /* 手机号 */
                code: '',
                /* 验证码 */
                countdown: null,
                countdownInfo: '获取验证码',
                countdownTimer: null,
                isSend: true,
                loginCode: ''
            }
        },
        onLoad() {
            clearInterval(this.countdownTimer)
            this.countdown = null;
            this.countdownInfo = '获取验证码';
            this.countdownTimer = null;
            this.isSend = true;
            if (wx.getStorageSync('userInfo')) {
                wx.removeStorageSync('userInfo');
            }
        },
        methods: {
            getInfo(res) {
                if (res.target.userInfo) {
                    wx.setStorageSync('userInfo', JSON.stringify(res.target.userInfo))
                    this.login(res.target.userInfo)
                } else {
                    this.util.loginModel();
                }
            },
            //发送验证码
            sendSms() {
                if (!this.isSend) {
                    return
                }
                if (this.phone(this.tel)) {
                    this.isSend = false;
                    this.util.post({
                        url: '/api/Merchant/VerifyCode/SendSmsCode',
                        data: {
                            Mobile: this.tel,
                            BizType: 2
                        }
                    }).then(res => {
                        if (res.State == 1) {
                            this.msg(res.Msg)
                            this.countdown = 60;
                            this.countdownInfo = `${this.countdown}s后重新获取`;
                            this.countdownTimer = setInterval(() => {
                                this.countdown--;
                                if (this.countdown <= 0) {
                                    clearInterval(this.countdownTimer)
                                    this.countdownInfo = '重新获取';
                                    this.isSend = true;
                                } else {
                                    this.countdownInfo = `${this.countdown}s后重新获取`;
                                }
                            }, 1000)
                        } else {
                            this.msg(res.Msg)
                            this.isSend = true;
                        }
                    }).catch(err => {
                        this.isSend = true;
                        this.msg(err.Msg)
                    })
                }
            },
            login(userInfo) {
                let QQmap = wx.getStorageSync('QQmap');
                var result = gcoord.transform(
                    [QQmap.longitude, QQmap.latitude], // 经纬度坐标
                    gcoord.WGS84, // 当前坐标系
                    gcoord.BD09 // 目标坐标系
                );
                console.log(result)
                if (this.phone(this.tel) && this.smsCoding(this.code)) {
                    this.util.post({
                        url: '/api/Merchant/VerifyCode/CommitSmsCode',
                        data: {
                            Mobile: this.tel,
                            BizType: 2,
                            VerifyCode: this.code,
                            Loction: `${result[0]},${result[1]}`,
                            CityName: QQmap.city,
                            wxUserInfo: JSON.stringify(userInfo)
                        }
                    }).then(res => {
                        console.log(res, '登录后')
                        if (res.State == 1) {
                            this.msg(res.Msg)
                            //登录成功修改绑定手机号状态，以便于其它页面获取用户绑定手机号状态
                            let loginInfo = Object.assign({}, wx.getStorageSync('loginInfo'), {
                                IsBindPhone: 1
                            })
                            wx.setStorageSync('loginInfo', loginInfo)
                            //店铺信息是否存在
                            if (loginInfo.ShopID != 0) {
                                wx.switchTab({
                                    url: '/pages/admin-index'
                                })
                            } else {
                                /* 此时loginInfo为空，到个人信息页获取loginInfo信息获取不到，重新调用wxjscodelogin获取loginInfo */
                                this.getUserInfo()
                            }
                        }
                    }).catch(err => {
                        this.msg(err.Msg)
                        if (err.State == -2004) {
                            setTimeout(_ => {
                                wx.redirectTo({
                                    url: '/pages/admin-shop-index'
                                })
                            }, 500)
                        }
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
            userLogin() {
                this.util.post({
                    url: '/api/Merchant/Login/WxJsCodeLogin',
                    data: {
                        jsCode: this.loginCode,
                        // wxopenid: "o2J1J5DQsMZmeFoROTdn4O2S6nmA"
                    }
                }).then(res => {
                    if (res.State == 1) {
                        wx.setStorageSync('loginInfo', res.Body)
                        wx.redirectTo({
                            url: '/pages/admin-guide'
                        })
                    } else if (res.State == -10) {
                        if (!(wx.getStorageSync('loginInfo').Token)) {
                            //再次获取用户信息
                            this.userLogin()
                        }
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            getUserInfo() {
                // 调用登录接口
                wx.login({
                    success: res => {
                        this.loginCode = res.code;
                        this.userLogin()
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            },
        },
        watch: {
            tel: function(newVal, oldVal) {
                //不是数字的替换为空
                this.tel = newVal.replace(/[^\d]/g, '');
            },
            code: function(newVal, oldVal) {
                this.code = newVal.replace(/[^\d]/g, '');
            },
        },
        onUnload() {
            clearInterval(this.countdownTimer)
            this.countdownTimer = null;
        }
    }
</script>

<style lang="less">
    .admin_shop_login {
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        position: relative;
        background: #eeeef4;
        .bg {
            background: #3c59ee;
            height: 282rpx;
            padding: 0 48rpx;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            .title {
                font-size: 56rpx;
                color: #fff;
                line-height: 96rpx;
            }
        }
        .main {
            background: #fff;
            margin: 165rpx 36rpx 0;
            position: relative;
            z-index: 10;
            padding: 62rpx 0 146rpx;
        }
        .options {
            background: #fff;
            margin: 0 30rpx; // height: 110rpx;
            border-bottom: 1rpx solid #e6e6e6;
            padding: 24rpx 0;
            p {
                font-size: 32rpx;
                color: #1a1a1a;
                width: 134rpx;
                text-align: left;
                transform: translateY(3rpx);
                line-height: 80rpx;
            }
            .item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            input {
                flex: 1;
                font-size: 28rpx;
                color: #1a1a1a;
                line-height: 56rpx;
            }
            .placeholderStyle {
                font-size: 28rpx;
                color: #ccc;
                line-height: 56rpx;
            }
            .sms_click {
                display: inline-block;
                height: 56rpx;
                line-height: 56rpx;
                font-size: 24rpx;
                color: #3c59ee;
                background: transparent;
                border: 1rpx solid #3c59ee;
                outline: none;
                white-space: nowrap;
                padding: 0 17rpx;
            }
        }
        .btn {
            background: #ccc;
            margin: 95rpx auto 0;
            text-align: center; // height: 88rpx;
            line-height: 88rpx;
            width: 620rpx;
            height: 100rpx;
            color: #fff;
            font-size: 28rpx;
            border: 0;
            &.on {
                // background-image: linear-gradient(270deg, #1651f1 0%, #3692fd 100%), linear-gradient( #333333, #333333);
                // background-blend-mode: normal, normal;
                // box-shadow: 0 2px 8px 0px rgba(0, 150, 253, 0.2);
                background: url('../../../static/loginBtn.png') no-repeat center;
                background-size: 100%;
            }
        }
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 50;
            display: flex;
            .mask_info {
                text-align: center;
                margin: auto;
                width: 60%;
                padding: 35rpx;
                background: #fff;
                border-radius: 8rpx;
                p {
                    font-size: 32rpx;
                    color: #1a1a1a;
                    margin-bottom: 30rpx;
                }
                span {
                    display: block;
                    font-size: 24rpx;
                    color: #999;
                    padding-bottom: 30rpx;
                    border-bottom: 1rpx solid #ebebeb;
                }
                div {
                    margin-top: 30rpx;
                    background: #3c59ee;
                    line-height: 80rpx;
                    height: 80rpx;
                    font-size: 30rpx;
                    color: #fff;
                }
            }
        }
    }
</style>
