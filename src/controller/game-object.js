/**
 * @description This is the base class for all game objects. It contains the main functions that are required by all child classess
 */
class gameObject {
  constructor(config, name, path) {
    this.config = config;
    this.name = name;
    this.path = path;

    this.setInitialState();
    this.lastUpdateTime = 0;
    this.updateTimeDifference = 0;
  }

  setInitialState() {
    // x, y position
    this.position = [0, 0];

    this.velocity = [0, 0];

    this.scale = 1;
    this.radius = 1;

    // Initial direction is set to be facing up
    this.direction = -Math.PI / 2;
    this.dead = false;

    this.children = [];

    this.lastUpdateTime = 0;
    this.updateTimeDifference = 0;
  }

  getUpdateDelta() {
    var currentTime = new Date().getTime();
    if (this.lastUpdateTime == 0) {
      this.updateTimeDifference = 0;
    } else {
      this.updateTimeDifference = currentTime - this.lastUpdateTime;
    }

    this.lastUpdateTime = currentTime;
    return this.updateTimeDifference / 1000;
  }

  getState() {
    return {
      name: this.name,
      path: this.path,
      position: this.position,
      velocity: this.velocity,
      scale: this.scale,
      radius: this.radius, // this.getBoundRadius(),
      direction: this.direction,
      dead: this.dead,
      children: this.children.map(child => child.getState())
    };
  }

  getBoundRadius() {
    return this.radius * this.scale;
  }

  isDead() {
    return this.dead;
  }

  getSpeed() {
    return Math.sqrt(
      Math.pow(this.velocity[0], 2) + Math.pow(this.velocity[1], 2)
    );
  }

  rotate(rad, delta) {
    const rotationValue = delta ? rad * delta : rad;
    if (!this.dead) {
      this.direction += rotationValue;
    }
  }

  kill() {
    this.dead = true;
  }

  move(delta) {
    this.position[0] += this.velocity[0] * delta;
    // Check and handle if the player has left the screen
    if (this.position[0] < 0)
      this.position[0] = this.config.GAME_WIDTH + this.position[0];
    else if (this.position[0] > this.config.GAME_WIDTH)
      this.position[0] -= this.config.GAME_WIDTH;

    this.position[1] += this.velocity[1] * delta;
    // Check and handle if the player has left the screen
    if (this.position[1] < 0)
      this.position[1] = this.config.GAME_HEIGHT + this.position[1];
    else if (this.position[1] > this.config.GAME_HEIGHT)
      this.position[1] -= this.config.GAME_HEIGHT;
  }

  checkCollision(object) {
    if (object.isDead() || this.isDead()) return false;

    var a_pos = object.position,
      b_pos = this.position;

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
    this.move(delta);
    this.children.forEach(child => child.update(delta));
  }
}

module.exports = gameObject;
