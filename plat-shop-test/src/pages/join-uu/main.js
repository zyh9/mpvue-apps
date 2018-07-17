import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarTitleText: '入驻UU',
        //上方导航栏颜色
        navigationBarBackgroundColor: '#0963EE',
        //上方导航栏标题颜色，仅支持 black/white
        navigationBarTextStyle: 'white',
    }
}
