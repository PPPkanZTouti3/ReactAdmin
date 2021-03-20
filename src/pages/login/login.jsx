import React, { PureComponent } from 'react'
import {
    Form,
    Input,
    Button,
    message
} from 'antd';
import {Redirect} from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'

import {login} from '../../redux/actions'
import {reqLogin} from '../../api/index'
import logo from "../../assets/images/logo.jpg"
import './login.less'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils.js'
class Login extends PureComponent {
    //创建ref容器，获取Form节点，用于表单统一验证
    // formRef = React.createRef();

    //接收到用户信息，进行统一验证
    // onCheck = async () => {
    //     try {
    //         const values = await this.formRef.current.validateFields();
    //         console.log('Success:', values);
    //         message.success('提交校验成功')
    //     } catch (errorInfo) {
    //         console.log('Failed:', errorInfo);
    //         message.warn('提交校验失败')
    //     }
    // }

    //验证成功，提交表单
    onFinish = async (values) => {
        
        //console.log(values)
        const {username,password} = values
        this.props.login(username,password)
        
        // let res = await reqLogin(username,password)
        // console.log(res)
        // if(res.status === 0){
        //     // 登录成功
        //     message.success('登录成功');
        //     // 保存用户信息
        //     const user = res.data;
        //     memoryUtils.user = user;
        //     storageUtils.saveUser(user);
        //     // 跳转路由
        //     this.props.history.replace('/home')
        // }
        // else{
        //     // 登录失败
        //     message.error(res.msg);
        // }
    }
    

    render() {
        // const user = memoryUtils.user;
        const user = this.props.user
        // debugger
        console.log(user)
        if(user && user._id){
            this.props.history.push('/home')
        }
        const errorMsg = this.props.user.errorMsg;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React后台管理</h1>
                </header>
                <section className="login-content">
                    <div>{errorMsg}</div>
                    <h2>用户登录</h2>
                    <Form
                        // ref={this.formRef}
                        name="normal_login"
                        className="login-form"
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            //声明式验证
                            rules={[
                                { required: true, message: '用户名不能为空' },
                                { min: 4, message: '用户名长度小于4' },
                                { max: 12, message: '用户名长度大于12' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"

                            //自定义验证密码
                            rules={[{
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject('密码不能为空'),
                            }]}
                        //rules={[{ validator: this.validatePwd },]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login)
