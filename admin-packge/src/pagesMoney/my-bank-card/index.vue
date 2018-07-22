<template>
  <div class="container">
    <div class="card-info" @click="toBondBank" v-if='info.CardNum!=null'>
      <div class="info">
        <p class="bank-name">招商银行</p>
        <span class="card-id">尾号{{info.CardNum}}储蓄卡</span>
      </div>
      <div class="edit-card">点击更换<i class="icon icon_arrowRight"></i></div>
    </div>
    <div class="no-card" @click="setPayPassword" v-if='info.CardNum==null'>
      <i class="icon icon_emitAdd"></i>
      <p>添加银行卡</p>
      <i class="icon icon_arrowRight"></i>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        countdownInfo: '获取验证码',
        info: {
          AvailableMoney: 0,
          TradeMoney: 0,
          WithdrawMoney: 0,
          BankName: "",
          CardNum: null,
          IsHaveTradersPwd: true
        }
      };
    },
    onShow() {
      this.getInfo();
    },
    mounted() {},
    methods: {
      /* 修改绑定银行卡 */
      toBondBank() {
        wx.setStorageSync('bankCardInfo', this.info);
        wx.navigateTo({
          url: "/pagesMoney/bond-bank-card"
        });
      },
      /* 绑定银行卡--去设置支付密码 */
      setPayPassword() {
        wx.navigateTo({
          url: "/pagesMoney/forget-pay-password?type=1"
        });
      },
      getInfo() {
        this.util.post({
          url: '/api/Merchant/ShopManage/ShopWallet',
          data: {
            ShopID: wx.getStorageSync('loginInfo').ShopID,
          }
        }).then(res => {
          if (res.State == 1) {
            this.info = res.Body;
          }
        }).catch(err => {
          this.msg(err.Msg)
        })
      }
    },
    components: {}
  };
</script>

<style lang="less">
  .container {
    height: 100%;
    background: #eeeef4;
    overflow: hidden;
    .card-info {
      background: #fff;
      padding: 35rpx;
      display: flex;
      align-items: center;
      .info {
        flex: 1;
        .bank-name {
          font-size: 32rpx;
          color: #1a1a1a;
          line-height: 40rpx;
          font-weight: 900;
        }
        .card-id {
          font-size: 28rpx;
          color: #444444;
          line-height: 34rpx;
        }
      }
      .edit-card {
        font-size: 28rpx;
        color: #999;
        .icon {
          margin-left: 19rpx;
          vertical-align: middle;
        }
      }
    }
    .no-card {
      background: #fff;
      padding: 35rpx;
      display: flex;
      align-items: center;
      margin-top: 24rpx;
      .add-icon {
        width: 27rpx;
        height: 27rpx;
      }
      p {
        font-size: 28rpx;
        color: #1a1a1a;
        margin-left: 25rpx;
        flex: 1;
      }
    }
  }
</style>
