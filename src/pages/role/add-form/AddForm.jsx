import React, { Component } from 'react'
import{Form, Input} from 'antd'

const{Item} = Form

export default class AddForm extends Component {
  state = {
    roleName:'',
  }
  changeName = event => {
    this.setState({roleName:event.target.value})
  }
  showRoleName = () => {
    return this.state.roleName
  }
  render() {
    return (
      <Form>
        <Item
          rules={[
            {
              required: true, 
              message: '角色名称不能为空！' ,
            },
          ]}
        >
          <span style={{marginLeft:20}}>角色名称：</span>
          <Input onChange={this.changeName} style={{width:300,marginRight:80}} placeholder='请输入角色名称'/>
        </Item>
      </Form>
    )
  }
}
