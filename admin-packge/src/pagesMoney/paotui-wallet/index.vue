<template>
    <div class="admin_my_purse">
        <div class="bgc"></div>
        <div class="small_card">
            <div class="my_purse_top">
                <p>可用余额(元)</p>
                <h1>{{info.AccountMoney}}</h1>
                <!-- <span>低于¥200，您的店铺将自动休息不能接单</span> -->
                <div class="shop_info_list">
                    <div class="withdraw" @click="isShow=true">充值</div>
                </div>
            </div>
        </div>
        <div class="account">
            <p class="account-text">绑定账户</p>
            <p class="account-phone">{{info.PaoTuiUserName}}</p>
        </div>
        <div class="withdraw-text">
            注：<br> 充值请使用此绑定账户帐号充值，跳转后请确认目前不支持使用其它账户余额，请见谅
        </div>
        <div class="mask" v-if='isShow||isFail' @click='isShow=false'></div>
        <div class="layBox" v-if='isShow'>
            <h2 class="title">提示信息</h2>
            <p>充值请使用此绑定账号充值目前不支持使用其他账户余额，请见谅~</p>
            <div class="set-flex set-between">
                <div class="btn on" @click='isShow=false'>取消</div>
                <!-- <div class="btn" @click="goRecharge">去充值</div> -->
                <div class="btn"><navigator target="miniProgram" open-type="navigate" app-id="wx453615a79bad971f" path="pages/index/main" extra-data="" version="release" hover-class="none">去充值</navigator></div>
                
            </div>
        </div>
        <div class="layBox fail" v-if='isFail'>
            <img class='warn' src="https://otherfiles-ali.uupt.com/Stunner/FE/M/bb16c040817c422da1b3fa5d7624b8e3_big.png" alt="">
            <div class="title ">绑定失败</div>
            <p>您当前的跑腿钱包绑定失败<br>请点击重新绑定按钮再次绑定</p>
             <div class=" set-flex set-center">
                <!-- <div class="btn on" @click='isFail=false'>稍后</div> -->
                <div class="btn bigBtn" @click='binding'>重新绑定</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isShow: false,
                isFail:false,
                info:{
                    AccountMoney:0
                }
            };
        },
        onShow() {
            this.isShow=this.isFail = false;
        },
        mounted() {
            this.getInfo();
        },
        methods: {
            goRecharge() {
                this.isShow = false;
                wx.navigateToMiniProgram({
                    appId: 'wx453615a79bad971f',
                    path: 'pages/home/home',
                    extraData: {
                        // foo: 'bar'
                    },
                    // envVersion: 'develop',
                    success(res) {
                        // 打开成功
                        console.log('成功')
                    }
                })
            },
            getInfo(){
                this.util.post({
                    url: '/api/Merchant/ShopManage/PaoTuiWallet',
                    data: {
                        ShopID:  wx.getStorageSync('loginInfo').ShopID,
                    }
                }).then(res => {
                    if (res.State == 1) {
                        this.info=res.Body;
                        // if(res.Body.PaoTuiUserName==''){
                        //     this.isFail=true;
                        // }
                    }else if(res.State==-11){
                        this.isFail=true;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            },
            binding(){
                this.util.post({
                    url: '/api/Merchant/ShopManage/ReBindPaotui',
                    data: {
                        ShopID:  wx.getStorageSync('loginInfo').ShopID,
                    }
                }).then(res => {
                    if (res.State == 1) {
                         this.isFail=false;
                    }
                }).catch(err => {
                    this.msg(err.Msg)
                })
            }
        },
        components: {}
    };
</script>

<style lang="less">
    .admin_my_purse {
        height: 100%;
        background: #efeef4;
        overflow-x: hidden;
        overflow-y: scroll;
        padding-top: 20rpx;
        position: relative;
        box-sizing: border-box;
        .small_card {
            margin: 0 24rpx;
            background: #fff;
            z-index: 10;
            position: relative;
        }
        .bgc {
            height: 165rpx;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            background: #e37048;
        }
        .my_purse_top {
            margin: 0 auto 20rpx auto;
            padding: 40rpx 48rpx 23rpx;
            p {
                color: #999;
                font-size: 24rpx;
            }
            h1 {
                color: #1a1a1a;
                font-size: 90rpx;
            }
            span {
                display: block;
                font-size: 24rpx;
                color: #999;
            }
        }
        .shop_info_list {
            padding-top: 30rpx;
            .withdraw {
                width: 606rpx;
                height: 101rpx;
                line-height: 74rpx;
                text-align: center;
                margin: 0 auto;
                background: url("../../../static/wallet_button_paotui.png") no-repeat;
                background-size: 100% 100%;
                font-size: 28rpx;
                color: #fff;
            }
        }
        .account {
            display: flex;
            background: #fff;
            padding: 35rpx;
            align-items: center;
            margin-bottom: 20rpx;
            .account-text {
                flex: 1;
                font-size: 30rpx;
                color: #1a1a1a;
            }
            .account-phone {
                font-size: 30rpx;
                color: #999999;
            }
        }
        .withdraw-text {
            display: flex;
            padding: 35rpx;
            font-size: 24rpx;
            color: #999;
            line-height: 32rpx;
        }
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .7);
            z-index: 20;
        }
        .layBox {
            position: absolute;
            top: 217rpx;
            left: 0;
            right: 0;
            margin: 0 auto;
            padding: 38rpx 30rpx 30rpx;
            margin: 0 90rpx;
            background: #fff;
            border-radius: 10rpx;
            box-sizing: border-box;
            z-index: 30;
            img.warn{
                width:120rpx ;
                height: 120rpx;
                margin:14rpx auto 20rpx;

            }
            h2.title {
                text-align: center;
                font-size: 34rpx;
                color: #333333;
                line-height: 37rpx;
            }
            p {
                font-size: 26rpx;
                color: #666;
                line-height: 48rpx;
                padding-top: 30rpx;
                text-align: center;
            }
            .btn {
                width: 245rpx;
                height: 80rpx;
                background: #3c59ee;
                line-height: 80rpx;
                font-size: 30rpx;
                color: #fff;
                text-align: center;
                border: 1rpx solid #3c59ee;
                margin-top: 45rpx;
                &.on {
                    background: #fff;
                    color: #3c59ee;
                }
            }
            .bigBtn{
                width: 504rpx;
                height: 80rpx;
                 
            }
            &.fail{
                .title{
                    text-align: center;
                    font-size: 34rpx;
                    color:#333333;
                    font-weight: 900;
                }
                p{
                    font-size: 28rpx;
                    color:#999;
                    text-align: center;
                }
            }
        }
    }
</style>
