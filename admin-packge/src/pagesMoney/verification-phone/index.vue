<template>
  <div class="container">
    <div class="list-main ">
      <div class="list-item  border-bottom-1" @click="editPass">
        <p>手机号</p>
        <span>18288113631</span>
      </div>
      <div class="list-item  border-bottom-1">
        <p>设置密码</p>
        <input type="text" placeholder="请输入验证码" v-model="authVal" maxlength="4">
        <button class="sms_click" plain="true"  :class="countdown>0?'disabled':''">{{countdownInfo}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      countdownInfo: '获取验证码',
    };
  },
  mounted() {},
  methods: {
    editPass() {
     
    },

  },
  components: {}
};
</script>

<style lang="less">
.container {
  height: 100%;
  background: #f5f5f5;
  overflow: hidden;
  .list-main{
    background: #fff;
    padding:0  35rpx;
    .list-item{
      padding: 35rpx 0;
      display: flex;
      align-items: center;
      p {
        width:112rpx;
        font-size: 28rpx;
        margin-left:20rpx;
        color: #1a1a1a;
      }
      span{
        margin-left:52rpx;
        font-size: 28rpx;
        color: #1a1a1a;
      }
      input {
        margin-left:52rpx;
        flex: 1;
        font-size: 28rpx;
        color: #ccc;
        padding-right: 20rpx;
      }
      .sms_click {
        margin-right: 20rpx;
        height: 50rpx;
        line-height: 50rpx;
        font-size: 24rpx;
        color: #3c59ee;
        background: transparent;
        border: 1rpx solid #3c59ee;
        border-radius: 6rpx;
        outline: none;
        white-space: nowrap;
        padding: 0 10rpx;
      }
    }
  }
}
.border-bottom-1{
   border-bottom: 1rpx solid #e6e6e6;
}
</style>
