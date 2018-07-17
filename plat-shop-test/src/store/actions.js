import {types} from './types.js'
// console.log(types)
const actions = {
    backIndex({commit},val){
        commit(types.BACK_INDEX,val)
    },
}

export default actions;
