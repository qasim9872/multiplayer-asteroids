// CONFIG
const PORT = process.env.PORT || 4000;
const FRAME_RATE = 1000.0 / 60.0;

// DEPENDENCIES
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socketIO = require('socket.io');
const path = require('path');
const Game = require('./controller/game');

// INITIALISATION
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const game = new Game();

// MIDDLEWARES
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// app.use(morgan('dev'));

// SERVE STATIC
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

// SOCKET EVENT HANDLER
io.on('connection', socket => {
  console.log(`connection event received`);
  socket.on(`new-player`, data => {
    console.log(`new-player event received`);
    game.playerConnected(socket, data);
  });

  socket.on(`player-action`, data => {
    console.log(`player-action event received`);
  });

  socket.on(`disconnect`, data => {
    console.log(`disconnect event received`);
    game.playerDisconnected(socket, data);
  });
});

// Server side game loop, runs at 60Hz and sends out update packets to all
// clients every tick.
setInterval(function() {
  game.update();
  game.sendState();
}, FRAME_RATE);

// INIT SERVER
server.listen(PORT, () => {
  console.log('Starting server on port ' + PORT);
});
