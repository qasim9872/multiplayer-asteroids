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

    this.generation = _gen ? _gen : this.config.ASTEROID_GENERATIONS;

    this.reverseGen = this.config.ASTEROID_GENERATIONS - this.generation;

    this.scale = 5 - this.reverseGen * 2;
    this.radius = 10 - this.reverseGen * 2;

    // switch (this.generation) {
    //   case 3:
    //     this.scale = 5;
    //     this.radius = 10;
    //     break;
    //   case 2:
    //     this.scale = 4;
    //     this.radius = 9;
    //     break;
    //   default:
    //     this.scale = 3;
    //     this.radius = 8;
    // }

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
    return this.generation;
  }

  getReverseGeneration() {
    return this.reverseGen + 1;
  }
}

module.exports = Asteroid;
