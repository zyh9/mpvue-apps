<template>
  <div class="user">
    <div class="user_info">
      <img :src="userInfo.avatarUrl" alt="" class="user_img">
      <p class="user_name">{{userInfo.nickName}}</p>
    </div>
    <p class="options" @click="store">点击进入个人店铺页</p>
    <p class="options" @click="order">我的订单</p>
    <p class="options" @click="address">我的收货地址</p>
    <p class="options" @click="shopInfo">查看店铺信息</p>
    <div class="uu_tips">
      <p>软件服务由UU跑腿提供</p>
      <p class="me_shop">我也要开店</p>
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
      store() {
        wx.navigateTo({
          url: '/pages/store/main'
        })
      },
      address() {
        wx.navigateTo({
          url: '/pages/address/main'
        })
      },
      order() {
        wx.navigateTo({
          url: '/pages/myorder/main'
        })
      },
      shopInfo() {
        wx.navigateTo({
          url: '/pages/shopinfo/main'
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
      margin-top: 20rpx;
      padding: 20rpx;
      color: #666;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
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
