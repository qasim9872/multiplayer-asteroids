class Player {
  constructor(socket) {
    this.playerSocket = socket;
    this.score = 0;
    this.lives = 0;
  }

  getPlayerState() {
    return {
      score: this.score,
      lives: this.lives
    };
  }

  sendState(gameState) {
    const gameAndPlayerState = {
      ...this.getPlayerState(),
      ...gameState
    };

    this.playerSocket.emit('update', gameAndPlayerState);
  }
}

module.exports = Player;
