import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form,Input} from 'antd'
import 'antd/dist/antd.css'

const Item = Form.Item

//更新对话框的组件
export default  class UpdateForm extends Component {
  static propTypes = {
    categoryName:PropTypes.string.isRequired,
    getNewName:PropTypes.func.isRequired,
  }

  newName = event => {
    this.props.getNewName(event.target.value)
  }

  validateName = (rule,value,callback) => {
    if(!value){
      callback('不能为空!')
    }else{
      callback()
    }
  }

  render() {
    return (
      <Form> 
        <p>重命名分类名称：</p>
        <Item
          name='newName'
          rules={[
            {
              validator:this.validateName
            },
          ]}  
        >
            <Input name='newName' type='newName' onChange={this.newName} placeholder='输入分类名称'/>
        </Item>
      </Form>
    )
  }
}


