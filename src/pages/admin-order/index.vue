<template>
  <div class="admin_order">
    <ul class="admin_order_top">
      <li v-for="(v,i) in info" :key="i" :class="{li_select:i==currentTab}" :data-current="i" @click="swichNav">{{v.name}}</li>
    </ul>
    <swiper :current="currentTab" class="swiper-box" duration="300" :style="{height:winHeight+'px'}" @change="bindChange">
      <swiper-item v-for="(v,i) in info" :key="i">
        <scroll-view scroll-y="true" style="height: 100%">
          <ul class="admin_order_list">
            <li class="order_item" v-for="(item,index) in newOrder" :key="index">
              <div class="lis_top">
                <div class="shop_name">
                  <img src="../../../static/userImg.png" alt="" class="icon">
                  <p class="name_info">跑男张师傅</p>
                </div>
                <p class="order_time">2018/05/01 12:12:12</p>
              </div>
              <div class="lis_center">
                <ul class="order_shop_list">
                  <li class="list_lis_info" v-for="(ele,ind) in 3" :key="ind">
                    <p>烤肉拌饭</p>
                    <p>X1</p>
                  </li>
                </ul>
                <div class="order_time_price">
                  <p>订单共支付：15元<span>配送费：5元</span></p>
                </div>
              </div>
              <div class="lis_bottom">
                <p>{{item.text}}</p>
                <ul class="lis_bottom_btn">
                  <li>拒单</li>
                  <li>接单</li>
                </ul>
              </div>
            </li>
          </ul>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        info: [{
            name: '待接单'
          }, {
            name: '待发货'
          }, {
            name: '进行中'
          },
          {
            name: '已完成'
          },
          {
            name: '已取消'
          }
        ],
        orderList: [{
          type: 0,
          text: '待接单订单'
        }, {
          type: 0,
          text: '待接单订单'
        }, {
          type: 1,
          text: '待发货订单'
        }, {
          type: 1,
          text: '待发货订单'
        }, {
          type: 2,
          text: '进行中订单'
        }, {
          type: 2,
          text: '进行中订单'
        }, {
          type: 3,
          text: '已完成订单'
        }, {
          type: 4,
          text: '已取消订单'
        }, ],
        winWidth: 0,
        winHeight: 0,
        // tab切换  
        currentTab: 0,
      }
    },
    onShow() { //页面渲染就会触发
      this.currentTab = 0;
      let history = wx.getStorageSync('history') || [];
      console.log(history)
    },
    mounted() {
      let query = wx.createSelectorQuery();
      query.select('.admin_order_top').boundingClientRect()
      query.exec(res => {
        let height = res[0].height;
        wx.getSystemInfo({
          success: res => {
            // console.log(res)
            this.winWidth = res.windowWidth;
            //减去上方的高度
            this.winHeight = res.windowHeight - height;
          }
        })
      })
    },
    methods: {
      //点击切换
      swichNav(e) {
        // console.log(e)
        if (this.currentTab === e.target.dataset.current) return;
        this.currentTab = e.target.dataset.current;
      },
      //滑动切换
      bindChange(e) {
        // console.log(e)
        this.currentTab = e.target.current
      },
    },
    computed: {
      newOrder: function() {
        console.log(this.currentTab)
        switch (this.currentTab) {
          case 0:
            return this.orderList.filter(e => e.type == 0);
            break;
          case 1:
            return this.orderList.filter(e => e.type == 1);
            break;
          case 2:
            return this.orderList.filter(e => e.type == 2);
            break;
          case 3:
            return this.orderList.filter(e => e.type == 3);
            break;
          case 4:
            return this.orderList.filter(e => e.type == 4);
            break;
        }
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .admin_order {
    height: 100%;
    background: #f5f5f5;
  }
  .admin_order_top {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    li {
      color: #666;
      font-size: 24rpx;
      flex-flow: 1;
      width: 100%;
      text-align: center;
      padding: 16rpx;
    }
    .li_select {
      color: skyblue;
    }
  }
  .admin_order_list {
    overflow: hidden;
    .order_item {
      background: #fff;
      margin-top: 20rpx;
      padding: 20rpx;
      .lis_top {
        padding-bottom: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #e6e6e6;
        .shop_name {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .icon {
            width: 50rpx;
            height: 50rpx;
            margin-right: 20rpx;
          }
          .name_info {
            font-size: 24rpx;
            color: #666;
          }
        }
        .order_time {
          font-size: 24rpx;
          color: #666;
        }
      }
      .lis_center {
        border-bottom: 1rpx solid #e6e6e6;
        .order_shop_list {
          .list_lis_info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            p {
              padding: 12rpx 0;
              font-size: 24rpx;
              color: #666;
            }
          }
        }
        .order_time_price {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          p {
            padding: 12rpx 0;
            font-size: 24rpx;
            color: #666;
          }
        }
      }
      .lis_bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 20rpx;
        p {
          font-size: 24rpx;
          color: #666;
        }
        .lis_bottom_btn {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          li {
            padding: 8rpx 20rpx;
            border: 1rpx solid #2395ff;
            border-radius: 6rpx;
            background: #fff;
            font-size: 24rpx;
            color: #2395ff;
            margin-left: 20rpx;
          }
        }
      }
    }
    .order_item:nth-last-of-type(1) {
      margin-bottom: 20rpx;
    }
  }
</style>
