import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG
} from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'

// 设置头部标题的同步action
export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle})

// 接收用户的同步action
export const receiveUser = (user) => ({type: RECEIVE_USER, user})

// 显示错误信息同步action
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

// 登录的异步acton
export const login = (username,password) => {
    return async dispatch => {
        const res = await reqLogin(username,password)
        // 登录成功 保存用户信息
        if(res.status === 0){
            const user = res.data;
            // 保存在local中
            storageUtils.saveUser(user);
            dispatch(receiveUser(user))
        }
        // 登录失败 显示错误信息
        else{
            const msg = res.msg;
            dispatch(showErrorMsg(msg))
        }
        
    }
}