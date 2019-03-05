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

    this.scale = 1;
    this.radius = 4;

    this.lastFire = null;
  }

  init() {
    this.sendConfig();
  }

  sendConfig() {
    this.playerSocket.emit('game-config', this.config);
  }

  getState() {
    const state = super.getState();

    return {
      ...state,
      playerId: this.playerSocket.id,
      invincible: this.invincible,
      lives: this.lives,
      score: this.score
    };
  }

  sendState(gameState) {
    this.playerSocket.emit('update', gameState);
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

  brake() {
    this.velocity[0] = 0;
    this.velocity[1] = 0;
  }

  isInvincible() {
    return this.invincible;
  }

  setInvincibility(bool) {
    this.invincible = bool;
  }

  extraLife() {
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
      const tempFunc = this.setInvincibility.bind(this);
      setTimeout(() => {
        tempFunc(false);
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
    if (this.canFire()) {
      const _pos = [this.position[0], this.position[1]];
      const _dir = this.direction;

      this.children.push(new Bullet(this.config, _pos, _dir));
      this.lastFire = Date.now();
    }
  }

  handleHitScore(name) {
    switch (name) {
      case 'asteroid':
        this.addScore(this.config.ASTEROID_SCORE);
        break;
    }
  }

  checkIfBulletHits(obj) {
    const bullets = this.children.filter(child => child.name === 'bullet');

    for (const bullet of bullets) {
      if (bullet.checkCollision(obj)) {
        this.handleHitScore(obj.name);
        bullet.targetHit();
        return true;
      }
    }

    return false;
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

  checkCollision(obj) {
    if (this.isInvincible()) return false;
    return super.checkCollision(obj);
  }
}

module.exports = Player;
