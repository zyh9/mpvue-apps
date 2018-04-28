<template>
  <div class="user">
    <div class="user_info">
      <img :src="userInfo.avatarUrl" alt="" class="user_img">
      <p class="user_name">{{userInfo.nickName}}</p>
    </div>
    <p class="options" @click="store">点击进入个人店铺页</p>
    <p class="options" @click="address">我的收货地址</p>
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
      }
    },
    components: {},
  }
</script>

<style lang="less">
  .user {
    height: 100%;
    background: #f5f5f5;
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
        padding: 20rpx 0;
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
      justify-content: center;
    }
  }
</style>
