'use strict';

// Socket server code

// initializes app to be a function handler for an http server
var app = require('express')();
var http = require('http').Server(app);

// initializes an instance of a socket.io server to mount onto the http server
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

// global objects to store users and their data
var users = {};
var canvasHistory = {};

io.on('connection', function(socket) {
  // add the user to the list
  users[socket.id] = socket.id;
  console.log('a user connected with id: ' + socket.id);

  // if lines have already been drawn, show them to the newly connected user
  if (Object.keys(canvasHistory).length !== 0) {
    socket.emit('canvasHistory', {
      history: canvasHistory
    });
  }

  socket.on('disconnect', function() {
    if (Object.keys(canvasHistory).length !== 0) {
      // get the lines that the user has drawn
      var userPoints = canvasHistory[socket.id];
      var pointsToKeep = [];

      // only keep points that are marked to be saved
      if (userPoints != null) {
        for (var i = 0; i < userPoints.length; i++) {
          if (userPoints[i].saved === true) {
            // store the saved points into a separate array
            pointsToKeep.push(userPoints[i]);
          }
        }
        // set history to only include the saved points
        canvasHistory[socket.id] = pointsToKeep;

        // have the canvas redraw itself with the new history
        io.emit('canvasHistory', {
          history: canvasHistory
        });
      }
    }

    // remove the user from the list
    delete users[socket.id];
    console.log('user with id %s disconnected', socket.id);
  });

  // main drawing function
  socket.on('mouseDrawing', function(data) {
    // add the new data to the user's history
    if (canvasHistory[socket.id] != null) {
      canvasHistory[socket.id].push(data);
    } else {
      canvasHistory[socket.id] = [data];
    }

    // tell the client to draw a new point
    io.emit('mouseDrawing', {
      x: data.x,
      y: data.y,
      type: data.type,
      user: socket.id,
      saved: false
    });
  });

  // saves the history for a user
  socket.on('saveLines', function(data) {
    var user = data.user;
    var history = canvasHistory[user];
    if (history != null) {
      for (var i = 0; i < history.length; i++) {
        var point = history[i];
        point.saved = true;
      }
    }
  });

  // clears all the history on the server
  socket.on('clearLines', function() {
    canvasHistory = {};

    io.emit('canvasHistory', {
      history: canvasHistory
    });
  });

});
