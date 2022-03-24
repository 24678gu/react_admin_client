import React, { Component } from 'react'
import './LeftNav.css'
import logo from '../../assets/images/logo.png'
import { Menu } from 'antd';
import * as Icon from '@ant-design/icons';
import {Link,withRouter} from 'react-router-dom'
import MenuList from '../../config/menuConfig'

const { SubMenu } = Menu;

// 左侧导航组件

class LeftNav extends Component {
  state = {
    key:'',
    collapsed: false,
  };

  //根据menu数组生成标签数组
  getMenuNodes = MenuList => {
    const path = this.props.location.pathname
    return MenuList.map(item => {
      if(!item.children){
        const icon = React.createElement(Icon[item.icon],{style:{ fontSize: '16px'}})
        return (
          <Menu.Item key={item.key} icon={icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        )
      }else{
        const cItem = item.children.find(cItem => this.props.location.pathname.indexOf(cItem.key)===0)
        if(cItem){
         this.openKey = item.key
        }
        return(
          <SubMenu key={item.key} title={item.title}>
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  }

  getMenuNodes_reduce = MenuList => {
    return MenuList.reduce((pre,item) => {
      if(!item.children){
        const icon = React.createElement(Icon[item.icon],{style:{ fontSize: '16px'}})
        pre.push((
          <Menu.Item key={item.key} icon={icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        ))
      }
      else{
        pre.push((
          <SubMenu key={item.key} title={item.title}>
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        ))
      }
      return pre
    },[])

  }

  componentWillMount() {
    this.menuNodes = this.getMenuNodes(MenuList)
}

  render() {
    let path = this.props.location.pathname
    if(path.indexOf('/product/productManage')===0){
      path = '/product/productManage'
    }
    const openKey = this.openKey;
    return (
      <div className='left-nav'>
        <Link to='/home' className='left-nav-header'>
          <img src={logo} alt='logo'/>
          <h1>React后台</h1>
        </Link>
        <div>
          <Menu
            defaultSelectedKeys={[path]}
            selectedKeys={[path]}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
            defaultOpenKeys={[openKey]}
          >
            {
              this.menuNodes
            }

          </Menu>
        </div>
      </div>
    )
  }
}

//withRouter高阶组件：
// 包装非路由组件，返回一个新组件
//新的组件向非路由组件传递3个属性：history/location/match
export default withRouter(LeftNav)
