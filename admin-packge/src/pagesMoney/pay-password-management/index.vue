<template>
  <div class="container">
    <div class="list-main">
      <div class="list-item  border-bottom-1" @click="editPass">
        <p>支付密码修改</p>
        <i class="icon icon_arrowRight"></i>
      </div>
      <div class="list-item" @click="forgetPass">
        <p>忘记支付密码</p>
        <i class="icon icon_arrowRight"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    editPass() {
      wx.navigateTo({
        url: "/pagesMoney/edit-pay-password"
      });
    },
    forgetPass() {
      wx.navigateTo({
        url: "/pagesMoney/forget-pay-password?type=2"
      });
    }
  },
  components: {}
};
</script>

<style lang="less">
.container {
  height: 100%;
  background: #efeef4;
  overflow: hidden;
  .list-main{
    background: #fff;
    padding:0  35rpx;
    .list-item{
      padding: 35rpx 0;
      display: flex;
      align-items: center;
      p {
        flex: 1;
        font-size: 28rpx;
        margin-left:20rpx;
        color: #1a1a1a;
      }
      .icon {
        width: 25rpx;
        height: 25rpx;
      }
    }
  }
}
.border-bottom-1{
   border-bottom: 1rpx solid #ebebeb;
}
</style>
