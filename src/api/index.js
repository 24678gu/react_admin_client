/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值是promise
 */
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

// 登录
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')

// 添加用户
export const reqAddUser = user => ajax('/manager/user/add',user,'POST')

// 查询天气
// jsonp请求的接口请求函数
export const reqWeather = city => {

    return new Promise((resolve,reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=62f2bed6fc85bb21f79f28d200fd3d30&city=${city}`
        jsonp(url,{},(err,data) => {
            // 如果成功
            if(!err && data.status === '1'){
                const weather = data.lives[0]
                resolve(weather)
            }else{//失败
                message.error('获取天气信息失败！')
            }
        })
    })

}

// 获取商品列表
export const reqCategorys = parentId => ajax('/manage/category/list',{parentId},'GET')
// 添加分类
export const reqAddCategorys = (categoryName,parentId) => ajax('/manage/category/add',{categoryName,parentId},'POST')
// 更新分类
export const reqUpdateCategorys = ({categoryId,categoryName}) => ajax('/manage/category/update',{categoryName,categoryId},'POST')

// 查询商品
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize},'GET')
//搜索商品
export const reqSearchProducts = ({searchName,pageNum,pageSize,searchType}) => ajax('/manage/product/search',{[searchType]:searchName,pageNum,pageSize},'GET')

// 获取所属分类名
export const reqCategory = categoryId => ajax('/manage/category/info',{categoryId},'GET')

// 更新商品状态
export const reqUpdateStatus = (productId,status) => ajax('/manage/product/updateStatus',{productId,status},'POST')

//删除上传的图片
export const reqDeleteImg = name => ajax('/manage/img/delete',{name},'POST')

// 添加或更新商品
export const reqAddOrUpdateProduct = product => ajax('/manage/product/'+(product._id?'update':'add'),product,"POST")

//获取所有角色的列表
export const reqGetRoles = () => ajax('/manage/role/list',{},'GET')
//添加角色
export const reqAddRole = roleName => ajax('/manage/role/add',{roleName},'POST')
//更新角色
export const reqUpdateRole = role => ajax('/manage/role/update',role,"POST")

// 获取所有用户列表
export const reqGetUsers = () => ajax('/manage/user/list',{},'GET')
// 删除用户
export const reqDeleteUser = userId => ajax('/manage/user/delete',{userId},'POST')
// 添加用户
export const reqAddOrUpdateNewUser = user => ajax(`/manage/user/${user._id?'update':'add'}`,user,'POST')
