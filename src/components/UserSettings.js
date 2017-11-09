import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { gql, graphql, compose } from 'react-apollo'

class UserSettings extends Component {

    state = {
        email: '',
        password: '',
        name: ''
    }
    render(){
        const userId = localStorage.getItem(GC_USER_ID)
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
        if (this.props.userSettingsQuery && this.props.userSettingsQuery.loading) {
            return (
                <div>
                    <h1 className="tc">Settings</h1>
                    Loading...
                    <div>Name: Loading... </div>
                </div>
            )
        }
        if (this.props.userSettingsQuery && this.props.userSettingsQuery.error) {
            console.log(this.props.userSettingsQuery)
            console.log(userId)
            return (
                <div>
                    <h1 className="tc">Settings</h1>
                    Error
                    <div>Name: Error :(</div>
                </div>
            )
        }
        return (
            <div>
                <h1 className="tc">Settings</h1>
                <div className="ma3">
                    <strong>Name: </strong>
                    {this.props.userSettingsQuery.User.name}
                            <input
                                type='text'
                                placeholder='New Name...'
                                onChange={(e) => this.setState({ name: e.target.value })}
                                />
                    <button onClick={ this._updateName }>update</button>                </div>
                <div className="ma3"><strong>Email: </strong>{this.props.userSettingsQuery.User.email} </div>
            </div>
        )
    }
    _updateName = async () => {
        const { name } = this.state
        let id = localStorage.getItem(GC_USER_ID)
        this.props.updateUserName({
            variables: {
                id: id,
                name: name
            }
        })
    }
}

export const USER_SETTINGS_QUERY = gql`
  query UserSettingsQuery($id: ID!) {
    User(id: $id) {
      id
      name
      email
    }
  }
`

const UPDATE_USER_NAME_MUTATION = gql`
    mutation UpdateUserName($id: ID!, $name: String!){
        updateUser(id: $id, name: $name){
            id
            name
    }}`

export default compose(
    graphql(USER_SETTINGS_QUERY, {
        name: 'userSettingsQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
            variables: { id: userId }
        }}}),
    graphql(UPDATE_USER_NAME_MUTATION, { name: 'updateUserName' })
)(UserSettings)