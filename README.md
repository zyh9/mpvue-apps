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

[高德 微信小程序 SDK](http://lbs.amap.com/api/wx/summary)

### 距离计算

```javascript
	distance(lat1, lng1, lat2, lng2) {
	    var radLat1 = lat1 * Math.PI / 180.0;
	    var radLat2 = lat2 * Math.PI / 180.0;
	    var a = radLat1 - radLat2;
	    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	    s = s * 6378.137;
	    s = Math.round(s * 10000) / 10000;
	    return s;
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
	import QQMapWX from './qqmap-wx-jssdk.js';
	const QQMap = new QQMapWX({
		key: 'BZMBZ-OKXRU-DINVZ-2SRN5-4KWJ7-S6B6O'
	})

	//数据请求地址
	const baseUrl = 'localhost:8080';

	const commonHeader = _ => {
		//headers每次必传数据存放位置
		return {
			// appid: '暂无'
		}
	}

	//get数据请求
	const get = (opt = {}) => {
		let time = new Date().getTime();
		const str = Object.entries(opt.params).map(e => `${e[0]}=${e[1]}`).join("&").replace(/\s/g, '');
		let editHeaders = Object.assign({}, { 'content-type': 'application/json' }, commonHeader())
		opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
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
		let editHeaders = Object.assign({}, { 'content-type': 'application/json' }, commonHeader())
		opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
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
							//调用wxLogin接口
							wxLogin()
							resolve(res.data)
						} else if (res.data.State == -1010) {
							//地址同步
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

	//地理位置获取
	const qqMapInfo = _ => {
		return new Promise((resolve, reject) => {
			wx.getLocation({
				type: 'wgs84',
				success: res => {
					QQMap.reverseGeocoder({
						location: {
							latitude: res.latitude,
							longitude: res.longitude
						},
						success: ok => {
							//城市 经纬度
							let pos = {
								city: ok.result.address_component.city,
								latitude: res.latitude,
								longitude: res.longitude
							}
							wx.setStorageSync('QQmap', pos)
							//调用wxLogin接口
							wxLogin().then(res => {
								resolve(res)
							}).catch(err => {
								reject(err)
							})
						},
						fail: err => {
							reject(err)
						}
					})
				},
				fail: err => {
					console.log(err)
				}
			})
		})
	}

	//全局wxLogin token获取
	const wxLogin = _ => {
		// 调用登录接口
		return new Promise((resolve, reject) => {
			wx.login({
				success: res => {
					userLogin(res.code).then(res => {
						if (res.State == 1) {
							resolve(res)
							wx.setStorageSync('loginInfo', res.Body)
						} else if (res.State == -10) {
							wxLogin()
						}
					}).catch(err => {
						reject(err)
					})
				},
				fail: err => {
					console.log(err)
				}
			})
		})
	}
	const userLogin = async code => {
		return await post({
			url: 'WxJsCodeLogin',
			data: {
				jsCode: code,
			},
			headers: {
				appid: '1',
				qrcode: ''
			}
		})
	}

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

	export default { get, post, openTime, qqMapInfo };

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

> 示例代码

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

		网络图片的绘制在真机实测的时候是不会显示的，可以调用以下方法先获取本地图片路径，再进行canvas绘制
		
		wx.downloadFile(OBJECT)  ||  wx.getImageInfo(OBJECT)
		
		针对多个图片获取地址的解决方法，将上述两个方法用Promise包装一下
		
		再使用async/await来获取所有的图片本地地址，用catch来抛出图片地址获取异常的情况

> 优化图片请求方式，采用异步加载

```javascript
	Promise.all([this.downImg(this.QrCodeUrl),
			this.downImg(this.Logo),
			this.downImg(this.shopInfoList.Logo),
			this.downImg('https://otherfiles-ali.uupt.com/Stunner/FE/C/shareCard.png')
	]).then(res=>{
			console.log(res,111)
	}).catch(err=>{
			console.log(err,222)
	})
```

### 三方模板店铺页

```javascript
	onLoad(options) {
		this.scene = options.scene;
		wx.setStorageSync('scene', this.scene);
		this.ShopId = this.$mp.query.ShopId || wx.getStorageSync('uShopId') || '测试店铺id';
	}

	const commonHeader = _ => {
		//headers每次必传数据存放位置
		return {
			appid: wx.getStorageSync('uAppId') || '1',
			token: wx.getStorageSync('loginInfo').Token || '',
			qrcode: wx.setStorageSync('scene', this.scene) || ''
		}
	}

	//获取第三方平台自定义的数据字段
	let config = wx.getExtConfigSync();

	config.appId && (wx.setStorageSync('uAppId', config.appId));

	!config.shopId && console.log('未获取到shopId');

	config.shopId && (wx.setStorageSync('uShopId', config.shopId));
```

### 函数节流防抖参考链接

[30-seconds-of-code](https://github.com/Chalarangelo/30-seconds-of-code/tree/master/snippets)

### vue 与 throttle 的坑

[参考链接](http://fszer.github.io/2018/01/21/vue%E4%B8%8Ethroltte%E7%9A%84%E5%9D%91/)

[其它](https://github.com/zyh9/Small-example/tree/master/other/)

### 小程序分包

		前提是项目代码体积已经超过2M的项目才可以使用此方法

		小程序单包最大支持2M，分包后最大可支持8M，故此需要对其进行分包处理

		将main.js里面的pages单独存储于pages.js内（有点像路由的配置文件）

		然后根据功能性来划分相应模块，只有用户触及到某些模块的时候才会去加载

		相应的也就提高了进入小程序的加载速度
		
		pages.js数组的第一项就是作为首页的页面，没有类似于小程序的'^'前置方法

```javascript
	//pages.js配置（单个页面的配置以及路径）
	module.exports = [
		{
			path: 'pages/admin-index',//页面所在路径
			subPackage: true,//是否分包，主包可不用配置此项
			config: {
				navigationBarTitleText: '',//导航文字
				navigationBarBackgroundColor:'#0963EE'//导航颜色
			}
		},
	]
```
