<template>
  <div class="user">
    <div class="user_info">
      <img :src="userInfo.avatarUrl" alt="" class="user_img">
      <p class="user_name">{{userInfo.nickName}}</p>
    </div>
    <div class="options" @click="store">
      <p>点击进入个人店铺页</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options" @click="order">
      <p>我的订单</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options" @click="address">
      <p>我的收货地址</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options" @click="shopInfo">
      <p>查看店铺信息</p>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="uu_tips">
      <p>软件服务由UU跑腿提供</p>
      <p class="me_shop">我也要开店</p>
    </div>
    <login v-if="loginMask" @log-in="loginEmit"></login>
  </div>
</template>

<script>
  import login from '../../components/Login';
  export default {
    data() {
      return {
        userInfo: [],
        loginMask: true
      }
    },
    onShow() {
      this.loginMask = wx.getStorageSync('success') ? false : true;
    },
    mounted() {
      this.userInfo = wx.getStorageSync('userInfo')
      // console.log(this.userInfo)
    },
    methods: {
      store() {
        wx.navigateTo({
          url: '/pages/my-store/main'
        })
      },
      address() {
        wx.navigateTo({
          url: '/pages/my-address/main'
        })
      },
      order() {
        wx.navigateTo({
          url: '/pages/my-order/main'
        })
      },
      shopInfo() {
        wx.navigateTo({
          url: '/pages/my-shop-info/main'
        })
      },
      loginEmit(val) {
        console.log(val)
        this.loginMask = false;
      },
      userData() {
        this.util.post({
            url: '/api/Customer/PersonerCenter/UserCenter',
            data: {},
            headers: {
              appid: '1',
              token: wx.getStorageSync('loginInfo').Token || ''
            }
          })
          .then(res => {
            if (res.State == 1) {
              console.log(res)
            }
          }).catch(err => {
            this.msg(err.Msg)
          })
      },
      //用户退出
      userOut() {
        this.util.post({
            url: '/api/Customer/Login/Logout',
            data: {},
            headers: {
              appid: '1',
              token: wx.getStorageSync('loginInfo').Token || ''
            }
          })
          .then(res => {
            if (res.State == 1) {
              console.log(res)
            }
          }).catch(err => {
            this.msg(err.Msg)
          })
      }
    },
    computed: {
      // loginMask: function() {
      //   return wx.getStorageSync('success') ? false : true;
      // },
    },
    components: {
      login
    },
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
