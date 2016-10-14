var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/ss-client.js', function(req, res){
  res.sendFile('ss-client.js', { root: __dirname });
});

app.get('/', function(req, res){
  res.sendFile('shared-shapes.html', { root: __dirname });
});

var id = 0;
io.on('connection', function(socket) {
  socket.on('create', function(msg) {
    console.log('create: ' + msg + "; assigning id m-" + id);
    io.emit('create', {id: "m-" + id++, element: msg});
  });
  
  // switched the drag-stop event to drag to match the client
  socket.on('drag', function(msg) {
    console.log('drag: ' + msg.id + " to " + msg.top + " " + msg.left);
    socket.broadcast.emit('drag', msg);
  });
  socket.on('transform', function(msg) {
    console.log('transform: ' + msg);
	socket.broadcast.emit('transform', msg);
  });
});

http.listen(3000, function(){
  console.log('Listening on *:3000');
});
