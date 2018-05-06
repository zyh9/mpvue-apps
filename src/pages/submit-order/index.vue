<template>
  <div class="submit_order">
    <div class="submit_con">
      <div class="con_order_address">
        <div class="options" @click="address">
          <p>请选择收货地址</p>
          <img src="../../../static/userImg.png" alt="">
        </div>
        <div class="options" @click="time">
          <p>配送方式+配送时长</p>
          <img src="../../../static/userImg.png" alt="">
        </div>
      </div>
      <div class="con_order_info">
        <div class="options">
          <img src="../../../static/userImg.png" alt="">
          <p>张姐烤肉拌饭</p>
        </div>
        <ul class="con_order_list">
          <li v-for="(v,i) in 3" :key="i" class="con_list_item">
            <div class="lis_left">
              <img src="../../../static/jp.jpg" alt="">
              <div class="li_info">
                <p>番茄烤肉拌饭</p>
                <p class="price">¥12元</p>
              </div>
            </div>
            <div class="num">X 2</div>
            <div class="sum">24元</div>
          </li>
        </ul>
        <div class="consume">
          <p>配送费</p>
          <p>10元</p>
        </div>
        <div class="consume">
          <p>打包费</p>
          <p>10元</p>
        </div>
        <div class="consume_sum">
          <p>小计：66元</p>
        </div>
      </div>
      <div class="con_order_other">
        <div class="consume">
          <p>支付方式</p>
          <p>微信支付</p>
        </div>
        <div class="consume_note">
          <p>备注</p>
          <input type="text" placeholder="点此可输入备注信息">
        </div>
      </div>
    </div>
    <div class="submit_bottom">
      <p>总价：888元</p>
      <div class="pay">结算</div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      address() {
        wx.navigateTo({
          url: '/pages/my-address/main'
        })
      },
      time() {
        console.log('开发中。。。')
      },
      //价格计算
      priceNum() {
        this.util.post({
            url: '/api/Customer/Order/ComputeGoodsPrice',
            data: {
              "ShopId": 0,
              "Distance": 0,
              "OrderCityName": "string",
              "OrderCountyName": "string",
              "EndAddress": "string",
              "EndAddressNote": "string",
              "EndLocation": "string",
              "CartOrderGoods": [{
                "GoodsId": 0,
                "GoodsNum": 0
              }]
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
      },
      //运费计算
      Freight() {
        this.util.post({
            url: '/api/Customer/Order/ComputeExpressPrice',
            data: {
              "ShopId": 0,
              "Distance": 0,
              "OrderCityName": "string",
              "OrderCountyName": "string",
              "EndAddress": "string",
              "EndAddressNote": "string",
              "EndLocation": "string"
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
      },
      //创建订单
      createOrder() {
        this.util.post({
            url: '/api/Customer/Order/CreateOrder',
            data: {
              "ReceiveAddressId": 0,
              "GoodPriceToken": "string",
              "ExpressPriceToken": "string",
              "Remarks": "string"
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
      },
    },
    components: {}
  }
</script>

<style lang="less">
  .submit_order {
    height: 100%;
    background: #f5f5f5;
    .submit_con {
      height: 100%;
      padding-bottom: 80rpx;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: scroll;
      .con_order_address {
        margin-bottom: 20rpx;
        .options {
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20rpx;
          border-bottom: 1rpx solid #e6e6e6;
          p {
            font-size: 24rpx;
            white-space: nowrap;
            color: #666;
          }
          img {
            width: 50rpx;
            height: 50rpx;
          }
        }
      }
      .con_order_info {
        margin-bottom: 20rpx;
        .options {
          background: #fff;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 20rpx;
          border-bottom: 1rpx solid #e6e6e6;
          img {
            width: 50rpx;
            height: 50rpx;
            margin-right: 20rpx;
          }
          p {
            white-space: nowrap;
            color: #666;
          }
        }
        .con_order_list {
          background: #fff;
          .con_list_item {
            padding: 12rpx 30rpx;
            border-bottom: 1rpx solid #eee;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .lis_left {
              display: flex;
              align-items: center;
              img {
                width: 80rpx;
                height: 80rpx;
                margin-right: 20rpx;
              }
              .li_info {
                p {
                  font-size: 24rpx;
                  color: #666;
                }
                .price {
                  color: #f00;
                }
              }
            }
            .num,
            .sum {
              font-size: 24rpx;
              color: #666;
            }
          }
        }
        .consume {
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20rpx;
          border-bottom: 1rpx solid #e6e6e6;
          p {
            font-size: 24rpx;
            white-space: nowrap;
            color: #666;
          }
        }
        .consume_sum {
          background: #fff;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 20rpx;
          border-bottom: 1rpx solid #e6e6e6;
          p {
            font-size: 30rpx;
            white-space: nowrap;
            color: #666;
          }
        }
      }
      .con_order_other {
        margin-bottom: 20rpx;
        .consume {
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20rpx;
          border-bottom: 1rpx solid #e6e6e6;
          p {
            font-size: 24rpx;
            white-space: nowrap;
            color: #666;
          }
        }
        .consume_note {
          background: #fff;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 20rpx;
          border-bottom: 1rpx solid #e6e6e6;
          p {
            width: 140rpx;
            text-align: left;
            font-size: 24rpx;
            color: #666;
          }
          input {
            font-size: 24rpx;
            color: #666;
            flex-grow: 1;
            text-align: right;
          }
        }
      }
    }
    .submit_bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      background: #ccc;
      height: 80rpx;
      p {
        font-size: 24rpx;
        color: #666;
        margin-left: 20rpx;
        height: 100%;
        flex-grow: 1;
        line-height: 80rpx;
      }
      .pay {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ff8b03;
        font-size: 24rpx;
        color: #fff;
        height: 100%;
        width: 160rpx;
      }
    }
  }
</style>
