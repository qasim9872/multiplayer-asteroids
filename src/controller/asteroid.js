const GameObject = require('./game-object');
/**
 * The asteroids are created and spawned randomly on the screen. Each asteroid has a generation beginning with the default which is the largest.
 * With each hit, the generation is reduced until it hits 0 in which case its completely destroyed.
 * The re spawning logic is handled by the game class but the scale is set dynamically based on the generation
 */
class Asteroid extends GameObject {
  static getPath() {
    return [
      [-10, 0],
      [-5, 7],
      [-3, 4],
      [1, 10],
      [5, 4],
      [10, 0],
      [5, -6],
      [2, -10],
      [-4, -10],
      [-4, -5],
      [-10, 0]
    ];
  }

  constructor(config, _gen) {
    super(config, 'asteroid', Asteroid.getPath());

    this.generation = _gen ? _gen : this.config.ASTEROID_GENERATIONS;

    this.reverseGen = this.config.ASTEROID_GENERATIONS - this.generation;

    this.scale = 5 - this.reverseGen * 2;
    this.radius = 10 - this.reverseGen * 2;

    this.init();
  }

  init() {
    this.position[0] = Math.random() * this.config.GAME_WIDTH;
    this.position[1] = Math.random() * this.config.GAME_HEIGHT;

    this.velocity[0] = Math.random() * this.config.ASTEROID_SPEED;
    this.velocity[1] = Math.random() * this.config.ASTEROID_SPEED;

    this.rotation = (Math.random() + 0.2) * this.config.ASTEROID_ROTATE_SPEED;

    if (Math.random() > 0.5) {
      this.path.reverse();
    }

    if (Math.random() > 0.5) {
      this.rotation = -this.rotation;
    }
  }

  getState() {
    const state = super.getState();
    return {
      ...state,
      rotation: this.rotation,
      generation: this.generation
    };
  }

  /**
   * The update for asteroids also need to spin the asteroid hence the update is overridden
   * @param {number} delta
   */
  update(delta) {
    super.update(delta);
    this.rotate(this.rotation, delta);
  }

  getGeneration() {
    return this.generation;
  }

  getReverseGeneration() {
    return this.reverseGen + 1;
  }
}

module.exports = Asteroid;
