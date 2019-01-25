import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Auth.css';

class Register extends Component {
  
  constructor(props){

    super(props);
    
    this.state = {  
    username: '',
    password: ''
    };

    this.socket = io('localhost:5000');
    this.handleSubmitRegister = this.handleSubmitRegister.bind(this);
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

  handleSubmitRegister(event){

    event.preventDefault();

    const url = "/users";

    const data = {
    username: this.state.username,
    password: this.state.password
    } 

    axios.post(url, { data })
    alert('register with success');
    this.props.history.push('/connection');
  }

  render() {
    return(
      <div className="register">
        <h1>Register</h1>
        <form id="fields" onSubmit={this.handleSubmitRegister}>
          <input class="form-control form-control-lg" type="text" value={this.state.username} onChange={this.handleChangeUsername} placeholder="Username" />
          <input class="form-control form-control-lg" type="password" name="password" value={this.state.password} onChange={this.handleChangePassword} placeholder="Password" />
          <input class="btn btn-outline-primary" type="submit" value="Register" name="sub" />
        </form>
      </div>
    );
  }
}

export default Register;