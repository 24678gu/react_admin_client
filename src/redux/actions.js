//包含n个action creator函数的模块
// 同步action:对象{type:'xxx',data:数据值}
// 异步action:函数 dispatch => {}
import { RECEIVE_USER, SET_HEAD_TITLE,SET_USER,SHOW_ERROR_MESSAGE } from "./actions-types"
import { reqLogin } from "../api"
import storageUtils from "../utils/storageUtils"

//设置头部标题的同步action
export const setHeadTitle = headTitle => ({type:SET_HEAD_TITLE,data:headTitle})

// 设置当前登录用户的同步action
export const setUser = user => ({type:SET_USER,data:user})

// 接收用户的同步action
export const receiveUser = user => ({type:RECEIVE_USER,user})

// 显示错误信息的同步action
export const showErrMsg = msg => ({type:SHOW_ERROR_MESSAGE,msg})

// 登录的异步action
export const login = (username,password) => {
    return async dispatch => {
        /**
         * 1.执行异步ajax请求
         * 2.如果成功，分发成功的同步action
         * 3.如果失败，分发失败的同步action
         */
        const result = await reqLogin(username,password)
        if(result.status===0){
            const user = result.data
            //保存local中
            storageUtils.saveUser(user)
            dispatch(receiveUser(user))
        }else{
            const msg = result.msg
            dispatch(showErrMsg(msg))
        }
    }
}