import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
} from 'antd'
import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button/LinkButton'
import {reqGetUsers,reqDeleteUser,reqAddNewUser} from '../../api'
import UserForm from './add-update-user/UserForm'

// 用户管理路由
export default class User extends Component {

  state = {
    loading:false,
    users:[],
    isShow:false,
    roles:[],
    value:{}
  }

  initColumns = () => {
    this.columns = [
      {
        title:'用户名',
        dataIndex:'username', 
      },
      {
        title:'邮箱',
        dataIndex:'email'
      },
      {
        title:'电话',
        dataIndex:'phone'
      },
      {
        title:'注册时间',
        dataIndex:'create_time',
        render:formateDate
      },
      {
        title:'所属角色',
        dataIndex:'role_id',
        render:role_id => {
          const role = this.state.roles.find(role=>role._id===role_id)
          return (<span>{role.name}</span>)
        }
      },
      {
        title:'操作',
        dataIndex:'',
        render:user=>{
          return(
          <span>
            <LinkButton>修改</LinkButton>
            <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
          </span>)
        }
      },
    ]
  }

  deleteUser = user => {
    Modal.confirm({
      title:`确认删除${user.username}吗？`,
      onOk: async() => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0){
          this.getUsers()
          message.success('删除成功')
        }else{
          message.error('删除失败')
        }
      }
    })
  }

  addOrUpdateUser = async () => {
    const user = this.state.value
    const result = await reqAddNewUser(user)
    if(result.status===0){
      message.success('添加成功')
      this.setState({isShow:false})
      this.getUsers()
    }else{
      message.error('添加失败')
    }
  }

  getUsers = async () => {
    this.setState({loading:true})
    const result = await reqGetUsers()
    this.setState({loading:false})
    if(result.status===0){
      const {users,roles} = result.data
      this.setState({users,roles})
    }else{
      message.error('获取用户列表失败')
    }
  }

  getFormData = (value) => {
    this.setState({value})
  }
  getRoleId = role_id => {
    let value = {...this.state.value}
    value.role_id = role_id
    this.setState({value})
  }

  componentWillMount(){
    this.initColumns()
  }
  componentDidMount(){
    this.getUsers()
  }

  render() {
    const {loading,isShow,users,roles} = this.state
    const title = <Button type='primary' onClick={()=>this.setState({isShow:true})}>创建用户</Button>

    return (
      <Card title={title}>
        <Table
          loading={loading}
          size='medium' 
          dataSource={users} 
          columns={this.columns} 
          bordered 
          rowKey='_id' 
          pagination={
            {
              defaultPageSize:4,
              showQuickJumper:true
            }
          }
        />
        <Modal 
          title="添加用户" 
          visible={isShow} 
          onOk={this.addOrUpdateUser} 
          onCancel={()=>this.setState({isShow:false})}
          dataSource={users}
          okText='确认'
          cancelText='取消'
          destroyOnClose
        >
          <UserForm roles={roles} getFormData={this.getFormData} getRoleId={this.getRoleId}/>
        </Modal>
      </Card>
    )
  }
}
