<template>
  <div class="join-uu">
    <img src="https://otherfiles-ali.uupt.com/Stunner/FE/C/admin-shop.png" alt="" class="index_bg fade_in">
    <div class="index_btn_img index_btn">
      <p @click="openShop">我也要开店</p>
      <navigator target="miniProgram" open-type="navigate" app-id="wxec3fbad970d598be" path="pages/admin-shop-index" extra-data="" version="release" hover-class="none"></navigator>
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
  .join-uu {
    height: 100%;
    position: relative;
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: scroll;
    .index_bg {
      width: 100%;
      height: 1000rpx;
    }
    .index_btn_img {
      width: 500rpx;
      height: 108rpx;
      margin: 60rpx auto;
      position: relative;
      p {
        text-align: center;
        height: 108rpx;
        line-height: 90rpx;
        color: #965b05;
        font-size: 28rpx;
        font-weight: 700;
      }
      navigator {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    }
  }
</style>
