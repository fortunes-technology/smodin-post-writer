import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../constants'
import { USER_SETTINGS_QUERY } from './UserSettings'
import { graphql } from 'react-apollo'

class Header extends Component {
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        return (
            <div className='justify-between' id='horizontalheader'>
                <div className='black pt1-vert'>
                    {this.props.userSettingsQuery && ( !this.props.userSettingsQuery.loading && !this.props.userSettingsQuery.error) ?
                        <div className='fw7 mr1 f3 ml2'>Welcome {this.props.userSettingsQuery.User.name}</div>
                    : <div className='fw7 mr1 f3 ml2'>Welcome</div>}
                </div>
                <div className='flex pt1-vert mr2'>
                    {userId ?
                        <div className='flex black'>
                            <Link to='/console' className='ml1 pt1 no-underline black'>Console</Link>
                            <div className='ml1 pt1'>|</div>
                            <Link to='/settings' className='ml1 pt1 no-underline black'>Settings</Link>
                            <div className='ml1 pt1'>|</div>
                        <div className='ml1 pt1 pointer black' onClick={() => {
                            localStorage.removeItem(GC_USER_ID)
                            localStorage.removeItem(GC_AUTH_TOKEN)
                            localStorage.setItem('headerPath', '')
                            this.props.history.push(`/login`)
                            }}>logout</div>
                        </div>
                        :
                        <Link to='/login' className='ml1 no-underline black'>login</Link>
                    }
                </div>
            </div>
        )
    }

}

export default withRouter(
    graphql(USER_SETTINGS_QUERY,{
        name: 'userSettingsQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
        }}}
)(Header))