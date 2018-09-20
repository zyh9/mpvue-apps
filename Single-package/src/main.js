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
