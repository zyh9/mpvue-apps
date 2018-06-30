import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '附近店铺',
        backgroundTextStyle: "dark",
        enablePullDownRefresh: true,
        onReachBottomDistance: 50,
    }
}
