import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import {UserOutlined,LockOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css'
// import memoryUtils from '../../utils/memoryUtils'

import './Login.css'
import logo from '../../assets/images/logo.png'
// import { reqLogin } from '../../api';
// import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {setHeadTitle,setUser,login} from '../../redux/actions'

class Login extends Component {

  onFinish = async values => {
    const {username,password} = values
    this.props.login(username,password)
    // const data = await reqLogin(username,password)
    // const {status} = data
    // if(status === 0){
    //   message.success('登录成功')
    //   // 保存user
    //   const user = data.data
    //   memoryUtils.user = user//保存到内存
    //   storageUtils.saveUser(user)//保存到local
    //   this.props.setUser(user)
    //   //跳转到后台管理界面(不需要回退用replace,否则用push)
    //   this.props.setHeadTitle('首页')
    //   this.props.history.replace('/home')
    // }else{
    //   message.error(data.msg)
    // }
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  // 对密码进行自定义验证
  validatePwd = (rule,value,callback) => {
    //callback()//验证通过
    //callback('')//验证失败，并指定提示的文本
    if(!value){
      callback('密码不能为空！');
    }else if(value.length < 4){
      callback('密码至少4位！')
    }else if(value.length > 12){
      callback('密码至多12位！')
    }else{
      const reg = /^[a-zA-Z0-9_]+$/
      if(reg.test(value)){
        callback()
      }else{
        callback('密码必须由大小写英文字母、数字或下划线组成！')
      }
    }
  }

  render() {
    // 如果用户已经登录自动跳转到管理界面
    // const user = memoryUtils.user
    const user = this.props.user
    if(user && user._id){
      return <Redirect to='/'/>
    }
    const errMsg = user.errMsg
    if(errMsg){
      message.error(errMsg)
    }

    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt='logo'/>
          <h1>React项目：后台管理系统</h1> 
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form className="login-form"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >

            {/* 用户名和密码的合法性要求
                1.必须输入
                2.必须大于4位
                3.必须小于12位
                4.必须由英文、数字或下划线组成
            */}

            <Form.Item
              name="username"
              // 声明式验证：直接使用别人定义的验证规则验证
              rules={[
                { 
                  required: true, 
                  whitespace:true,
                  message: '用户名不能为空！' ,
                },
                {
                  min:4,
                  message:'用户名至少4位！'
                },
                {
                  max:12,
                  message:'用户名至多12位！'
                },
                {
                  pattern:/^[a-zA-Z0-9_]+$/,
                  message:'用户名必须由英文、数字或下划线组成！'
                }
              ]}
            >
              <Input
                prefix={<UserOutlined type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                type='username'
                placeholder="请输入用户名"
                name='username'
              />
            </Form.Item>

            <Form.Item
              name="password"
              /**
               * 自定义验证
               * rules={[
               *  {
               *    validator:this.validatePwd
               *  }
               * ]}
               */
              rules={[
                {
                  validator:this.validatePwd
                }
              ]}
              // rules={[
              //   { 
              //     required: true, 
              //     whitespace:true,
              //     message: '密码不能为空！' ,
              //   },
              //   {
              //     min:4,
              //     message:'密码至少4位！'
              //   },
              //   {
              //     max:12,
              //     message:'密码至多12位！'
              //   },
              //   {
              //     pattern:/^[a-zA-Z0-9_]+$/,
              //     message:'密码必须由英文、数字或下划线组成！'
              //   }
              // ]}
            >
              <Input
                prefix={<LockOutlined type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                type="password"
                placeholder="请输入密码"
                name='password'
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {
    setHeadTitle,
    setUser,
    login,
  }
)(Login)

