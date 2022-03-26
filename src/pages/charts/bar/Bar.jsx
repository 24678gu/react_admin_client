import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react'
import {
  Button,
  Card,
} from 'antd'

// 柱形图
export default class Bar extends Component {
  state = {
    data:[23, 24, 18, 25, 27, 28, 25]
  }
  // 更新
  update = () => {
    this.setState(state=>({
      data:state.data.map(i=>i+1)
    }))
  }
  // 返回柱状图的配置对象
  getOption = () => {
    return {
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: this.state.data
        }
      ]
    };
  }
  render() {

    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>
        <Card title='柱状图1'>
          <ReactECharts option={this.getOption()}/>
        </Card>
      </div>
    )
  }
}
