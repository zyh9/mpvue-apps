<template>
  <div class="admin_user">
    <div class="user_info">
      <img :src="userInfo.avatarUrl" alt="" class="user_img">
      <p class="user_name">{{userInfo.nickName}}</p>
    </div>
    <div class="options">
      <p>个人信息</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options">
      <p>我的钱包</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options">
      <p>绑定其他平台</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options">
      <p>我的收款码</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options">
      <p>咨询客服</p>
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
      console.log(this.userInfo)
    },
    methods: {
    },
    components: {},
  }
</script>

<style lang="less">
  .admin_user {
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
  }
</style>
