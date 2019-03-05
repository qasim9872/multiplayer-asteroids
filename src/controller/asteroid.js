const GameObject = require('./game-object');

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

    this.scale = 5;
    this.radius = 10;
    this.generation = _gen ? _gen : this.config.ASTEROID_GENERATIONS;

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

  move(delta) {
    super.move(delta);
    this.rotate(this.rotation, delta);
  }

  getGeneration() {
    return generation;
  }
}

module.exports = Asteroid;
