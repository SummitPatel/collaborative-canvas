'use strict';

// Socket server code goes here

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var users = {};
var canvasHistory = {};

io.on('connection', function(socket) {
  users[socket.id] = socket.id;
  console.log('a user connected with id: ' + socket.id);

  if(Object.keys(canvasHistory).length !== 0) {
    socket.emit('canvasHistory', {
      history: canvasHistory
    });
  }

  socket.on('disconnect', function() {
    if(Object.keys(canvasHistory).length !== 0) {
      var userPoints = canvasHistory[socket.id];
      var pointsToKeep = [];

      // only keep points that are saved
      if(userPoints != null) {
        for(var i = 0; i < userPoints.length; i++) {
          if(userPoints[i].saved === true) {
            pointsToKeep.push(userPoints[i]);
          }
        }
        // set history to the saved points
        canvasHistory[socket.id] = pointsToKeep;

        io.emit('canvasHistory', { history: canvasHistory });
      }
    }

    console.log('user with id %s disconnected', socket.id);
    delete users[socket.id];
  });

  socket.on('mouseDrawing', function(data) {
    if(canvasHistory[socket.id] != null) {
      canvasHistory[socket.id].push(data);
    } else {
      canvasHistory[socket.id] = [data];
    }

    io.emit('mouseDrawing', {
      x: data.x,
      y: data.y,
      type: data.type,
      user: socket.id,
      saved: false
    });
  });

  socket.on('saveLines', function(data) {
    var user = data.user;
    var history = canvasHistory[user];
    if(history != null) {
      for(var i = 0; i < history.length; i++) {
        var point = history[i];
        point.saved = true;
      }
    }
  });

  socket.on('clearLines', function() {
    canvasHistory = {};

    io.emit('canvasHistory', { history: canvasHistory });
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
