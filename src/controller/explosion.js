const GameObject = require('./game-object');

/**
 * @description This object displays a set of lines around a given point on the viewport and is used to display explosions.
 * The update function increments the scale periodically which gives the illusion of the explosion increasing in size
 */
class Explosion extends GameObject {
  static getPath() {
    // This creates a set of random points around the given point which defines the path for an explosion
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

    // Copy the position to avoid setting a reference which will be linked to the original position
    this.position = [position[0], position[1]];
    // Default duration is used if one is not provided
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
