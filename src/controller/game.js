const Asteroid = require('./asteroid');
const Player = require('./player');
const Explosion = require('./explosion');
class Game {
  static config() {
    const BUCKET_COUNT = 10;

    return {
      // Game settings
      GAME_HEIGHT: 576,
      GAME_WIDTH: 720,
      FRAME_PERIOD: 30, // 1 frame / x frames/sec
      LEVEL_TIMEOUT: 2000, // How long to wait after clearing a level.

      // Player settings
      ROTATE_SPEED: Math.PI / 15, // How fast do players turn?  (radians)
      MAX_SPEED: 7, // Maximum player speed
      THRUST_ACCEL: 1,
      DEATH_TIMEOUT: 2000, // milliseconds
      INVINCIBLE_TIMEOUT: 1000, // How long to stay invincible after resurrecting?
      PLAYER_LIVES: 3,
      POINTS_PER_SHOT: 1, // How many points does a shot cost? (Should be >= 0.)
      POINTS_TO_EXTRA_LIFE: 500, // How many points to get a 1-up?
      PLAYER_SCORE: 50, // How many points to shoot another player

      // Bullet settings
      BULLET_SPEED: 20,
      BULLET_COOLDOWN: 200,
      MAX_BULLETS: 3,
      MAX_BULLET_AGE: 25,

      // Asteroid settings
      ASTEROID_COUNT: 1, // This + current level = number of asteroids.
      ASTEROID_GENERATIONS: 3, // How many times to they split before dying?
      ASTEROID_CHILDREN: 3, // How many does each death create?
      ASTEROID_SPEED: 3,
      ASTEROID_SCORE: 10, // How many points is each one worth?
      ASTEROID_ROTATE_SPEED: Math.PI / 25, // How fast do players turn?  (radians)

      // Explosion settings
      EXPLOSION_DURATION: 1000,

      // Synchronisation settings
      BUCKET_COUNT, // Defines the number of times update will be run within a second
      BUCKET_SYNCHRONISATION_TIME: 1000 / BUCKET_COUNT, // The time after which update will be executed

      // ARTIFICIAL NETWORK DELAY SETUP
      ARTIFICIAL_NETWORK_DELAY_TIMEOUT: 50
    };
  }

  constructor() {
    console.log(`Game class initialized`);
    // Load game config
    this.config = Game.config();

    this.init();
  }

  /**
   * This function initializes the variables that will hold the game state on the server side
   */
  init() {
    this.players = {};
    this.asteroids = [];
    this.explosions = [];

    this.spawnAsteroids();
  }

  /**
   * This function initialises and adds new asteroid objects to the game state
   */
  spawnAsteroids() {
    for (let i = 0; i < this.config.ASTEROID_COUNT; i++) {
      const roid = new Asteroid(this.config);
      this.asteroids.push(roid);
    }
  }

  /**
   * This function is called when 'new-player' event is received.
   * This adds the client to the list of players
   */
  playerConnected(socket) {
    const playerId = socket.id;
    console.log(`new player with id: ${playerId} connected at ${new Date()}`);
    this.players[playerId] = new Player(socket, this.config);
  }

  update(delta) {
    // UPDATE GAME OBJECTS
    Object.values(this.players).forEach(player => {
      if (!player.isDead()) {
        player.update(delta);
      }
    });

    if (this.asteroids.length === 0) {
      this.spawnAsteroids();
    }

    this.asteroids.forEach(roid => {
      roid.update(delta);
    });

    // Do a backwards loop and remove explosions from array if applicable
    for (var i = this.explosions.length - 1; i >= 0; i--) {
      if (this.explosions[i].isExpired()) {
        this.explosions.splice(i, 1);
      } else {
        this.explosions[i].update(delta);
      }
    }

    // Check for collision
    this.checkCollisions();
  }

  checkCollisions() {
    // Player
    Object.values(this.players).forEach((player, index, playerArray) => {
      // collides with asteroids
      for (let i = this.asteroids.length - 1; i >= 0; i--) {
        const roid = this.asteroids[i];

        // Player
        if (player.checkCollision(roid)) {
          console.log(`player died`);
          this.explosions.push(new Explosion(this.config, player.position));

          const killedRoids = this.asteroids.splice(i, 1);
          this.handleAsteroidKills(killedRoids);

          player.die();
        }

        // Player's bullets
        if (player.checkIfBulletHits(roid)) {
          this.explosions.push(
            new Explosion(
              this.config,
              roid.position,
              this.config.EXPLOSION_DURATION / roid.getReverseGeneration()
            )
          );
          const killedRoids = this.asteroids.splice(i, 1);
          this.handleAsteroidKills(killedRoids);
        }
      }

      // with other players
      for (let i = 0; i < playerArray.length; i++) {
        if (i === index) {
          // current player
          continue;
        } else {
          const otherPlayer = playerArray[i];

          // Player
          if (player.checkCollision(otherPlayer)) {
            console.log(`player crashed into another player and died`);
            this.explosions.push(new Explosion(this.config, player.position));

            otherPlayer.die();
            player.die();
          }

          // Player
          if (player.checkIfBulletHits(otherPlayer)) {
            console.log(`player is killed by a bullet`);
            this.explosions.push(
              new Explosion(this.config, otherPlayer.position)
            );

            otherPlayer.die();
          }
        }
      }
    });

    // Player, Asteroid, Bullet
  }

  handleAsteroidKills(roids) {
    // spawn smaller asteroids if the generation is more than 0
    for (let roid of roids) {
      const newGen = roid.getGeneration() - 1;
      if (newGen > 0) {
        // Create children
        for (let i = 0; i < this.config.ASTEROID_CHILDREN; i++) {
          const newRoid = new Asteroid(this.config, newGen);
          // set spawn location to parent's location
          newRoid.position = [roid.position[0], roid.position[1]];
          this.asteroids.push(newRoid);
        }
      }
    }
  }

  sendState() {
    const playerStates = Object.values(this.players).map(player =>
      player.getState()
    );

    for (const playerId of Object.keys(this.players)) {
      const player = this.players[playerId];

      player.sendState({
        self: playerStates.find(state => state.playerId === playerId),
        players: playerStates.filter(state => state.playerId !== playerId),
        asteroids: this.asteroids.map(roid => roid.getState()),
        explosions: this.explosions.map(expl => expl.getState())
      });
    }
  }

  updatePlayer(playerId, playerInput) {
    const player = this.players[playerId];

    if (!player) return;

    console.log(
      `Action sent at ${new Date(playerInput.timestamp).toISOString()} with ${
        playerInput.updateCount
      } received for player with id ${playerId} at ${new Date().toISOString()}`
    );
    player.setInput(playerInput);
  }

  playerDisconnected(playerId) {
    console.log(`player with id: ${playerId} disconnected at ${new Date()}`);
    delete this.players[playerId];
  }
}

module.exports = Game;
