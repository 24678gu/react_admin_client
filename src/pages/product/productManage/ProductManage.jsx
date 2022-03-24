import React, { Component } from 'react'
import {Switch,Route, Redirect} from 'react-router-dom'

import ProductHome from './home/ProductHome'
import ProductAddUpdate from './add-update/ProductAddUpdate'
import Detail from './detail/Detail'

// 商品管理
export default class ProductManage extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product/productManage/addupdate' component={ProductAddUpdate}/>
        <Route path='/product/productManage/detail' component={Detail}/>
        <Route path='/product/productManage' component={ProductHome}/>
        <Redirect to='/product/productManage'/>
      </Switch>
    )
  }
}
