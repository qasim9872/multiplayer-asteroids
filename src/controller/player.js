class Player {
  constructor(socket, config) {
    this.playerSocket = socket;
    this.config = config;

    this.score = 0;
    this.lives = config.PLAYER_LIVES;
    this.setup();

    this.init();
  }

  setup() {
    this.position = [this.config.GAME_WIDTH / 2, this.config.GAME_HEIGHT / 2];
    this.velocity = [0, 0];

    this.direction = -Math.PI / 2;

    this.dead = false;
    this.invincible = false;
    this.lives = this.config.PLAYER_LIVES;
    this.score = 0;
    this.radius = 3;
    this.path = [[10, 0], [-5, 5], [-5, -5], [10, 0]];
    this.scale = 1;
  }

  init() {
    this.sendConfig();
  }

  getPlayerState() {
    return {
      playerId: this.playerSocket.id,
      position: this.position,
      velocity: this.velocity,
      direction: this.direction,
      dead: this.dead,
      invincible: this.invincible,
      lives: this.lives,
      score: this.score,
      radius: this.radius,
      path: this.path,
      scale: this.scale
    };
  }

  sendState(gameState) {
    this.playerSocket.emit('update', gameState);
  }

  sendConfig() {
    this.playerSocket.emit('game-config', this.config);
  }

  getPosition() {
    return this.position;
  }
  getVelocity() {
    return this.velocity;
  }
  getSpeed() {
    return Math.sqrt(
      Math.pow(this.velocity[0], 2) + Math.pow(this.velocity[1], 2)
    );
  }
  getDirection() {
    return this.direction;
  }
  getRadius() {
    return this.radius;
  }
  getScore() {
    return this.score;
  }
  addScore(pts) {
    this.score += pts;
  }
  lowerScore(pts) {
    this.score -= pts;
    if (score < 0) {
      this.score = 0;
    }
  }
  getLives() {
    return this.lives;
  }
  rotate(rad) {
    if (!this.dead) {
      this.direction += rad;
    }
  }
  thrust(force) {
    if (!this.dead) {
      this.velocity[0] += force * Math.cos(this.direction);
      this.velocity[1] += force * Math.sin(this.direction);

      if (this.getSpeed() > this.config.MAX_SPEED) {
        this.velocity[0] = this.config.MAX_SPEED * Math.cos(this.direction);
        this.velocity[1] = this.config.MAX_SPEED * Math.sin(this.direction);
      }
    }
  }
  move() {
    this.position[0] += this.velocity[0];
    if (this.position[0] < 0)
      this.position[0] = this.config.GAME_WIDTH + this.position[0];
    else if (this.position[0] > this.config.GAME_WIDTH)
      this.position[0] -= this.config.GAME_WIDTH;

    this.position[1] += this.velocity[1];
    if (this.position[1] < 0)
      this.position[1] = this.config.GAME_HEIGHT + this.position[1];
    else if (this.position[1] > this.config.GAME_HEIGHT)
      this.position[1] -= this.config.GAME_HEIGHT;
  }
  draw(ctx) {
    // CLIENT SIDE FUNCTION
    // Asteroids.drawPath(ctx, position, direction, 1, path);
  }
  isDead() {
    return this.dead;
  }
  isInvincible() {
    return this.invincible;
  }
  extraLife(game) {
    lives++;
  }
  die() {
    if (!this.dead) {
      this.dead = true;
      this.invincible = true;
      this.lives--;
      this.position = [this.config.GAME_WIDTH / 2, this.config.GAME_HEIGHT / 2];
      this.velocity = [0, 0];
      this.direction = -Math.PI / 2;
      if (this.lives > 0) {
        setTimeout(
          (function(player) {
            return function() {
              player.ressurrect();
            };
          })(this),
          this.config.DEATH_TIMEOUT
        );
      } else {
        throw new Error(`HANDLE THIS EVENT`);
        // game.gameOver();
      }
    }
  }
  ressurrect() {
    if (this.dead) {
      this.dead = false;
      setTimeout(function() {
        this.invincible = false;
      }, this.config.INVINCIBLE_TIMEOUT);
    }
  }
  // fire(game) {
  //   if (!dead) {
  //     game.log.debug('You fired!');
  //     var _pos = [position[0], position[1]],
  //       _dir = direction;

  //     this.lowerScore(POINTS_PER_SHOT);

  //     return Asteroids.bullet(game, _pos, _dir);
  //   }
  // }
}

module.exports = Player;
