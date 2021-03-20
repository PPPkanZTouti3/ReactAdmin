import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { Menu, Button } from 'antd';
import {connect} from 'react-redux'

import './index.less'
import logo from '../../assets/images/logo.jpg'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import {setHeadTitle} from '../../redux/actions'
const { SubMenu } = Menu;

class LeftNav extends Component {
    // map遍历
    getMenuNodes_map(menuList){
        return menuList.map((item)=>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            }
            else{
                return (
                    <SubMenu key={item.key} icon={item.icon} title="商品">
                        {
                            this.getMenuNodes_map(item.children)
                        }
                        
                    </SubMenu>
                )
            }
        })
    }

    // 判断当前登陆用户对item是否有权限
    hasAuth = (item) => {
        const {key,isPublic} = item;
        const menus = memoryUtils.user.role.menus;
        const username = memoryUtils.user.username;
        // 1. admin
        // 2. isPulic
        // 3. 拥有此item权限
        if(username === 'admin' || isPublic || menus.indexOf(key) !== -1){
            return true;
        }
        // 4. item的children的key存在menus中
        else if(item.children){
            return !!item.children.find(child => menus.indexOf(child.key) !== -1 );

        }
        return false;
        
    }

    // reduce遍历
    getMenuNodes = (menuList)=>{
        let path = this.props.location.pathname;
        return menuList.reduce((pre,item)=>{
            if(this.hasAuth(item)){
                if(!item.children){
                    if(item.key === path || path.indexOf(item.key) === 0){
                        this.props.setHeadTitle(item.title)
                    }
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>{item.title}</Link>
                        </Menu.Item>
                    ))
                }
                else{
                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title="商品">
                            {
                                this.getMenuNodes(item.children)
                            }
                            
                        </SubMenu>
                    ))
                    
                    
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
                    if(cItem){
                        this.openKey = item.key;
                    }
                }
            }
            return pre;
        },[])
    }

    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList);
    }

    render() {
        let path = this.props.location.pathname;
        if(path.indexOf('/product')===0){
            path = '/product'
        }
        const openKey = this.openKey;
        return (
            <div className="left-nav">
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo" />
                    <h1>React后台</h1>
                </Link>

                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}
export default connect(
    state => ({}),
    {
        setHeadTitle
    }
)(withRouter(LeftNav))