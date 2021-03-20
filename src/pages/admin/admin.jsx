import React, { Component } from 'react'
import {Redirect,Switch,Route} from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Category from '../../pages/category/category'
import Home from '../../pages/home/home'
import Product from '../../pages/product/product'
import User from '../../pages/user/user'
import Role from '../../pages/role/role'
import Bar from '../../pages/charts/bar'
import Line from '../../pages/charts/line'
import Pie from '../../pages/charts/pie'

const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        if(!user._id || !user){
            return <Redirect to='/login'/>
        }
        return (
            <div>
                <Layout style={{minHeight: '100vh'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{backgroundColor: '#fff', margin: '30px'}}>
                            <Switch>
                                <Route path='/home' component={Home}></Route>
                                <Route path='/category' component={Category}></Route>
                                <Route path='/product' component={Product}></Route>
                                <Route path='/user' component={User}></Route>
                                <Route path='/role' component={Role}></Route>
                                <Route path='/charts/bar' component={Bar}></Route>
                                <Route path='/charts/line' component={Line}></Route>
                                <Route path='/charts/pie' component={Pie}></Route>
                                <Redirect to='/home'/>
                            </Switch>
                        </Content>
                        <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，使用体验更佳</Footer>
                    </Layout>
                </Layout>
            </div>
        )
    }
}
