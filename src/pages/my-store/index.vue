<template>
  <div class="store">
    <div class="store_top_info">
      <div class="store_top">
        <img src="../../../static/userImg.png" alt="" class="shop_img">
        <div class="top_right">
          <p class="name">XXXXX的便利店</p>
          <p class="address">地址：河南省郑州市金水区航海路与嵩山路交叉口200米路东</p>
          <p class="time">营业时间：9:30-22:00</p>
        </div>
      </div>
      <ul class="store_info">
        <li v-for="(v,i) in info" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav">{{v.name}}</li>
      </ul>
    </div>
    <swiper :current="currentTab" class="swiper-box" duration="300" :style="{height:winHeight+'px'}" @change="bindChange">
      <swiper-item>
        <storeIndex></storeIndex>
      </swiper-item>
      <swiper-item>
        <shopDetails></shopDetails>
      </swiper-item>
      <swiper-item>
        <shopOrder></shopOrder>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  // import store from './store'
  import storeIndex from '../../components/storeIndex';
  import shopDetails from '../../components/shopDetails';
  import shopOrder from '../../components/shopOrder';
  export default {
    data() {
      return {
        info: [{
          name: '首页'
        }, {
          name: '店铺信息'
        }, {
          name: '我的订单'
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
      //   store.commit('increment')
      // },
      // decrement () {
      //   store.commit('decrement')
      // }
      //滑动切换
      bindChange(e) {
        // console.log(e)
        this.currentTab = e.target.current
      },
      /** 
       * 点击tab切换 
       */
      swichNav(e) {
        // console.log(e)
        if (this.currentTab === e.target.dataset.current) return;
        this.currentTab = e.target.dataset.current;
      }
    },
    components: {
      storeIndex,
      shopDetails,
      shopOrder
    }
  }
</script>

<style lang="less">
  .store_top_info {
    overflow: hidden;
    .store_top {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 30rpx;
      .shop_img {
        width: 100rpx;
        height: 100rpx;
        display: block;
      }
      .top_right {
        padding-left: 30rpx;
        flex-grow: 1;
        .name {
          font-size: 24rpx;
          color: #666;
        }
        .address {
          font-size: 24rpx;
          color: #666;
          display: -webkit-box !important;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .time {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    .store_info {
      display: flex;
      justify-content: space-around;
      align-items: center;
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
</style>
