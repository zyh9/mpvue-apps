<template>
  <div class="admin_my_purse">
    <div class="my_purse_top">
      <p>可用余额</p>
      <i>¥40.00</i>
    </div>
    <div class="shop_info_list">
      <div class="recharge" @click="recharge">充值</div>
      <div class="withdraw" @click="withdraw">提现</div>
    </div>
    <div class="purse_lis">
      <p>交易中</p>
      <img src="../../../static/userImg.png" alt="" class="icon">
    </div>
    <div class="purse_lis">
      <p>提现中</p>
      <img src="../../../static/userImg.png" alt="" class="icon">
    </div>
    <div class="purse_lis">
      <p>钱包明细</p>
      <img src="../../../static/userImg.png" alt="" class="icon">
    </div>
    <div class="purse_lis">
      <p>支付密码管理</p>
      <img src="../../../static/userImg.png" alt="" class="icon">
    </div>
    <div class="purse_lis">
      <p>我的银行卡</p>
      <img src="../../../static/userImg.png" alt="" class="icon">
    </div>
  </div>
</template>

<script>
  import msg from '../../utils/toast';
  export default {
    data() {
      return {}
    },
    mounted() {},
    methods: {
      recharge() {
        wx.navigateTo({
          url: '/pages/admin-user-recharge/main'
        })
      },
      withdraw() {
        wx.navigateTo({
          url: '/pages/admin-user-withdraw/main'
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_my_purse {
    height: 100%;
    background: #f5f5f5;
    overflow: hidden;
    .my_purse_top {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      padding: 30rpx 0;
      p {
        padding-top: 20rpx;
        color: #666;
        font-size: 24rpx;
      }
      i {
        padding-top: 20rpx;
        color: #666;
        font-size: 50rpx;
      }
    }
    .shop_info_list {
      margin: 20rpx 0;
      display: flex;
      padding: 20rpx;
      align-items: center;
      background: #fff;
      .recharge,
      .withdraw {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: #666;
        padding: 8rpx;
      }
      .recharge {
        border-right: 1rpx solid #e6e6e6;
        box-sizing: border-box;
      }
    }
    .purse_lis {
      background: #fff;
      padding: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #e6e6e6;
      .icon {
        width: 50rpx;
        height: 50rpx;
        margin-right: 20rpx;
      }
      p {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
</style>
