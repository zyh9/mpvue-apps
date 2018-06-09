import {types} from './types.js'

// 定义state的值
const state = {
    qrcode:null
}

// 每个action的提交引发state的改变
const mutations = {
    [types.COMMIT_CODE](state,val){
        state.qrcode = val
    },
}

// 获取到变化的值
const getters = {
    qrcode(state){
        return state.qrcode;
    }
}

// 导出
export default{
	state,
	mutations,
	getters
}
