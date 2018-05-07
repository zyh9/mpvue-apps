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
      'pages/index/main',
      'pages/movie-details/main',
      'pages/map/main',
      'pages/my-cart/main',
      'pages/user/main',
      //店铺详情页
      'pages/my-shop-info/main',
      //店铺页面
      'pages/my-store/main',
      'pages/product-details/main',
      //提交订单
      'pages/submit-order/main',
      //地址页面
      'pages/select-address/main',
      'pages/my-address/main',
      'pages/add-address/main',
      //订单页面
      'pages/my-order/main',
      'pages/order-details/main',
      //平台页面
      'pages/plat-index/main',
      'pages/plat-join-uu/main',
      'pages/plat-mine/main',
      'pages/history-shop/main',
      //后台登录页面
      'pages/admin-shop-index/main',
      'pages/admin-shop-login/main',
      'pages/admin-shop-signup/main',
      //修改信息页面
      'pages/admin-modify-mobile/main',
      'pages/admin-modify-password/main',
      //后台页面
      'pages/admin-index/main',
      'pages/admin-order/main',
      'pages/admin-user/main',
      //后台店铺信息页面
      'pages/admin-shop-info/main',
      //后台订单详情
      'pages/admin-order-details/main',
      //我的钱包
      'pages/admin-user-purse/main',
      'pages/admin-user-recharge/main',
      'pages/admin-user-withdraw/main',
      //我的收款码
      'pages/admin-collection-code/main',
      'pages/admin-receipt-records/main',
      //我的个人信息
      'pages/admin-user-info/main',
      //店铺管理
      'pages/admin-store-manage/main',
      'pages/admin-store-templet/main',
      'pages/admin-store-deploy/main',
      //商品管理
      'pages/admin-commodity-manage/main',
      '^pages/upload-shop-img/main',
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
      color: '#666',
      list: [
        {
          //图标选中状态
          selectedIconPath: "static/index-active.png",
          //图标未选中状态
          iconPath: "static/index.png",
          //页面所属路径
          pagePath: "pages/index/main",
          //图标下方文字描述
          text: "首页"
        },
        // {
        //   selectedIconPath: "static/subject-active.png",
        //   iconPath: "static/subject.png",
        //   pagePath: 'pages/map/main',
        //   text: "地图"
        // },
        {
          selectedIconPath: "static/subject-active.png",
          iconPath: "static/subject.png",
          pagePath: 'pages/my-cart/main',
          text: "购物车"
        },
        {
          selectedIconPath: "static/user-active.png",
          iconPath: "static/user.png",
          pagePath: 'pages/user/main',
          text: "我的"
        }

        // {
        //   //图标选中状态
        //   selectedIconPath: "static/index-active.png",
        //   //图标未选中状态
        //   iconPath: "static/index.png",
        //   //页面所属路径
        //   pagePath: "pages/plat-index/main",
        //   //图标下方文字描述
        //   text: "UU小店"
        // },
        // {
        //   selectedIconPath: "static/subject-active.png",
        //   iconPath: "static/subject.png",
        //   pagePath: 'pages/plat-join-uu/main',
        //   text: "入驻U商"
        // },
        // {
        //   selectedIconPath: "static/user-active.png",
        //   iconPath: "static/user.png",
        //   pagePath: 'pages/plat-mine/main',
        //   text: "我的"
        // }

        // {
        //   //图标选中状态
        //   selectedIconPath: "static/index-active.png",
        //   //图标未选中状态
        //   iconPath: "static/index.png",
        //   //页面所属路径
        //   pagePath: "pages/admin-index/main",
        //   //图标下方文字描述
        //   text: "店铺"
        // },
        // {
        //   selectedIconPath: "static/subject-active.png",
        //   iconPath: "static/subject.png",
        //   pagePath: 'pages/admin-order/main',
        //   text: "订单"
        // },
        // {
        //   selectedIconPath: "static/user-active.png",
        //   iconPath: "static/user.png",
        //   pagePath: 'pages/admin-user/main',
        //   text: "个人中心"
        // }

        //平台店铺
        // {
        //   //图标选中状态
        //   selectedIconPath: "static/index-active.png",
        //   //图标未选中状态
        //   iconPath: "static/index.png",
        //   //页面所属路径
        //   pagePath: "pages/my-store/main",
        //   //图标下方文字描述
        //   text: "首页"
        // },
        // {
        //   selectedIconPath: "static/user-active.png",
        //   iconPath: "static/user.png",
        //   pagePath: 'pages/user/main',
        //   text: "我的"
        // }

      ]
    },
  }
}
