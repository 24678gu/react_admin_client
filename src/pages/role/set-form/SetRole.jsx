import React, { Component } from 'react'
import{
    Form, 
    Input,
    Tree,
} from 'antd'
import menuList from '../../../config/menuConfig'

const{Item} = Form
// menuList[1].key='/products'
// menuList[1].children[0].key='/category'
// menuList[1].children[1].key='/product'

export default class SetRole extends Component {
    state = {
        checked:[]
    }
  
    onCheck = (checkedKeys,info) => {
        // const newKeys = checkedKeys.map(i => {
        //     if(i==='/products') return '/product'
        //     else if(i==='/category') return '/product/category'
        //     else if(i==='/product') return '/product/productManage'
        //     else return i
        // })
        this.setState({checked:checkedKeys})
    }

    getCheckedKeys = () => {
        return this.state.checked
    }

    render() {
        const treeData = [
            {
                title:'平台权限',
                key:'all',
                children:menuList
            }
        ]
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
                <Input value={this.props.role.name} disabled style={{width:300,marginRight:80}} placeholder='请输入角色名称'/>
            </Item>
            <Item style={{marginTop:20}}>
                <span>角色权限变更：<br/></span>
                <br/>
                <Tree
                    checkable
                    onCheck={this.onCheck}
                    treeData={treeData}
                    defaultExpandAll
                    defaultCheckedKeys={this.props.role.menus}
                />
            </Item>
        </Form>
    )
  }
}
