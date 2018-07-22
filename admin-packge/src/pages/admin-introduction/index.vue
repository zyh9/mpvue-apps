<template>
  <div class="admin_introduction">
    <div class="info_item mb20">
      <p class="title">1.需要您门头照或商标</p>
    </div>
    <div class="upload mb30">
      <div class="con_img">
        <img @click="upload" :src="shopImg?shopImg:'https://otherfiles-ali.uupt.com/Stunner/FE/M/1978b6eeed3e4ba6bb9eafa2568fcf8b_big.png'" alt="">
        <p>点此上传您的门头或商标<br/>让买家认识您</p>
      </div>
    </div>
    <div class="info_item mb20">
      <p class="title">2.简单介绍下您的店铺</p>
    </div>
    <div class="shop_details"><input type="text" placeholder="请将介绍填写在这里，不超过24个字" v-model="shopDetails" maxlength="24" /></div>
    <div class="guide_btn">
      <div class="next_btn" @click="cerateShop">创建店铺</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        shopImg: '',
        shopDetails: '',
        shopInfo: {},
      }
    },
    onReady() {
      // this.shopImg = '';
      // this.shopDetails = '';
    },
    onShow() {
      if (wx.getStorageSync('editInfo')) {
        this.shopInfo = wx.getStorageSync('editInfo');
      }
      if (wx.getStorageSync('cutImgShop')) {
        this.shopImg = wx.getStorageSync('cutImgShop');
      }
    },
    methods: {
      next() {},
      upload() {
        wx.navigateTo({
          url: '/pages/upload-shop-img?type=Shop'
        })
      },
      cerateShop() {
        if (this.shopImg.indexOf('http') > -1) {
          this.shopInfo.ShopSummary = this.shopDetails;
          this.shopInfo.ShopLogo = this.shopImg;
          wx.setStorageSync('editInfo', this.shopInfo);
          this.util.post({
            url: '/api/Merchant/ShopManage/CreateShop',
            data: this.shopInfo
          }).then(res => {
            if (res.State == 1) {
              let loginInfo = wx.getStorageSync('loginInfo');
              loginInfo.ShopID = res.Body.ShopID;
              wx.setStorageSync('loginInfo', loginInfo);
              wx.setStorageSync('shopInfo', this.shopInfo);
              this.msg('创建成功');
              wx.removeStorageSync('editInfo');
              wx.removeStorageSync('cutImgShop');
              setTimeout(_ => {
                wx.redirectTo({
                  url: '/pages/admin-select-plat'
                })
              }, 300)
            }
          }).catch(err => {
            this.msg(err.Msg)
          })
        } else this.msg('您还没有上传店铺logo哦')
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_introduction {
    position: relative;
    height: 100%;
    padding: 32rpx 36rpx 0;
    box-sizing: border-box;
    overflow: hidden;
    .info_item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .title {
        width: 555rpx;
        height: 88rpx;
        line-height: 88rpx;
        font-size: 30rpx;
        color: #656782;
        position: relative;
      }
    }
    .upload {
      padding: 20rpx 0;
      display: flex;
      justify-content: flex-end;
      .con_img {
        width: 100%;
        padding-left: 30rpx;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      img {
        width: 160rpx;
        height: 160rpx;
        border-radius: 80rpx;
      }
      p{
        padding-left: 38rpx;
        font-size: 28rpx;
        color: #999;
      }
    }
    .shop_details {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      background-color: #f7f7f7;
      input {
        width: 100%;
        padding-left: 30rpx;
        box-sizing: border-box;
        height: 88rpx;
        font-size: 28rpx;
        padding-right: 32rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 5rpx;
      }
    }
    .guide_btn {
      position: absolute;
      width: 100%;
      height: 118rpx;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        border-top: 1px solid #ebebeb;
        position: absolute;
        left: 0;
        top: 0;
        transform: scaleY(0.5);
        transform-origin: 0 0;
      }
      .next_btn {
        position: absolute;
        left: 36rpx;
        right: 36rpx;
        height: 88rpx;
        background: #3c59ee;
        color: #fff;
        font-size: 30rpx;
        line-height: 88rpx;
        text-align: center;
      }
    }
    .mb20 {
      margin-bottom: 20rpx;
    }
    .mb30{
      margin-bottom: 30rpx;
    }
  }
</style>
