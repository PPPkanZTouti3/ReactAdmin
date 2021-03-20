import React, { Component } from 'react'
import {
    List,
    Card,
} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {BASE_IMG} from '../../utils/constants'
import {reqCategory} from '../../api/index'
const Item = List.Item;
export default class ProductDetail extends Component {

    state = {
        cName1: '',
        cName2: ''
    }

    async componentDidMount () {
        const {pCategoryId, categoryId} = this.props.location.state.product;
        if(pCategoryId === '0'){
            let res = await reqCategory(categoryId);
            this.setState({cName1: res.data.name})
        }
        else{
            let res = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = res[0].data.name;
            const cName2 = res[1].data.name;
            this.setState({cName1,cName2})
        }
    }

    render() {
        const {name, desc, price, detail, imgs} = this.props.location.state.product;
        const {cName1,cName2} = this.state;
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined style={{marginRight: 10, fontSize: 20}} onClick={()=>this.props.history.goBack()}/>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称：</span>
                        {name}
                    </Item>

                    <Item>
                        <span className='left'>商品描述：</span>
                        {desc}
                    </Item>

                    <Item>
                        <span className='left'>商品价格：</span>
                        {price}元
                    </Item>

                    <Item>
                        <span className='left'>所属分类：</span>
                        {cName1} {cName2 ? ' --> ' + cName2 : ''}
                    </Item>

                    <Item>
                        <span className='left'>商品图片：</span>
                        {
                            imgs.map((img)=>{
                                <img key={img} src={BASE_IMG + img} alt="img" className='product-img'/>
                            })
                        }
                    </Item>

                    <Item style={{display:'flex', justifyContent:'flex-start'}}>
                        <span className='left'>商品详情：</span>
                        <span className='normal' dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
