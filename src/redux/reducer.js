import {combineReducers} from 'redux' 

import storageUtils from '../utils/storageUtils'
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG
} from './action-types'

const initHeadTitle = '首页'
function headTitle (state = initHeadTitle, action) {
    switch(action.type){
        case SET_HEAD_TITLE:
            return action.data;
        default: 
            return state
    }
}

const initUser = storageUtils.getUser() 
function user (state = initUser, action) {
    switch(action.type){
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg = action.errorMsg
        // state.errorMsg = errorMsg  // 不要直接修改原本状态数据
            return {...state, errorMsg}
        default: 
            return state
    }
}

export default combineReducers({
    headTitle,
    user
})

