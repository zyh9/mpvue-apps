<template>
    <div class="container">
        <div class="bank-card-info">
            <div class="card">银行卡</div>
            <div class="card-name">招商储蓄卡({{CardNum}})</div>
        </div>
        <div class="price-info">
            <div class="info-title">提现金额</div>
            <div class="price">
                <span>¥</span>
                <input type="digit" placeholder="请输入想要充值的金额" v-model="money" placeholder-class='placeholderStyle'>
            </div>
            <div class="price-bottom">
                <div class="text">当前可用余额¥{{usableMoney}}</div>
                <div class="withdraw-all" @click='money=usableMoney'>全部提现</div>
            </div>
        </div>
        <div class="btn" :class="{on:money>0}" @click="step">确认提现</div>
        <div class="tip">提现说明:<br> 通过银行转账方式，预计24小时内到账，每笔提现收取手续费1%</div>
        <div class="layBox" v-if='isLay' @click='isLay=false'></div>
        <div class="form" v-if='isLay'>
            <h2 class="title">请输入支付密码</h2>
            <div class="inp">
                <p>支付密码:</p>
                <input type="number" password='true' maxlength="6" placeholder="请输入支付密码" v-model="password">
            </div>
            <div class="btn" @click="submit">确定</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isLay:false,
                money: '',
                CardNum:'',
                usableMoney: 0,
                password:'',
            }
        },
        onShow() { //页面渲染就会触发
            this.money = '';
            this.password='';
            this.isLay=false;
            if(wx.getStorageSync('purseInfo')){
                this.usableMoney=wx.getStorageSync('purseInfo').AvailableMoney;
                this.CardNum=wx.getStorageSync('purseInfo').CardNum;
            }
        },
        methods: {
            step(){
                if (this.money > 0 ) {
                    if(this.money <= this.usableMoney){
                        this.isLay=true;
                    }else{
                        this.msg('提现金额不得大于当前可用余额~')
                    }
                    
                }
            },
            submit() {
                if(this.password.length!=6){
                    this.msg('请输入6位支付密码')
                    return
                }
                this.util.post({
                    url: '/api/Merchant/Personal/UserWithdraw',
                    data: {
                        ShopID :wx.getStorageSync('loginInfo').ShopID,
                        TradersPassword: this.password, //交易密码
                        WithdrawMoney: this.money, //交易金额
                    }
                }).then(res => {
                    this.msg('提现申请提交成功');
                    setTimeout(()=>{
                        this.isLay=false;
                        wx.navigateBack({
                          delta: 1
                        });
                    },300)
                }).catch(err => {
                    this.msg(err.Msg)
                })
                
            }
        },
    }
</script>

<style lang="less">
    .container {
        height: 100%;
        background: #efeef4;
        overflow-x: hidden;
        overflow-y: scroll;
        .bank-card-info {
            display: flex;
            background: #fff;
            padding: 35rpx;
            margin-bottom: 24rpx;
            .card {
                font-size: 28rpx;
                color: #1a1a1a;
                flex: 1;
            }
            .card-name {
                font-size: 28rpx;
                color: #0863ee;
            }
        }
        .price-info {
            background: #fff;
            padding: 35rpx;
            .info-title {
                font-size: 28rpx;
                color: #1a1a1a;
            }
            .price {
                margin: 63rpx auto 10rpx;
                display: flex;
                span {
                    font-size: 40rpx;
                    color: #1a1a1a;
                    font-weight: 900;
                    padding-right: 12rpx;
                    vertical-align: middle;
                }
                input {
                    font-size: 60rpx;
                    color: #1a1a1a;
                    line-height: 60rpx;
                    height: 60rpx;
                    flex: 1;
                }
                .placeholderStyle {
                    font-size: 28rpx;
                    color: #ccc;
                    line-height: 60rpx;
                }
            }
        }
        .price-bottom {
            display: flex;
            align-items: center;
            height: 88rpx;
            border-top: 1rpx solid #ebebeb;
            .text {
                flex: 1;
                font-size: 22rpx;
                color: #999;
            }
            .withdraw-all {
                font-size: 22rpx;
                color: #3c59ee;
            }
        }
        .btn {
            margin: 56rpx 35rpx 0;
            background-color: #ccc;
            color: #fff;
            height: 88rpx;
            font-size: 28rpx;
            text-align: center;
            line-height: 88rpx;
            &.on {
                background-color: #0863ee;
            }
        }
        .tip {
            margin-top: 30rpx;
            font-size: 22rpx;
            color: #999;
            line-height: 40rpx;
            padding: 0 35rpx;
        }
        .layBox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .7);
            z-index: 10;
        }
        .form {
            position: fixed;
            top: 217rpx;
            left: 0;
            right: 0;
            margin: 0 auto;
            padding: 38rpx 30rpx 30rpx;
            margin: 0 90rpx;
            background: #fff;
            border-radius: 10rpx;
            box-sizing: border-box;
            z-index: 11;
            h2.title {
                text-align: center;
                font-size: 34rpx;
                color: #333333;
                line-height: 37rpx;
            }
            .inp {
                border-bottom: 1rpx solid #ebebeb;
                padding: 32rpx 0;
                p {
                    line-height: 50rpx;
                    font-size: 28rpx;
                    color: #1a1a1a;
                    padding-bottom: 17rpx;
                }
                input {
                    font-size: 28rpx;
                    color: #333;
                    line-height: 40rpx;
                }
                 ::-webkit-input-placeholder {
                    font-size: 28rpx;
                    color: #ccc;
                    line-height: 40rpx;
                }
            }
            .btn {
                // width: 245rpx;
                height: 80rpx;
                background: #3c59ee;
                line-height: 80rpx;
                font-size: 30rpx;
                color: #fff;
                text-align: center;
                border: 1rpx solid #3c59ee;
                margin-top: 45rpx;
               
            }
        }
    }
</style>
