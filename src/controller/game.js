const Asteroid = require('./asteroid');
const Player = require('./player');
class Game {
  static config() {
    return {
      // Game settings
      GAME_HEIGHT: 480,
      GAME_WIDTH: 640,
      FRAME_PERIOD: 60, // 1 frame / x frames/sec
      LEVEL_TIMEOUT: 2000, // How long to wait after clearing a level.

      // Player settings
      ROTATE_SPEED: Math.PI / 10, // How fast do players turn?  (radians)
      MAX_SPEED: 15, // Maximum player speed
      THRUST_ACCEL: 1,
      DEATH_TIMEOUT: 2000, // milliseconds
      INVINCIBLE_TIMEOUT: 1000, // How long to stay invincible after resurrecting?
      PLAYER_LIVES: 3,
      POINTS_PER_SHOT: 1, // How many points does a shot cost? (Should be >= 0.)
      POINTS_TO_EXTRA_LIFE: 500, // How many points to get a 1-up?

      // Bullet settings
      BULLET_SPEED: 20,
      MAX_BULLETS: 3,
      MAX_BULLET_AGE: 25,

      // Asteroid settings
      ASTEROID_COUNT: 2, // This + current level = number of asteroids.
      ASTEROID_GENERATIONS: 3, // How many times to they split before dying?
      ASTEROID_CHILDREN: 2, // How many does each death create?
      ASTEROID_SPEED: 3,
      ASTEROID_SCORE: 10 // How many points is each one worth?
    };
  }

  constructor() {
    console.log(`Game class initialized`);
    // Load game config
    this.config = Game.config();

    this.players = {};
    this.asteroids = [];

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
    this.players[playerId] = new Player(socket, this.config);
  }

  update() {
    // UPDATE GAME OBJECTS
    Object.values(this.players).forEach(player => {
      if (!player.isDead()) {
        player.move();
      }
    });
  }

  sendState() {
    const playerStates = Object.values(this.players).map(player =>
      player.getPlayerState()
    );

    for (const playerId of Object.keys(this.players)) {
      const player = this.players[playerId];

      player.sendState({
        self: playerStates.find(state => state.playerId === playerId),
        players: playerStates.filter(state => state.playerId !== playerId),
        asteroids: this.asteroids
      });
    }
  }

  updatePlayer(playerId, playerInput) {
    const player = this.players[playerId];

    if (playerInput.keyboardState.UP) {
      console.log(`will apply thrust`);
      player.thrust(this.config.THRUST_ACCEL);
    }

    if (playerInput.keyboardState.LEFT) {
      console.log(`will rotate left`);
      player.rotate(-this.config.ROTATE_SPEED);
    }

    if (playerInput.keyboardState.RIGHT) {
      console.log(`will rotate right`);
      player.rotate(this.config.ROTATE_SPEED);
    }
  }

  playerDisconnected(playerId) {
    console.log(`Player disconnected`);
    delete this.players[playerId];
  }
}

module.exports = Game;
