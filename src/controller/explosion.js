const GameObject = require('./game-object');

class Explosion extends GameObject {
  static getPath() {
    const lines = [];
    for (var i = 0; i < 5; i++) {
      var rad = 2 * Math.PI * Math.random();
      var x = Math.cos(rad);
      var y = Math.sin(rad);
      lines.push([[x, y], [x * 2, y * 2]]);
    }
    return lines;
  }

  constructor(config, position, duration) {
    super(config, 'explosion', Explosion.getPath());

    // Update position on
    this.position = [position[0], position[1]];
    this.expires =
      new Date().getTime() + (duration || this.config.EXPLOSION_DURATION);
  }

  getState() {
    const state = super.getState();
    return {
      ...state,
      expires: this.expires
    };
  }

  isExpired() {
    return new Date().getTime() > this.expires;
  }

  update(delta) {
    this.scale += delta;
  }
}

module.exports = Explosion;
