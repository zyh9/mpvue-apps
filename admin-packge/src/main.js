import Vue from 'vue'
import App from './App'

const app = new Vue(App)

app.$mount()

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
      //平台管理-首页
      // '^pages/admin-shop-index/main',
      // //平台管理-登录
      // 'pages/admin-shop-login/main',
      // //我的小店首页
      // 'pages/admin-index/main',
      // //微信授权
      // 'pages/wx-auth/main',
      //  //新手引导
      // 'pages/admin-guide/main',
      // //店铺名字--类型
      // 'pages/admin-name-guide/main',
      // //位置--联系方式
      // 'pages/admin-tel-guide/main',
      // //logo--介绍
      // 'pages/admin-introduction/main',
      // //选择店铺类型
      // 'pages/admin-select-plat/main',
      // //第三方平台授权
      // 'pages/admin-auth/main',
      // //平台介绍
      // 'pages/plat-introduction/main',
      // //专享介绍
      // 'pages/vip-introduction/main',
      // //引导图
      // 'pages/admin-mask/main',
      // //图文列表
      // 'pages/admin-help/main',
      // //图文详情
      // 'pages/admin-help-details/main',
      // //视频
      // 'pages/admin-webview/main',


      // //我的订单
      // 'pages/admin-order/main',
      // //订单详情
      // 'pages/admin-order-details/main',
      // //个人中心
      // 'pages/admin-user/main',
      // //个人信息
      // 'pages/admin-user-info/main',
      // //修改绑定手机号
      // 'pages/admin-modify-mobile/main',
      // //绑定手机号
      // 'pages/admin-bind-mobile/main',
      // //我的收款码
      // 'pages/admin-collection-code/main',
      // //收款记录
      // 'pages/admin-receipt-records/main',
      

      // //支付密码管理
      // 'pages/pay-password-management/main',
      // //修改支付密码 - 输入原密码-设置新密码
      // 'pages/edit-pay-password/main',
      // //修改支付密码
      // 'pages/forget-pay-password/main',
      // //验证手机调整
      // 'pages/verification-phone/main',
      // //我的银行卡
      // 'pages/my-bank-card/main',
      // //绑定银行卡
      // 'pages/bond-bank-card/main',
      // //我的钱包
      // 'pages/admin-user-purse/main',
      // //提现（商城）
      // 'pages/admin-user-withdraw/main',
      // //提现--验证手机号支付密码
      // 'pages/withdraw-phone/main',
      // //跑腿钱包--去充值
      // 'pages/paotui-wallet/main',
      // //达达钱包
      // 'pages/dada-wallet/main',
      // //达达充值
      // 'pages/admin-dd-recharge/main',
      // //钱包明细（商城、达达）
      // 'pages/wallet-details/main',
      // //订购记录
      // 'pages/order-record/main',
      // //店铺套餐
      // 'pages/admin-shop-setmeal/main',
      // //订购成功
      // 'pages/admin-order-result/main',

      
      // //店铺管理
      // 'pages/admin-store-manage/main',
      // //选择店铺模板
      // 'pages/admin-store-templet/main',
      // //店铺配置 ---餐饮模板
      // 'pages/admin-store-deploy/main',
      // //店铺管理---其他模板
      // 'pages/admin-store-deployother/main',
      // //跑腿设置
      // 'pages/admin-paotui-select/main',
      // //跑腿配置信息
      // 'pages/admin-emit-drive/main',
      // //UU计价规则
      // 'pages/admin-rule-price/main',
      // //达达配置信息
      // 'pages/admin-dd-option/main',
      // //达达配置编辑
      // 'pages/admin-dd-set/main',
      // //行业类型选择
      // 'pages/admin-type-select/main',
      // //编辑快递配置
      // 'pages/admin-emit-express/main',
      // //默认计价方式
      // 'pages/admin-delivery-price/main',
      // //配送费配置
      // 'pages/admin-emit-expressSet/main',
      // //店铺信息页面
      // 'pages/admin-shop-info/main',
      // //选择地址
      // 'pages/select-address/main',
      // //上传图片
      // 'pages/upload-shop-img/main',
      // //店铺营业时间
      // 'pages/admin-emit-time/main',
      // //商品管理--查看商品列表，批量修改商品信息
      // 'pages/admin-commodity-manage/main',
      // //暂无商品信息
      // 'pages/admin-no-shop/main',
      // //商品搜索
      // 'pages/admin-commodity-search/main',
      // //添加商品
      // 'pages/admin-add-goods/main',
      // //编辑商品规格
      // 'pages/admin-emit-spec/main',
      // //创建折扣
      // 'pages/admin-create-rebate/main',
      // //折扣活动列表
      // 'pages/admin-rebate-list/main',
      // //商品折扣配置
      // 'pages/admin-discount-config/main',
      // //优惠管理
      // 'pages/admin-discount-manage/main',
      // //优惠券列表
      // 'pages/admin-discount-list/main',
      // //创建优惠券
      // 'pages/admin-create-discount/main',
    ],
    window: {
      //下拉 loading 的样式，仅支持 dark/light
      backgroundTextStyle: 'light',
      //上方导航栏背景颜色
      navigationBarBackgroundColor: '#3c59ee',
      //上方导航栏标题文字内容
      navigationBarTitleText: '',
      //上方导航栏标题颜色，仅支持 black/white
      navigationBarTextStyle: 'white',
      //取消任务栏
      // navigationStyle:'custom',
    },
    tabBar: {
      //下方导航栏背景颜色
      backgroundColor: "#fff",
      //文字选中颜色
      selectedColor: "#3c59ee",
      //文字初始颜色
      color: '#b2b2b2',
      list: [
        //后台管理
        {
          //图标选中状态
          selectedIconPath: "static/tabBar/admin_indexActive.png",
          //图标未选中状态
          iconPath: "static/tabBar/admin_index.png",
          //页面所属路径
          pagePath: "pages/admin-index",
          //图标下方文字描述
          text: "首页"
        },
        {
          selectedIconPath: "static/tabBar/admin_orderActive.png",
          iconPath: "static/tabBar/admin_order.png",
          pagePath: 'pages/admin-order',
          text: "订单"
        },
        {
          selectedIconPath: "static/tabBar/admin_userActive.png",
          iconPath: "static/tabBar/admin_user.png",
          pagePath: 'pages/admin-user',
          text: "我的"
        }

      ]
    },
  },
}
