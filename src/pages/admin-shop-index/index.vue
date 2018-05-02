<template>
  <div class="admin_shop_index">
    <div class="index_btn">
      <p @click="openShop">打开我的店铺</p>
      <p @click="signUp">注册</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    mounted() {},
    methods: {
      openShop() {
        //后续可根据token是否存在做页面跳转处理
        wx.navigateTo({
          url: '/pages/admin-shop-login/main'
        })
      },
      signUp() {
        wx.navigateTo({
          url: '/pages/admin-shop-signup/main'
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_shop_index {
    background: #f5f5f5;
    height: 100%;
    position: relative;
    .index_btn {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 60rpx;
      p {
        width: 50%;
        background: skyblue;
        margin: 0 auto;
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 8rpx;
        color: #fff;
        font-size: 30rpx;
      }
      p:nth-last-of-type(1) {
        margin-top: 20rpx;
      }
    }
  }
</style>
