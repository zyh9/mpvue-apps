<template>
  <div class="pay_err">
    <div class="err_img"></div>
    <p class="info">恭喜您付款成功</p>
    <div class="money_num"><span>¥</span>
      <p>{{info.money}}</p>
    </div>
    <p class="shop_name">{{info.shopName}}</p>
    <div class="btn_list">
      <div class="btn btn_left" @click="other">逛逛其他店铺</div>
      <div class="btn btn_right" @click="openShop">进入本店</div>
    </div>
    <img class="bot_img" :src="imgUrl" alt="">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imgUrl: require('../../../static/pay-info.png'),
        info: {}
      }
    },
    onLoad() {
      this.info = this.$mp.query;
      console.log(this.info)
    },
    methods: {
      other() {
        setTimeout(_ => {
          wx.switchTab({
            url: '/pages/nearby-shop/main'
          })
        }, 400)
      },
      openShop() {
        setTimeout(_ => {
          wx.redirectTo({
            url: `/pages/my-store/main?ShopId=${this.info.shopId||wx.getStorageSync('ShopId')}&type=1`
          })
        }, 400)
      }
    },
    components: {}
  }
</script>

<style lang="less">
  page {
    background: #fff;
  }
  .pay_err {
    height: 100%;
    overflow: hidden;
    position: relative;
    .err_img {
      margin: 120rpx auto 0;
      width: 228rpx;
      height: 162rpx;
      background-image: url('../../../static/pay-ok.png');
      background-repeat: no-repeat;
      background-size: 100%;
    }
    .info {
      font-size: 40rpx;
      color: #40ab17; // font-weight: 700;
      text-align: center;
      margin-bottom: 40rpx;
    }
    .money_num {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 60rpx;
      color: #1a1a1a;
      span {
        font-size: 40rpx;
        margin-right: 6rpx;
      }
    }
    .shop_name {
      font-size: 28rpx;
      color: #1a1a1a;
      text-align: center;
    }
    .btn_list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 70rpx 36rpx 0;
      .btn {
        flex: 1;
        height: 88rpx;
        font-size: 30rpx;
        line-height: 88rpx;
        text-align: center;
        border-radius: 6rpx;
        box-sizing: border-box;
      }
      .btn_left {
        color: #1a1a1a;
        background: #fff;
        margin-right: 22rpx;
        border: 1px solid #999;
      }
      .btn_right {
        color: #fff;
        background: #1a1a1a;
        border: 1px solid #1a1a1a;
      }
    }
    .bot_img {
      position: absolute;
      width: auto;
      left: 36rpx;
      right: 36rpx;
      bottom: 36rpx;
      height: 172rpx;
    }
  }
</style>
