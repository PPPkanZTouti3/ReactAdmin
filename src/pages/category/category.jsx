import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';

import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api/index'
import LinkButton from '../../components/link-button'
import AddForm from './addForm'
import UpdateForm from './updateForm'
export default class Category extends Component {

  state = {
    categorys: [], //一级分类列表
    subCategorys: [], //二级分类列表
    loading: false,
    parentId: '0',
    parentName: '',
    showStatus: 0, //展示对话框，1展示添加对话框，2展示修改对话框，0不展示对话框
  }

  getCategorys = async (parentId) => {
    this.setState({ loading: true })
    parentId = parentId || this.state.parentId;
    let res = await reqCategorys(parentId);
    if (res.status === 0) {
      this.setState({ loading: false })
      console.log(res)
      const categorys = res.data;
      if (parentId === '0') {
        this.setState({ categorys })
      }
      else {
        this.setState({ subCategorys: categorys })
      }
    }
    else {
      message.error('获取分类列表失败')
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.updateShow(category)}>修改分类</LinkButton>
            {
              this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null
            }
          </span>
        ),
      },
    ];
  }

  // 展示二级列表
  showSubCategorys = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name,
    }, () => {
      this.getCategorys();
    })
  }
  // 展示一级列表
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  // 展示添加分类框
  addShow = () => {
    this.setState({
      showStatus: 1
    })
  }
  // 展示修改分类框
  updateShow = (category) => {
    // 保存分类的对象
    this.category = category;
    // 更新状态
    this.setState({
      showStatus: 2
    })
  }
  // 关闭分类框
  handleCancel = () => {
    this.form.current.resetFields();
    this.setState({
      showStatus: 0
    })

  }

  // 添加分类
  addCategory = () => {
    this.form.current.validateFields(async (err, values) => {
      if (!err) {
        // 隐藏确定框
        this.setState({
          showStatus: 0
        })
        // 准备数据
        const { parentId, categoryName } = values;
        // 清除数据
        this.form.current.resetFields();
        // 发送请求
        const res = await reqAddCategory(parentId, categoryName);
        if (res.status === 0) {
          if (parentId === this.state.parentId) {
            this.getCategorys();
          } else if (parentId === '0') {
            this.getCategorys('0')
          }

        }
      }
    })
  }
  // 修改分类
  updateCategory = () => {
    this.form.current.validateFields(async (err, values) => {
      if (!err) {
        // 隐藏确定框
        this.setState({
          showStatus: 0
        })

        // 准备数据
        const categoryId = this.category._id;
        const { categoryName } = values;
        // const categoryName = this.form.current.getFieldValue('categoryName');

        // 清除输入数据
        this.form.current.resetFields();

        // 发送请求
        const res = await reqUpdateCategory({ categoryId, categoryName })
        if (res.status === 0) {
          // 重新显示列表
          this.getCategorys();
        }
      }
    })

  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getCategorys();
  }

  render() {
    const { categorys, loading, parentId, parentName, subCategorys, showStatus } = this.state;
    const title = parentId === '0' ? '一级分类列表' :
      (<span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <ArrowRightOutlined />
        <span>{parentName}</span>
      </span>)
      ;
    const extra = <Button type='primary'>
      <PlusOutlined />
      <span onClick={this.addShow}>添加</span>
    </Button>

    const category = this.category || {};
    console.log(category)
    return (
      <Card title={title} extra={extra}>


        <Table
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          bordered 
          rowKey='_id'
          loading={loading}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />;

        <Modal title="添加分类" visible={showStatus === 1} onOk={this.addCategory} onCancel={this.handleCancel}>
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={form => this.form = form}
          />
        </Modal>

        <Modal title="修改分类" visible={showStatus === 2} onOk={this.updateCategory} onCancel={this.handleCancel}>
          <UpdateForm
            categoryName={category.name}
            setForm={form => this.form = form}
          />
        </Modal>
      </Card>
    )
  }
}
