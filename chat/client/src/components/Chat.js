import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import '../css/Chat.css';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      message: [],
      recentMessage: [],
      channels: [],
      messageChannel : [],
      currentChannel: ''
    };

    this.socket = io('localhost:5000');
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.socket.on("current channel", function(channel){
      currentChannel(channel);
      console.log(channel);
    });

    this.socket.on("list message", function(message){
      recentMessage(message);
    });

    this.socket.on("list channels", function(channel){
      newChannel(channel);
    });

    this.socket.on("message channel", function(message){
      messageToChannel(message);
    });

    const currentChannel = data => {
      this.setState({
        currentChannel: data
      });
    }

    const recentMessage = data => {
      this.setState({
        recentMessage: [...this.state.recentMessage, data]
      });
    }

    const newChannel = data => {
      this.setState({
        channels: [...this.state.channels, data]
      });
    }

    const messageToChannel = data => {
      this.setState({
        messageChannel: [...this.state.messageChannel, data]
      });
    }
  }

  componentDidMount(){
    
    var listMessages = '/list-message';
    var listChannels = '/list-channels';


    axios.get(listMessages)
    .then(response => {
      for(var key in response.data){
        var value = response.data[key];
        this.setState({
        message: [...this.state.message, value]
        })
      }
    })

    axios.get(listChannels)
    .then(response => {
      for(var key in response.data){
        var value = response.data[key];
        this.setState({
        channels: [...this.state.channels, value]
        })
      }
    })
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }
  
  handleSubmit(event) {

    event.preventDefault();

    console.log(this.state.currentChannel);

    var idSession = sessionStorage.getItem('id');
    var userSession = sessionStorage.getItem('username');
    var newChannel = this.state.value.substr(8);
    var joinChannel = this.state.value.substr(6);

    const url = '/message';

    if(this.state.value.charAt(0) !== '/'){
        
      const dataChannel = this.socket.emit('new message', {
        id_user: idSession,
        username: userSession,
        content: this.state.value,

      });
    }

    else if(this.state.value === '/create '+newChannel){
      
      this.socket.emit('new channel', {
        name: newChannel
      });
    }  

    this.setState({
      value: ''
    })
  }

  handleClick(event){
    
    event.preventDefault();

    sessionStorage.removeItem('id');
    sessionStorage.removeItem('username');
    this.props.history.push('/connection');
  }

  render() {

    return (
        <div className='chat'>
          <div className="sidebar">
            <button onClick={this.handleClick}>
            Log out
            </button>
            <ul>
              <li>#Channel :</li><br />
              {        
                this.state.channels.map((channels, index) =>
                  <li key={index}>
                  #{channels.name}
                  </li>
                )
              }
            </ul>
            
            <h3>Command :</h3>
            <ul>
              <li>/create "room"</li>
            </ul>
          </div>
          <div className='box-chat'>
          <p id="bienvenue">Welcome to the chat !</p>
          {        
           this.state.message.map((message, index) =>
                <li id="connect" key={index}>
                {message.username} : {message.content}
                </li>
            )
          }
          {        
           this.state.recentMessage.map((message, index) =>
                <li id="connect" key={index}>
                {message.username} : {message.content}
                </li>
            )
          }
          {        
           this.state.messageChannel.map((message, index) =>
                <li id="connect" key={index}>
                {message.username} : {message.content}
                </li>
            )
          }
          <form id="chat" onSubmit={this.handleSubmit}>
            <input id="m" type="text" value={this.state.value} onChange={this.handleChange} />
            <button id="button" type="submit" name="msg">Envoyer</button>
          </form>
        </div>
      </div>

    );
  }
}

export default Chat;
