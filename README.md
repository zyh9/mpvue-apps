## mpvue 踩坑之旅

### 单包demo

[单包demo，请戳我](https://github.com/zyh9/mpvue-apps/tree/master/Single-package)

```javascript
	//main.json配置（单个页面的配置）
	{
		navigationBarTitleText: '',//导航文字
		navigationBarBackgroundColor: '',//导航颜色
		backgroundTextStyle: "dark",//下拉loading样式
		enablePullDownRefresh: true,//启用下拉刷新
		onReachBottomDistance: 60,//触底距离
	}
```

> mpvue-loader已经支持分包(需要修改配置文件)

```javascript
	//webpack.base.conf.js文件
	const appEntry = { app: resolve('./src/main.js') }

	function getEntry (rootSrc, path) {
		var map = {};
		glob.sync(rootSrc + '/' + path + '/**/main.js')
		.forEach(file => {
			var key = relative(rootSrc, file).replace('.js', '');
			map[key] = file;
		})
		return map;
	}

	let entry;
	const pagesEntry = getEntry(resolve('./src'), 'pages')
	// 判断app.json文件中是否包含subpackages配置来判断单包、分包
	let appJson = require('../src/app.json')
	let subpackages = appJson.subpackages || appJson.subPackages || [];
	if(subpackages.length){
		let entryPath = subPackages.map(({root})=>({root}))
		let entryArray = [];
		entryPath.forEach( e =>{
			entryArray.push(getEntry(resolve('./src'), e['root']))
		})
		entry = Object.assign({}, appEntry, pagesEntry, ...entryArray)
	}else entry = Object.assign({}, appEntry, pagesEntry)
```

### 分包demo

[分包demo，请戳我](https://github.com/zyh9/mpvue-apps/tree/master/Multi-package)

		前提是项目代码体积已经超过2M的项目才可以使用此方法

		小程序单包最大支持2M，分包后最大可支持8M，故此需要对其进行分包处理

		将单个页面的配置单独存储于pages.js内（有点像路由的配置文件）

		然后根据功能性来划分相应模块，只有用户触及到某些模块的时候才会去加载

		相应的也就提高了进入小程序的加载速度

[mpvue-entry，请戳我](https://github.com/F-loat/mpvue-entry)

```javascript
	//pages.js配置（单个页面的配置以及路径）
	module.exports = [
		{
			path: 'pages/index',//主包页面所在路径
			config: {
				navigationBarTitleText: '',//导航文字
				navigationBarBackgroundColor: '',//导航颜色
				backgroundTextStyle: "dark",//下拉loading样式
				enablePullDownRefresh: true,//启用下拉刷新
				onReachBottomDistance: 60,//触底距离
			}
		},
		{
			path: 'pagesOther/other',//分包页面所在路径
			subPackage: true,//是否分包，主包可不用配置此项
			config: {
				navigationBarTitleText: '',//导航文字
				navigationBarBackgroundColor: '',//导航颜色
				backgroundTextStyle: "dark",//下拉loading样式
				enablePullDownRefresh: true,//启用下拉刷新
				onReachBottomDistance: 60,//触底距离
			}
		}
	]
```

### 地理位置获取

		引入腾讯的微信小程序JavaScript SDK
		
		因为微信小程序wx.getLocation API 返回的是地理位置坐标
		
		所以要用到地址逆解析，然后就是一顿复制
		
		var QQMapWX = require('xxx/qqmap-wx.js')...
		
		然后就出问题了，貌似SDK最后的代码是这样导出的module.exports = QQMapWX;
		
		改为export default QQMapWX; 引入改为import QQMapWX from 'XXX/qqmap-wx-jssdk.js'; 即可
		
		百度的微信小程序JavaScript SDK和其类似，故此不再赘述

> 注：另一种解决方法，把地图SDK放到static下，别让它被webpack编译就不会报错了

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
	    return s; //返回数值单位：公里
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

[gcoord github地址，请戳我](https://github.com/hujiulong/gcoord)

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

	//数据请求地址
	const baseUrl = 'localhost:8080';

	const commonHeader = _ => {
		//headers每次必传数据存放位置
		return {
			//...
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
						resolve(res.data)
					}, 0)
				},
				fail: err => {
					reject(err)
				}
			})
		})
	}

	export default { get, post };

