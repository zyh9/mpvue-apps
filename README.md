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

### 距离计算

> 此距离计算是直线距离的计算，目前我只是用作附近地址的距离计算

```javascript
	distance(lat1, lng1, lat2, lng2) {
	    var radLat1 = lat1 * Math.PI / 180.0;
	    var radLat2 = lat2 * Math.PI / 180.0;
	    var a = radLat1 - radLat2;
	    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	    s = s * 6378.137;
	    s = Math.round(s * 10000) / 10000;
	    return s*10
	}
```

> 取小数点后两位

		Math.floor(this.distance(lat1, lng1, lat2, lng2)*100)/100;

###  一个处理地理坐标系的js库

> 安装 and 引入

```javascript
	npm install gcoord --save
	
	<script src="https://unpkg.com/gcoord/dist/gcoord.js"></script>
	
	CommonJS:
	
		const gcoord = require( 'gcoord' );
		const { transform, WGS84, GCJ02 } = require( 'gcoord' );
	
	ES Module:
	
		import gcoord from 'gcoord'
		import { transform, WGS84, GCJ02 } from 'gcoord';
```

> 小例子

```javascript
	var result = gcoord.transform(
	    [ 116.403988, 39.914266 ],    // 经纬度坐标
	    gcoord.WGS84,                 // 当前坐标系
	    gcoord.BD09                   // 目标坐标系
	)
	
	console.log( result );  // [ 116.41661560068297, 39.92196580126834 ]
```

