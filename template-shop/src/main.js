import Vue from 'vue'
import App from './App'

const app = new Vue(App)

app.$mount()

import './common/reset.less';

// 引用数据请求
import util from './utils/index';
Vue.prototype.util = util;
// 引用toast提示
import msg from './utils/toast';
Vue.prototype.msg = msg;
// 引用vuex
import store from './store/index';
Vue.prototype.$store = store;

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页
    pages: [
      //店铺页面
      '^pages/my-store/main',
      'pages/product-details/main',
      //提交订单
      'pages/submit-order/main',
      'pages/add-note/main',
      //地址页面
      'pages/select-address/main',
      'pages/my-address/main',
      'pages/add-address/main',
      //订单页面
      'pages/my-order/main',
      'pages/order-details/main',
      //登录页面
      'pages/login/main',
      'pages/wx-auth/main',
    ],
    window: {
      //下拉 loading 的样式，仅支持 dark/light
      backgroundTextStyle: 'light',
      //上方导航栏背景颜色
      navigationBarBackgroundColor: '#fff',
      //上方导航栏标题文字内容
      navigationBarTitleText: '优小店',
      //上方导航栏标题颜色，仅支持 black/white
      navigationBarTextStyle: 'black',
      //隐藏任务栏
      // navigationStyle:'custom',
    },
  }
}
