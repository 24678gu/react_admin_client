import React, { Component } from 'react'
import { Redirect,Route,Switch } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import {Layout} from 'antd'
import LeftNav from '../../components/left-nav/LeftNav'
import AdminHeader from '../../components/header/AdminHeader'
import Home from '../home/Home'
import Category from '../product/category/Category'
import ProductManage from '../product/productManage/ProductManage'
import Role from '../role/Role'
import User from '../user/User'
import Bar from '../charts/bar/Bar'
import Line from '../charts/line/Line'
import Pie from '../charts/pie/Pie'

const { Header, Footer, Sider, Content } = Layout

export default class Admin extends Component {
  render() {
    const user = memoryUtils.user
    // 如果内存没有存储user ==> 当前没有登录
    if(!user || !user._id){
      // 自动跳转到登录界面
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{minHeight:'100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header style={{padding:0}}>
            <AdminHeader/>
          </Header>
          <Content style={{margin: 40,backgroundColor:'#fff'}}>
            <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/product/category' component={Category}/>
              {/* <Route path='/category' component={Category}/> */}
              <Route path='/product/productManage' component={ProductManage}/>
              {/* <Route path='/product' component={ProductManage}/> */}
              <Route path='/user' component={User}/>
              <Route path='/role' component={Role}/>
              <Route path='/charts/bar' component={Bar}/>
              <Route path='/charts/line' component={Line}/>
              <Route path='/charts/pie' component={Pie}/>
              <Redirect to='/home'/>
            </Switch>
          </Content>
          <Footer style={{textAlign:'center',color:'#cccc',marginBottom:0}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
