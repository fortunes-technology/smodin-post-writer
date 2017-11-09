import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Header from './Header'
import Login from './Login'
import Console from './Console'
import UserSettings from './UserSettings'
import IndustriesPage from './IndustriesPage'
import { GC_USER_ID } from '../constants'

class App extends Component {
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        return (
          <div className='flexbox-parent'>
            <div className='' >
                <Header />
            </div>
            <div className='flex-1 fill-area-content fill-area background-gray'>
              <Switch>
                  {(userId)?
                  <Route exact path='/' render={() => <Redirect to='/console' />} />
                  :<Route exact path='/' render={() => <Redirect to='/login' />} />}
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/console' component={Console} />
                  <Route exact path='/settings' component={UserSettings} />
                  <Route exact path='/industries' component={IndustriesPage} />
              </Switch>
            </div>
          </div>
        )
    }
}

export default App;
