import {types} from './types.js'
// console.log(types)
const actions = {
    code({commit},val){
        commit(types.COMMIT_CODE,val)
    },
}

export default actions;
