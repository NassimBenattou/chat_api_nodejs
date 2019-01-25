const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const mysql = require("mysql");
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test",
  database: "chat"
});

  app.post('/users', function (req, res) {

    var data = [
    [req.body.data.username, req.body.data.password],
    ];
    
    connection.query("INSERT INTO users (username, password) VALUES ?", [data], function(err, result){
    console.log('ok');
    })
  })

  app.get('/list-users', function (req, res) {

    connection.query('SELECT id, username, password FROM users', function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
  });

io.on('connection', function(socket){

    socket.on('new message', function(message){

      console.log(message);

      io.emit('list message', message);

      var data = [
      [message.content, message.id_user],
      ];
        
      connection.query("INSERT INTO message (content, id_user) VALUES ?", [data], function(err, result){
        console.log("message envoyé");
      })
    })

  socket.on('new channel', function(channel){

    io.emit('list channels', channel);

    var data = [
    [channel.name]
    ];
      
    connection.query("INSERT INTO channel (name) VALUES ?", [data], function(err, result){
      console.log(result);
    })
  })
})

  app.get('/list-message', function(req, res){

    connection.query("SELECT username, content FROM message LEFT JOIN users ON users.id = message.id_user", function(err, result){
      res.send(result);
    })
  })

  app.get('/list-channels', function(req, res){

    connection.query("SELECT id, name FROM channel", function(err, result){
      res.send(result);
    })
  })

http.listen(port, () => console.log(`Listening on port ${port}`));