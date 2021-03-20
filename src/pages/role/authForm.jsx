import React, { Component } from 'react'
import {
    Form,
    Input,
    Tree
} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig';

const { TreeNode } = Tree;
const Item = Form.Item;
const newMenuList = [{
    title: '平台权限',
    key: 'all',
    children: menuList
}]

export default class AuthForm extends Component {
    static propTypes = {
        role: PropTypes.object
    }

    constructor (props) {
        super(props)
    
        // 根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
          checkedKeys: menus
        }
      }

    getTreeNodes = (newMenuList) => {
        return newMenuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )

            return pre;
        },[])
    }

    getMenus = () => this.state.checkedKeys

    onCheck = (checkedKeys) => {
        // console.log('onCheck', checkedKeysValue);
        this.setState({checkedKeys})
      };

    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(newMenuList)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus;
        this.state.checkedKeys = menus;
    }

    render() {
        const {role} = this.props;
        const {checkedKeys} = this.state;
        console.log(role.name)
        return (
            <div>
                <Form>
                    <Item 
                        label='角色名称'
                        name='roleName'
                    >
                        <Input placeholder={role.name} disabled></Input>
                    </Item>
                </Form>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                    treeData={newMenuList}
                >
                    {/* <TreeNode title='平台权限' key='all'>
                        {this.treeNodes}
                    </TreeNode> */}
                </Tree>
            </div>
        )
    }
}
