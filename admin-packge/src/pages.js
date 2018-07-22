module.exports = [
  {
    path: 'pages/admin-shop-index',
    config: {
      navigationBarTitleText: '',
      navigationBarBackgroundColor:'#0963EE',
      backgroundColorTop:'#0963EE'
    }
  },
  {
    path: 'pages/admin-index',
    config: {
      navigationBarTitleText: '',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/admin-order', 
    config: {
      navigationBarTitleText: '我的订单',
      backgroundColorTop:'#efeef6',
      backgroundTextStyle:'dark',
      enablePullDownRefresh:true,
      onReachBottomDistance:60
    } 
  },
  {
    path: 'pages/admin-order-details',
    config: {
      navigationBarTitleText: '订单详情'
    }
  },
  {
    path: 'pages/admin-user',
    config: {
      navigationBarTitleText: '',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/admin-auth',
    config: {
      navigationBarTitleText: '专享店铺授权',
        navigationBarBackgroundColor:'#0963EE',
    }
  },
  {
    path: 'pages/admin-guide',
    config: {
      navigationBarTitleText: '新手引导',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/admin-help',
    config: {
      navigationBarTitleText: '我需要帮助',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/admin-help-details',
    config: {
      navigationBarTitleText: '我需要帮助详情',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/admin-introduction',
    config: {
      navigationBarTitleText: '填写店铺信息',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/plat-introduction',
    config: {
      navigationBarTitleText: '',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/admin-mask',
    config: {
      navigationBarTitleText: '新手引导',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/admin-name-guide',
    config: {
      navigationBarTitleText: '填写店铺信息',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/admin-select-plat',
    config: {
      navigationBarTitleText: '',
      navigationBarBackgroundColor:'#0963EE',
      backgroundColorTop:'#0963EE'
    }
  },
  {
    path: 'pages/admin-shop-login',
    config: {
      navigationBarTitleText: ''
    }
  },
  {
    path: 'pages/admin-tel-guide',
    config: {
      navigationBarTitleText: '填写店铺信息',
    }
  },
  {
    path: 'pages/admin-webview',
    config: {
      navigationBarTitleText: '',
    }
  },
  {
    path: 'pages/vip-introduction',
    config: {
      navigationBarTitleText: '',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/wx-auth',
    config: {
      navigationBarTitleText: '微信授权',
    }
  },


  {
    path: 'pagesUser/admin-user-info',
    subPackage: true,
    config: {
      navigationBarTitleText: '个人信息'
    }
  },
  {
    path: 'pagesUser/admin-bind-mobile',
    subPackage: true,
    config: {
      navigationBarTitleText: '绑定新手机号'
    }
  },
  {
    path: 'pagesUser/admin-collection-code',
    subPackage: true,
    config: {
      navigationBarTitleText: '我的收款码'
    }
  },
  {
    path: 'pagesUser/admin-receipt-records',
    subPackage: true,
    config: {
      navigationBarTitleText: '收款记录',
    }
  },
  {
    path: 'pagesUser/admin-modify-mobile',
    subPackage: true,
    config: {
      navigationBarTitleText: '修改绑定手机号',
    }
  },


  {
    path: 'pagesMoney/admin-dd-recharge',
    subPackage: true,
    config: {
      navigationBarTitleText: '达达跑腿充值',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
      backgroundColor:'#eeeef4'
    }
  },
  {
    path: 'pagesMoney/admin-order-result',
    subPackage: true,
    config: {
      navigationBarTitleText: '订购结果',
    }
  },
  {
    path: 'pagesMoney/admin-shop-setmeal',
    subPackage: true,
    config: {
      navigationBarTitleText: '店铺套餐',
      navigationBarBackgroundColor: "#fff",
      navigationBarTextStyle:"black"
    }
  },
  {
    path: 'pagesMoney/admin-user-purse',
    subPackage: true,
    config: {
      navigationBarTitleText: '我的钱包',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pagesMoney/admin-user-withdraw',
    subPackage: true,
    config: {
      navigationBarTitleText: '提现',
    }
  },
  {
    path: 'pagesMoney/bond-bank-card',
    subPackage: true,
    config: {
      navigationBarTitleText: '绑定银行卡',
    }
  },
  {
    path: 'pagesMoney/dada-wallet',
    subPackage: true,
    config: {
      navigationBarTitleText: '达达跑腿钱包',
      navigationBarBackgroundColor:'#e37048',
      backgroundColorTop:'#e37048'
    }
  },
  {
    path: 'pagesMoney/edit-pay-password',
    subPackage: true,
    config: {
      navigationBarTitleText: '修改支付密码',
    }
  },
  {
    path: 'pagesMoney/forget-pay-password',
    subPackage: true,
    config: {
      navigationBarTitleText: '修改支付密码',
    }
  },
  {
    path: 'pagesMoney/my-bank-card',
    subPackage: true,
    config: {
      navigationBarTitleText: '我的银行卡',
    }
  },
  {
    path: 'pagesMoney/order-record',
    subPackage: true,
    config: {
      navigationBarTitleText: '订购记录',
    }
  },
  {
    path: 'pagesMoney/paotui-wallet',
    subPackage: true,
    config: {
      navigationBarTitleText: '跑腿钱包',
      navigationBarBackgroundColor:'#e37048',
      backgroundColorTop:'#e37048'
    }
  },
  {
    path: 'pagesMoney/pay-password-management',
    subPackage: true,
    config: {
      navigationBarTitleText: '支付密码管理',
    }
  },
  {
    path: 'pagesMoney/verification-phone',
    subPackage: true,
    config: {
      navigationBarTitleText: '手机验证',
    }
  },
  {
    path: 'pagesMoney/wallet-details',
    subPackage: true,
    config: {
      navigationBarTitleText: '商城钱包明细',
    }
  },
  {
    path: 'pagesMoney/withdraw-phone',
    subPackage: true,
    config: {
      navigationBarTitleText: '提现',
    }
  },
  




  {
    path: 'pages/admin-add-goods',
    config: {
      navigationBarTitleText: '添加商品',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
    }
  },
  {
    path: 'pages/admin-commodity-manage',
    config: {
      navigationBarTitleText: '商品管理',
    }
  },
  {
    path: 'pages/admin-commodity-search',
    config: {
      navigationBarTitleText: '商品搜索',
    }
  },
  {
    path: 'pages/admin-create-discount',
    config: {
      navigationBarTitleText: '创建优惠券',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
    }
  },
  {
    path: 'pages/admin-create-rebate',
    config: {
      navigationBarTitleText: '创建折扣商品',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
    }
  },
  {
    path: 'pages/admin-dd-option',
    config: {
      navigationBarTitleText: '达达跑腿',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
      backgroundColor:'#eeeef4'
    }
  },
  {
    path: 'pages/admin-dd-set',
    config: {
      navigationBarTitleText: '达达跑腿',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
      backgroundColor:'#eeeef4'
    }
  },
  {
    path: 'pages/admin-delivery-price',
    config: {
      navigationBarTitleText: '配送费计价',
    }
  },
  {
    path: 'pages/admin-self-express',
    config: {
      navigationBarTitleText: '编辑配送费',
    }
  },
  {
    path: 'pages/admin-discount-config',
    config: {
      navigationBarTitleText: '商品规格',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
    }
  },
  {
    path: 'pages/admin-stock-list',
    config: {
      navigationBarTitleText: '商品库存',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
    }
  },
  {
    path: 'pages/admin-discount-list',
    config: {
      navigationBarTitleText: '优惠券列表',
    }
  },
  {
    path: 'pages/admin-discount-manage',
    config: {
      navigationBarTitleText: '优惠管理',
    }
  },
  {
    path: 'pages/admin-emit-drive',
    config: {
      navigationBarTitleText: '跑腿配置',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
      backgroundColor:'#eeeef4'
    }
  },
  {
    path: 'pages/admin-emit-express',
    config: {
      navigationBarTitleText: '快递配置',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
      backgroundColor:'#eeeef4'
    }
  },
  {
    path: 'pages/admin-emit-expressSet',
    config: {
      navigationBarTitleText: '配送费优惠',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
      backgroundColor:'#eeeef4'
    }
  },
  {
    path: 'pages/admin-emit-spec',
    config: {
      navigationBarTitleText: '商品规格',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
    }
  },
  {
    path: 'pages/admin-emit-time',
    config: {
      navigationBarTitleText: '营业时间',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
    }
  },
  {
    path: 'pages/admin-no-shop',
    config: {
      navigationBarTitleText: '商品管理',
    }
  },
  {
    path: 'pages/admin-paotui-select',
    config: {
      navigationBarTitleText: '跑腿配置',
      navigationBarBackgroundColor:'#0963EE',
      backgroundColorTop:'#0963EE'
    }
  },
  {
    path: 'pages/admin-rebate-list',
    config: {
      navigationBarTitleText: '折扣活动列表',
      backgroundTextStyle: "dark",
      enablePullDownRefresh: true,
      onReachBottomDistance: 50,
    }
  },
  {
    path: 'pages/admin-rule-price',
    config: {
      navigationBarTitleText: 'UU计价规则',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
    }
  },
  {
    path: 'pages/admin-shop-info',
    config: {
      navigationBarTitleText: '店铺信息',
      navigationBarBackgroundColor:'#3c59ee',
      navigationBarTextStyle: 'white',
      backgroundColor:'#eeeef4'
    }
  },
  {
    path: 'pages/admin-store-deploy',
    config: {
      navigationBarTitleText: '商品分类',
      backgroundColor:'#eeeef4'
    }
  },
  {
    path: 'pages/admin-store-deployother',
    config: {
      navigationBarTitleText: '商品分类',
    }
  },
  {
    path: 'pages/admin-store-manage',
    config: {
      navigationBarTitleText: '店铺管理',
    }
  },
  {
    path: 'pages/admin-store-templet',
    config: {
      navigationBarTitleText: '店铺模板',
      backgroundColor:'#eeeef4'
    }
  },
  {
    path: 'pages/admin-type-select',
    config: {
      navigationBarTitleText: '行业类型选择',
    }
  },
  {
    path: 'pages/select-address',
    config: {
      navigationBarTitleText: '',
      backgroundColorTop:'#3c59ee'
    }
  },
  {
    path: 'pages/upload-shop-img',
    config: {
      navigationBarTitleText: '选择商品图片',
    }
  }
]