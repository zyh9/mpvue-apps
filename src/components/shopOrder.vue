<template>
  <ul class="shop_order">
    <div class="me_address" @click="address">我的收货地址</div>
    <li class="order_item">
      <div class="lis_top">
        <div class="shop_name">
          <img src="" alt="" class="icon">
          <p class="name_info">张姐烤肉拌饭</p>
        </div>
        <img src="" alt="" class="direction">
      </div>
      <div class="lis_center">
        <ul class="order_shop_list">
          <li class="list_lis_info">
            <p>烤肉拌饭</p>
            <p>X1</p>
          </li>
        </ul>
        <div class="order_time_price">
          <p>2018/05/01</p>
          <p>订单共支付：15元</p>
        </div>
      </div>
      <div class="lis_bottom">
        <p>订单已完成</p>
        <ul class="lis_bottom_btn">
          <li>再来一单</li>
          <li>确认收货</li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      address() {
        wx.navigateTo({
          url: '/pages/address/main'
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .shop_order {
    height: 100%;
    background: #f5f5f5;
    overflow: hidden;
    .me_address {
      background: #fff;
      margin-top: 20rpx;
      padding: 20rpx;
      color: #666;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .order_item {
      background: #fff;
      margin-top: 20rpx;
      padding: 20rpx;
      .lis_top {
        padding-bottom: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #e6e6e6;
        .shop_name {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .icon {
            width: 50rpx;
            height: 50rpx;
            margin-right: 20rpx;
            background: #f00;
          }
          .name_info {
            font-size: 24rpx;
            color: #666;
          }
        }
        .direction {
          width: 50rpx;
          height: 50rpx;
          background: #f00;
        }
      }
      .lis_center {
        border-bottom: 1rpx solid #e6e6e6;
        .order_shop_list {
          .list_lis_info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            p {
              padding: 12rpx 0;
              font-size: 24rpx;
              color: #666;
            }
          }
        }
        .order_time_price {
          display: flex;
          align-items: center;
          justify-content: space-between;
          p {
            padding: 12rpx 0;
            font-size: 24rpx;
            color: #666;
          }
        }
      }
      .lis_bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 20rpx;
        p {
          font-size: 24rpx;
          color: #666;
        }
        .lis_bottom_btn {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          li {
            padding: 8rpx 14rpx;
            border: 1rpx solid #2395ff;
            border-radius: 6rpx;
            background: #fff;
            font-size: 24rpx;
            color: #2395ff;
            margin-left: 20rpx;
          }
        }
      }
    }
  }
</style>
