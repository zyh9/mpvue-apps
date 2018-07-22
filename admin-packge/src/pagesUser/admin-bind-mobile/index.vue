<template>
  <div class="admin_bind_mobile">
      <div class="wrap">
    <div class="options">
      <p>手机号</p>
      <input type="number" placeholder="请输入您的手机号"  placeholder-class='placeholderStyle' maxlength="11" v-model="tel">
    </div>
    <div class="password">
      <p>验证码</p>
      <input type="number" placeholder="请输入验证码"  placeholder-class='placeholderStyle' v-model="val" maxlength="4">
      <div class="sms_click" @click="sendSms">{{countdownInfo}}</div>
    </div>
    </div>
    <div class="btn" @click="bind">确认绑定</div>
  </div>
</template>

<script>
  import gcoord from 'gcoord';
  export default {
    data() {
      return {
        tel: '',
        val: '',
        countdown: null,
        countdownInfo: '获取验证码',
        countdownTimer: null,
        isSend: true,
      }
    },
    onShow() { //页面渲染就会触发
      clearInterval(this.countdownTimer)
      this.tel = this.val = '';
      this.isSend = true;
      this.countdown = null;
      this.countdownTimer = null;
      this.countdownInfo = '获取验证码';
    },
    methods: {
      //发送验证码
      sendSms() {
        if (this.phone(this.tel)) {
          if (this.isSend) {
            this.isSend = false;
            this.util.post({
              url: '/api/Merchant/VerifyCode/SendSmsCode',
              data: {
                Mobile: this.tel,
                BizType: 4,
                Token: wx.getStorageSync('shopToken'),
              }
            }).then(res => {
              // this.msg(res.Msg)
              this.countdown = 60;
              this.countdownInfo = `${this.countdown}s后重新获取`;
              this.countdownTimer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                  clearInterval(this.countdownTimer)
                  this.countdownInfo = '重新获取';
                  this.isSend = true;
                } else {
                  this.countdownInfo = `${this.countdown}s后重新获取`;
                }
              }, 1000)
            }).catch(err => {
              this.isSend = true;
              this.msg(err.Msg)
            })
          }
        }
      },
      //检测手机号
      phone(tel) {
        let reg = /^[1][3,4,5,6,7,8,9]\d{9}$/;
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
      },
      smsCoding(val) { //短信4位
        let reg = /^\d{4}$/;
        if (reg.test(val)) {
          return true;
        } else {
          if (val != '') {
            this.msg('请输入完整的短信验证码')
          } else {
            this.msg('请输入短信验证码')
          }
          return false;
        }
      },
      bind() {
        let QQmap = wx.getStorageSync('QQmap');
        var result = gcoord.transform(
          [QQmap.longitude, QQmap.latitude], // 经纬度坐标
          gcoord.WGS84, // 当前坐标系
          gcoord.BD09 // 目标坐标系
        );
        if (this.phone(this.tel) && this.smsCoding(this.val)) {
          this.util.post({
            url: '/api/Merchant/VerifyCode/CommitSmsCode',
            data: {
              Mobile: this.tel,
              BizType: 4,
              VerifyCode: this.val,
              Loction: `${result[0]},${result[1]}`,
              CityName: QQmap.city,
              Token: wx.getStorageSync('shopToken'),
              wxUserInfo: ''
            }
          }).then(res => {
            this.msg(res.Msg)
            let shopInfo = Object.assign({}, wx.getStorageSync('shopInfo'), {
              LinkMobile: this.tel
            })
            let loginInfo=wx.getStorageSync('loginInfo');
            loginInfo.Mobile=this.tel;
            wx.setStorageSync('loginInfo',loginInfo)
            wx.setStorageSync('shopInfo', shopInfo)
            this.tel = this.val = '';
            //登录成功清除定时器
            this.timer = null;
            clearInterval(this.countdownTimer)
            wx.removeStorageSync('shopToken');
            wx.navigateBack({
              delta: 2
            })
          }).catch(err => {
            this.msg(err.Msg)
          })
        }
      }
    },
    watch: {
      tel: function(newVal, oldVal) {
        //不是数字的替换为空
        this.tel = newVal.replace(/[^\d]/g, '');
      },
      val: function(newVal, oldVal) {
        this.val = newVal.replace(/[^\d]/g, '');
      },
    },
  }
</script>

<style lang="less">
 page{
        background: #eeeef4;
    }
  .admin_bind_mobile {
    // padding: 0 36rpx;
    box-sizing: border-box;
    // height: 100%;
    // overflow-x: hidden;
    // position: relative;
     .wrap{
        background: #fff;
    }
    .options {
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
       padding: 30rpx 0;
      margin: 0 36rpx;
    //   border-bottom: 1rpx solid #e6e6e6;
     position: relative;
      &:after{
          content: '';
          display: block;
          width: 100%;
          height: 0;
          border-bottom: 1px solid #ebebeb;
          transform: scaleY(0.5);
          transform-origin: 0 0;
          position: absolute;
          bottom: 0;
          left: 0;
      }
      p {
         font-size:28rpx;
        color: #1a1a1a;
        width: 140rpx;
        text-align: left;
        transform: translateY(3rpx);
      }
      input {
        flex: 1;
         font-size: 28rpx;
        color: #1a1a1a;
      }
      .placeholderStyle{
          font-size: 28rpx;
          color:#ccc;
          
      }
    }
    .password {
      background: #fff;
      padding: 30rpx 0;
      margin: 0 36rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      p {
         font-size: 28rpx;
        color: #1a1a1a;
        width: 140rpx;
        text-align: left;
        transform: translateY(3rpx);
      }
      input {
        flex: 1;
         font-size: 28rpx;
        color: #1a1a1a;
        padding-right: 20rpx;
      }
      .placeholderStyle{
          font-size: 28rpx;
          color:#ccc;
          
      }
      .sms_click {
        height: 50rpx;
        line-height: 50rpx;
        font-size: 24rpx;
        color: #3c59ee;
        background: transparent;
        border: 1rpx solid #3c59ee;
        border-radius: 6rpx;
        outline: none;
        white-space: nowrap;
        padding: 0 10rpx;
      }
    }
    .btn {
      background: #4b6df8;
     margin: 56rpx 36rpx 0;
      text-align: center;
      height: 88rpx;
      line-height: 88rpx;
      color: #fff;
      font-size: 30rpx;
    }
  }
</style>
