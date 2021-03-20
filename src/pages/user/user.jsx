import React, { Component } from 'react'
import {
    Card,
    Modal,
    Button,
    Table,
    message
} from 'antd'

import LinkButton from '../../components/link-button'
import { formateDate } from '../../utils/dateUtils'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'

export default class User extends Component {

    state = {
        users: [], // 用户列表
        roles: [], //角色列表
        isShow: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name;
            return pre;
        },{})
        this.roleNames = roleNames;
    }

    // 获取用户列表
    getUsers = async () => {
        const res = await reqUsers();
        if(res.status === 0){
            const {users, roles} = res.data;
            this.initRoleNames(roles);
            this.setState({users,roles})
        }
    }

    showAdd = () =>{
        this.user = null;
        this.setState({isShow: true});
    }

    showUpdate = (user) => {
        this.user = user;
        this.setState({isShow: true});
    }

    // 删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确定删除${user.username}吗？`,
            onOk: async () => {
                const res = await reqDeleteUser(user._id);
                if(res.status === 0){
                    message.success('删除用户成功!')
                    this.getUsers();
                }
                else{
                    message.error('删除用户失败!')
                }
            }
        })  
    }

    // 创建/更新用户
    addOrUpdateUser = async () => {
        this.setState({isShow: false});

        // 准备数据
        const user = this.form.current.getFieldsValue();
        this.form.current.resetFields();
        // console.log(user);
        // 发送请求
        if(this.user){
            user._id = this.user._id;
        }
        const res = await reqAddOrUpdateUser(user);
        // 处理结果
        if(res.status === 0){
            message.success(`${user._id ? '修改' : '创建'}用户成功`)
            this.getUsers()
        }
    }

    UNSAFE_componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getUsers();
    }

    render() {
        const {users,isShow,roles} = this.state;
        const user = this.user || {};
        const title = <Button type='primary' onClick={this.showAdd} >创建用户</Button>

        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize: 5}}
                />

            <Modal 
                title={user._id ? '修改用户' : '创建用户'}
                visible={isShow} 
                onOk={this.addOrUpdateUser} 
                onCancel={()=>{
                    this.form.current.resetFields();
                    this.setState({isShow: false})
                }}
            >
                <UserForm
                    setForm={form => this.form = form}
                    roles={roles}
                    user={user}
                />
            </Modal>

                
            </Card>
        )
    }
}
