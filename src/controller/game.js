class Game {
  constructor() {
    console.log(`Game class initialized`);
  }

  playerConnected(data) {
    console.log(`Player connected`);
  }

  playerDisconnected(data) {
    console.log(`Player disconnected`);
  }
}

module.exports = Game;
