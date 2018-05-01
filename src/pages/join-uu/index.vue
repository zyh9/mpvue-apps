<template>
  <div class="join_uu">
    <p class="join_img">背景图待定</p>
    <div class="join_bottom">
      <p>我也要开店</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    components: {}
  }
</script>

<style lang="less">
  .join_uu {
    height: 100%;
    background: #f5f5f5;
    position: relative;
    overflow-x: hidden;
    .join_img {
      text-align: center;
      margin-top: 50rpx;
    }
    .join_bottom {
      position: absolute;
      bottom: 60rpx;
      left: 0;
      right: 0;
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
    }
  }
</style>
