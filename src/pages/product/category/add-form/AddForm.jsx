import React, { Component } from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
import 'antd/dist/antd.css'

const Item = Form.Item
const Option = Select.Option

//添加对话框的组件
export default  class AddForm extends Component {

  static propTypes = {
    categorys:PropTypes.array.isRequired,//一级分类数组
    parentId:PropTypes.string.isRequired,//父分类的ID
  }

  newName = event => {
    this.props.getNewName(event.target.value)
  }
  onSelect = event => {
    this.props.getId(event)
  }
  render() {
    const {categorys,parentId,parentName,subCategorys} = this.props
    this.props.getId(parentId)
    return (
      <Form>
        <Item>
          <span>所属分类：</span>
        </Item>
        <Item>
          {
            parentId === '0' ? (
              <Select defaultValue='0' onSelect={this.onSelect}>
              <Option key='0'>一级分类</Option>
              {
                categorys.map(item => {
                  return <Option key={item._id}>{item.name}</Option>
                })
              }
            </Select>) : (
              <Select defaultValue={parentId} onSelect={this.onSelect}>
                <Option key={parentId}>{parentName}</Option>
                {
                  subCategorys.map(item => {
                    return <Option key={item._id}>{item.name}</Option>
                  })
                }
              </Select>
            )
          }
            
        </Item>
        <Item>
          <span>分类名称：</span>
        </Item>
        <Item
          name='newName'
          rules={[
            {
              required: true, 
              whitespace:true,
              message: '不能为空！' ,
            },
            {
              min:4,
              message:'至少4位！'
            },
          ]}>
            <Input name='newName' onChange={this.newName} placeholder='请输入分类名称'/>
        </Item>
      </Form>
    )
  }
}

