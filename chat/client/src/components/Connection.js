import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Auth.css';

class Connection extends Component {
  
  constructor(props){

    super(props);
    
    this.state = {  
    username: '',
    password: ''
    };

    this.socket = io('localhost:5000');
    this.handleSubmitConnection = this.handleSubmitConnection.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleChangeUsername(event) {
    this.setState({
      username: event.target.value
    });
  }

  handleChangePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  handleSubmitConnection(event){

    event.preventDefault();
 
    axios.get("/list-users", {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      for (var i = 0; i < response.data.length; i++) {

        const data = {
        username: this.state.username,
        password: this.state.password
        }

        const dataServ = {
        username: response.data[i].username,
        password: response.data[i].password
        }
        
        console.log(dataServ);

        if(response.data[i].username == this.state.username && response.data[i].password == this.state.password){
          sessionStorage.setItem('id', response.data[i].id);
          sessionStorage.setItem('username', this.state.username);
          this.props.history.push('/chat')
        }
      }
    }) 
    .catch(() => console.log("Erreur"))
  }

  render() {
    return(
      <div class="login">
        <h1>Login</h1>
        <form id="fields" onSubmit={this.handleSubmitConnection}>
          <input class="form-control form-control-lg" type="text" value={this.state.username} onChange={this.handleChangeUsername} placeholder="Username" />
          <input class="form-control form-control-lg" type="password" name="password" value={this.state.password} onChange={this.handleChangePassword} placeholder="Password" />
          <input class="btn btn-outline-primary" type="submit" value="Connection" name="sub" />
        </form>
      </div>
    );
  }
}

export default Connection;