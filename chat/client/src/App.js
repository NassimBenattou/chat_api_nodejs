import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import axios from 'axios';
import Register from './components/Register.js';
import Connection from './components/Connection.js';
import Chat from './components/Chat.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {

render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' component={Register} exact />
          <Route path='/connection' component={Connection} exact />
          <Route path='/chat' component={Chat} exact />
		</Switch>
      </BrowserRouter>
    );
  }
}

export default App;