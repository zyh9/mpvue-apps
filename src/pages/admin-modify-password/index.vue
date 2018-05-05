<template>
  <div class="admin_modify_password">
    <div class="tel_left">
      <div class="options">
        <p>联系电话</p>
        <input type="text" placeholder="请输入您的手机号" maxlength="11" v-model="tel">
      </div>
      <div class="password">
        <p>验证码</p>
        <input type="text" placeholder="请输入验证码" v-model="val" maxlength="4">
        <button class="sms_click" plain="true" @click="sendSms" :disabled="countdown>0?true:false" :class="countdown>0?'disabled':''">{{countdownInfo}}</button>
      </div>
      <div class="btn" @click="next">下一步</div>
    </div>
    <div class="tel_right" :class="currentTab>0?'right':''">
      <div class="options">
        <p>设置密码</p>
        <input type="password" placeholder="英文字母与数字，最少8位" v-model="password">
        <i class="clear" @click="password=''" v-if="password">+</i>
      </div>
      <div class="password">
        <p>再次输入</p>
        <input type="password" placeholder="请再输入一遍" v-model="again">
        <i class="clear" @click="again=''" v-if="again">+</i>
      </div>
      <div class="btn" @click="modify">确定修改</div>
      <div class="btn" @click="cancel">取消</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tel: '',
        val: '',
        currentTab: 0,
        countdown: null,
        countdownInfo: '获取验证码',
        countdownTimer: null,
        password: '',
        again: '',
      }
    },
    onShow() { //页面渲染就会触发
      this.currentTab = 0;
    },
    methods: {
      //点击切换
      next(e) {
        this.currentTab = 1;
        this.countdownTimer = null;
        clearInterval(this.countdownTimer)
      },
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
      modify() {
        wx.navigateTo({
          url: '/pages/admin-user-info/main'
        })
      },
      cancel() {
        wx.navigateTo({
          url: '/pages/admin-user-info/main'
        })
      }
    },
    watch: {
      tel: function(newVal, oldVal) {
        //不是数字的替换为空
        this.tel = newVal.replace(/[^\d]/g, '');
      },
      val: function(newVal, oldVal) {
        this.val = newVal.replace(/[^\d]/g, '');
      },
      currentTab: function(newVal, oldVal) {
        wx.setNavigationBarTitle({
          title: this.currentTab == 0 ? '修改密码' : '设置密码'
        })
      }
    },
    beforeDestroy() { //清除定时器
      clearInterval(this.countdownTimer)
    },
  }
</script>

<style lang="less">
  .admin_modify_password {
    height: 100%;
    overflow-x: hidden;
    position: relative;
    .tel_left,
    .tel_right {
      background: #f5f5f5;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .tel_left {
      z-index: 5;
    }
    .tel_right {
      z-index: 10;
      transform: translateX(100%);
      transition: transform 0.6s ease;
    }
    .right {
      transform: translateX(0);
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
    }
    .btn {
      background: skyblue;
      margin: 20rpx;
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 8rpx;
      color: #fff;
      font-size: 30rpx;
    }
    .btn_sum {
      overflow: hidden;
    }
  }
</style>
