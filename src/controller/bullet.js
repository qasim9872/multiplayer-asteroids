const GameObject = require('./game-object');

class Bullet extends GameObject {
  static getPath() {
    return [[0, 0], [-4, 0]];
  }

  constructor(config, position, direction) {
    super(config, 'bullet', Bullet.getPath());

    this.position = position;
    this.direction = direction;
    this.age = 0;
    // this.hit = false;

    this.velocity[0] = this.config.BULLET_SPEED * Math.cos(direction);
    this.velocity[1] = this.config.BULLET_SPEED * Math.sin(direction);
  }

  getState() {
    const state = super.getState();
    return {
      ...state,
      age: this.age
    };
  }

  targetHit() {
    this.kill();
  }

  update(delta) {
    // update state of object
    if (this.age < this.config.MAX_BULLET_AGE && !this.isDead()) {
      this.age += delta;
      super.update(delta);
    } else {
      this.kill();
    }
  }
}

module.exports = Bullet;
