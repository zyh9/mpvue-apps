module.exports = [
  {
    path: 'pages/index',
    config: {
      navigationBarTitleText: '首页',//导航文字
      backgroundColorTop: '#3c59ee',//导航背景颜色
      // backgroundTextStyle: 'dark',//下拉背景
      // enablePullDownRefresh: true,//下拉刷新
      // onReachBottomDistance: 60//触底距离
    }
  },
  {
    path: 'pages/order',
    config: {
      navigationBarTitleText: '订单'
    }
  },
  {
    path: 'pages/user', 
    config: {
      navigationBarTitleText: '我的'
    } 
  },
  {
    path: 'pages/upload', 
    config: {
      navigationBarTitleText: '图片裁剪'
    } 
  },
  {
    path: 'pagesOther/other',
    subPackage: true,//开启分包
    config: {
      navigationBarTitleText: '其它'
    }
  },
]
