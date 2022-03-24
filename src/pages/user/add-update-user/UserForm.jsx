import React, { PureComponent } from 'react'
import {
    Form,
    Input,
    Select,
} from 'antd'

const {Item} = Form
const {Option} = Select
export default class UserForm extends PureComponent {
    
    formRef = React.createRef()
    handleChange = () => {
        this.props.getFormData(this.formRef.current.getFieldsValue())
    }
    showRole = roleId => {
      this.props.getRoleId(roleId)
    }
  render() {
      const {roles} = this.props
    return (
      <Form ref={this.formRef} onChange={this.handleChange}> 
          <Item label='用户名' name='username'>
            <Input className='input' placeholder='请输入用户名'/>
          </Item>
          <Item label='密码' name='password'>
            <Input type='password' className='input' placeholder='请输入密码'/>
          </Item>
          <Item label='手机号' name='phone'>
            <Input className='input' placeholder='请输入手机号'/>
          </Item>
          <Item label='邮箱' name='email'>
            <Input className='input' placeholder='请输入邮箱'/>
          </Item>
          <Item label='角色' name='role_id'>
            <Select placeholder='请选择角色' onSelect={this.showRole}>
                {
                    roles.map(role=><Option key={role._id}>{role.name}</Option>)
                }
            </Select>
          </Item>
      </Form>
    )
  }
}
