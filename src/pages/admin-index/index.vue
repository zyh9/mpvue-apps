<template>
  <div class="admin_index">
    <div class="index_top">
      <div class="income">
        <div class="today_income">
          <p>今日共计收入</p>
          <i>￥0</i>
        </div>
        <div class="complete_order">
          <p>完成订单数</p>
          <i>0单</i>
        </div>
      </div>
      <ul class="index_info">
        <li v-for="(v,i) in info" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav">{{v.name}}</li>
      </ul>
    </div>
    <swiper :current="currentTab" class="swiper-box" duration="300" :style="{height:winHeight+'px'}" @change="bindChange">
      <swiper-item>
        <ul class="platSum">
          <li v-for="(v,i) in platSum" :key="i">
            <img src="../../../static/userImg.png" alt="">
            <p>{{v.text}}</p>
          </li>
        </ul>
      </swiper-item>
      <swiper-item>
        <div class="me_shop">
          <img src="../../../static/jp.jpg" alt="">
          <p class="btn">开通</p>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        info: [{
          name: '平台店铺'
        }, {
          name: '自主店铺'
        }],
        platSum: [{
            text: '店铺管理'
          },
          {
            text: '商品管理'
          },
          {
            text: '分享码'
          }
        ],
        winWidth: 0,
        winHeight: 0,
        // tab切换  
        currentTab: 0,
      }
    },
    onShow() { //页面渲染就会触发
      this.currentTab = 0;
    },
    mounted() {
      let query = wx.createSelectorQuery();
      query.select('.index_top').boundingClientRect()
      query.exec(res => {
        let height = res[0].height;
        wx.getSystemInfo({
          success: res => {
            // console.log(res)
            this.winWidth = res.windowWidth;
            //减去上方的高度
            this.winHeight = res.windowHeight - height;
          }
        })
      })
    },
    methods: {
      //滑动切换
      bindChange(e) {
        // console.log(e)
        this.currentTab = e.target.current
      },
      //点击tab切换 
      swichNav(e) {
        // console.log(e)
        if (this.currentTab === e.target.dataset.current) return;
        this.currentTab = e.target.dataset.current;
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_index {
    height: 100%;
    overflow-x: hidden;
    background: #f5f5f5;
    .index_top {
      .income {
        display: flex;
        padding: 40rpx 20rpx;
        .today_income,
        .complete_order {
          width: 100%;
          flex-flow: 1;
          p {
            font-size: 30rpx;
            color: #666;
            text-align: center;
          }
          i {
            padding-top: 20rpx;
            font-size: 60rpx;
            color: #333;
            text-align: center;
          }
        }
      }
      .index_info {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-bottom: 1rpx solid #e6e6e6;
        background: #fff;
        li {
          color: #666;
          font-size: 24rpx;
          flex-flow: 1;
          width: 100%;
          text-align: center;
          padding: 16rpx;
        }
        .li_select {
          color: skyblue;
        }
      }
    }
    .platSum {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 20rpx;
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          width: 120rpx;
          height: 80rpx;
        }
        p {
          padding: 10rpx 0;
          text-align: center;
          font-size: 26rpx;
          color: #666;
        }
      }
    }
    .me_shop {
      padding: 30rpx;
      img {
        width: 100%;
        height: 300rpx;
        border-radius: 8rpx 8rpx 0 0;
      }
      .btn {
        background: skyblue;
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 0 0 8rpx 8rpx;
        color: #fff;
        font-size: 30rpx;
      }
    }
  }
</style>
