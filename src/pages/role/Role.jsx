import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  message,
  Modal,
} from 'antd'
import { reqGetRoles,reqAddRole,reqUpdateRole } from '../../api'
import AddForm from './add-form/AddForm'
import SetRole from './set-form/SetRole'

// 角色管理路由
export default class Role extends Component {
  state = {
    roles:[],//所有角色列表
    role:{},//选中的role
    loading:false,
    showAddStatus:false,
    showAuthStatus:false
  }

  addRef = React.createRef()
  updateRef = React.createRef()

  initColumn = () => {
    this.columns = [
      {
        title:'角色名称',
        dataIndex:'name'
      },
      {
        title:'创建时间',
        dataIndex:'create_time'
      },
      {
        title:'授权时间',
        dataIndex:'auth_time'
      },
      {
        title:'授权人',
        dataIndex:'auth_name'
      },
    ]
  }

  getRoles = async () => {
    this.setState({loading:true})
    const result = await reqGetRoles()
    this.setState({loading:false})
    if(result.status===0){
      this.setState({roles:result.data})
    }else{
      message.error('获取角色列表失败')
    }
  }

  onRow = role => {
    return {
      onClick:event => {
        this.setState({role})
      },
      onChange:event => {
        this.setState({role})
      }
    }
  }

  // 添加用户
  addRole = async () => {
    const roleName = this.addRef.current.showRoleName()
    const result = await reqAddRole(roleName)
    if(result.status===0){
      this.getRoles()
      message.success('添加成功')
      this.handleAddVisible(false)
    }else{
      message.error('添加失败')
    }
  }

  //关闭/开启对话框
  handleAddVisible = showAddStatus => {
    this.setState({showAddStatus})
  }

  handleAddOk = () => {
    this.addRole()
  };

  handleAddCancel = () => {
    this.handleAddVisible(false)
  };



  //关闭/开启对话框
  handleSetVisible = showAuthStatus => {
    this.setState({showAuthStatus})
  }

  // 更新角色
  updateRole = async () => {
    const menus = this.updateRef.current.getCheckedKeys()
    if(menus.length===0){
      message.info('未做出任何修改')
    }else{
      const {_id,auth_name} = this.state.role
      const role = {_id,auth_name,menus}
      const result = await reqUpdateRole(role)
      console.log('result',result)
      if(result.status===0){
        message.success('修改成功')
        this.handleSetVisible(false)
      }else{
        message.error('修改失败')
      }
    }
  }

  handleSetCancel = () => {
    this.handleSetVisible(false)
  };


  componentWillMount(){
    this.initColumn()
  }
  componentDidMount(){
    this.getRoles()
  }
  render() {
    const {roles,loading,role,showAddStatus,showAuthStatus} = this.state
    const title = (
      <span>
        <Button type='primary' onClick={()=>this.handleAddVisible(true)}>创建角色</Button>&nbsp;&nbsp;
        <Button type='primary' onClick={()=>this.handleSetVisible(true)} disabled={!role._id}>设置角色权限</Button>
      </span>
    )
    return (
      <div>
      <Card title={title}>
        <Table
          loading={loading}
          size='medium' 
          dataSource={roles} 
          columns={this.columns} 
          bordered 
          rowKey='_id' 
          pagination={
            {
              defaultPageSize:4,
              showQuickJumper:true
            }
          }
          rowSelection={
            {type:'radio',
            selectedRowKeys:[role._id],
            }}
          onRow={this.onRow}
        />
      </Card>
      <Modal 
        title="创建角色" 
        visible={showAddStatus} 
        onOk={this.handleAddOk} 
        onCancel={this.handleAddCancel}
        okText='确认'
        cancelText='取消'
        destroyOnClose
      >
        <AddForm ref={this.addRef}/>
      </Modal>
      <Modal 
        title="设置角色权限" 
        visible={showAuthStatus} 
        onOk={this.updateRole} 
        onCancel={this.handleSetCancel}
        okText='确认'
        cancelText='取消'
        destroyOnClose
      >
        <SetRole role={role} ref={this.updateRef}/>
      </Modal>
      </div>
    )
  }
}
