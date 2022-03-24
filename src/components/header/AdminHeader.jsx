import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import MenuList from '../../config/menuConfig'
import './AdminHeader.css'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api/index'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button/LinkButton'

const { confirm } = Modal;

class AdminHeader extends Component {

  state={
    currentTime:formateDate(Date.now()),
    weather:''
  }

  getWeather = async () => {
    const result = await reqWeather('北京')
    this.setState({weather:result.weather})
  }

  getTitle = (menu,path) => {
    let title
    menu.forEach(item => {
      if(item.key === path){
        title = item.title
      }else if(item.children){
       const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
       if(cItem) title = cItem.title
      }
    })
    return title
  }

  showConfirm = () => {
    confirm({
      title: '再次确认',
      icon: <ExclamationCircleOutlined />,
      content: '点击确定退出系统',
      okText:'确认',
      cancelText:'取消',
      onOk: () => {
        storageUtils.removeUser()
        memoryUtils.user = {}
        this.props.history.replace('/login')
      },
    });
  }


  componentDidMount(){
    //获取当前时间
     this.timer = setInterval(() => {
      this.setState({currentTime:formateDate(Date.now())})
    },1000)
    this.getWeather()
  }

  componentWillUnmount(){
    clearInterval(this.timer)
  }

  render() {
    const {currentTime,weather} = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle(MenuList,this.props.location.pathname)
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎,{username}</span>
          <LinkButton onClick={this.showConfirm}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(AdminHeader)
