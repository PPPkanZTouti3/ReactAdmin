import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Modal,
    message
} from 'antd'

import { reqRoleList, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './addForm'
import AuthForm from './authForm'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'
export default class Role extends Component {

    auth = React.createRef();

    state = {
        roles: [], //角色列表
        role: {}, //被选中的角色
        isShowAdd: false,
        isShowUpdate: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    getRoles = async () => {
        const res = await reqRoleList();
        if (res.status === 0) {
            const roles = res.data;
            this.setState({ roles });
        }
    }

    onRow = role => {
        return {
            onClick: event => {
                console.log(role)
                this.setState({ role });
            }
        }
    }

    // 添加角色
    addRole = async () => {
        this.setState({isShowAdd: false})
        try {
            const values = await this.form.current.validateFields();
            // console.log('Success:', values);

            // 1.准备数据
            const {roleName} = values
            // console.log(roleName)
            this.form.current.resetFields();
            // 调用接口
            const res = await reqAddRole(roleName);
            if(res.status === 0){
                message.success('添加角色成功')
                const role = res.data;
                this.setState(state=>({
                    roles: [...state.roles,role]
                }))
            }
            // 处理数据
            
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            message.error('添加角色失败')
        }
    }

    // 更新角色
    updateRole = async () => {
        this.setState({isShowUpdate: false})

        const role = this.state.role;
        const menus = this.auth.current.getMenus();
        role.menus = menus;
        role.auth_name = memoryUtils.user.username;
        role.auth_time = Date.now()

        const res = await reqUpdateRole(role);
        if(res.status === 0){
            
            // 当前用户修改自己的权限 需要退出登录
            if(role._id === memoryUtils.user.role_id){
                memoryUtils.user = {};
                storageUtils.removeUser();
                message.success('设置当前角色权限成功')
                this.props.history.replace('/login')
            }
            else{
                this.setState({
                    roles: [...this.state.roles]
                })
                message.success('设置角色权限成功')
            }
            
        }
        else{
            message.error('设置角色权限失败')
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles();
    }

    render() {
        const { roles, role, isShowAdd, isShowUpdate } = this.state;
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowUpdate: true})}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    dataSource={roles}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: 5 }}
                    rowSelection={{ 
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role)=>{this.setState({role})}
                     }}
                    onRow={this.onRow}
                />

                <Modal title="添加角色" visible={isShowAdd} onOk={this.addRole} onCancel={()=>this.setState({isShowAdd:false})}>
                    <AddForm
                        setForm={form => this.form = form}
                    />
                </Modal>

                <Modal title="设置角色权限" visible={isShowUpdate} onOk={this.updateRole} onCancel={()=>this.setState({isShowUpdate:false})}>
                    <AuthForm
                        role={role}
                        ref={this.auth}
                    />
                </Modal>
            </Card>
        )
    }
}
