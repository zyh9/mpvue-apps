<template>
  <div class="pay_list">
    <h3 class="title">消费余额明细</h3>
    <div class="container">
      <scroll-view scroll-y="true" lower-threshold="60" @scrolltolower="scrollHandler" style="height: 100%">
        <p class="no_info" v-if="noInfo">暂无明细信息</p>
        <div class="list-item" v-for="(v,i) in 10" :key="i">
          <div class="wallet-info">
            <div class="text">会员卡充值</div>
            <div class="time">2018.02.02</div>
          </div>
          <div class="price">
            +22
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        noInfo: false
      }
    },
    onReady() {},
    methods: {},
    watch: {},
    onUnload() {}
  }
</script>

<style lang="less">
  .pay_list {
    background: #fff;
    .title {
      position: absolute;
      left: 0;
      top: 0;
      margin: 20rpx 36rpx;
      font-size: 46rpx;
      font-weight: 700;
      z-index: 5;
    }
    .container {
      padding-top: 104rpx;
      box-sizing: border-box;
      height: 100%;
      background: #fff;
      overflow: hidden;
      .list-item {
        position: relative;
        padding: 35rpx 0;
        margin: 0 35rpx;
        display: flex;
        align-items: center;
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
        .wallet-info {
          flex: 1;
          .text {
            font-size: 28rpx;
            line-height: 22rpx;
            color: #1a1a1a;
          }
          .time {
            margin-top: 16rpx;
            font-size: 22rpx;
            line-height: 22rpx;
            color: #999;
          }
        }
        .price {
          font-size: 36rpx;
          color: #fa5f40;
        }
      }
      .list-item:nth-last-child(1) {
        &:after {
          display: none !important;
        }
      }
    }
    .no_info {
      text-align: center;
      font-size: 28rpx;
      color: #666;
      padding-top: 100rpx;
    }
  }
</style>
