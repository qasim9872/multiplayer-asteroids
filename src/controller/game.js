const Asteroid = require('./asteroid');
const Player = require('./player');
class Game {
  constructor() {
    console.log(`Game class initialized`);

    this.players = {};
    this.asteroids = [];

    this.asteroidsCount = 1;
    this.canvasWidth = 780;
    this.canvasHeight = 540;

    this.init();
  }

  init() {
    for (let i = 0; i < this.asteroidsCount; i++) {
      this.asteroids.push(Asteroid.create(this.canvasWidth, this.canvasHeight));
    }
  }

  playerConnected(socket, data) {
    console.log(`Player connected`);
    const playerId = socket.id;
    this.players[playerId] = new Player(socket);
  }

  update() {
    // UPDATE GAME OBJECTS
  }

  sendState() {
    for (const player of Object.values(this.players)) {
      player.sendState({
        asteroids: this.asteroids
      });
    }
  }

  playerDisconnected(socket, data) {
    console.log(`Player disconnected`);
  }
}

module.exports = Game;
