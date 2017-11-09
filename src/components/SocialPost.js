import React, { Component } from 'react'
import { findAllParametersInString } from '../utils'
import SocialPostWithCSS from './SocialPostWithCSS'
import TextareaAutosize from 'react-autosize-textarea'

class SocialPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: this.props.socialPost.message,
            postChanged: false,
            editing: false
        }
    }
    _clickToEdit() {
        this.textarea.focus()
    }
    render() {
        return (
            <div className='socialpostbox mt1'>
                <div className='socialpostboxtop justify-end'>
                    {(!this.state.editing) ?
                        <div className='ml4 mb2 mt2 flex-auto pointer'
                             onClick={async ()=>{await this.setState({editing: true}); this._clickToEdit()}}>
                            <SocialPostWithCSS
                                allParametersQuery={this.props.allParametersQuery}>{this.state.message}</SocialPostWithCSS>
                        </div>
                        :<div className='ml4 mb2 mt2 flex-auto'>
                            <TextareaAutosize
                            onBlur={() => {this.setState({ editing: false})}}
                            type='text'
                            className='socialpostboxresponse'
                            innerRef={(input)=>{this.textarea=input}}
                            value={this.state.message}
                            onChange={(e) => { this.setState({ message: e.target.value}); (this.props.socialPost.message !== e.target.value) ?  this.setState({ postChanged: true }) : this.setState({ postChanged: false })}}/>
                        </div>
                    }
                    {(this.state.postChanged) ?
                    <div className='socialpostboxeditbutton socialpostboxeditbutton-edit'>
                        <a className='ma2' onClick={this._updateSocialPost}>E</a>
                    </div>
                        :<div className='socialpostboxeditbutton socialpostboxeditbutton-no-edit'>
                            <a className='ma2'>E</a>
                        </div>}
                    <div className='socialpostboxdeletebutton'>
                        <a className='ma2' onClick={this._deleteSocialPost}>X</a>
                    </div>
                </div>
                <div className='ml4 mr4 mt1 mb2 '>
                    {(this.props.allParametersQuery.loading) ?
                        <p className='pa0 ma0'><strong>Generating Your Messages.....</strong></p>
                        :
                        <p className='pa0 ma0'><strong className='user-select-n'>Rewrite: </strong>{findAllParametersInString(this.props.socialPost.message, '{{', '}}', this.props.allParametersQuery.allParameters)} </p>
                    }
                </div>
            </div>
        )
    }
    _deleteSocialPost = () => {
        const id = this.props.socialPost.id
        this.props.deleteSocialPost(id)
    }
    _updateSocialPost = () => {
        const id = this.props.socialPost.id
        const newMessage = this.state.message
        this.props.updateSocialPost(id, newMessage)
        this.setState({ postChanged: false })
    }
}

export default SocialPost