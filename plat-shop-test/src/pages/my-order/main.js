import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '',
        backgroundTextStyle: "dark",
        enablePullDownRefresh: true,
        onReachBottomDistance: 80,
    }
}
