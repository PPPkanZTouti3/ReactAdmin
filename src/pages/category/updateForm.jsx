import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'

const Item = Form.Item;

export default class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    
    formRef = React.createRef();

    UNSAFE_componentWillMount(){
        this.props.setForm(this.formRef)
        // this.props.setForm(form)
    }

    render() {
        
        const {categoryName} = this.props
        console.log(categoryName)
        return (
            <Form ref={this.formRef} >
            {/* // <Form form={form} > */}
                <Item name='categoryName' 
                    initialValue={categoryName}
                    rules={[
                        {required: true, message: '分类名称必须输入'}
                      ]}
                >
                    <Input placeholder='请输入分类名称'></Input>
                </Item>
            </Form>
        )
    }
}
