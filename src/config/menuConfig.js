
const menuList=[
    {
        title:'首页',
        key:'/home',
        icon:'HomeOutlined',
    },
    {
        title:'商品',
        icon:'AppstoreOutlined',
        key:'/product',
        children:[
            {
                title:'品类管理',
                key:'/product/category',
                icon:'BarsOutlined'
            },
            {
                title:'商品管理',
                key:'/product/productManage',
                icon:'ToolOutlined'
            }
        ]
    },
    {
        title:'用户管理',
        key:'/user',
        icon:'UserOutlined'   
    },
    {
        title:'角色管理',
        key:'/role',
        icon:'CheckCircleOutlined'
    },
    {
        title:'图形图表',
        icon:'AreaChartOutlined',
        key:'/charts',
        children:[
            {
                title:'柱形图',
                key:'/charts/bar',
                icon:'BarChartOutlined'
            },
            {
                title:'折线图',
                key:'/charts/line',
                icon:'LineChartOutlined'
            },
            {
                title:'饼图',
                key:'/charts/pie',
                icon:'PieChartOutlined'
            }
        ]
    }
]

export default menuList