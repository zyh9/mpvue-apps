import {types} from './types.js'
// console.log(types)
const actions = {
    polling({commit},val){
        commit(types.POLLING_INFO,val)
    }
}

export default actions;
