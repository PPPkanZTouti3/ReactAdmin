import React, { Component } from 'react'
import {
    Form,
    Input
} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item;

export default class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    formRef = React.createRef();

    UNSAFE_componentWillMount(){
        this.props.setForm(this.formRef)
    }

    render() {
        return (
            <Form ref={this.formRef}>
                <Item 
                    label='角色名称'
                    name='roleName'
                    rules={[
                        {required: true, message: '角色名称必须输入'}
                      ]}
                >
                    <Input placeholder='请输入角色名称'></Input>
                </Item>
            </Form>
        )
    }
}
