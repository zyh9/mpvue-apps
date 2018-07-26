<template>
  <div class="pay_err">
    <div class="err_img"></div>
    <p class="info">Sorry，付款失败</p>
    <p class="tips">请您点击下边按钮重新支付</p>
    <div class="btn" @click="againPay">重新支付</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        info: {},
        payOnoff: true
      }
    },
    onLoad() {
      this.payOnoff = true;
      this.info = this.$mp.query;
      console.log(this.info)
    },
    methods: {
      againPay() {
        if (this.payOnoff) {
          this.payOnoff = false;
          this.util.post({
            url: '/api/Customer/Order/CustomerPayment',
            data: {
              ShopId: this.info.shopId || wx.getStorageSync('ShopId') || '',
              Money: this.info.money || ''
            }
          }).then(res => {
            wx.requestPayment({
              timeStamp: res.Body.wxPayInfo.timeStamp,
              nonceStr: res.Body.wxPayInfo.nonceStr,
              package: res.Body.wxPayInfo.package,
              signType: res.Body.wxPayInfo.signType,
              paySign: res.Body.wxPayInfo.paySign,
              success: payres => {
                console.log(payres)
                this.payOnoff = true;
                wx.redirectTo({
                  url: `/pages/pay-ok/main?money=${this.val}&shopName=${this.ShopName}&shopId=${this.ShopId}`
                })
              },
              fail: error => {
                this.payOnoff = true;
                console.log(error.errMsg)
                if (error.errMsg == 'requestPayment:fail cancel') {
                  this.msg('您已取消支付')
                } else { //支付失败
                  wx.redirectTo({
                    url: `/pages/pay-error/main?money=${this.val}&shopName=${this.ShopName}&shopId=${this.ShopId}`
                  })
                }
              }
            })
          }).catch(err => {
            this.payOnoff = true;
            console.log(err)
            this.msg(err.Msg)
          })
        }
      },
    },
    components: {}
  }
</script>

<style lang="less">
  page {
    background: #fff;
  }
  .pay_err {
    overflow: hidden;
    .err_img {
      margin: 135rpx auto 0;
      width: 228rpx;
      height: 162rpx;
      background-image: url('../../../static/pay-err.png');
      background-repeat: no-repeat;
      background-size: 100%;
    }
    .info {
      font-size: 40rpx;
      color: #ee5f46; // font-weight: 700;
      text-align: center;
      margin-bottom: 10rpx;
    }
    .tips {
      font-size: 28rpx;
      color: #1a1a1a;
      text-align: center
    }
    .btn {
      margin: 100rpx 36rpx 0;
      height: 88rpx;
      color: #fff;
      background: #1a1a1a;
      font-size: 30rpx;
      line-height: 88rpx;
      text-align: center;
      border-radius: 6rpx;
    }
  }
</style>
