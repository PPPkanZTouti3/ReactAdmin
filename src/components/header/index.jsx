import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {connect} from 'react-redux'

import LinkButton from '../../components/link-button'
import {reqWeather} from '../../api/index'
import {formateDate} from '../../utils/dateUtils.js'
import memoryUtils from '../../utils/memoryUtils.js'
import menuList from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils.js'
import './index.less'
class Header extends Component {
    state = {
        currentTime: '',
        weather: '',
        temperature: '',
    }

    getTime = ()=>{
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
          }, 1000)
    }

    getWeather = async ()=>{
        let res =  await reqWeather('北京');
        const {weather,temperature} = res;
        this.setState({weather,temperature})
    }

    getTitle = ()=>{
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item=>{
            if(item.key === path){
                title = item.title;
            }
            else if(item.children){
                const cItem = item.children.find(cItem=> path.indexOf(cItem.key) === 0) || 0;
                if(cItem){
                    title = cItem.title;
                }
            }
        })
        return title;
    }

    logout = ()=>{
        Modal.confirm({
            title: '你想要退出登录吗？',
            icon: <ExclamationCircleOutlined />,
            //content: 'Some descriptions',
            onOk: ()=> {
                storageUtils.removeUser();
                memoryUtils.user = {};

                this.props.history.replace('/login');
            },
        })
    }

    componentWillMount(){
        // 获得时间
        this.getTime();
        // 获取天气
        this.getWeather();
    }

    componentWillUnmount(){
        clearInterval(this.intervalId)
    }

    render() {
        const {username} = memoryUtils.user; 
        const {currentTime,weather,temperature} = this.state;
        // 原版
        // const title = this.getTitle();
        // redux版
        const title = this.props.headTitle
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>
                        欢迎 {username}
                    </span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <span className='temperature'>{temperature + '℃'}</span>
                        <span className='weather'>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({headTitle: state.headTitle}),
    {}
)(withRouter(Header))
