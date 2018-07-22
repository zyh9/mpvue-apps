<template>
  <div class="admin_auth">
    <img :src="imgInfo" alt="" class="qrcode fade_in" lazy-load="true">
    <i class="info mt30">保存上方二维码</i>
    <i class="info mb50">并使用公众平台绑定的管理员个人微信号扫描</i>
    <div class="save_img" @click="saveImg">
      <i class="icon_down"></i>
      <span>点击保存到相册</span>
    </div>
    <div class="help_tips">
      <div class="icon_tips" @click="isShow=true"></div>
    </div>
    <div class="auth_btn">
      <div class="next_btn" @click="nextClick">下一步</div>
    </div>
    <div class="mask" v-if='isShow' @click='isShow=false'></div>
    <div class="layBox" v-if='isShow'>
      <h2 class="title">帮助小贴士</h2>
      <p>如果您没有小程序或无营业执照申请小程序建议您返回选择平台版店铺</p>
      <div class="set-flex set-between">
        <div class="btn" @click='adminHelp'>我需要帮助</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imgUrl: '',
        imgInfo: '',
        isShow: false
      }
    },
    onShow() {
      this.isShow = false;
      console.log(wx.getStorageSync('loginInfo').ShopID)
      this.codeUrl()
    },
    methods: {
      codeUrl() {
        wx.downloadFile({
          url: `${this.util.baseUrl}/Common/Index?ShopId=${wx.getStorageSync('loginInfo').ShopID}`,
          success: res => {
            // console.log(res.tempFilePath)
            this.imgInfo = `${this.util.baseUrl}/Common/Index?ShopId=${wx.getStorageSync('loginInfo').ShopID}`;
            this.imgUrl = res.tempFilePath;
          },
          fail: err => {
            console.log(err)
          }
        })
      },
      saveImg() {
        wx.saveImageToPhotosAlbum({
          filePath: this.imgUrl,
          success: res => {
            this.msg('已为您保存到系统相册')
          },
          fail: err => {
            this.util.phModel()
          }
        })
      },
      nextClick() {
        console.log(wx.getStorageSync('loginInfo').ShopID + '-----' + wx.getStorageSync('loginInfo').Token, '00000')
        this.util.post({
          url: '/api/Merchant/ShopManage/GetShopPlatSetType',
          data: {
            ShopID: wx.getStorageSync('loginInfo').ShopID || ''
          }
        }).then(res => {
          if (res.Body.ShopPlatType != 0) {
            wx.navigateTo({
              url: '/pages/admin-mask'
            })
          } else {
            this.msg(res.Msg)
          }
        }).catch(err => {
          console.log(err)
          this.msg(err.Msg)
        })
      },
      adminHelp() {
        wx.navigateTo({
          url: '/pages/admin-help'
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_auth {
    height: 100%;
    padding: 120rpx 36rpx 0;
    box-sizing: border-box;
    position: relative;
    .qrcode {
      width: 364rpx;
      height: 364rpx;
      margin: 0 auto;
    }
    .info {
      font-size: 28rpx;
      color: #656782;
      white-space: nowrap;
      text-align: center;
      line-height: 48rpx;
    }
    .mt30 {
      margin-top: 30rpx;
    }
    .mb50 {
      margin-bottom: 50rpx;
    }
    .save_img {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1rpx solid #4b6df8;
      height: 74rpx;
      width: 280rpx;
      margin: 0 auto;
      position: relative;
      margin-top: 40rpx;
      span {
        margin-left: 12rpx;
        line-height: 74rpx;
        color: #4b6df8;
        font-size: 24rpx;
      }
      .save_btn {
        border: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 2;
      }
    }
    .help_tips {
      margin-top: 60rpx;
      display: flex;
      justify-content: flex-end;
    }
    .auth_btn {
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
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);
    z-index: 20;
  }
  .layBox {
    position: absolute;
    top: 350rpx;
    left: 0;
    right: 0;
    padding: 70rpx 30rpx 40rpx;
    margin: 0 90rpx;
    background: #fff;
    border-radius: 10rpx;
    box-sizing: border-box;
    z-index: 30;
    h2.title {
      line-height: 37rpx;
      font-size: 34rpx;
      color: #656782;
      text-align: center;
    }
    p {
      font-size: 28rpx;
      color: #656782;
      line-height: 48rpx;
      padding-top: 50rpx;
    }
    .btn {
      width: 100%;
      height: 80rpx;
      background: #3c59ee;
      line-height: 80rpx;
      font-size: 30rpx;
      color: #fff;
      text-align: center;
      border: 1rpx solid #3c59ee;
      margin-top: 45rpx;
      &.on {
        background: #fff;
        color: #3c59ee;
      }
    }
  }
</style>
