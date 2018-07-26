<template>
  <div class="add_address">
    <div class="pageTitle">{{title}}</div>
    <div class="options">
      <p class="potions_text"><i class="icon icon_recName"></i></p>
      <input type="text" maxlength="6" placeholder-class='placeholderStyle' placeholder="请填写收件人姓名" v-model="address.LinkMan">
    </div>
    <div class="options">
      <p class="potions_text"><i class="icon icon_recTel"></i></p>
      <input type="number" placeholder="请填写收件人电话" placeholder-class='placeholderStyle' maxlength="11" v-model="address.LinkManMobile">
    </div>
    <div class="options other">
      <p class="potions_text"><i class="icon icon_recAddress"></i></p>
      <div class="select_address set-flex set-grow set-align  set-between" @click="select">
        <div class=" left set-grow">
          <p class="click_select">{{addressTitle}}</p>
          <p class="addressDetail">{{addressNote}}</p>
        </div>
        <i class="icon icon_arrowRight"></i>
      </div>
    </div>
    <div class="options other itemBor">
      <p class="potions_text"><i class="icon"></i></p>
      <input type="text" placeholder-class='placeholderStyle' maxlength="24" placeholder="详细地址，例1号楼2层201室" v-model="note">
    </div>
    <div class="add_btn" @click="addAddress">保存</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        region: ['点击选择', '', ''],
        customItem: '请选择',
        note: '',
        userInfo: {},
        address: {
          LinkMan: '',
          LinkManMobile: ''
        },
        title: '',
        saveOnoff: true
      }
    },
    onShow() {
      this.saveOnoff = true;
      this.note = '';
      this.userInfo = wx.getStorageSync('userInfo');
      this.address = wx.getStorageSync('address') || {};
      this.note = this.address.UserNote;
      this.title = this.$root.$mp.query.type == 1 ? '新增地址' : '修改地址';
    },
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
        if (val) {
          return true;
        } else {
          this.msg('您还没有输入收件人名字哦')
          return false
        };
      },
      //检测收货地址标题
      authTitle(val) {
        if (val != '' && val != '选择收货地址') {
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
        this.region = e.target.value;
      },
      select() {
        wx.setStorageSync('address', Object.assign({}, this.address, {
          UserNote: this.note
        }));
        wx.navigateTo({
          url: '/pages/select-address/main'
        })
      },
      addAddress() {
        if (this.authName(this.address.LinkMan) && this.phone(this.address.LinkManMobile) && this.authTitle(this.addressTitle) && this.authDetails(this.addressNote)) {
          
          if (this.saveOnoff) {
            this.saveOnoff = false;
            this.util.post({
                url: '/api/Customer/PersonerCenter/UpdateAddress',
                data: {
                  Id: this.$root.$mp.query.addressId || 0,
                  AddressTitle: this.addressTitle,
                  AddressNote: this.addressNote,
                  AddressLoc: `${this.location.lng},${this.location.lat}`,
                  UserNote: this.note ? this.note : '',
                  LinkMan: this.address.LinkMan,
                  LinkManMobile: this.address.LinkManMobile,
                  LinkManSex: this.userInfo.gender,
                  CityName: this.address.city || this.address.CityName,
                  CountyName: this.address.district || this.address.CountyName,
                  Type: 1
                }
              })
              .then(res => {
                if (res.State == 1) {
                  this.saveOnoff = true;
                  wx.removeStorageSync('address');
                  if (this.$root.$mp.query.type == 2) {
                    let selectAddress = wx.getStorageSync('selectAddress');
                    let select = Object.assign({}, selectAddress, {
                      Id: this.$root.$mp.query.addressId || 0,
                      AddressTitle: this.addressTitle,
                      AddressNote: this.addressNote,
                      AddressLoc: `${this.location.lng},${this.location.lat}`,
                      UserNote: this.note ? this.note : '',
                      LinkMan: this.address.LinkMan,
                      LinkManMobile: this.address.LinkManMobile,
                      LinkManSex: this.userInfo.gender,
                      CityName: this.address.city || this.address.CityName,
                      CountyName: this.address.district || this.address.CountyName,
                      Type: 1
                    })
                    wx.setStorageSync('selectAddress', select)
                  }
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }).catch(err => {
                this.saveOnoff = true;
                this.msg(err.Msg)
              })
          }
        }
      }
    },
    computed: {
      addressTitle: function() {
        return this.address.title ? this.address.title : '选择收货地址';
      },
      addressNote: function() {
        return this.address.name ? this.address.name : '';
      },
      location: function() {
        return this.address.location ? this.address.location : {}
      }
    },
    components: {},
    watch: {
      region: function(newVal, oldVal) {
        let region = newVal.filter(e => e != "请选择")
        region.length < 3 && this.msg('收货地址信息还没填完整哦');
      },
      tel: function(newVal, oldVal) {
        this.address.LinkManMobile = newVal.replace(/[^\d]/g, '');
      },
    }
  }
</script>

<style lang="less">
  .add_address {
    height: 100%;
    background: #fff;
    padding: 0 36rpx;
    .options {
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      min-height: 120rpx;
      padding: 20rpx 0;
      position: relative;
      box-sizing: border-box;
      &:after {
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
      &.other {
        overflow: hidden;
        &:after {
          left: 60rpx;
        }
      }
      &.itemBor {
        overflow: hidden;
        &::after {
          left: 52rpx;
        }
      }
      .potions_text {
        font-size: 24rpx;
        color: #333;
        text-align: left;
        transform: translateY(3rpx);
        .icon {
          margin-right: 15rpx;
        }
      }
      input {
        flex: 1;
        font-size: 28rpx;
        color: #1a1a1a;
      }
      .placeholderStyle {
        color: #999999;
      }
      .citySelect {
        flex: 1;
        color: #777;
        font-size: 24rpx;
      }
      img {
        width: 50rpx;
        height: 50rpx;
        margin-left: 20rpx;
      }
      .select_address {
        .left {
          padding-right: 20rpx;
          max-width: 570rpx;
        }
        .click_select {
          font-size: 28rpx;
          color: #1a1a1a;
          line-height: 34rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 570rpx;
        }
        .addressDetail {
          font-size: 24rpx;
          color: #999;
          line-height: 32rpx;
          height: auto;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 570rpx;
        }
      }
    }
    .add_btn {
      background: #333;
      text-align: center;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 6rpx;
      color: #fff;
      font-size: 30rpx;
      margin-top: 74rpx;
    }
  }
</style>
