<template>
  <div class="store">
    <div class="store_top_info">
      <div class="store_banner">
        <img src="../../../static/logo.png" alt="" class="shop_img">
        <img src="../../../static/share.png" alt="" class="share">
      </div>
      <div class="store_text">
        <p class="name">汉堡王(望京店)</p>
        <p class="time">营业时间：9:30-22:00</p>
        <p class="address">地址：河南省郑州市金水区航海路与嵩山路交叉口200米路东</p>
      </div>
      <ul class="store_info">
        <li v-for="(v,i) in info" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav"><span>{{v.name}}</span></li>
      </ul>
    </div>
    <swiper :current="currentTab" class="swiper-box" duration="300" :style="{height:winHeight+'px'}" @change="bindChange">
      <swiper-item>
        <storeIndex></storeIndex>
      </swiper-item>
      <swiper-item>
        <shopDetails></shopDetails>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  // import store from './store'
  import storeIndex from '../../components/storeIndex';
  import shopDetails from '../../components/shopDetails';
  // import shopOrder from '../../components/shopOrder';
  export default {
    data() {
      return {
        info: [{
          name: '首页'
        }, {
          name: '店铺信息'
        }],
        winWidth: 0,
        winHeight: 0,
        // tab切换  
        currentTab: 0,
      }
    },
    onShow() { //页面渲染就会触发
      this.currentTab = 0;
      let history = wx.getStorageSync('history') || [];
      // console.log(history)
    },
    created() {},
    mounted() {
      let query = wx.createSelectorQuery();
      query.select('.store_top_info').boundingClientRect()
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
    computed: {
      // count () {
      //   return store.state.count
      // }
    },
    methods: {
      // increment () {
      //   store.    ('increment')
      // },
      // decrement () {
      //   store.commit('decrement')
      // }
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
    components: {
      storeIndex,
      shopDetails,
      // shopOrder
    }
  }
</script>

<style lang="less">
  .store_top_info {
    overflow: hidden;
    .store_banner {
      background: #383838;
      position: relative;
      height: 114rpx;
      .shop_img {
        position: absolute;
        left: 50%;
        width: 160rpx;
        height: 160rpx;
        transform: translateX(-50%);
        border-radius: 8rpx;
      }
      .share {
        position: absolute;
        bottom: 0;
        right: 28rpx;
        width: 70rpx;
        height: 70rpx;
        transform: translateY(50%);
      }
    }
    .store_text {
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 58rpx;
      .name {
        font-size: 38rpx;
        color: #383838;
        font-weight: 700;
      }
      .time {
        font-size: 22rpx;
        color: #ff4d3a;
        background-color: rgba(255, 77, 58, 0.13);
        border-radius: 4rpx;
        padding: 0 8rpx;
        margin: 6rpx 0 10rpx;
      }
      .address {
        width: 60%;
        font-size: 22rpx;
        color: #939393;
        display: -webkit-box !important;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-align: center;
      }
    }
    .store_info {
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1rpx solid #ebebeb;
      box-sizing: border-box;
      li {
        flex-flow: 1;
        width: 100%;
        text-align: center;
        height: 70rpx;
        span {
          line-height: 70rpx;
          color: #4d4d4d;
          font-size: 28rpx;
          position: relative;
          z-index: -1;
          box-sizing: border-box;
          display: inline-block;
          height: 100%;
        }
      }
      .li_select {
        span {
          color: #1d1d1d;
          border-bottom: 4rpx solid #ff4d3a;
        }
      }
    }
  }
</style>
