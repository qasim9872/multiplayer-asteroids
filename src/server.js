// CONFIG
const PORT = process.env.PORT || 4000;

// DEPENDENCIES
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const Game = require('./controller/game');
const { hrtimeMs } = require('./controller/util');

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
    game.updatePlayer(socket.id, data);
  });

  socket.on(`disconnect`, () => {
    console.log(`disconnect event received`);
    game.playerDisconnected(socket.id);
  });
});

let previous = hrtimeMs();
let tick = 0;

const loop = () => {
  setTimeout(loop, game.config.BUCKET_SYNCHRONISATION_TIME);

  let now = hrtimeMs();
  let delta = (now - previous) / game.config.FRAME_PERIOD;

  // console.log(`${tick}. delta: ${delta}`);

  // game logic would go here
  game.update(delta, tick);
  game.sendState();

  previous = now;
  tick++;
};

// INIT SERVER
server.listen(PORT, () => {
  console.log('Starting server on port ' + PORT);
  console.log(
    `game update will run every ${game.config.BUCKET_SYNCHRONISATION_TIME}`
  );
  loop();
});
