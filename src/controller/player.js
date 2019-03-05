const GameObject = require('./game-object');
const Bullet = require('./bullet');
class Player extends GameObject {
  static getPath() {
    return [[10, 0], [-5, 5], [-5, -5], [10, 0]];
  }

  constructor(socket, config) {
    super(config, 'player', Player.getPath());

    this.playerSocket = socket;

    this.setup();

    this.init();
  }

  setup() {
    // Overwrite position to place the player in center of screen
    this.position = [this.config.GAME_WIDTH / 2, this.config.GAME_HEIGHT / 2];

    this.invincible = false;
    this.lives = this.config.PLAYER_LIVES;
    this.score = 0;
    this.scale = 2;
    this.radius = 4;

    this.lastFire = null;
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
      radius: this.getBoundRadius(),
      path: this.path,
      scale: this.scale,
      children: this.children
    };
  }

  sendState(gameState) {
    this.playerSocket.emit('update', gameState);
  }

  sendConfig() {
    this.playerSocket.emit('game-config', this.config);
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

  stop() {
    this.velocity[0] = 0;
    this.velocity[1] = 0;
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
      // remove bullets from player
      this.children = this.children.filter(child => child.name !== 'bullet');
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
        // throw new Error(`HANDLE THIS EVENT`);
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

  canFire() {
    switch (true) {
      case Boolean(!this.lastFire):
        return true;

      case this.dead:
      case Date.now() - this.lastFire < this.config.BULLET_COOLDOWN:
      case this.children.filter(child => child.name === 'bullet').length >=
        this.config.MAX_BULLETS:
        return false;
      default:
        return true;
    }
  }

  fire() {
    // Add firing logic
    if (this.canFire()) {
      const _pos = [this.position[0], this.position[1]];
      const _dir = this.direction;

      this.children.push(new Bullet(this.config, _pos, _dir));
      this.lastFire = Date.now();
    }
  }

  update(delta) {
    // Do a backwards loop and remove bullets from array if applicable
    for (var i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i].isDead()) {
        this.children.splice(i, 1);
      } else {
        this.children[i].update(delta);
      }
    }
  }
}

module.exports = Player;
