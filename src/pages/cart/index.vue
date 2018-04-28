<template>
  <div class="cart">
    <p class="shop_cart">我的购物车</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    onShow() { //页面渲染就会触发
      let history = wx.getStorageSync('history') || [];
      console.log(history)
    },
    mounted() {},
    components: {}
  }
</script>

<style lang="less">
.cart{
  height: 100%;
  background: #f5f5f5;
  overflow: hidden;
}
  .shop_cart {
    background: #fff;
    margin-top: 20rpx;
    padding: 20rpx;
    color: #666;
    font-size: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
