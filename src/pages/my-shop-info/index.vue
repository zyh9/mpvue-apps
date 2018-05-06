<template>
  <div class="my_shop_info">
    <div class="shop_info_top">
      <img src="../../../static/jp.jpg" alt="" class="shop_img">
      <p class="shop_name">张姐烤肉拌饭</p>
    </div>
    <div class="address">
      <img src="../../../static/userImg.png" alt="" class="icon">
      <p>地址：河南省郑州市金水区航海路与嵩山路交叉口200米路东11111111</p>
    </div>
    <div class="shop_info_list">
      <div class="shop_tel" @click="tel">
        <img src="../../../static/userImg.png" alt="" class="icon">
        <p>商家电话</p>
      </div>
      <div class="shop_wx" @click="copyWx">
        <img src="../../../static/userImg.png" alt="" class="icon">
        <p>商家微信</p>
      </div>
    </div>
    <div class="shop_service">
      <img src="../../../static/userImg.png" alt="" class="icon">
      <p>UU跑腿配送</p>
    </div>
    <div class="shop_business">
      <img src="../../../static/userImg.png" alt="" class="icon">
      <p>营业时间：9:00-20:00</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    mounted() {
      this.shopInfo()
    },
    methods: {
      tel() {
        wx.makePhoneCall({
          phoneNumber: '13837987714'
        })
      },
      copyWx() {
        wx.setClipboardData({
          data: 'zyh941109',
          success: res => {
            this.msg("复制成功")
          },
          fail: err => {
            this.msg("复制失败")
          }
        })
      },
      shopInfo() {
        this.util.post({
            url: '/api/Customer/Browse/GetShopInfo',
            data: {
              shopId: 1
            },
            headers: {
              appid: '1',
              token: wx.getStorageSync('loginInfo').Token || ''
            }
          })
          .then(res => {
            if (res.State == 1) {
              console.log(res)
            }
          }).catch(err => {
            this.msg(err.Msg)
          })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .my_shop_info {
    height: 100%;
    background: #f5f5f5;
    overflow: hidden;
    .shop_info_top {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      padding: 30rpx 0;
      .shop_img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
      }
      .shop_name {
        padding-top: 20rpx;
        color: #666;
        font-size: 24rpx;
      }
    }
    .address {
      margin-top: 20rpx;
      background: #fff;
      display: flex;
      padding: 20rpx;
      align-items: center;
      justify-content: flex-start;
      .icon {
        width: 50rpx;
        height: 50rpx;
        margin-right: 20rpx;
      }
      p {
        font-size: 24rpx;
        color: #666;
        display: -webkit-box !important;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
    .shop_info_list {
      margin-top: 20rpx;
      display: flex;
      padding: 20rpx;
      align-items: center;
      background: #fff;
      .shop_tel,
      .shop_wx {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          width: 50rpx;
          height: 50rpx;
          margin-right: 20rpx;
        }
        p {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    .shop_service,
    .shop_business {
      margin-top: 20rpx;
      background: #fff;
      padding: 20rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .icon {
        width: 50rpx;
        height: 50rpx;
        margin-right: 20rpx;
      }
      p {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
</style>
