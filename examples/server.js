var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , port = process.env.PORT || 8080
  , app = express();

var server = http.createServer(app)
  , wss = new WebSocketServer({server: server})

app.use(express.static(__dirname + '/../'));

wss.on('connection', function(ws) {
  console.log('client connected');

  ws.on('message', function(e) {
    console.log('received message')
    ws.send(e)
  })

  ws.on('close', function() {
    console.log('connection closed');
  });
});

server.listen(8080);
console.log("Listening at http://localhost:8080")
