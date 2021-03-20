import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'

import { reqDeleteImg } from '../../api';
import { BASE_IMG, BASE } from '../../utils/constants';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {
    static propTypes = {
        imgs: PropTypes.array
    }

    constructor(props){
        super(props);

        const {imgs} = this.props;
        let fileList = [];
        if(imgs && imgs.length > 0){
            fileList = imgs.map((item,index)=>({
                uid: -index,
                name: item,
                status: 'done',
                url: BASE_IMG + item
            }))
        }
        this.state = {  
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList
        }
    }

    
    getImgs = () => {
        return this.state.fileList.map((file) => file.name)
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = async ({ file, fileList }) => {
        if (file.status === 'done') {
            const res = file.response;
            if (res.status === 0) {
                message.success('图片上传成功')
                const { name, url } = res.data;
                file = fileList[fileList.length - 1];
                file.name = name;
                file.url = url;
            }
            else {
                message.error('图片上传失败')
            }
        }
        else if(file.status === 'removed'){
            const res = await reqDeleteImg(file.name);
            if(res.status === 0){
                message.success('删除图片成功')
            }else{
                message.error('删除图片失败')
            }
        }
        
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;

        const uploadButton = (
            <div>
                <PlusOutlined />
                <div>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action= "manage/img/upload"
                    accept='image/*'
                    name='image'
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 5 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}