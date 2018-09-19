import {types} from './types.js'
// console.log(types)
const actions = {
    add({commit},val){
        commit(types.ADD_NUM,val)
    }
}

export default actions;
