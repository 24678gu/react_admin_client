import React, { Component } from 'react'
import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  message
} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../../../components/link-button/LinkButton'
import { reqCategorys,reqAddOrUpdateProduct } from '../../../../api'
import PicturesWall from './pictures-wall/PicturesWall'
import RichTextEditor from './rich-text-editor/RichTextEditor'

const {Item} = Form
const {TextArea} = Input

// productManage的添加和更新的子路由组件
class ProductAddUpdate extends Component {

  state = {
    options:[],
  }

  imageRef = React.createRef()
  textRef = React.createRef()

  initOptions = async categorys => {
    const options = categorys.map(item => (
      {
        value:item._id,
        label:item.name,
        isLeaf:false,
      })
    )

    //如果是一个二级分类商品的更新
    const {isUpdate,product} = this
    const {pCategoryId,categoryId} = product
    if(isUpdate && pCategoryId !== '0'){
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      //生成二级列表的下拉列表的options
      const childOptions = subCategorys.map(c=>({
        label:c.name,
        value:c._id,
        isLeaf:true
      }))
      //关联一级option上
      const targetOption = options.find(option => option.value===pCategoryId)
      targetOption.children = childOptions
    }

    this.setState({options})
  }

  // async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
  getCategorys = async parentId => {
    const result = await reqCategorys(parentId)
    if(result.status===0){
      const categorys = result.data
      if(parentId==='0'){
        this.initOptions(categorys)
      }else{//二级列表
        return categorys//当前async函数返回的promise就会成功且value为categorys
      }
    }else{
      message.error('获取数据失败')
    }
  }

  onFinish = async values => {
    const {productName,desc,price,classify} = values
    let pCategoryId,categoryId
    if(classify.length===1){
      pCategoryId = '0'
      categoryId = classify[0]
    }else{
      pCategoryId = classify[0]
      categoryId = classify[1]
    }
    const imageName = this.imageRef.current.getImgs()
    const detail = this.textRef.current.getDetail()
    const product = {
      name:productName,
      desc,
      price,
      imgs:imageName,
      detail,
      pCategoryId,
      categoryId,
    }
    if(this.isUpdate){
      product._id = this.product._id
    }
    const result = await reqAddOrUpdateProduct(product)
    if(result.status===0){
      message.success(`${this.isUpdate?'更新':'添加'}商品成功`)
      this.props.history.goBack()
    }else{
      message.error(`${this.isUpdate?'更新':'添加'}商品成功`)
    }
  }

  // 验证价格的函数
  validatePrice = (rule,value,callback) => {
    const price = value*1
    if(price){
      if(price >= 0){
        callback()
      }else{
        callback('价格不能是负数')
      }
    }else{
      callback('请输入数字')
    }
  }

  //用于加载下一级列表的回调函数
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0]
    //显示loading
    targetOption.loading = true
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if(subCategorys && subCategorys.length > 0){
      targetOption.children = subCategorys.map(c => (
        {
          label:c.name,
          value:c._id,
          isLeaf:true
        }
      ))
      this.setState({
        options:[...this.state.options]
      })
    }else{//当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }
  }

  componentWillMount(){
    const product = this.props.location.state
    // console.log(product)
    this.isUpdate = !!product
    this.product = product || {}
  }

  componentDidMount(){
    this.getCategorys('0')//获取一级列表
  }

  render() {
    const {isUpdate,product} = this
    const {name,price,desc,categoryId,pCategoryId,detail,imgs,_id} = product
    //用来接收级联分类ID的数组
    const categoryIds = []
    if(isUpdate){
      //只有一级分类的商品
      if(pCategoryId==='0'){
        categoryIds.push(categoryId)
      }else{//二级分类商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const title = (
      <span>
        <LinkButton onClick={()=>this.props.history.goBack()}>
          <ArrowLeftOutlined style={{fontSize:20}}/>
        </LinkButton>
        <span>{isUpdate?'修改商品':'添加商品'}</span>
      </span>
    )
    
    return (
      <Card title={title}>
        <Form
         labelCol={{ span: 2 }}
         wrapperCol={{ span: 12 }}
         onFinish={this.onFinish}
        >
          <Item initialValue={name} label='商品名称' name='productName' rules={[{ required: true, message: '商品名称不能为空!' }]}>
            <Input placeholder='输入商品名称'/>
          </Item>
          <Item initialValue={desc} label='商品描述' name='desc' rules={[{ required: true, message: '商品描述不能为空!' }]}>
            <TextArea placeholder='请输入商品描述(最多100字)' rows={4} autoSize={{minRows:3}} showCount maxLength={100}/>
          </Item>
          <Item initialValue={price} label='商品价格' name='price' rules={[
            { required: true, message: '必须填写商品价格!' },
            {validator:this.validatePrice}
            ]}>
            <Input prefix="￥" suffix="元" placeholder='填写商品价格'/>
          </Item>
          <Item initialValue={categoryIds} label='商品分类' name='classify'>
            <Cascader 
              options={this.state.options}//需要显示的列表数据数组
              loadData={this.loadData}//当选择某个列表项，加载下一级列表的监听回调
              placeholder='请选择商品分类'
            />
          </Item>
          <Item label='商品图片' name='imgs'>
            <PicturesWall ref={this.imageRef} imgs={imgs}/>
          </Item>
          <Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:20}} name='detail'>
            <RichTextEditor detail={detail} ref={this.textRef}/>
          </Item>
          <Item>
            <Button type='primary' htmlType='submit'>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default ProductAddUpdate
