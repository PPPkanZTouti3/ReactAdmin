import React, { PureComponent } from 'react'
import {
    Form,
    Input,
    Select
} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item;
const Option = Select.Option;
export default class UserForm extends PureComponent {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    formRef = React.createRef();

    UNSAFE_componentWillMount(){
        this.props.setForm(this.formRef)
    }

    render() {
        const {roles,user} = this.props;
        
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
          }
        return (
            <Form ref={this.formRef} {...formItemLayout}>
                <Item 
                    label='用户名'
                    name='username'
                    initialValue={user.username}
                    rules={[
                        {required: true, message: '用户名必须输入'}
                      ]}
                >
                    <Input placeholder='请输入用户名'></Input>
                </Item>

                {
                    user._id ? null : (
                        <Item 
                            label='密码'
                            name='password'
                            rules={[
                                {required: true, message: '密码必须输入'}
                            ]}
                        >
                            <Input type='password' placeholder='请输入密码'></Input>
                        </Item>
                    )
                }

                <Item 
                    label='手机号'
                    name='phone'
                    initialValue={user.phone}
                    rules={[
                        {required: true, message: '手机号必须输入'}
                      ]}
                >
                    <Input placeholder='请输入手机号'></Input>
                </Item>

                <Item 
                    label='邮箱'
                    name='email'
                    initialValue={user.email}
                    rules={[
                        {required: true, message: '邮箱必须输入'}
                      ]}
                >
                    <Input placeholder='请输入邮箱'></Input>
                </Item>

                <Item 
                    label='角色'
                    name='role_id'
                    initialValue={user.role_id}
                    rules={[
                        {required: true, message: '角色必须输入'}
                      ]}
                >
                    <Select placeholder='请选择角色分类'>
                        {
                            roles.map((role)=>
                            <Option key={role._id} value={role._id}>{role.name}</Option>
                            )
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
