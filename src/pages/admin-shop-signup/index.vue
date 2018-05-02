<template>
  <div class="shop_signup">
    <div class="options">
      <p>联系电话</p>
      <input type="text" placeholder="请输入您的手机号" maxlength="11" v-model="authTel">
    </div>
    <div class="password">
      <p>验证码</p>
      <input type="text" placeholder="请输入验证码" v-model="authVal" maxlength="4">
      <button class="sms_click" @click="sendSms" :disabled="countdown>0?true:false" :class="countdown>0?'disabled':''">{{countdownInfo}}</button>
    </div>
    <div class="btn_login" @click="next">下一步</div>
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
      }
    },
    mounted() {},
    methods: {
      //发送验证码
      sendSms() {
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
      },
      next(){
         wx.navigateTo({
          url: '/pages/admin-shop-set-password/main'
        })
      }
    },
    components: {},
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
  .shop_signup {
    height: 100%;
    background: #f5f5f5;
    overflow-x: hidden;
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
      margin: 20rpx;
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 8rpx;
      color: #fff;
      font-size: 30rpx;
    }
  }
</style>
