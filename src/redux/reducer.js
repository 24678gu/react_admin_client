//用来根据老的state和指定的action生成并返回新的state的函数
import { combineReducers } from 'redux'
import storageUtils from '../utils/storageUtils'
import { SET_HEAD_TITLE,SET_USER,RECEIVE_USER,SHOW_ERROR_MESSAGE } from './actions-types'

// 管理头部标题的reducer函数
const initHeadTitle = '首页'
function headTitle(state=initHeadTitle,action){
    switch (action.type){
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

// 管理当前登录用户的reducer函数
const initUser = storageUtils.getUser()
function user(state=initUser,action){
    switch (action.type){
        case SHOW_ERROR_MESSAGE:
            const errMsg = action.msg
            return {...state,errMsg}//不要直接修改原本的状态数据
        case RECEIVE_USER:
            return action.user
        case SET_USER:
            return action.data
        default:
            return state
    }
}

// 向外默认暴露的是合并产生的总的reducer函数
// 管理总的state的结构
/**
 * {
 *      headTitle:'首页',
 *      user:{}
 * }
 */
export default combineReducers({
    headTitle,
    user,
})