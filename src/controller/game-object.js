class gameObject {
  constructor(config, name, path) {
    this.config = config;
    this.name = name;
    this.path = path;

    // x, y position
    this.position = [0, 0];
    this.velocity = [0, 0];
    this.scale = 1;
    this.radius = 1;
    this.direction = -Math.PI / 2;
    this.dead = false;

    this.children = [];
  }

  getName() {
    return this.name;
  }
  getPath() {
    return this.path;
  }
  getPosition() {
    return this.position;
  }
  getVelocity() {
    return this.velocity;
  }
  getScale() {
    return this.scale;
  }
  getRadius() {
    return this.radius;
  }

  getBoundRadius() {
    return this.radius * this.scale;
  }

  getDirection() {
    return this.direction;
  }
  isDead() {
    return this.dead;
  }

  getSpeed() {
    return Math.sqrt(
      Math.pow(this.velocity[0], 2) + Math.pow(this.velocity[1], 2)
    );
  }

  rotate(rad, delta = 1) {
    if (!this.dead) {
      this.direction += rad * delta;
    }
  }

  kill() {
    this.dead = true;
  }

  moveChildren(delta) {
    this.children.forEach(child => child.move(delta));
  }

  move(delta) {
    this.position[0] += this.velocity[0] * delta;
    if (this.position[0] < 0)
      this.position[0] = this.config.GAME_WIDTH + this.position[0];
    else if (this.position[0] > this.config.GAME_WIDTH)
      this.position[0] -= this.config.GAME_WIDTH;

    this.position[1] += this.velocity[1] * delta;
    if (this.position[1] < 0)
      this.position[1] = this.config.GAME_HEIGHT + this.position[1];
    else if (this.position[1] > this.config.GAME_HEIGHT)
      this.position[1] -= this.config.GAME_HEIGHT;

    this.moveChildren(delta);
  }

  transformPoints() {
    const transformedPath = this.path.map(cord => {
      // We set the canvas 0,0 to the x and y below and draw from there
      const x = this.position[0];
      const y = this.position[1];

      const curX = cord[0] * this.scale;
      const curY = cord[1] * this.scale;

      const transformedX = x + curX;
      const transformedY = y + curY;
      return [transformedX, transformedY];
    });
    // console.log(transformedPath);
    return transformedPath;
  }

  checkCollision(object) {
    if (object.isDead() || this.isDead()) return false;

    var a_pos = object.getPosition(),
      b_pos = this.getPosition();

    function sq(x) {
      return Math.pow(x, 2);
    }

    var distance = Math.sqrt(sq(a_pos[0] - b_pos[0]) + sq(a_pos[1] - b_pos[1]));

    if (distance <= object.getBoundRadius() + this.getBoundRadius()) {
      return true;
    }
    return false;
  }

  update(delta) {
    this.children.forEach(child => child.update(delta));
  }
}

module.exports = gameObject;
