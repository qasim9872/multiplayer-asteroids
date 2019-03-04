const gameObject = require('./game-object');

class Asteroid extends gameObject {
  static create(canvasWidth, canvasHeight) {
    const roid = new Asteroid();
    roid.x = Math.random() * canvasWidth;
    roid.y = Math.random() * canvasHeight;
    // while (!roid.isClear()) {
    //   roid.x = Math.random() * canvasWidth;
    //   roid.y = Math.random() * canvasHeight;
    // }
    roid.vel.x = Math.random() * 4 - 2;
    roid.vel.y = Math.random() * 4 - 2;
    if (Math.random() > 0.5) {
      roid.points.reverse();
    }
    roid.vel.rot = Math.random() * 2 - 1;
    console.log(roid);
    return roid;
  }

  constructor() {
    super('asteroid', [
      -10,
      0,
      -5,
      7,
      -3,
      4,
      1,
      10,
      5,
      4,
      10,
      0,
      5,
      -6,
      2,
      -10,
      -4,
      -10,
      -4,
      -5
    ]);

    this.scale = 6;
    this.visible = true;
  }
}

module.exports = Asteroid;
