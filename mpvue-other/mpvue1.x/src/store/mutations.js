import {types} from './types.js'

// 定义state的值
const state = {
    num: 0
}

// 每个action的提交引发state的改变
const mutations = {
    [types.ADD_NUM](state,val){
        state.num = val;
    }
}

// 获取到变化的值
const getters = {
    num(state){
        return state.num;
    }
}

// 导出
export default{
	state,
	mutations,
	getters
}
