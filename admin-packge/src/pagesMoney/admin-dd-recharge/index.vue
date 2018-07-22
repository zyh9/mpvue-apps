<template>
  <div class="admin-dd-recharge">
    <div class="wrap">
      <div class="options">
        <p>充值金额</p>
        <input type="digit" placeholder="请输入您要充值的金额" placeholder-class='placeholderStyle' v-model="value" @input="moneyNum(value)">
      </div>
    </div>
    <div class="btn" @click="recharge">充值</div>
  </div>
</template>

<script>
  import gcoord from 'gcoord';
  export default {
    data() {
      return {
        value: ''
      }
    },
    onShow() { //页面渲染就会触发
      this.value = '';
    },
    methods: {
      moneyNum(val) {
        let reg = /(^(\.{1,})|(([0-9]+)[.]([0-9]{3,}))|(([0-9]+)([.]{2,}))|(([.]([\d]+)){2,}))|(^(([0]{2,})|([0][1-9])))$/;
        let valStr = val.toString();
        if (reg.test(valStr)) {
          this.msg('请输入合法金额');
        }
        let v = valStr.replace(reg, "");
        this.value = v;
      },
      recharge() {
        if (this.value == '') {
          this.msg('您还没有输入充值金额哦')
        } else {
          this.util.post({
            url: '/api/Merchant/ShopManage/RechargeDaDa',
            data: {
              ShopId: wx.getStorageSync('loginInfo').ShopID || '',
              Money: this.value
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
                setTimeout(_ => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 800)
              },
              fail: res => {
                this.msg('您已取消支付')
              }
            })
          }).catch(err => {
            console.log(err)
            this.msg(err.Msg)
          })
        }
      }
    },
    watch: {},
  }
</script>

<style lang="less">
  page {
    background: #eeeef4;
  }
  .admin-dd-recharge {
    box-sizing: border-box;
    position: relative;
    .wrap {
      background: #fff;
    }
    .options {
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 30rpx 0;
      margin: 0 36rpx;
      position: relative;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        border-bottom: 1px solid #ebebeb;
        transform: scaleY(0.5);
        transform-origin: 0 0;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      p {
        font-size: 28rpx;
        color: #1a1a1a;
        width: 140rpx;
        text-align: left;
        transform: translateY(3rpx);
      }
      input {
        flex: 1;
        font-size: 28rpx;
        color: #1a1a1a;
      }
      .placeholderStyle {
        font-size: 28rpx;
        color: #ccc;
      }
    }
    .password {
      background: #fff;
      padding: 30rpx 0;
      margin: 0 36rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      p {
        font-size: 28rpx;
        color: #1a1a1a;
        width: 140rpx;
        text-align: left;
        transform: translateY(3rpx);
      }
      input {
        flex: 1;
        font-size: 28rpx;
        color: #1a1a1a;
        padding-right: 20rpx;
      }
      .placeholderStyle {
        font-size: 28rpx;
        color: #ccc;
      }
      .sms_click {
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
    .btn {
      background: #4b6df8;
      margin: 56rpx 36rpx 0;
      text-align: center;
      height: 88rpx;
      line-height: 88rpx;
      color: #fff;
      font-size: 30rpx;
    }
  }
</style>
