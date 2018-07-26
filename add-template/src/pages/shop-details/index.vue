<template>
  <div class="shop_details">
    <h3 class="title">店铺信息</h3>
    <div class="store_banner details_bor">
      <img :src="shopInfoList.Logo?shopInfoList.Logo+'?x-oss-process=image/resize,w_200/format,jpg':''" alt="" class="shop_img fade_in">
      <div class="shop_right_details">
        <p class="shop_name">{{shopInfoList.ShopName}}</p>
        <p class="shop_tips">简介：{{shopInfoList.ShopSummary?shopInfoList.ShopSummary:'欢迎光临本店，我们不定期会推出活动和优惠！'}}</p>
      </div>
    </div>
    <div class="shop_details_info">
      <div class="options options_bor">
        <div class="label">店铺地址</div>
        <div class="item">{{addressShopInfo}}</div>
      </div>
      <div class="options options_bor">
        <div class="label">配送服务</div>
        <div class="item">由商家指定配送服务(UU跑腿/快递)</div>
      </div>
      <div class="options" style="border:none">
        <div class="label">营业时间</div>
        <div class="item">{{shopInfoList.OpenTime}}</div>
      </div>
      <div class="shop_info_list">
        <div class="shop_tel" @click="tel">
          <i class="icon icon_shop_tel icon_info"></i>
          <p>商家电话</p>
        </div>
        <div class="shop_wx" @click="copyWx">
          <i class="icon icon_shop_wx icon_info"></i>
          <p>商家微信</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        shopInfoList: {}
      }
    },
    onReady() {
      this.shopInfoList = {};
      this.shopInfo()
    },
    methods: {
      //店铺信息
      shopInfo() {
        this.util.post({
          url: '/api/Customer/Browse/GetShopInfo',
          data: {
            //分享二维码获取  商品详情获取 this.ShopId || wx.getStorageSync('ShopId')
            shopId: this.ShopId || String(wx.getStorageSync('shopInfo').ShopId) || wx.getStorageSync('ShopId') || '',
          }
        }).then(res => {
          res.Body.OpenTime = String(this.util.openTime(res.Body.OpenTime));
          this.shopInfoList = res.Body;
        }).catch(err => {
          this.msg(err.Msg)
        })
      },
      tel() {
        wx.makePhoneCall({
          phoneNumber: this.shopInfoList.ShopMobile
        })
      },
      copyWx() {
        if (this.shopInfoList.ShopWechat == "") {
          this.msg('商家未提供微信联系方式')
        } else {
          wx.setClipboardData({
            data: this.shopInfoList.ShopWechat,
            success: res => {
              this.msg("复制成功")
            },
            fail: err => {
              this.msg("复制失败")
            }
          })
        }
      },
    },
    watch: {},
    computed: {
      addressShopInfo: function() {
        return this.shopInfoList.ShopAddress ? this.shopInfoList.ShopAddress.split('($)').join(' ') : '';
      },
    },
    onUnload() {}
  }
</script>

<style lang="less">
  .shop_details {
    overflow-x: hidden;
    background: #fff;
    .title {
      margin: 20rpx 36rpx 0;
      font-size: 46rpx;
      font-weight: 700;
    }
    .details_bor:after {
      content: '';
      display: block;
      width: 100%;
      height: 0;
      border-bottom: 1px solid #ebebeb;
      position: absolute;
      bottom: 0;
      left: 0;
      transform: scaleY(0.5);
      transform-origin: 0 0;
    }
    .store_banner {
      position: relative;
      padding: 60rpx 0;
      margin: 0 35rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .shop_img {
        width: 160rpx;
        height: 160rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }
      .shop_right_details {
        flex: 1;
        overflow: hidden;
        .shop_name {
          color: #1a1a1a;
          font-size: 36rpx;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          line-height: 42rpx;
          padding: 0 8rpx;
          flex: 1;
          margin-bottom: 6rpx;
        }
        .shop_tips {
          color: #999;
          font-size: 24rpx; // white-space: nowrap;
          // text-overflow: ellipsis;
          // overflow: hidden;
          line-height: 42rpx;
          padding: 0 8rpx;
          flex: 1;
          display: -webkit-box !important;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
      .share {
        position: absolute;
        top: 0;
        right: 22rpx;
        width: 86rpx;
        height: 86rpx;
      }
    }
    .shop_details_info {
      height: 100%;
      background: #fff;
      overflow: hidden;
      .options {
        padding: 35rpx 0;
        background: #fff;
        display: flex;
        margin: 0 35rpx;
        position: relative;
        .label {
          font-size: 28rpx;
          color: #5e5e5e;
          white-space: nowrap;
          font-weight: 900;
          width: 160rpx;
        }
        .item {
          flex: 1;
          font-size: 28rpx;
          color: #999;
          line-height: 40rpx;
          text-align: right;
        }
      }
      .options_bor:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        border-bottom: 1px solid #ebebeb;
        position: absolute;
        bottom: 0;
        left: 0;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      .shop_info_list {
        display: flex;
        padding: 0 35rpx 20rpx;
        align-items: center;
        background: #fff;
        .shop_tel,
        .shop_wx {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          padding: 20rpx 0;
          border-radius: 8rpx;
          .icon_info {
            width: 30rpx;
            height: 30rpx;
            margin-right: 8rpx;
          }
          p {
            font-size: 24rpx;
            color: #666;
          }
        }
        .shop_tel {
          margin-right: 20rpx;
        }
      }
    }
  }
</style>
