import React, { Component } from 'react'
import {
    Card,
    Table,
    Select,
    Input,
    Button,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index'

const Option = Select.Option;
export default class ProductHome extends Component {

    state = {
        products: [], // 商品的数组
        total: 0, // 页码总页数
        loading: false,
        searchName: '',
        searchType: 'productName'
    }

    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (product) => {
                    const {_id,status} = product
                    
                    const newStatus = status===1? 2 : 1;
                    return (
                        <span>
                            <Button 
                                type='primary'
                                onClick={()=>this.updateStatus(_id,newStatus)}
                            >
                                {status===1 ? '下架' : '上架'}
                            </Button>
                            <span>{status===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push('./product/detail',{product})}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

    getProducts = async (pageNum) => {
        this.pageNum = pageNum;
        this.setState({ loading: true })
        const { searchName, searchType } = this.state;
        let res;
        if (searchName === '') {
            res = await reqProducts(pageNum, PAGE_SIZE);
        } else {
            // 参数传的是对象
            res = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        }
        this.setState({ loading: false })
        if (res.status === 0) {
            const { total, list } = res.data
            this.setState({ total, products: list })

        }
    }

    updateStatus = async(productId, status) =>{
        console.log(productId)
        const res = await reqUpdateStatus(productId, status)
        if(res.status === 0){
            message.success('更新商品成功');
            this.getProducts(this.pageNum)
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1);
    }

    render() {
        const { products, loading, total, searchType, searchName } = this.state;

        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>

                <Input
                    placeholder='关键字'
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={e => this.setState({ searchName: e.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>
                    搜索
                </Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <PlusOutlined />添加商品
            </Button>
        )


        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={products}
                    columns={this.columns}
                    rowKey='_id'
                    bordered
                    loading={loading}
                    pagination={
                        {
                            current: this.pageNum,
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            total,
                            onChange: this.getProducts
                        }
                    }
                />;
            </Card>
        )
    }
}
