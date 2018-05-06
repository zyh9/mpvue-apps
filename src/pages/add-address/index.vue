<template>
  <div class="add_address">
    <div class="options">
      <p>收件人</p>
      <input type="text" placeholder="请填写收件人姓名">
    </div>
    <div class="options">
      <p>联系电话</p>
      <input type="text" placeholder="请填写收件人电话" maxlength="11" v-model="tel">
    </div>
    <div class="options">
      <p>收货地址</p>
      <picker mode="region" @change="regionChange" :value="region" :custom-item="customItem" class="citySelect">
        <view class="picker">
          {{region[0]}} {{region[1]}} {{region[2]}}
        </view>
      </picker>
      <img src="../../../static/userImg.png" alt="">
    </div>
    <div class="options">
      <p>详细地址</p>
      <input type="text" placeholder="详细地址，例1号楼2层201室">
    </div>
    <div class="add_btn">添加</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        region: ['点击选择', '', ''],
        customItem: '请选择',
        tel: ''
      }
    },
    mounted() {},
    methods: {
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
      regionChange(e) {
        console.log(e)
        this.region = e.target.value;
        console.log(this.region)
      },
      addAddress() {
        this.util.post({
            url: '/api/Customer/PersonerCenter/UpdateAddress',
            data: {
              "Id": 0,
              "AddressTitle": "string",
              "AddressNote": "string",
              "AddressLoc": "string",
              "UserNote": "string",
              "LinkMan": "string",
              "LinkManMobile": "string",
              "LinkManSex": 0
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
    components: {},
    watch: {
      region: function(newVal, oldVal) {
        let region = newVal.filter(e => e != "请选择")
        region.length < 2 && this.msg('收货地址信息还没填完整哦');
      },
      tel: function(newVal, oldVal) {
        this.tel = newVal.replace(/[^\d]/g, '');
      },
    }
  }
</script>

<style lang="less">
  .add_address {
    height: 100%;
    background: #f5f5f5;
    .options {
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 20rpx;
      border-bottom: 1rpx solid #e6e6e6;
      p {
        font-size: 24rpx;
        color: #333;
        width: 140rpx;
        text-align: left;
        transform: translateY(3rpx);
      }
      input {
        flex-grow: 1;
        font-size: 24rpx;
        color: #666;
      }
      .citySelect {
        flex-grow: 1;
        color: #777;
        font-size: 24rpx;
      }
      img {
        width: 50rpx;
        height: 50rpx;
        margin-left: 20rpx;
      }
    }
    .add_btn {
      background: skyblue;
      margin: 20rpx;
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 8rpx;
      color: #fff;
      font-size: 30rpx;
    }
  }
</style>
