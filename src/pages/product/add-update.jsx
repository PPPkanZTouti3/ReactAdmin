import React, { Component } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Button,
    message
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { reqCategorys, reqUpdateProduct, reqAddProduct } from '../../api/index'
import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const { Item } = Form;
const { TextArea } = Input;

export default class ProductAddUpdate extends Component {
    formRef = React.createRef();
    pw = React.createRef();
    editor = React.createRef();
    state = {
        options: [],
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        const subCategorys = await this.getCategorys(targetOption.value);
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map((item) => ({
                label: item.name,
                value: item._id,
                isLeaf: true
            }))
            targetOption.children = childOptions;
        }
        else {
            targetOption.isLeaf = true;
        }

        this.setState({
            options: [...this.state.options],
        })

    };

    initOptions = async (categorys) => {
        const options = categorys.map(item =>
            ({
                label: item.name,
                value: item._id,
                isLeaf: false
            })
        )

        // 如果是一个二级分类列表的更新
        const { isUpdate, product } = this;
        const { pCategoryId } = product;
        if (isUpdate && pCategoryId !== '0') {
            const subCategorys = await this.getCategorys(pCategoryId);
            const childOptions = subCategorys.map(item => ({
                label: item.name,
                value: item._id,
                isLeaf: true
            }))

            const targetOption = options.find((option) => option.value === pCategoryId);
            targetOption.children = childOptions;
        }

        this.setState({ options })
    }

    getCategorys = async (parentId) => {
        const res = await reqCategorys(parentId);
        if (res.status === 0) {
            const categorys = res.data;
            // 如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys)
            }
            else {
                return categorys;
            }

        }
    }

    submit = async () => {
        try {
            const values = await this.formRef.current.validateFields();
            console.log('Success:', values);

            // 1.准备数据
            const {name,desc,price,categoryIds} = values
            let categoryId, pCategoryId;
            if(categoryIds.length === 1){
                pCategoryId = '0';
                categoryId = categoryIds[0];
            }
            else{
                pCategoryId = categoryIds[0];
                categoryId = categoryIds[1];
            }
            const imgs = this.pw.current.getImgs();
            const detail = this.editor.current.getDetail();
            const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}

            // 如果是更新
            if(this.isUpdate){
                product._id = this.product._id;
            }
            console.log(product._id)
            console.log(product)
            let res;
            // 调用接口
            if(this.isUpdate){
                res = await reqUpdateProduct(product)
            }
            else{
                res = await reqAddProduct(product)
            }

            // 处理数据
            if(res.status === 0){
                message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
            }else{
                message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
            }
            
            console.log('imgs', imgs,detail)
            message.success('提交校验成功')
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            message.warn('提交校验失败')
        }
    }

    UNSAFE_componentWillMount() {
        // 取出携带的state
        const product = this.props.location.state;
        // 保存是否更新的标识符
        this.isUpdate = !!product;
        this.product = product || {};
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    render() {
        const { options } = this.state;
        const { isUpdate, product } = this;
        const { pCategoryId, categoryId, imgs, detail } = product
        const categoryIds = [];
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId);
            }
            else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId);
            }
        }

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        }

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )


        //this.setState({options:optionLists})

        return (
            <Card title={title}>
                <Form {...formItemLayout} ref={this.formRef}>
                    <Item
                        label='商品名称'
                        name='name'
                        initialValue={product.name}
                        rules={[{ required: true, message: '必须输入商品名称' }]}
                    >
                        <Input placeholder='请输入商品名称'></Input>
                    </Item>

                    <Item
                        label='商品描述'
                        name='desc'
                        initialValue={product.desc}
                        rules={[{ required: true, message: '必须输入商品描述' }]}
                    >
                        <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }}></TextArea>
                    </Item>

                    <Item
                        label='商品价格'
                        name='price'
                        initialValue={product.price}
                        rules={[
                            { required: true, message: '必须输入商品价格' },
                            {
                                validator: (_, value) =>
                                    value * 1 > 0 ? Promise.resolve() : Promise.reject(new Error('价格必须大于0')),
                            }
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元'></Input>
                    </Item>

                    <Item
                        label='商品分类'
                        name='categoryIds'
                        initialValue={categoryIds}
                        rules={[
                            { required: true, message: '必须输入商品分类' },
                        ]}
                    >
                        <Cascader
                            options={options}
                            placeholder='请指定商品分类'
                            loadData={this.loadData}

                        />
                    </Item>

                    <Item label='商品图片'>
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>

                    <Item 
                        label='商品详情' 
                        labelCol={{ span: 2 }}
                        wrapperCol= {{ span: 20 }}
                    >
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>

                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
