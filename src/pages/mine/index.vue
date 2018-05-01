<template>
  <div class="user">
    <div class="user_info">
      <img :src="userInfo.avatarUrl" alt="" class="user_img">
      <p class="user_name">{{userInfo.nickName}}</p>
    </div>
    <div class="options">
      <p>绑定手机号</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options" @click="order">
      <p>我的订单</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options" @click="address">
      <p>我的地址</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options" @click="history">
      <p>历史店铺</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options">
      <p>我要开店</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: []
      }
    },
    mounted() {
      this.userInfo = wx.getStorageSync('userInfo')
      // console.log(this.userInfo)
    },
    methods: {
      address() {
        wx.navigateTo({
          url: '/pages/select-address/main'
        })
      },
      order() {
        wx.navigateTo({
          url: '/pages/my-order/main'
        })
      },
      history(){
        wx.navigateTo({
          url: '/pages/history-shop/main'
        })
      }
    },
    components: {},
  }
</script>

<style lang="less">
  .user {
    height: 100%;
    background: #f5f5f5;
    position: relative;
    .user_info {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      padding: 30rpx 0;
      .user_img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
      }
      .user_name {
        padding-top: 20rpx;
        color: #666;
        font-size: 24rpx;
      }
    }
    .options {
      background: #fff;
      padding: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #e6e6e6;
      p {
        color: #666;
        font-size: 24rpx;
      }
      img {
        width: 40rpx;
        height: 40rpx;
      }
    }
    .uu_tips {
      position: absolute;
      left: 50%;
      bottom: 100rpx;
      transform: translateX(-50%);
      p {
        font-size: 24rpx;
        color: #666;
        text-align: center;
        padding: 8rpx;
      }
      .me_shop {
        text-decoration: underline;
      }
    }
  }
</style>
