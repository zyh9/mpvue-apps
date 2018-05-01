## mpvue 踩坑之旅

### 定位

		引入腾讯的微信小程序JavaScript SDK
		
		因为微信小程序wx.getLocation API 返回的是地理位置坐标
		
		所以要用到地址逆解析，然后就是一顿复制
		
		var QQMapWX = require('xxx/qqmap-wx.js')...
		
		然后就出问题了，貌似SDK最后的代码是这样导出的module.exports = QQMapWX;
		
		改为export default QQMapWX; 引入改为import QQMapWX from 'XXX/qqmap-wx-jssdk.js'; 即可

		百度的微信小程序JavaScript SDK何其类似，不再赘述

[腾讯 微信小程序 SDK](http://lbs.qq.com/qqmap_wx_jssdk/index.html)

[百度 微信小程序 SDK](https://github.com/baidumapapi/wxapp-jsapi)
