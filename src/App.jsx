import React, { Component } from 'react'
import {Switch,Route} from 'react-router-dom'

import './App.css'
import Admin from './pages/admin/Admin'
import Login from './pages/login/Login'

export default class App extends Component {

  render() {
    return (
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/' component={Admin}/>
        </Switch>
    )
  }
}
