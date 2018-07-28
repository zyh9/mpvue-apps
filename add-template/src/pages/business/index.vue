<template>
  <div class="business">
    <div class="business_con">
      <div class="business_top">
        <div class="search" @click="search">
          <i class="icon icon_search_3"></i>
          <p class="text">搜索</p>
        </div>
        <div class="classify" @click="openType">
          <i class="icon icon_classify"></i>
          <span>分类</span>
        </div>
      </div>
      <div class="business-banner">
        <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" circular="true">
          <block v-for="(item,index) in imgUrls" :key="index">
            <swiper-item>
              <img :src="item" class="slide-image" />
            </swiper-item>
          </block>
        </swiper>
      </div>
      <div class="business-nav">
        <div class="business-nav-cont">
          <div class="business-nav-item" :class="{indexNavItems: imgUrls.length < 4}" v-for="(item,index) in imgUrls" :key="index">
            <img :src="item" />
            <!-- <p>苹果</p> -->
          </div>
        </div>
      </div>
      <div class="business-ad">
        <div class="business-ad-item" :class="{indexNavItems: imgUrls.length < 4}" v-for="(item,index) in imgUrls" :key="index">
          <img :src="item" />
        </div>
      </div>
      <div class="business-recommend">
        <div class="business-recommend-title">
          <i class="icon icon_recommend"></i>
          <p>
            <span>推荐商品</span>
            <i class="icon icon_curve"></i>
          </p>
        </div>
        <div class="business-recommend-list">
          <div class="business-recommend-item" v-for="(item,index) in imgUrls" :key="index">
            <img :src="item" />
            <div class="business-recommend-item-title">这是商品名称</div>
            <div class="business-recommend-item-price">￥123</div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab_bar">
      <div class="tab_bar_item">
        <img src="../../../static/tabBar/index-active.png" alt="">
        <p class="active">首页</p>
      </div>
      <div class="tab_bar_item" @click="openCart">
        <img src="../../../static/tabBar/cart.png" alt="">
        <p>购物车</p>
      </div>
      <div class="tab_bar_item" @click="openUser">
        <img src="../../../static/tabBar/user.png" alt="">
        <p>我的</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //swiper配置
        imgUrls: [
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000
      }
    },
    onLoad() {},
    onReady() {
      this.getUserInfo();
    },
    onShow() {
    },
    methods: {
      getUserInfo() {
        this.util.post({
          url: '/api/Customer/Browse/GetShopInfo',
          data: {
            ShopId: '1817162813555718'
          }
        }).then(res => {
          console.log(res)
        }).catch(err => {
          this.msg(err.Msg)
        })
      },
      search() {
        wx.navigateTo({
          url: `/pages/search-product/main`
        })
      },
      openType() {
        wx.navigateTo({
          url: `/pages/type-list/main`
        })
      },
      openCart() {
        this.util.openCart(this, 'business', 'cart')
      },
      openUser() {
        this.util.openUser(this, 'business', 'user')
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .business {
    height: 100%;
    position: relative;
    padding-bottom: 96rpx;
    box-sizing: border-box;
    .business_con {
      height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
    }
    .business_top {
      padding: 0 36rpx 26rpx;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .search {
        flex: 1;
        height: 64rpx;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        background-color: rgba(235, 235, 235, 0.8);
        border-radius: 32rpx;
        margin-right: 20rpx;
        padding-left: 24rpx;
        box-sizing: border-box;
        .text {
          margin-left: 12rpx;
          font-size: 24rpx;
          color: #000000;
        }
      }
      .classify {
        width: 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        text-align: center;
        align-items: center;
        span {
          margin-top: 3rpx;
          font-size: 20rpx;
          line-height: 22rpx;
          color: #444444;
        }
      }
    }
    .business-banner {
      padding: 0 36rpx 20rpx;
      height: 280;
      .slide-image {
        width: 100%;
        height: 100%;
        border-radius: 10rpx;
      }
    }
    .business-nav {
      padding: 0 36rpx;
      .business-nav-cont {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        .business-nav-item {
          width: 159rpx;
          height: 100%;
          margin-top: 15rpx;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          img {
            width: 100%;
            height: 159rpx;
            border-radius: 10rpx;
          }
          p {
            font-size: 24rpx;
            color: #000000;
            text-align: center;
            line-height: 24rpx;
            margin-top: 17rpx;
          }
        }
        .indexNavItems {
          width: 212rpx;
        }
      }
    }
    .business-ad {
      padding: 35rpx 36rpx 59rpx;
      .business-ad-item {
        height: 200rpx;
        margin-bottom: 16rpx;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
      }
      &.business-ad-item:last-child {
        margin-bottom: 0;
      }
    }
    .business-recommend {
      padding: 0 36rpx;
      .business-recommend-title {
        height: 40rpx;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        p {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          span {
            font-size: 40rpx;
            font-weight: 700;
            color: #000000;
          }
        }
      }
      .business-recommend-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 40rpx;
        .business-recommend-item {
          width: 325rpx;
          margin-bottom: 35rpx;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          img {
            width: 100%;
            height: 332rpx;
            border-radius: 10rpx;
          }
          .business-recommend-item-title {
            margin-top: 20rpx;
            font-size: 27rpx;
            font-weight: 600;
            color: #000;
            line-height: 40rpx;
          }
          .business-recommend-item-price {
            margin-top: 10rpx;
            font-size: 29rpx;
            font-weight: 600;
            color: #ed523d;
          }
        }
      }
    }
  }
</style>
