<template>
  <div class="add_address">
    <div class="options">
      <p class="potions_text">收件人</p>
      <input type="text" placeholder="请填写收件人姓名" v-model="name">
    </div>
    <div class="options">
      <p class="potions_text">联系电话</p>
      <input type="text" placeholder="请填写收件人电话" maxlength="11" v-model="tel">
    </div>
    <div class="options">
      <p class="potions_text">收货地址</p>
      <!-- <picker mode="region" @change="regionChange" :value="region" :custom-item="customItem" class="citySelect">
                            <view class="picker">
                              {{region[0]}} {{region[1]}} {{region[2]}}
                            </view>
                          </picker> -->
      <div class="select_address" @click="select">
        <p class="click_select">{{addressTitle}}</p>
        <img src="../../../static/userImg.png" alt="">
      </div>
    </div>
    <div class="options">
      <p class="potions_text">详细地址</p>
      <input type="text" placeholder="详细地址，例1号楼2层201室" v-model="addressNote">
    </div>
    <div class="options">
      <p class="potions_text">备注</p>
      <input type="text" placeholder="请填写备注" v-model="note">
    </div>
    <div class="add_btn" @click="addAddress">添加</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        region: ['点击选择', '', ''],
        customItem: '请选择',
        tel: '',
        name: '',
        note: '',
        userInfo: {},
        address: {}
      }
    },
    onShow() {
      this.userInfo = wx.getStorageSync('userInfo');
      console.log(this.userInfo)
      this.address = wx.getStorageSync('address') || {};
      console.log(this.address)
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
      //检测是否填写收件人姓名
      authName(val) {
        if (val != '') {
          return true;
        } else {
          this.msg('您还没有输入收件人名字哦')
          return false
        };
      },
      //检测收货地址标题
      authTitle(val) {
        if (val != '' && val != '点击选择') {
          return true;
        } else {
          this.msg('您还没有选择收货地址哦')
          return false
        };
      },
      //检测收货地址内容
      authDetails(val) {
        if (val != '') {
          return true;
        } else {
          this.msg('您还没有输入详细地址哦')
          return false
        };
      },
      regionChange(e) {
        console.log(e)
        this.region = e.target.value;
        console.log(this.region)
      },
      select() {
        wx.navigateTo({
          url: '/pages/select-address/main'
        })
      },
      addAddress() {
        if (this.authName(this.name) && this.phone(this.tel) && this.authTitle(this.addressTitle) && this.authDetails(this.addressNote)) {
          this.util.post({
              url: '/api/Customer/PersonerCenter/UpdateAddress',
              data: {
                Id: 0,
                AddressTitle: this.addressTitle,
                AddressNote: this.addressNote,
                AddressLoc: `${this.location.lng},${this.location.lat}`,
                UserNote: this.note,
                LinkMan: this.name,
                LinkManMobile: this.tel,
                LinkManSex: this.userInfo.gender
              },
              headers: {
                appid: '1',
                token: wx.getStorageSync('loginInfo').Token || ''
              }
            })
            .then(res => {
              if (res.State == 1) {
                wx.removeStorageSync('address')
              }
            }).catch(err => {
              this.msg(err.Msg)
            })
        }
      }
    },
    computed: {
      addressTitle: function() {
        return this.address.city ? `${this.address.city} ${this.address.district}` : '点击选择';
      },
      addressNote: function() {
        return this.address.name ? this.address.name : ''
      },
      location:function(){
        return this.address.location? this.address.location:{}
      }
    },
    components: {},
    watch: {
      region: function(newVal, oldVal) {
        let region = newVal.filter(e => e != "请选择")
        region.length < 3 && this.msg('收货地址信息还没填完整哦');
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
      .potions_text {
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
      .select_address {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-grow: 1;
        .click_select {
          flex-grow: 1;
          font-size: 24rpx;
          color: #666;
        }
      }
    }
    .add_btn {
      position: absolute;
      bottom: 20rpx;
      left: 20rpx;
      right: 20rpx;
      background: skyblue;
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 8rpx;
      color: #fff;
      font-size: 30rpx;
    }
  }
</style>
