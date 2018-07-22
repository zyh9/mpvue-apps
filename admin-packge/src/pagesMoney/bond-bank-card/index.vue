<template>
    <div class="container">
        <div class="list-main ">
            <div class="list-item  border-bottom-1">
                <p>银行卡</p>
                <input type="number" placeholder-class='placeholderStyle' maxlength="19" placeholder="请输入要绑定的银行卡号" v-model="cardNumber">
            </div>
            <div class="list-item border-bottom-1">
                <p>卡类型</p>
                <span>招商银行</span>
            </div>
            <div class="list-item  border-bottom-1">
                <p>身份证</p>
                <input type="idcard" placeholder-class='placeholderStyle' maxlength="18" placeholder="请输入银行卡本人的身份证号" v-model="idNumber">
            </div>
            <div class="list-item  border-bottom-1">
                <p>姓名</p>
                <input type="text" placeholder-class='placeholderStyle' placeholder="请输入银行卡本人的真实姓名" v-model="name">
            </div>
            <div class="list-item  border-bottom-1">
                <p>支付密码</p>
                <input type="number" password='true' placeholder-class='placeholderStyle' maxlength="6" placeholder="请输入支付密码" v-model="password">
            </div>
        </div>
        <div class="bond-btn">
            <div class="btn-main" :class="{on:(cardNumber.length==16||cardNumber.length==19)&&idNumber.length==18&&name!=''&&password.length==6}" @click='submit'>
                绑定
            </div>
            <div class="bond-rule">
                银行卡绑定说明：
                <p>1.支持国内所有银行的银行卡。</p>
                <p>1.银行卡绑定需要优先设置支付密码，用以确保交易安全。</p>
                <p>3.目前仅支持绑定一张银行卡，可更换绑定。</p>
                <p>4.提现手续费由用户自己承担。</p>
                <p>5.提现申请后，1-2个工作日内到账。</p>
                <p>6.无提现门槛，手续费最少1元。</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                countdownInfo: '获取验证码',
                cardNumber: '',//银行卡号
                idNumber: '',//身份证号
                name: '',//姓名
                password:'',//交易密码
            };
        },
        onShow(){
            this.cardNumber='';
            this.password='';
        },
        mounted() {
            if(wx.getStorageSync('bankCardInfo')){
                let cardInfo=wx.getStorageSync('bankCardInfo');
                this.name=cardInfo.RealName;
                this.idNumber=cardInfo.IDCardNum
            }
           
        },
        methods: {
            submit() {
                if (this.cardNumber == '') {
                    this.msg('银行卡号不能为空');
                    return;
                }
                if (this.idNumber == '') {
                    this.msg('身份证号不能为空')
                    return;
                }
                if (this.name == '') {
                    this.msg('姓名不能为空');
                    return;
                }
                if(this.password==''){
                    this.msg('支付密码不能为空');
                    return;
                }
                var pattern = /^([1-9]{1})(\d{15}|\d{18})$/;
                if (!pattern.test(this.cardNumber)) {
                    this.msg('银行卡号输入不合法');
                    return;
                }
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (!reg.test(this.idNumber)) {
                    this.msg('身份证输入不合法')
                    return;
                }
                this.util.post({
                    url: '/api/Merchant/Personal/BindBankCards',
                    data: {
                        TradersPassword: this.password,//交易密码
                        BankID: 0,//银行id
                        CardNum: this.cardNumber,//银行开号
                        RealName:this.name,//姓名
                        IDCardNum:this.idNumber//身份证号码
                    }
                }).then(res => {
                    wx.navigateBack({
                      delta: 1 
                    });
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
        },
        computed: {
            
            
        },
        components: {}
    };
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #eeeef4;
        overflow: hidden;
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
                    width: 120rpx;
                    font-size: 28rpx;
                    margin-left: 20rpx;
                    color: #1a1a1a;
                }
                span {
                    margin-left: 52rpx;
                    font-size: 28rpx;
                    color: #1a1a1a;
                }
                input {
                    margin-left: 52rpx;
                    flex: 1;
                    font-size: 28rpx;
                    color: #1a1a1a;
                    line-height: 34rpx;
                    padding-right: 20rpx;
                }
                .placeholderStyle {
                    font-size: 28rpx;
                    color: #ccc;
                    line-height: 34rpx;
                }
            }
        }
        .bond-btn {
            padding: 50rpx 35rpx;
            .btn-main {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 680rpx;
                background-color: #ccc;
                color: #fff;
                height: 88rpx;
                font-size: 28rpx;
                &.on {
                    background: #0863ee;
                }
            }
        }
        .bond-rule {
            margin-top: 40rpx;
            font-size: 22rpx;
            line-height: 36rpx;
            color: #999;
            p{
                font-size: 22rpx;
                color: #999;
                line-height: 36rpx;
            }
        }
    }
</style>
