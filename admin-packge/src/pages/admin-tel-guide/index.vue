<template>
  <div class="admin_tel_guide">
    <div class="name_item mb20">
      <p>1.填写店铺位置方便骑手取货</p>
    </div>
    <div class="shop_tel" @click="goAddress"><input type="text" placeholder="请选择您的店铺位置" v-model="shopInfo.AddressTitle" disabled="true"/><i class="icon icon_arrowRight"></i></div>
    <div class="shop_tel mb30"><input type="text" placeholder="请补充您店铺的具体地址" v-model="addressInfo" /></div>
    <div class="name_item mb20">
      <p>2.填写您的联系方式方便买家联系</p>
    </div>
    <div class="shop_tel"><input type="number" placeholder="请将您的手机号填写在这里" v-model="tel" maxlength="11" /></div>
    <div class="guide_btn">
      <div class="next_btn" @click="nextBtn">下一步</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        shopInfo: {},
        tel: '',
        addressInfo: ''
      }
    },
    onReady() {
      // this.tel = '';
      // this.addressInfo = '';
    },
    onShow() {
      if (wx.getStorageSync('loginInfo')) {
        this.tel = wx.getStorageSync('loginInfo').Mobile;
      }
      if (wx.getStorageSync('editInfo')) {
        this.shopInfo = wx.getStorageSync('editInfo');
      }
      if (wx.getStorageSync('address')) {
        let address = wx.getStorageSync('address');
        /* 店铺地址信息 */
        this.shopInfo.AddressTitle = address.title;
        this.shopInfo.AddressNote = address.name;
        this.shopInfo.ShopPrivate = address.province;
        this.shopInfo.ShopCity = address.city;
        this.shopInfo.ShopCounty = address.district;
        this.shopInfo.ShopLoc = address.location.lng + ',' + address.location.lat
      }
    },
    methods: {
      nextBtn() {
        console.log(this.shopInfo.AddressTitle)
        this.shopInfo.AddressTitle == '' && this.msg('你还没有选择店铺地址哦');
        if (this.phone(this.tel) && this.shopInfo.AddressTitle != '') {
          this.shopInfo.AddressUserNote = this.addressInfo;
          this.shopInfo.LinkMobile = this.tel;
          wx.setStorageSync('editInfo', this.shopInfo);
          wx.navigateTo({
            url: '/pages/admin-introduction'
          })
        }
      },
      goAddress() {
        wx.navigateTo({
          url: '/pages/select-address'
        })
      },
      phone(tel) {
        let reg = /^[1][3-9]\d{9}$/;
        if (reg.test(tel)) {
          return true;
        } else {
          if (tel != '') {
            this.msg('请输入正确的手机号')
          } else {
            this.msg('请输入手机号')
          }
          return false;
        }
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_tel_guide {
    position: relative;
    height: 100%;
    padding: 32rpx 36rpx 0;
    box-sizing: border-box;
    overflow: hidden;
    .name_item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      p {
        width: 555rpx;
        height: 88rpx;
        line-height: 88rpx;
        font-size: 30rpx;
        color: #656782;
        position: relative;
      }
    }
    .shop_tel,
    .shop_wx,
    .address {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
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
        margin-bottom: 20rpx;
        background-color: #f7f7f7;
      }
      i {
        position: absolute;
        top: 34rpx;
        right: 16rpx;
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
