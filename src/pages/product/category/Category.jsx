import React, { Component } from 'react'
import { Button, Card,message,Table,Modal } from 'antd';
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons'
import 'antd/dist/antd.css'
import LinkButton from '../../../components/link-button/LinkButton'
import { reqCategorys,reqUpdateCategorys,reqAddCategorys } from '../../../api';
import AddForm from './add-form/AddForm';
import UpdateForm from './update-form/UpdateForm';

// 商品分类路由
export default class Category extends Component {

  state = {
    categorys:[],//一级分类列表
    subCategorys:[],//二级分类列表
    loading:false,//是否正在获取数据中
    parentId:'0',//当前需要显示的分类列表的parentId
    parentName:'',//当前需要显示的分类列表的父分类名称
    showStatus:0,//标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
  }

  

  // 初始化表格
  initTable = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: '',
        width:300,
        render: category => (
          <span>
            <LinkButton onClick={()=>{
              this.category = category
              this.setState({showStatus:2})
            }}>
              修改分类
            </LinkButton>
            {this.state.parentId === '0'?<LinkButton onClick={this.showSubCategorys(category)}>查看子分类</LinkButton>:null}
          </span>
        )
      },
    ]
  }

  showSubCategorys = category => {
    return () => {
      const {_id,name} = category
      this.setState({
        parentId:_id,
        parentName:name
      },() => {
        this.getCategorys()
      })
    }
  }

  // 异步获取一/二级列表
  getCategorys = async () => {
    // 发请求前loading
    this.setState({loading:true})
    const {parentId} = this.state
    const result = await reqCategorys(parentId)
    // 完成后隐藏loading
    this.setState({loading:false})
    if(result.status === 0){
      const categorys = result.data
      if(parentId === '0'){
        //更新一级分类状态
        this.setState({categorys})
      }else{
        // 更新二级分类状态
        this.setState({subCategorys:categorys})
      }
    }else{
      message.error('获取分类列表失败')
    }
  }

  //返回上一级
  returnBack = () => {
    this.setState({parentId:'0'},() => {this.getCategorys()})
  }

  // 隐藏对话框
  handleCancel = () => {
    this.setState({showStatus:0})
  }

  // 添加分类
  addCategory = async () => {
    const result = await reqAddCategorys(this.category.name,this.category._id)
    if(result.status === 0){
      if(this.category._id === this.state.parentId){
        this.getCategorys()
      }
      this.handleCancel()
      message.success('添加成功')
    }else{
      message.error('添加失败')
    }
  }

  //更新分类名称
  updateCategory = categoryId => {
    return async () => {
      if(categoryId){
        const categoryName = this.category.name
        console.log(categoryName)
        const result = await reqUpdateCategorys({categoryId,categoryName})
        if(result.status === 0){
          this.getCategorys()
          this.handleCancel()
          message.success('更新成功')
        }else{
          message.error('更新失败')
        }
      }
    }
  }

  //获得新名称
  getNewName = newName => {
    this.category.name = newName
  }

  getId = id => {
    this.category._id = id
  }

  componentWillMount = () => {
    this.initTable()
  }

  // 异步ajax请求
  componentDidMount = () => {
    //获取一级分类列表
    this.getCategorys()
  }

  render() {

    const {categorys,loading,subCategorys,parentId,parentName,showStatus} = this.state
    
    const title = parentId==='0'?'一级分类列表':(
      <span>
        <LinkButton onClick={this.returnBack}>一级分类列表</LinkButton>&nbsp;&nbsp;
        <ArrowRightOutlined />&nbsp;&nbsp;
        <span>{parentName}</span>
      </span>
    )

    const extra = (
      <div>
        <Button type='primary' onClick={()=>{this.setState({showStatus:1})}}>
          <PlusOutlined />
          添加
        </Button>
        
      </div>
    )

    if(!this.category){
      this.category={_id:'',name:''}
    }
    
    return (
      <Card title={title} extra={extra} size='small'>
        <Table 
          loading={loading} 
          size='medium' 
          dataSource={parentId === '0' ? categorys : subCategorys} 
          columns={this.columns} 
          bordered 
          rowKey='_id' 
          pagination={
            {
              defaultPageSize:5,
              showQuickJumper:true
            }
          }
        />
        <Modal title="添加分类" visible={showStatus===1} cancelText='取消' okText='确定' destroyOnClose={true} onOk={this.addCategory} onCancel={this.handleCancel}>
          <AddForm categorys={categorys} parentId={parentId} parentName={parentName} subCategorys={subCategorys} getNewName={this.getNewName} getId={this.getId}/>
        </Modal>
        <Modal title="修改分类" visible={showStatus===2} cancelText='取消' okText='确定' destroyOnClose={true} onOk={this.updateCategory(this.category._id)} onCancel={this.handleCancel}>
          <UpdateForm categoryName={this.category.name} getNewName={this.getNewName}/>
        </Modal>
      </Card>
    )
  }
}
