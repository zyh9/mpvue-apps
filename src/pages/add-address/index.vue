<template>
  <div class="add_address">
    <div class="options">
      <p>收件人</p>
      <input type="text" placeholder="请填写收件人姓名">
    </div>
    <div class="options">
      <p>联系电话</p>
      <input type="text" placeholder="请填写收件人电话">
    </div>
    <div class="options">
      <p>收货地址</p>
      <picker mode="region" @change="regionChange" :value="region" :custom-item="customItem" class="citySelect">
      <view class="picker">
        {{region[0]}} {{region[1]}} {{region[2]}}
      </view>
    </picker>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options">
      <p>门牌号</p>
      <input type="text" placeholder="详细地址，例1号楼2层201室">
    </div>
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        region: ['点击选择', '', ''],
        customItem: '请选择'
      }
    },
    mounted() {
    },
    methods: {
      regionChange(e) {
        console.log(e)
        this.region = e.target.value;
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .add_address {
    height: 100%;
    background: #f5f5f5;
    font-size: 24rpx;
    .options {
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 20rpx;
      border-bottom: 1rpx solid #e6e6e6;
      p {
        width: 140rpx;
        text-align: left;
        transform: translateY(3rpx);
      }
      input {
        flex-grow: 1;
      }
      .citySelect{
        flex-grow: 1;
        color: #666;
      }
      img {
        width: 50rpx;
        height: 50rpx;
        margin-left: 20rpx;
      }
    }
  }
</style>