```

```javascript
	// 代码示例
	let shopInfo = async _ =>{
		let data1 = await this.util.post({
			url:'http://XXXXXX',
			data:{
				demo:'111'
			}
		})
		console.log(data1)
		let data2 = await this.util.post({
			url:'http://XXXXXX',
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

### vuex的加入

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

### 关于canvas请求网络图片绘制

		网络图片的绘制在真机实测的时候是不会显示的，可以调用以下方法先获取本地图片路径，再进行canvas绘制
		
		wx.downloadFile(OBJECT)  ||  wx.getImageInfo(OBJECT)
		
		针对多个图片获取地址的解决方法，将上述两个方法用Promise包装一下
		
		再使用async/await来获取所有的图片本地地址，用catch来抛出图片地址获取异常的情况

```javascript
	//获取线上图片生成本地临时路径
	const downImg = val => {
		return new Promise((resolve, reject) => {
			//判断本地图片路径是否存在
			if (val.indexOf('wxfile://') == -1) {
				wx.downloadFile({
					url: val,
					success: res => {
						resolve(res.tempFilePath)
					},
					fail: err => {
						reject(err)
					}
				})
			} else {
				resolve(val)
			}
		})
	}
```

> 优化图片请求方式，采用异步加载

```javascript
	Promise.all([this.downImg(this.QrCodeUrl),
			this.downImg(this.Logo)
	]).then(res=>{
			console.log(res,111)
	}).catch(err=>{
			console.log(err,222)
	})
```

### canvas文字截取

```javascript
	/**
	 * ctx,画布对象
	 * str,需要绘制的文字
	 * splitLen,切割的长度字符串
	 * strHeight,每行文字之间的高度
	 * x,位置
	 * y,位置
	 */
	fontLineFeed(ctx, str, splitLen, strHeight, x, y) {
		let strArr = [];
		for (let i = 0, len = str.length / splitLen; i < len; i++) {
			strArr.push(str.substring(i * splitLen, i * splitLen + splitLen));
		}
		if (str.length > splitLen) {
			strArr[0] = strArr[0] + '...';
		}
		// console.log(strArr[0])
		// let s = 0;
		// for (let j = 0, len = strArr.length; j < len; j++) {
		//     s = s + strHeight;
		//     ctx.fillText(strArr[j], x, y + s);
		// }
		ctx.fillText(strArr[0], x, y);
	}
```

### 虚拟导航层级处理

> 灵感源自于有赞对虚拟导航的处理方式，判断当前路径是否在路径数组中，存在即回退，不存在则导向新的路径，可解决层级过深的问题

```javascript
	let index = getCurrentPages().findIndex(e => e.route == 'pages/index/main');
	if (index > -1) {
		wx.navigateBack({
			delta: getCurrentPages().length - 1 - index
		})
	} else {
		wx.navigateTo({
			url: '/pages/index/main'
		})
	}
```

### 小程序0.5像素边框

> 跟1px边框实现方式大同小异，使用伪类来实现

```css
	element:before {
		content: '';
		position: absolute;
		top: -50%;
		bottom: -50%;
		left: -50%;
		right: -50%;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		border: 1px solid #999;
		border-radius: 6rpx;
	}
```

### 检测是否授权

```javascript
	const isAuth = (name) => {
		return new Promise((resolve, reject) => {
			Taro.getSetting({
			success: (res) => {
				if (res.authSetting[name]) {
				resolve();
				} else {
				reject();
				}
			},
			fail: (err) => {
				reject(err);
			}
			})
		})
	}
```

### 小程序跳转另一个小程序

		可使用navigator标签，但想要在另外一个小程序来接受参数的话就需要使用到extra-data属性

		但在跳转过去的onShow(options){}里，并未获取到referrerInfo信息

		解决方法：使用小游戏的 wx.getLaunchOptionsSync() 方法

### textarea去除输入法上方完成栏

```html
	<textarea :show-confirm-bar="false"></textarea>
```

### 打开小程序设置页（wx.openSetting）接口调整

[微信开放社区，请戳我](https://developers.weixin.qq.com/community/develop/doc/000cea2305cc5047af5733de751008)

	方法1：使用button组件来使用此功能，示例代码如下：

		<button open-type="openSetting" bindopensetting="callback">打开设置页</button>

	方法2：由点击行为触发wx.openSetting接口的调用，示例代码如下：

		<button bindtap="openSetting">打开设置页</button>  =>  openSetting(){wx.openSetting()}

	其他方法：在点击中调用showModal，showModal的回调再调用openSetting也可以

### 函数节流防抖参考链接

[30-seconds-of-code，请戳我](https://github.com/Chalarangelo/30-seconds-of-code/tree/master/snippets)

### vue 与 throttle 的坑

[参考链接，请戳我](http://fszer.github.io/2018/01/21/vue与throltte的坑/)

### 小程序图片裁剪上传插件

[we-cropper地址，请戳我](https://github.com/we-plugin/we-cropper)

### 图片裁剪根据像素比来提高裁剪图片清晰度

> canvas的绘制函数为异步函数，故作延时处理之后导出裁剪区域图片，再做图片上传

[we-cropper在mpvue中截图模糊问题](https://github.com/we-plugin/we-cropper/wiki/FAQ)

### 优化setState的数据频繁更新

[github issues地址，请戳我](https://github.com/Meituan-Dianping/mpvue/issues/639)

### 热更新失效问题以及文件拷贝出错问题

[github issues地址，请戳我](https://github.com/Meituan-Dianping/mpvue/issues/801)

### mpvue-loader升级指南

[更改日志，请戳我](http://mpvue.com/change-log/)

[升级指南以及webpack配置，请戳我](http://mpvue.com/change-log/2018.7.24/)
