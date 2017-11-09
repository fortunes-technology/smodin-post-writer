import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { graphql, gql, compose } from 'react-apollo'
import { GC_USER_ID } from '../constants'
import SocialPost from './SocialPost'
import { ALL_PARAMETERS_QUERY } from './ParameterList'

class SocialPostList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newSocialPost: ''
        }
    }
    checkFocusedElement = () =>{
        if (document.activeElement === ReactDOM.findDOMNode(this.child)){
            console.log('its active')
        }
        console.log(document.activeElement)
    }
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        const PostListArray = () => {
            if (this.props.allParametersQuery.allParameters && this.props.allParametersQuery.allParameters.loading) return <div>Loading</div>
            if (this.props.allParametersQuery.allParameters && this.props.allParametersQuery.allParameters.error) return <div>Error</div>
            if (this.props.allParametersQuery.allParameters) return (
                    <div className='ma3' onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
                        {this.props.allParametersQuery.allParameters.map((parameter, index) => (
                            <div
                                key={index}
                                onClick={(e) => {this.checkFocusedElement;let lastFocusedElement = document.activeElement; lastFocusedElement.focus(); this.child.parameterClicked(parameter.param, parameter.id)}}
                                className='parameterhover inline-flex ma1 parameterborder' >{'{{' + parameter.param + '}}'}</div>
                        ))}
                    </div>
                )
            return null
        }
        if (!userId){
            return(
                <div>
                    <h1 className="tc">Oops! You're not logged in!</h1>
                    <button onClick={() => {
                        this.props.history.push('/login')
                    }}>Login
                    </button>
                </div>
            )
        }
        if (this.props.allSocialPostsQuery && this.props.allSocialPostsQuery.loading) {
            return (
                <div>
                    Loading...
                </div>
            )
        }
        if (this.props.allSocialPostsQuery && this.props.allSocialPostsQuery.error) {
            return (
                <div>
                    {this.props.allSocialPostsQuery.error}
                </div>
            )
        }
        return (
            <div>
                <h1>Social Posts</h1>
                <h4 className='mb2 b'>Available Parameters:</h4>
                <PostListArray />
                {this.props.allSocialPostsQuery.allSocialPosts.map((socialPost, index) => (
                    <SocialPost
                        ref={instance => {this.child = instance}}
                        key={socialPost.id}
                        socialPost={socialPost}
                        index={index}
                        deleteSocialPost={this._handleDeleteSocialPost}
                        updateSocialPost={this._handleUpdateSocialPost}
                        allParametersQuery={this.props.allParametersQuery}/>
                ))}
                <div>
                    <form className='mt3'>
                        <input
                            onChange={(e) => this.setState({ newSocialPost: e.target.value })}
                            value={this.state.newSocialPost}
                            placeholder='Your New Post...'
                            type='text'/>
                    </form>
                    <button className='button mt3' onClick={() => this._handleNewSocialPost()}>Submit</button>
                </div>
            </div>
        )
    }
    _handleDeleteSocialPost =  (id) => {
        console.log('deleting post ID: ' + id )
        this.props.deletedSocialPostMutation({
            variables: {
                id: id
            },
            update: (store) => {
                const userId = localStorage.getItem(GC_USER_ID)
                const data = store.readQuery({query: ALL_SOCIAL_POSTS_QUERY, variables: { id: userId }})
                const deletedSocialPostIndex = data.allSocialPosts.findIndex((socialPost) => (socialPost.id === id))
                data.allSocialPosts.splice(deletedSocialPostIndex, 1)
                store.writeQuery({query: ALL_SOCIAL_POSTS_QUERY, data, variables: { id: userId }})
            }
        })
    }
    _handleUpdateSocialPost =  (id, newMessage) => {
        console.log('ID of post updated: ' + id )
        this.props.updateSocialPostMutation({
            variables: {
                id: id,
                message: newMessage
            }
        })
    }
    _handleNewSocialPost = async () => {
        const { newSocialPost } = this.state
        let id = localStorage.getItem(GC_USER_ID)
        console.log('message: ' + newSocialPost)
        await this.props.addSocialPostMutation({
            variables: {
                message: newSocialPost,
                id: id
            },
            update: (store, {data: {createSocialPost} }) => {
                const userId = localStorage.getItem(GC_USER_ID)
                const data = store.readQuery({
                    query: ALL_SOCIAL_POSTS_QUERY,
                    variables: { id: userId }
                })
                data.allSocialPosts.push(createSocialPost)
                store.writeQuery({
                    query: ALL_SOCIAL_POSTS_QUERY,
                    data,
                    variables: { id: userId }
                })
            }
        })
    }
}

const ALL_SOCIAL_POSTS_QUERY = gql`
  query AllSocialPostsQuery ($id: ID!) {
    allSocialPosts (filter:{
        user: {
            id: $id
            }
        }){
          id
          default
          message
        }}`
const ADD_SOCIAL_POSTS_MUTATION = gql`
    mutation AddSocialPostMutation($id: ID!, $message: String!){
        createSocialPost(userId: $id, message: $message){
            message
            id
            default
    }}`
const UPDATE_SOCIAL_POSTS_MUTATION = gql`
    mutation UpdateSocialPost($id: ID!, $message: String!){
        updateSocialPost(id: $id, message: $message){
            id
            message
    }}`
const DELETE_SOCIAL_POSTS_MUTATION = gql`
  mutation DeletedSocialPostMutation($id: ID!) {
    deleteSocialPost(id: $id) {
      id
    }
  }
`
export default compose(
    graphql(ALL_SOCIAL_POSTS_QUERY, {
        name: 'allSocialPostsQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
            }}}),
    graphql(ALL_PARAMETERS_QUERY, {name: 'allParametersQuery'}),
    graphql(ADD_SOCIAL_POSTS_MUTATION, {name: 'addSocialPostMutation'}),
    graphql(UPDATE_SOCIAL_POSTS_MUTATION, {name: 'updateSocialPostMutation'}),
    graphql(DELETE_SOCIAL_POSTS_MUTATION, {name: 'deletedSocialPostMutation'})
)(SocialPostList)
