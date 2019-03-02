// CONFIG
const PORT = process.env.PORT || 4000;

// DEPENDENCIES
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socketIO = require('socket.io');
const path = require('path');

// INITIALISATION
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// MIDDLEWARES
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(morgan('dev'));

// SERVE STATIC
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

// INIT SERVER
server.listen(PORT, () => {
  console.log('Starting server on port ' + PORT);
});
