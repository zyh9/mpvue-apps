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

// export default {
//   // 这个字段走 app.json
//   config: {
//     // 页面前带有 ^ 符号的，会被编译成首页
//     pages: [
//       //店铺页面
//       'pages/my-store/main',
//       'pages/product-details/main',
//       'pages/my-user/main',
//       'pages/join-uu/main',
//       //提交订单
//       'pages/submit-order/main',
//       'pages/add-note/main',
//       //地址页面
//       'pages/select-address/main',
//       'pages/my-address/main',
//       'pages/add-address/main',
//       //订单页面
//       'pages/my-order/main',
//       'pages/order-details/main',
//       //登录页面
//       'pages/login/main',
//       //附近店铺  搜索店铺
//       '^pages/nearby-shop/main',
//       'pages/search-shop/main',
//       'pages/wx-auth/main',
//       'pages/my-coupon/main',
//       //付款码
//       'pages/code-pay/main',
//       'pages/pay-ok/main',
//       'pages/pay-error/main',
//     ],
//     window: {
//       //下拉 loading 的样式，仅支持 dark/light
//       backgroundTextStyle: 'light',
//       //上方导航栏背景颜色
//       navigationBarBackgroundColor: '#fff',
//       //上方导航栏标题文字内容
//       navigationBarTitleText: '优小店',
//       //上方导航栏标题颜色，仅支持 black/white
//       navigationBarTextStyle: 'black',
//       //隐藏任务栏
//       // navigationStyle:'custom',
//     },
//     tabBar: {
//       //下方导航栏背景颜色
//       backgroundColor: "#fff",
//       //文字选中颜色
//       selectedColor: "#090102",
//       //文字初始颜色
//       color: '#b2b2b2',
//       list: [
//         //平台店铺
//         {
//           //图标选中状态
//           selectedIconPath: "static/tabBar/index-active.png",
//           //图标未选中状态
//           iconPath: "static/tabBar/index.png",
//           //页面所属路径
//           // pagePath: "pages/my-store/main",
//           pagePath: "pages/nearby-shop/main",
//           //图标下方文字描述
//           text: "UU小店"
//         },
//         {
//           selectedIconPath: "static/tabBar/user-active.png",
//           iconPath: "static/tabBar/user.png",
//           pagePath: 'pages/my-user/main',
//           text: "我的"
//         },
//         {
//           selectedIconPath: "static/tabBar/join-active.png",
//           iconPath: "static/tabBar/join.png",
//           pagePath: 'pages/join-uu/main',
//           text: "入驻UU"
//         }
//       ]
//     },
//   }
// }
