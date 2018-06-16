import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '我的优惠券',
        backgroundColor:'#f3f3f3',
        enablePullDownRefresh: true,
        backgroundTextStyle:'dark'
    }
}
