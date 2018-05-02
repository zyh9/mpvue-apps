<template>
  <div class="set_password">
    <div class="options">
      <p>设置密码</p>
      <input type="password" placeholder="英文字母与数字，最少8位" maxlength="11" v-model="password">
      <i class="clear" @click="password=''" v-if="password">+</i>
    </div>
    <div class="password">
      <p>再次输入</p>
      <input type="password" placeholder="请再输入一遍" v-model="again">
      <i class="clear" @click="again=''" v-if="again">+</i>
    </div>
    <div class="btn_login" @click="signUp">注册</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        password: '',
        again: '',
      }
    },
    mounted() {
    },
    methods: {
      signUp() {
        wx.switchTab({
          url: '/pages/admin-index/main'
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .set_password {
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
