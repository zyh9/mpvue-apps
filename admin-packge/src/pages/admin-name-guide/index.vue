<template>
  <div class="admin_name_guide">
    <div class="name_item mb20">
      <p>1.您的店铺叫什么名字呢？</p>
    </div>
    <div class="shop_name mb40"><input type="text" placeholder="请输入店铺名称15字以下" v-model="name" maxlength="15" /></div>
    <div class="name_item">
      <p>2.您的开的店是做什么的？</p>
    </div>
    <div class="checked">
      <div class="list_checked">
        <div v-for="(v,i) in info" :key="i" class="item" @click="checked(i)" :data-v="v"><i class="icon icon_adminCheck" :class="{icon_adminChecked:v.checked}"></i>
          <p>{{v.text}}</p>
        </div>
      </div>
    </div>
    <div class="guide_btn">
      <div class="next_btn" @click="nextBtn">下一步</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        info: [{
            text: '做餐饮的',
            checked: true
          },
          {
            text: '不是做餐饮的',
            checked: false
          },
        ],
        checkedLi: 0,
        name: '',
        shopInfo: {
          // 店铺名字
          ShopName: '',
          // 店铺Logo
          ShopLogo: '',
          // 营业时间
          OpenTime: '',
          // 店铺类型
          BusinessType: '',
          //店铺省
          ShopPrivate: '',
          // 店铺市
          ShopCity: '',
          //店铺区县
          ShopCounty: '',
          //店铺地址标题
          AddressTitle: '',
          // 店铺详细地址
          AddressNote: '',
          // 店铺地址用户备注
          AddressUserNote: '',
          // 店铺坐标(x,y)
          ShopLoc: '',
          // 备餐时间（单位：分钟）,创建时默认填入0
          PrepareMinute: 0,
          // 店铺简介
          ShopSummary: '',
          // 联系电话
          LinkMobile: '',
          // 联系人微信
          LinkWechat: '',
        },
      }
    },
    onReady() {
      // this.checkedLi = 0;
      // this.name = '';
    },
    methods: {
      nextBtn() {
        if (this.nameAuth()) {
          this.shopInfo.ShopName = this.name;
          this.shopInfo.BusinessType = this.checkedLi + 1;
          wx.setStorageSync('editInfo', this.shopInfo);
          wx.navigateTo({
            url: '/pages/admin-tel-guide'
          })
        }
      },
      checked(index) {
        this.info.forEach(e => {
          e.checked = false;
        })
        this.info[index].checked = true;
        this.checkedLi = index;
        console.log(this.checkedLi)
      },
      nameAuth() {
        if (this.name == '') {
          this.msg('您还没有输入店铺名字哦')
          return false;
        } else return true;
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_name_guide {
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
    .mb20 {
      margin-bottom: 20rpx;
    }
    .mb40{
      margin-bottom: 40rpx;
    }
    .shop_name {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background-color: #f7f7f7;
      input {
        height: 88rpx;
        width: 100%;
        font-size: 28rpx;
        padding-left: 30rpx;
        box-sizing: border-box;
      }
    }
    .checked {
      height: 88rpx;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .list_checked {
        width: 100%;
        padding-left: 30rpx;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .item {
          display: flex;
          align-items: center;
          margin-right: 80rpx;
          .icon_adminCheck,
          .icon_adminChecked {
            width: 24rpx;
            height: 24rpx;
            margin-right: 12rpx;
          }
          p {
            font-size: 28rpx;
            color: #656782;
          }
        }
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
  }
</style>
