<template>
    <div class="container">
        <div class="list-main ">
            <div class="list-item" @click="editPass">
                <p>支付密码</p>
                <input type="number" password='true' maxlength="6" placeholder-class='placeholderStyle' placeholder="请输入支付密码" v-model="password">
            </div>
            <div class="list-item" @click="editPass">
                <p>手机号</p>
                <input type="number" placeholder-class='placeholderStyle' maxlength="11" placeholder="请输入手机号" v-model="tel">
            </div>
            <div class="list-item ">
                <p>验证码</p>
                <input type="number" placeholder-class='placeholderStyle' maxlength="4" placeholder="请输入验证码" v-model="code">
                <button class="sms_click" :disabled="time>0?true:false" @click='sendCode'>{{countdownInfo}}</button>
            </div>
        </div>
        <div class="btn" :class="{on:password&&tel.length==11&&code.length==4}" @click='submimt'>确定</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tel: '',
                password: '',
                code: '',
                countdownInfo: '获取验证码',
                creatTime:null,
                time:null
            };
        },
        mounted() {},
        methods: {
            sendCode() {
                if (!this.password) {
                    this.msg('请输入密码');
                    return;
                };
                if (this.tel == '') {
                    this.msg('请填写手机号')
                    return
                };
                var regTel = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!regTel.test(this.tel)) {
                    this.msg('请输入有效手机号')
                    return
                };
                const that=this;
                this.time=60;
                this.countdownInfo=this.time+'S后重新获取';
                this.creatTime=setInterval(function(){
                    if(that.time>0){
                        that.time--;
                        that.countdownInfo=that.time+'S后重新获取';

                    }else{
                        that.countdownInfo='重新获取';
                        clearInterval(that.creatTime)
                    }
                },1000)


            },
            submimt() {
                 if (!this.password||this.tel == ''||this.code.length!=4) {
                    return;
                };
                var regTel = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!regTel.test(this.tel)) {
                    this.msg('请输入有效手机号')
                    return
                };
                 this.msg('提交')
            }
        },
        components: {}
    };
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #efeef4;
        overflow-x: hidden;
        overflow-y: scroll;
        .list-main {
            background: #fff;
            padding: 0 35rpx;
            .list-item {
                padding: 35rpx 0;
                display: flex;
                align-items: center;
                border-bottom: 1rpx solid #ebebeb;
                &:last-child {
                    border: none;
                }
                p {
                    width: 134rpx;
                    font-size: 28rpx;
                    color: #1a1a1a;
                }
                input {
                    flex: 1;
                    font-size: 28rpx;
                    color: #1a1a1a;
                }
                .placeholderStyle {
                    font-size: 28rpx;
                    color: #ccc;
                    line-height: 34rpx;
                }
                .sms_click {
                    background: transparent;
                    outline: none;
                    display: inline-block;
                    height: 56rpx;
                    line-height: 56rpx;
                    font-size: 24rpx;
                    color: #3c59ee;
                    border: 1rpx solid #3c59ee;
                    padding: 0 10rpx;
                }
            }
        }
    }
    .btn {
        margin: 50rpx 35rpx;
        text-align: center;
        background-color: #ccc;
        color: #fff;
        height: 88rpx;
        line-height: 88rpx;
        font-size: 28rpx;
        &.on {
            background-color: #0863ee;
        }
    }
</style>
