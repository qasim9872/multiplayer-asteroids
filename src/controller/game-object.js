class gameObject {
  constructor(name, points) {
    this.name = name;
    this.points = points;

    this.vel = {
      x: 0,
      y: 0,
      rot: 0
    };

    this.acc = {
      x: 0,
      y: 0,
      rot: 0
    };

    this.children = {};

    this.visible = false;

    this.x = 0;
    this.y = 0;
    this.rot = 0;
    this.scale = 1;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y
    };
  }
}

module.exports = gameObject;
