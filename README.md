## mpvue 踩坑之旅

### 定位

		引入腾讯的微信小程序JavaScript SDK
		
		因为微信小程序wx.getLocation API 返回的是地理位置坐标
		
		所以要用到地址逆解析，然后就是一顿复制
		
		var QQMapWX = require('xxx/qqmap-wx.js')...
		
		然后就出问题了，貌似SDK最后的代码是这样导出的module.exports = QQMapWX;
		
		改为export default QQMapWX; 引入改为import QQMapWX from 'XXX/qqmap-wx-jssdk.js'; 即可
		
		百度的微信小程序JavaScript SDK和其类似，故此不再赘述

[腾讯 微信小程序 SDK](http://lbs.qq.com/qqmap_wx_jssdk/index.html)

[百度 微信小程序 SDK](https://github.com/baidumapapi/wxapp-jsapi)

### 小程序之一键回到顶部和获取滚动条当前位置

> 1.获取滚动条当前位置

```javascript
	onPageScroll(e){ // 获取滚动条当前位置
		console.log(e)
	}
```
> 2.回到顶部

```javascript
	goTop: function (e) {  // 一键回到顶部
		if (wx.pageScrollTo) {
			wx.pageScrollTo({
				scrollTop: 0
			})
		} else {
			wx.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
	}
```

### 小程序拖拽实现

```javascript
	<template>
	  <div class="store_deploy">
	    <ul class="deploy_list" :style="{height:(liHeight*deployList.length)+'px'}">
	      <li v-for="(v,i) in deployList" :key="i" class="deploy_item" 
	      :style="{top:(v.top)+'px',zIndex:v.zIndex,transition:v.transition}">
	        <div class="item_left"> <img src="XXX/test.png" alt="">
	          <p>{{v.text}}</p>
	        </div>
	        <div class="move" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :data-item="v">
	          <img src="XXX/test.png" alt="">
	        </div>
	      </li>
	    </ul>
	    <p class="deploy_tips">可拖拽调整分类顺序<br/>最多设置8个分类哟</p>
	    <div class="templet_bottom">
	      <p>保存</p>
	    </div>
	  </div>
	</template>
	
	<script>
	  export default {
	    data() {
	      return {
	        deployList: [{
	            text: '配置1'
	          },
	          {
	            text: '配置2'
	          }, {
	            text: '配置3'
	          }, {
	            text: '配置4'
	          }, {
	            text: '配置5'
	          }, {
	            text: '配置6'
	          }, {
	            text: '配置7'
	          },
	          {
	            text: '配置8'
	          }
	        ],
	        sPageY: 0, //初始坐标
	        mPageY: 0, //移动坐标
	        cIndex: -1, //点击索引
	        mObj: {}, //移动数据
	        liHeight: 0, //单个配置的高度
	      }
	    },
	    onShow() {},
	    mounted() {
	      let query = wx.createSelectorQuery();
	      query.select('.deploy_item').boundingClientRect()
	      query.exec(res => {
	        this.liHeight = res[0].height;
	        // console.log(this.liHeight)
	        this.deployList.forEach((e, i) => {
	          e.top = i * this.liHeight;
	          e.zIndex = 5;
	          e.transition = '0.1s';
	        })
	        // console.log(this.deployList)
	      })
	    },
	    methods: {
	      touchS(e) {
	        let {
	          item
	        } = e.currentTarget.dataset;
	        //获取点击的元素在整个列表中的索引
	        this.cIndex = this.deployList.findIndex(e => e.text == item.text)
	        this.mPageY = this.sPageY = Number(e.touches[0].pageY);
	        this.mObj = this.deployList[this.cIndex];
	        // console.log(item, this.cIndex, this.sPageY, this.mObj)
	      },
	      touchM(e) {
	        this.mPageY = Number(e.touches[0].pageY);
	        this.deployList[this.cIndex].top = this.mPageY;
	        this.deployList[this.cIndex].zIndex = 10;
	        // console.log(this.mPageY)
	      },
	      touchE(e) {
	        //获取结束点的坐标
	        let pageY = Number(e.mp.changedTouches[0].pageY);
	        // console.log(pageY, this.sPageY)
	        let pos = null;
	        if (pageY > this.sPageY && (pageY - this.sPageY) > parseInt(this.liHeight / 2)) {
	          //向下拖拽
	          pos = Math.round((pageY - this.sPageY) / this.liHeight) + this.cIndex;
	        } else if (pageY < this.sPageY && (this.sPageY - pageY) > parseInt(this.liHeight / 2)) {
	          //向上拖拽
	          pos = this.cIndex - Math.round((this.sPageY - pageY) / this.liHeight) + 1;
	        } else {
	          //停留原地
	          pos = this.cIndex;
	        }
	        console.log(pos)
	        // this.deployList[this.cIndex].top = this.liHeight*pos;
	        this.deployList.splice(this.cIndex, 1);
	        this.deployList.splice(pos, 0, this.mObj);
	        // console.log(this.deployList)
	        this.deployList.forEach((e, i) => {
	          e.top = i * this.liHeight;
	          e.zIndex = 5;
	          e.transition = '0.1s';
	        })
	      },
	    },
	    components: {}
	  }
	</script>
	
	<style lang="less">
	  .admin_store_deploy {
	    height: 100%;
	    background: #f5f5f5;
	    position: relative;
	    .deploy_list {
	      position: relative;
	      li {
	        width: 100%;
	        box-sizing: border-box;
	        display: flex;
	        align-items: center;
	        justify-content: space-between;
	        padding: 20rpx;
	        border-bottom: 1rpx solid #e6e6e6;
	        position: absolute;
	        left: 0;
	        background: #fff;
	        .item_left {
	          flex-grow: 1;
	          display: flex;
	          align-items: center;
	          justify-content: flex-start;
	          img {
	            width: 80rpx;
	            height: 80rpx;
	          }
	          p {
	            margin-left: 30rpx;
	            text-align: center;
	            font-size: 26rpx;
	            color: #666;
	          }
	        }
	        .move {
	          img {
	            width: 80rpx;
	            height: 80rpx;
	          }
	        }
	      }
	    }
	    .deploy_tips {
	      text-align: center;
	      font-size: 26rpx;
	      color: #666;
	      margin-top: 20rpx;
	    }
	    .templet_bottom {
	      position: fixed;
	      bottom: 20rpx;
	      left: 0;
	      right: 0;
	      p {
	        width: 80%;
	        background: skyblue;
	        margin: 0 auto;
	        text-align: center;
	        height: 80rpx;
	        line-height: 80rpx;
	        border-radius: 8rpx;
	        color: #fff;
	        font-size: 30rpx;
	      }
	    }
	  }
	</style>
```

### 小程序左滑删除

```javascript
	<template>
	  <div class="cart">
	    <ul class="cart_details">
	      <li v-for="(v,i) in cartList" :key="i" class="cart_list-item" @touchstart="touchS" 
	      @touchmove="touchM" @touchend="touchE" :data-index="i" :style="{marginLeft:v.leftVal}">
	        <img :src="v.img" alt="">
	        <div class="li_info">
	          <p>{{v.text}}</p>
	          <p>月售100单</p>
	          <div class="li_b">
	            <p class="price">¥{{v.price}}</p>
	            <div class="count">
	              <i class="lower" @click="lowerCart" :data-info="v" v-if="v.num>0">-</i>
	              <span v-if="v.num>0">{{v.num}}</span>
	              <i class="add" @click="addCart" :data-info="v">+</i>
	            </div>
	          </div>
	        </div>
	        <div class="list_item_del" :style="{right:-delBtnWidth+'px',width:delBtnWidth+'px'}" 
	        @click="delShop" :data-item="v">删除</div>
	      </li>
	    </ul>
	    <div class="cart_bottom">
	      <p>总价：{{count}}元</p>
	      <div class="lis_bottom_btn">结算</div>
	    </div>
	  </div>
	</template>
	
	<script>
	  export default {
	    data() {
	      return {
	        cartList: [],
	        startX: 0,
	        delBtnWidth: 60,
	        leftMove: 0
	      }
	    },
	    onShow() { //页面渲染就会触发
	      let history = wx.getStorageSync('history') || [];
	      this.cartList = history;
	      this.cartList.forEach(e => {
	        e.left = 0;
	      })
	      console.log(this.cartList)
	    },
	    mounted() {},
	    methods: {
	      touchS(e) {
	        if (e.touches.length == 1) {
	          this.startX = e.touches[0].clientX;
	        }
	      },
	      touchM(e) {
	        let index = e.currentTarget.dataset.index;
	        if (e.touches.length == 1) {
	          //手指滑动开始的位置记录
	          let moveX = e.touches[0].clientX;
	          let disX = this.startX - moveX;
	          let left = 0;
	          if (disX == 0 || disX < 0) { //如果移动距离小于等于0，位置不变
	            left = "0px";
	          } else if (disX > 0) { //移动距离大于0，left值等于手指移动距离
	            left = "-" + disX + "px";
	            if (disX >= this.delBtnWidth) {
	              left = "-" + this.delBtnWidth + "px";
	            }
	          }
	          // console.log(left)
	          if (index != "" && index != null) {
	            this.cartList[index].leftVal = left;
	          }
	        }
	      },
	      touchE(e) {
	        let index = e.currentTarget.dataset.index;
	        if (e.mp.changedTouches.length == 1) {
	          //手指抬起的位置
	          let endX = e.mp.changedTouches[0].clientX;
	          let disX = this.startX - endX;
	          let left = 0;
	          //如果距离小于删除按钮的1/2，不显示删除按钮
	          left = disX > this.delBtnWidth / 2 ? "-" + this.delBtnWidth + "px" : "0px";
	          if (index !== "" && index != null) {
	            this.cartList[index].leftVal = left;
	          }
	        }
	      },
	      delShop(e) {
	        let {
	          item
	        } = e.currentTarget.dataset;
	        console.log(item)
	        this.cartList = this.cartList.filter(ele => ele.shopId != item.shopId)
	        wx.setStorageSync('history', this.cartList)
	      },
	      lowerCart(e) {
	        let {
	          info
	        } = e.target.dataset;
	        this.cartList.forEach(ele => {
	          if (ele.shopId == info.shopId) {
	            ele.num--;
	          }
	        })
	        //针对num等于0的数据仍保留做清空处理
	        this.cartList && (this.cartList = this.cartList.filter(e => e.num != 0));
	        wx.setStorageSync('history', this.cartList)
	      },
	      addCart(e) {
	        let {
	          info
	        } = e.target.dataset;
	        this.cartList.forEach(ele => {
	          if (ele.shopId == info.shopId) {
	            ele.num++;
	          }
	        })
	        wx.setStorageSync('history', this.cartList)
	      },
	    },
	    computed: {
	      count: function() {
	        let n = 0;
	        this.cartList.forEach(e => {
	          if (e.num > 0) {
	            n += e.price * e.num;
	          }
	        })
	        return this.cartList.length ? n : 0;
	      }
	    },
	    components: {}
	  }
	</script>
	
	<style lang="less">
	  .cart {
	    height: 100%;
	    background: #f5f5f5;
	    overflow: hidden;
	  }
	  .cart_details {
	    height: 100%;
	    padding-bottom: 80rpx;
	    box-sizing: border-box;
	    overflow-x: hidden;
	    overflow-y: scroll;
	  }
	  .cart_list-item {
	    padding: 16rpx;
	    border-bottom: 1rpx solid #eee;
	    display: flex;
	    align-items: center;
	    transition: margin-left 0.6s ease;
	    width: 100%;
	    box-sizing: border-box;
	    position: relative;
	    img {
	      width: 120rpx;
	      height: 120rpx;
	      margin-right: 20rpx;
	    }
	    .li_info {
	      flex-grow: 1;
	      p {
	        color: #666;
	        font-size: 26rpx;
	      }
	      .li_b {
	        display: flex;
	        align-items: center;
	        justify-content: space-between;
	        .price {
	          color: #f00;
	        }
	        .count {
	          display: flex;
	          align-items: center;
	          .lower,
	          .add {
	            width: 30rpx;
	            height: 30rpx;
	            border-radius: 50%;
	            background: #2395ff;
	            color: #fff;
	            line-height: 30rpx;
	            text-align: center;
	            font-size: 24rpx;
	          }
	          span {
	            margin: 0 16rpx;
	            font-size: 24rpx;
	          }
	        }
	      }
	    }
	    .list_item_del {
	      position: absolute;
	      top: 0;
	      bottom: 0;
	      display: flex;
	      align-items: center;
	      justify-content: center;
	      color: #fff;
	      background: #ff8b03;
	      font-size: 24rpx;
	    }
	  }
	  .cart_bottom {
	    height: 80rpx;
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
	    .lis_bottom_btn {
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
	</style>
```
