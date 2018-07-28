<template>
  <div class="cart">
    <div class="cart_con">
      <ul class="cart_list">
        <li v-for="(v,i) in 10" :key="i">
          <img class="cart_lis_img" src="" alt="">
          <div class="lis_right">
            <p class="lis_shop_name">张杰</p>
            <span class="lis_shop_norm">111</span>
            <div class="lis_info">
              <i class="icon icon_discount_text"></i>
              <p><span>¥</span>24</p>
              <del>¥88</del>
            </div>
            <div class="count">
              <i class="icon icon_lower_bus"></i>
              <span>11</span>
              <i class="icon icon_add_bus"></i>
            </div>
          </div>
        </li>
      </ul>
      <div class="cart_bot">
        <p><span>合计:</span>¥111</p>
        <button class="sum" plain="true">结算</button>
      </div>
    </div>
    <div class="tab_bar">
      <div class="tab_bar_item" @click="openBusiness">
        <img src="../../../static/tabBar/index.png" alt="">
        <p>首页</p>
      </div>
      <div class="tab_bar_item">
        <img src="../../../static/tabBar/cart-active.png" alt="">
        <p class="active">购物车</p>
      </div>
      <div class="tab_bar_item" @click="openUser">
        <img src="../../../static/tabBar/user.png" alt="">
        <p>我的</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      openBusiness() {
        this.util.openBusiness(this,'cart','business')
      },
      openUser() {
        this.util.openUser(this,'cart','user')
      },
    },
    components: {}
  }
</script>

<style lang="less">
  .cart {
    height: 100%;
    padding-bottom: 96rpx;
    box-sizing: border-box;
    .cart_con {
      height: 100%;
      position: relative;
      box-sizing: border-box;
      padding-bottom: 100rpx;
    }
    .cart_list {
      height: 100%;
      padding: 0 36rpx;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: scroll;
      li {
        padding: 36rpx 0;
        overflow: hidden;
        position: relative;
        display: flex;
        &:after {
          content: '';
          display: block;
          width: 100%;
          height: 0;
          border-bottom: 1px solid #ebebeb;
          position: absolute;
          left: 0;
          bottom: 0;
          transform: scaleY(0.5);
          transform-origin: 0 0;
          z-index: 10;
        }
        .cart_lis_img {
          width: 136rpx;
          height: 136rpx;
          border-radius: 10rpx;
        }
        .lis_right {
          line-height: 42rpx;
          flex: 1;
          position: relative;
          .lis_shop_name {
            font-size: 30rpx;
            color: #1d1d1d;
            font-weight: 700;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .lis_shop_norm {
            font-size: 22rpx;
            color: #999999;
          }
          .lis_info {
            display: flex;
            align-items: center;
            i {
              transform: translateY(-2rpx);
            }
            p {
              font-size: 36rpx;
              color: #ff4d3a;
              span {
                font-size: 24rpx;
              }
            }
            del {
              font-size: 22rpx;
              color: #ccc;
              transform: translateY(4rpx);
              margin-left: 12rpx;
              position: relative;
              &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1px solid #ccc;
                position: absolute;
                bottom: 50%;
                left: 0;
                transform: scale(1, 0.5);
                transform-origin: 0 0;
              }
            }
          }
        }
        .count {
          position: absolute;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          width: 170rpx;
          justify-content: flex-end;
          .lower,
          .add {
            width: 44rpx;
            height: 44rpx;
          }
          span {
            font-size: 24rpx;
            color: #939393;
            margin: 0 12rpx;
          }
        }
      }
      li:nth-last-child(1) {
        &:after {
          display: none !important;
        }
      }
    }
    .cart_bot {
      height: 100rpx;
      background-color: #fff;
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 5;
      padding: 0 35rpx;
      box-sizing: border-box;
      z-index: 5;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        border-top: 1px solid #ebebeb;
        position: absolute;
        left: 0;
        top: 0;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      p {
        font-size: 36rpx;
        color: #1a1a1a;
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        line-height: 100rpx;
        span {
          font-size: 28rpx;
          margin-right: 10rpx;
        }
      }
      .sum {
        width: 184rpx;
        height: 64rpx;
        background-color: #ff4d3a;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #fff;
        line-height: 64rpx;
        text-align: center;
        border: 0;
      }
    }
  }
</style>
