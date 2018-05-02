import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '修改绑定手机号',
        //上方导航栏颜色
        // navigationBarBackgroundColor:'#f00',
    }
}