[gcoord github地址](https://github.com/hujiulong/gcoord)

### autoprefixer配置

> npm i autoprefixer -D

> 在文件.postcssrc.js里面添加"autoprefixer":{}

```javascript
	module.exports = {
	  "plugins": {
	    "postcss-mpvue-wxss": {},
	    "autoprefixer":{}
	  }
	}
```

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

### ES7 async/await 使用

> 先看数据请求代码

```javascript
	const baseUrl = 'http://192.168.1.1:8080';
	// const baseUrl = '';
	
	const commonHeader = _ => {
	  //headers每次必传数据存放位置
	  return {
	    // 'LocationX': 0,
	    // 'LocationY': 0,
	  }
	}
	
	//get数据请求
	const get = (opt = {}) => {
	  let time = new Date().getTime();
	  const str = Object.entries(opt.params).map(e => `${e[0]}=${e[1]}`).join("&").replace(/\s/g, '');
	  let editHeaders = Object.assign({}, { 'content-type': 'application/json;charset=utf-8' }, commonHeader())
	  if (opt.headers) {
	    editHeaders = Object.assign({}, editHeaders, opt.headers)
	  }
	  return new Promise((resolve, reject) => {
	    let address = str ? `${opt.url}?${str}&t=${time}` : `${url}?t=${time}`;
	    wx.request({
	      url: baseUrl + address,
	      header: editHeaders,
	      method: "GET",
	      success: res => {
	        setTimeout(_ => {
	          resolve(res.data)
	        }, 0)
	      },
	      fail: err => {
	        reject(err);
	      }
	    })
	  })
	}
	
	//post数据请求
	const post = (opt = {}) => {
	  let time = new Date().getTime();
	  //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	  let editHeaders = Object.assign({}, { 'content-type': 'application/json;charset=utf-8' }, commonHeader())
	  if (opt.headers) {
	    editHeaders = Object.assign({}, editHeaders, opt.headers)
	  }
	  return new Promise((resolve, reject) => {
	    wx.request({
	      url: `${baseUrl}${opt.url}?t=${time}`,
	      data: opt.data || {},
	      header: editHeaders,
	      method: "POST",
	      success: res => {
	        setTimeout(_ => {
	          if (res.data.State == 1) {
	            //返回正常的数据
	            resolve(res.data)
	          } else if (res.data.State == -10) {
	            //针对token失效问题
	            resolve(res.data)
	          } else {
	            //抛出异常
	            reject(res.data)
	          }
	        }, 0)
	      },
	      fail: err => {
	        reject(err)
	      }
	    })
	  })
	}
	
	export default { get, post}
```

```javascript
	// 代码示例
	let shopInfo = async _ =>{
		let data1 = await this.util.post({
			url:'http://XXXXXX',
			headers:{
				token:'222'
			}
			data:{
				demo:'111'
			}
		})
		console.log(data1)
		let data2 = await this.util.post({
			url:'http://XXXXXX',
			headers:{
				token:'222'
			}
			data:{
				demo:'111'
			}
		})
		console.log(data2)
	}
	
	//async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态
	
	//抛出的错误对象会被catch方法回调函数接收到
	
	shopInfo().then(res=>{console.log(res)}).catch(err=>{console.log(err)})
```

### vuex的加入（纯属瞎搞）

```javascript
		
	// 小程序内部是不能手动去刷新页面的，这就为状态管理的实现提供了可能性
	
	// 某些状态不需要长期存储，索性投入vuex的怀抱吧。。。
	
	// 引用数据请求
	import util from './utils/index';
	Vue.prototype.util = util;
	// 引用toast提示
	import msg from './utils/toast';
	Vue.prototype.msg = msg;
	// 引用vuex
	import store from './store/index';
	Vue.prototype.$store = store;
	
	// 发起action => 
	
	this.$store.dispatch('code',{a:1,b:2})
	
	// 获取state数据 =>
	
	this.$store.state.mutations
```

```javascript
	// store/index.js
	import Vue from 'vue';
	import Vuex from 'vuex';
	import mutations from './mutations';
	import actions from './actions';
	Vue.use(Vuex)
	export default new Vuex.Store({
		modules:{
			mutations
		},
		actions
	})
	
	
	// store/types.js
	import keymirror from 'keymirror'
	let types = keymirror({
	    COMMIT_CODE:null,
	})
	export {types};
	
	
	// store/actions.js
	import {types} from './types.js'
	const actions = {
	    code({commit},val){
	        commit(types.COMMIT_CODE,val)
	    },
	}
	export default actions;
	
	
	// store/mutations.js
	import {types} from './types.js'
	// 定义state的值
	const state = {
	    qrcode:null
	}
	// 每个action的提交引发state的改变
	const mutations = {
	    [types.COMMIT_CODE](state,val){
	        state.qrcode = val
	    },
	}
	// 获取到变化的值
	const getters = {
	    qrcode(state){
	        return state.qrcode;
	    }
	}
	// 导出
	export default{
		state,
		mutations,
		getters
	}
```

### 营业时间的数据封装

```javascript
	// 营业时间格式化 示例：'0-140,180-300' => ['00:00-02:20','03:00-05:00']
	// 返回一个数组，使用的时候直接String转化为字符串，做相应操作
	const openTime = str => {
	  const two = n => {
	    return n < 10 ? '0' + n : '' + n;
	  }
	  if (str.indexOf(',') > -1) {
	    return str.split(',').map(e => {
	      let a = two(Math.floor(e.split('-')[0] / 60))
	      let b = two(Math.floor(e.split('-')[0] % 60))
	      let c = two(Math.floor(e.split('-')[1] / 60))
	      let d = two(Math.floor(e.split('-')[1] % 60))
	      return e = `${a}:${b}-${c}:${d}`;
	    })
	  } else {
	    let a = two(Math.floor(str.split('-')[0] / 60))
	    let b = two(Math.floor(str.split('-')[0] % 60))
	    let c = two(Math.floor(str.split('-')[1] / 60))
	    let d = two(Math.floor(str.split('-')[1] % 60))
	    return [`${a}:${b}-${c}:${d}`];
	  }
	}
```

### 小程序拖拽实现（待后续完善）

> transition的加入并没有提升界面交互效果，反倒很不美观，索性去掉它吧。。。

```javascript
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
		      // e.transition = 'top 0.1s linear';
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
		    })
		  },
		},
		components: {}
	}
```

### 小程序左滑删除

```javascript
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
		},
		components: {}
	}
```

### 关于canvas请求网络图片绘制

		canvas图片的绘制可以调用以下方法先获取本地图片路径，再进行canvas绘制
		
		wx.downloadFile(OBJECT)  ||  wx.getImageInfo(OBJECT)
		
		针对多个图片获取地址的解决方法，将上述两个方法用Promise包装一下
		
		再使用async/await来获取所有的图片本地地址，用catch来抛出图片地址获取异常的情况

```javascript
	downImg(url) {
		return new Promise((resolve, reject) => {
		    wx.downloadFile({
		        url: url,
		        success: res => {
		            resolve(res.tempFilePath)
		        },
		        fail: err => {
		            reject(err)
		        }
		    })
		})
	}
```


### 关于v-html

		mpvue官方文档指出：不支持v-html（貌似现在已经支持了）
		
		但使用v-html在小程序会编译为<rich-view></rich-view>
		
		rich-view支持class样式修改，不能根据标签名设置样式
		
		可以使用正则，替换标签，添加类名

> 例如：

```javascript
	<div v-html='rules'></div>
	
	
	this.rules=this.rules.replace(/<dl>/g,'<dl class="dl">')
	.replace(/<dt>/g,'<dt class="dt">')
	.replace(/<dd>/g,'<dd class="dd">')
```

### 早睡早起篇

		早九晚二的生活持续三周左右，感觉自己的身体有些吃不消了，脑子瓦特了
		
		2018.05.17在朕出京城的日子，完全懵逼，感觉像是活在梦里
		
		出门忘带钱包怎么取火车票，到我大河南之后，再次摸兜
		
		我的身份证呢，一时间自己成了黑户，记不得在哪已经丢了
		
		应该是在掏票出站的时候掉了，但唯独朕在京的地铁卡和高铁票在兜里
		
		当时三者是在一起相依相偎的，什么鬼？？？
		
		脑神经的衰弱已经让我整个一天呈现出一种懵逼的状态
		
		我是谁，我在哪，我在干嘛？？？

### 重新开户篇

		继昨日成为黑户之后，担心我的身份遭泄露，朕登上了洗白之路
		
		没想到十几分钟的时间，从拍照到证件挂失补办就完成了
		
		可恶的是在20天之内，我才能有自己真实的身份，这一段时间怎么办呢
		
		洗洗睡吧，明天还不是得撸代码，哈哈哈...
