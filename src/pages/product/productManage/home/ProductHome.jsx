import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message
} from 'antd'
import 'antd/dist/antd.css'
import {PlusOutlined} from '@ant-design/icons'
import LinkButton from '../../../../components/link-button/LinkButton'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../../../api'
import {PAGE_SIZE} from '../../../../utils/constants'

const Option = Select.Option

// productManage的默认子路由组件
export default class ProductHome extends Component {

  state = {
    products:[],
    loading:false,
    total:0,//商品的总数量
    searchType:'productName',
    keyword:'',
  }

  updateStatus = async (productId,status) => {
    const result = await reqUpdateStatus(productId,status)
    if(result.status===0){
      this.getProducts(this.pageNum)
      if(status===1){
        message.success('上架成功')
      }else{
        message.success('下架成功')
      }
    }else{
      if(status===1){
        message.error('上架失败')
      }else{
        message.error('下架失败')
      }
    }
  }

  initColunms = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        width:200
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        width:470
      },
      {
        title: '价格',
        dataIndex: 'price',
        width:90,
        render:price => '￥' + price
      },
      {
        title: '状态',
        dataIndex: '',
        width:50,
        render:product=>{
          const {status,_id} = product
          const newStatus = status===1?2:1
          return(
            <span>
              <Button type='primary' onClick={()=>this.updateStatus(_id,newStatus)}>{status===2?'上架':'下架'}</Button>
              <span>{status===1?'在售':'已下架'}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        dataIndex: '',
        width:80,
        render:product=>{
          return(
            <span>
              {/* 将product对象使用state传递给目标路由组件 */}
              <LinkButton onClick={()=>this.props.history.push('/product/productManage/detail',{product})}>详情</LinkButton>
              <LinkButton onClick={()=>this.props.history.push('/product/productManage/addupdate',product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  // 获取指定页码的商品数据
  getProducts = async pageNum => {
    // 保存当前页码
    this.pageNum = pageNum
    const {keyword,searchType} = this.state
    let result
    this.setState({loading:true})
    if(!keyword.trim()){//搜索框为空
      result = await reqProducts(pageNum,PAGE_SIZE)
    }else{
      result = await reqSearchProducts({searchName:keyword,pageNum,pageSize:PAGE_SIZE,searchType})
    }
    this.setState({loading:false})
    if(result.status === 0){
      const {total,list} = result.data
      this.setState({total,products:list})
    }else{
      message.error('获取失败')
    }
  }

  // 获取搜索类型
  handleSearch = value => {
    this.setState({searchType:value})
  }

  // 获取搜索关键词
  handleKeyword = event => {
    this.setState({keyword:event.target.value})
  }


  constructor(){
    super()
    this.initColunms()
  }

  componentDidMount(){
    this.getProducts(1)
  }

  render() {

    const {products} = this.state

    const title = (
        <span>
            <Select onChange={this.handleSearch} defaultValue='productName' style={{width:150}}>
                <Option value='productName'>按名称搜索</Option>
                <Option value='productDesc'>按描述搜索</Option>
            </Select>
            <Input onChange={this.handleKeyword} placeholder='关键字' style={{width:150,margin:'0 15px'}}/>
            <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
        </span>
    )

    const extra = (
        <Button type='primary' onClick={()=>this.props.history.push('/product/productManage/addupdate')}>
            <PlusOutlined/>
            添加商品
        </Button>
    )

    return (
      <Card title={title} extra={extra}>
          <Table 
            dataSource={products} 
            columns={this.columns} 
            loading={this.state.loading}
            rowKey='_id'  
            bordered
            pagination={
              {
                defaultCurrent:1,
                showQuickJumper:true,
                total:this.state.total,
                defaultPageSize:PAGE_SIZE,
                onChange:this.getProducts
              }
            }
          />;
      </Card>
    )
  }
}
