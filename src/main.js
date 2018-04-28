import Vue from 'vue'
import App from './App'

const app = new Vue(App)
app.$mount()

import './common/reset.less';

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/index/main',
      'pages/cart/main',
      'pages/user/main',
      'pages/map/main',
      'pages/store/main',
      'pages/address/main',
      'pages/details/main',
      'pages/submit/main',
    ],
    window: {
      //下拉 loading 的样式，仅支持 dark/light
      backgroundTextStyle: 'light',
      //上方导航栏背景颜色
      navigationBarBackgroundColor: '#2395ff',
      //上方导航栏标题文字内容
      navigationBarTitleText: 'UU',
      //上方导航栏标题颜色，仅支持 black/white
      navigationBarTextStyle: 'white',
    },
    tabBar: {
      //下方导航栏背景颜色
      backgroundColor: "#fff",
      //文字选中颜色
      selectedColor: "skyblue",
      //文字初始颜色
      color: '#9c93b4',
      list: [{
        //图标选中状态
        selectedIconPath: "static/index-active.png",
        //图标未选中状态
        iconPath: "static/index.png",
        //页面所属路径
        pagePath: "pages/index/main",
        //图标下方文字描述
        text: "首页"
      },
      {
        selectedIconPath: "static/subject-active.png",
        iconPath: "static/subject.png",
        pagePath: 'pages/map/main',
        text: "地图"
      },
      {
        selectedIconPath: "static/subject-active.png",
        iconPath: "static/subject.png",
        pagePath: 'pages/cart/main',
        text: "购物车"
      },
      {
        selectedIconPath: "static/user-active.png",
        iconPath: "static/user.png",
        pagePath: 'pages/user/main',
        text: "我的"
      }
      ]
    },
  }
}
