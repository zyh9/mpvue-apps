<template>
  <div class="my_address">
    <ul class="my_address_list">
      <li v-for="(v,i) in 12" :key="i">
        <div class="address_item_left">
          <img src="../../../static/userImg.png" alt="" class="checked">
          <div class="address_item_info">
            <p class="pos">将府家园北里112号楼 1101室</p>
            <p class="name">高先生 13333333333</p>
            <p class="local_address">本地地址</p>
          </div>
        </div>
        <img src="../../../static/userImg.png" alt="" class="edit">
      </li>
    </ul>
    <div class="address_bottom">
      <p @click="synchronize">同步UU跑腿地址</p>
      <p @click="addAddress">添加新地址</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    mounted() {
      this.addressInfo()
    },
    methods: {
      addAddress() {
        wx.navigateTo({
          url: '/pages/add-address/main'
        })
      },
      //获取所有地址
      addressInfo() {
        this.util.post({
          url: '/api/Customer/PersonerCenter/Addresses',
          data: {},
          headers: {
            appid: '1',
            token: wx.getStorageSync('loginInfo').Token || ''
          }
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      },
      //同步UU跑腿地址
      synchronize() {
        this.util.post({
          url: '/api/Customer/PersonerCenter/PaotuiAddresses',
          data: {},
          headers: {
            appid: '1',
            token: wx.getStorageSync('loginInfo').Token || ''
          }
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      },
      delAddress(){
        this.util.post({
          url: '/api/Customer/PersonerCenter/DeleteAddress',
          data: {
            "AddressId": 0
          },
          headers: {
            appid: '1',
            token: wx.getStorageSync('loginInfo').Token || ''
          }
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .my_address {
    position: relative;
    height: 100%;
    .my_address_list {
      height: 100%;
      padding-bottom: 80rpx;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: scroll;
      li {
        border-bottom: 1rpx solid #e6e6e6;
        padding: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .address_item_left {
          display: flex;
          flex-grow: 1;
          justify-content: flex-start;
          .address_item_info {
            flex-grow: 1;
            .pos {
              font-size: 30rpx;
            }
            .name {
              color: #666;
              font-size: 24rpx;
            }
            .local_address {
              color: #666;
              font-size: 24rpx;
            }
          }
        }
        img {
          width: 80rpx;
          height: 80rpx;
        }
        .checked {
          margin-right: 30rpx;
        }
      }
      li:nth-last-of-type(1) {
        border-bottom: none;
      }
    }
    .address_bottom {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      p {
        height: 100%;
        width: 50%;
        background: #ccc;
        text-align: center;
        line-height: 80rpx;
        font-size: 24rpx;
      }
      p:nth-of-type(1) {
        border-right: 1rpx solid #fff;
        box-sizing: border-box;
      }
    }
  }
</style>
