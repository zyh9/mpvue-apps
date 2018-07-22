import {types} from './types.js'

// 定义state的值
const state = {
    polling:{}
}

// 每个action的提交引发state的改变
const mutations = {
    [types.POLLING_INFO](state,val){
        state.polling = val.polling;
    }
}

// 获取到变化的值
const getters = {
    polling(state){
        return state.polling;
    }
}

// 导出
export default{
	state,
	mutations,
	getters
}
