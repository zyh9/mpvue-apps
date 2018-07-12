import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: 'U支付',
        //上方导航栏颜色
        navigationBarBackgroundColor: '#1d1e20',
        //上方导航栏标题颜色，仅支持 black/white
        navigationBarTextStyle: 'white',
    }
}
