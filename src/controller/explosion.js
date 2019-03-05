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
    this.position = position;
    this.expires =
      new Date().getTime() + (duration || this.config.EXPLOSION_DURATION);
  }

  isExpired() {
    return new Date().getTime() > this.expires;
  }

  update(delta) {
    this.scale += delta;
  }
}

module.exports = Explosion;
