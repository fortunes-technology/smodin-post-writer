import React, { Component } from 'react'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'
import { gql, graphql, compose } from 'react-apollo'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: true,
            email: '',
            password: '',
            name: ''
        }
    }
    render() {
        return (
            <div className='flex justify-center items-center flex-column w-100'>
                <h4 className='mv2 mb3 w-100 tc f-5'>{this.state.login ? 'Login' : 'Sign Up'}</h4>
                <div className=''>
                    {!this.state.login &&
                    <input
                        className='login-inputs mb3'
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value })}
                        type='text'
                        placeholder='Your name'
                    />}
                    <br></br>
                    <input
                        className='login-inputs mb3'
                        value={this.state.email}
                        onChange={(e) => this.setState({ email: e.target.value })}
                        type='text'
                        placeholder='Your email address'
                    />
                    <br></br>
                    <input
                        className='login-inputs'
                        value={this.state.password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                        type='password'
                        placeholder='Choose a safe password'
                    />
                </div>
                <div className='flex mt3'>
                    <div
                        className='pointer mr2 button'
                        onClick={() => this._confirm()}
                    >
                        {this.state.login ? 'login' : 'create account' }
                    </div>
                    <div
                        className='pointer button'
                        onClick={() => this.setState({ login: !this.state.login })}
                    >
                        {this.state.login ? 'need to create an account?' : 'already have an account?'}
                    </div>
                </div>
                <button onClick={(e)=>this.props.addAllDefaultSocialPostsQuery()}>addAllDefaultSocialPostsQuery</button>
            </div>
        )
    }

    _confirm = async () => {
        const { name, email, password } = this.state
        if (this.state.login) {
            const result = await this.props.signinUserMutation({
                variables: {
                    email,
                    password
                }
            })
            const id = result.data.signinUser.user.id
            const token = result.data.signinUser.token
            this._saveUserData(id, token)
        } else {
            const result = await this.props.createUserMutation({
                variables: {
                    name,
                    email,
                    password
                }
            })
            const id = result.data.signinUser.user.id
            const token = result.data.signinUser.token
            this._saveUserData(id, token)
            const defaultSocialPostsQuery = this.props.allDefaultSocialPostsQuery
            const defaultSocialPostsArray = defaultSocialPostsQuery.allDefaultSocialPosts.map(defaultSocialPost => {
                const userId = localStorage.getItem(GC_USER_ID)
                const industriesIds = defaultSocialPost.industries.map(industry => {return '\"'+industry.id+'\"'})
                const returnValue = '{id default message industries {id}}'
                const createSocialPostUnit = defaultSocialPost.id+': createSocialPost(userId:\"'+userId+'\",message:\"'+defaultSocialPost.message+'\", industriesIds:['+industriesIds+'])'+returnValue
                return createSocialPostUnit
            })
            //****** try to get a map of posts with known IDs and such to work first
            const userId = 'cj9pu7kwv1aoe0187vlnvqbew'
            this.props.addAllDefaultSocialPostsOneByOneMutation({ variables: { userId: userId, industriesIds: [], message: "ok"}})
            defaultSocialPostsQuery.allDefaultSocialPosts.map(defaultSocialPost => {
                const userId = localStorage.getItem(GC_USER_ID)
                const industriesIds = defaultSocialPost.industries.map(industry => {return industry.id})
                console.log(this.props)
                this.props.addAllDefaultSocialPostsOneByOneMutation({
                    variables: {
                        userId: userId,
                        industriesIds: industriesIds,
                        message: defaultSocialPost.message
                    }
                })
            })
        }
        //this.props.history.push(`/`)
    }

    _saveUserData = (id, token) => {
        localStorage.setItem(GC_USER_ID, id)
        localStorage.setItem(GC_AUTH_TOKEN, token)
    }

}
console.log(this.state)
const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($name: String!, $email: String!, $password: String!) {
    createUser(
      name: $name,
      authProvider: {
        email: {
          email: $email,
          password: $password
        }
      }
    ) {
      id
    }

    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`
const ALL_DEFAULT_SOCIAL_POSTS_QUERY = gql`
  query AllSocialPostsQuery {
    allDefaultSocialPosts {
          id
          default
          message
          industries {id}
        }}`
const ADD_ALL_DEFAULT_SOCIAL_POSTS_MUTATION = gql`
  mutation AddAllDefaultSocialPostsMutation {
    cj9ok4zco01xx0119ebpbadvm: createSocialPost(
    userId: "cj8chwezmb3gr01805oyo0gf1", 
    message: "Charmander", 
    industriesIds: ["cj97jd2670t6501027go4pm46","cj8cgj28h0nje01953vt0k8cv"]) {
    id default message industries {id}
  }

  cj9ok4p5801xn0119w0dj4vej: createSocialPost(
    userId: "cj8chwezmb3gr01805oyo0gf1", 
    message: "Charmander", 
    industriesIds: ["cj97jd2670t6501027go4pm46","cj8cgj28h0nje01953vt0k8cv"]) {
    id
    default
    message
	}
    }`
const ADD_ALL_DEFAULT_SOCIAL_POSTS_ONE_BY_ONE_MUTATION = gql`
  mutation AddAllDefaultSocialPostsOneByOneMutation(
        $userId: ID!, $industriesIds: [ID!], $message: String!){
    createSocialPost(userId: $userId, message: $message, 
    industriesIds: $industriesIds) {
    id default message industries {id}
  }
}`
const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($email: String!, $password: String!) {
    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`
ADD_ALL_DEFAULT_SOCIAL_POSTS_MUTATION
export default compose(
    graphql(ALL_DEFAULT_SOCIAL_POSTS_QUERY, { name: 'allDefaultSocialPostsQuery'}),
    graphql(ADD_ALL_DEFAULT_SOCIAL_POSTS_ONE_BY_ONE_MUTATION, { name: 'addAllDefaultSocialPostsOneByOneMutation'}),
    graphql(CREATE_USER_MUTATION, { name: 'createUserMutation' }),
    graphql(SIGNIN_USER_MUTATION, { name: 'signinUserMutation' })
)(Login)
/*
mutation {
  cj9ok4zco01xx0119ebpbadvm: createSocialPost(
    userId: "cj8chwezmb3gr01805oyo0gf1",
    message: "Charmander",
    industriesIds: ["cj97jd2670t6501027go4pm46","cj8cgj28h0nje01953vt0k8cv"]) {
    id default message industries {id}
  }

  cj9ok4p5801xn0119w0dj4vej: createSocialPost(
    userId: "cj8chwezmb3gr01805oyo0gf1",
    message: "Charmander",
    industriesIds: ["cj97jd2670t6501027go4pm46","cj8cgj28h0nje01953vt0k8cv"]) {
    id
    default
    message
	}
}
 */