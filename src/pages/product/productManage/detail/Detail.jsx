import React, { Component } from 'react'
import {
  Card,
  List,
  message,
} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import 'antd/dist/antd.css'
import '../product.css'
import LinkButton from '../../../../components/link-button/LinkButton'
import {BASE_IMG_URL} from '../../../../utils/constants'
import {reqCategory} from '../../../../api'

const Item = List.Item

// 详情页
export default class Detail extends Component {
  state={
    cName1:'',//一级名称
    cName2:'',//二级名称
  }

  async componentDidMount(){
    const {categoryId,pCategoryId} = this.props.location.state.product
    if(pCategoryId==='0'){
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    }else{
      //通过多个await方式发送多个请求：后一个请求在前一个请求返回后才发送
      // const result1 = await reqCategory(pCategoryId)
      // const result2 = await reqCategory(categoryId)
      // const cName1 = result1.data.name
      // const cName2 = result2.data.name

      // 一次性发送多个请求，只有都成功才正常处理
      const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({cName1,cName2})
    }
  }
  render() {

    // 读取传递过来的数据
    const {name,desc,price,imgs,detail} = this.props.location.state.product
    const {cName1,cName2} = this.state
    /**
     * categoryId: "5fc74b650dd9b10798413162"
        desc: "年度重量级新品，X390、T490全新登场 更加轻薄机身设计9"
        detail: "<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">想你所需，超你所想！精致外观，轻薄便携带光驱，内置正版office杜绝盗版死机，全国联保两年！</span></p>\n<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">联想（Lenovo）扬天V110 15.6英寸家用轻薄便携商务办公手提笔记本电脑 定制【E2-9010/4G/128G固态】 2G独显 内置</span></p>\n<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\"></span></p>\n"
        imgs: ['1578588737108-index.jpg']
        name: "联想ThinkPad 翼4809"
        pCategoryId: "5e12b8bce31bb727e4b0e348"
        price: 6300
        status: 2
        __v: 0
        _id: "5e12b97de31bb727e4b0e349"
     */
    const title = (
      <span>
        <LinkButton>
          <ArrowLeftOutlined 
            style={{color:'rgb(80, 78, 206)',marginRight:10,fontSize:20}}
            onClick={()=>this.props.history.goBack()}
            />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称:</span>
            <span className='right'>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述:</span>
            <span className='right'>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格:</span>
            <span className='right'>{price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类:</span>
            <span className='right'>{cName1} {cName2?'-->'+cName2:''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片:</span>
            <span className='right'>
              {
                imgs.map(img => (
                  <img
                    key={img}
                    className='product-img'
                    src={BASE_IMG_URL + img}
                    alt='img'
                  />
                ))
              }
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}
