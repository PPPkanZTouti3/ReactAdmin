import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from 'prop-types'
import { BASE } from '../../utils/constants';

export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props);
        const html = this.props.detail;
        if(html){
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }
        }
        
      }

    state = {
        editorState: EditorState.createEmpty(),
    }

    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    }

    uploadImageCallBack = (file) => {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/manage/img/upload')
            const data = new FormData()
            data.append('image', file)
            xhr.send(data)
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText)
              const url = response.data.url // 得到图片的url
              resolve({data: {link: url}})
            })
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText)
              reject(error)
            })
          }
        )
      }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{ minHeight: 200, border: '1px solid #000', paddingLeft: 10 }}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
        );
    }
}