const GameObject = require('./game-object');
const { diff } = require('./util');

class Bullet extends GameObject {
  static getPath() {
    return [[0, 0], [-4, 0]];
  }

  constructor(config, position, direction) {
    super(config, 'bullet', Bullet.getPath());

    this.position = position;
    this.direction = direction;
    this.age = 0;

    this.velocity[0] = this.config.BULLET_SPEED * Math.cos(direction);
    this.velocity[1] = this.config.BULLET_SPEED * Math.sin(direction);

    this.lastPosition = this.position.slice();
  }

  /**
   * Overriding the getState function of the gameObject class by adding additional properties which are specific to this class
   */
  getState() {
    const state = super.getState();
    return {
      ...state,
      age: this.age
    };
  }

  targetHit() {
    this.kill();
  }

  /**
   * This function overrides and wraps the update function of the game-object class by only calling it when the bullet has still not aged enough to be destroyed
   * @param {number} delta
   */
  update(delta) {
    // update state of object
    if (this.age < this.config.MAX_BULLET_AGE && !this.isDead()) {
      this.age += delta;
      super.update(delta);
    } else {
      this.kill();
    }
  }

  checkCollision(obj) {
    // create a path between start position and end position and check for collision on that path
    // slice the arrays so we do not affect the actual arrays
    const startPosition = this.lastPosition.slice();
    const endPosition = this.position.slice();

    // reset object's position to where it was at the end of last update
    this.position = startPosition;
    let collided = false;

    // check for collision on the path by moving object at intervals of 10 second
    const interval = 5;

    // while

    const endX = endPosition[0];
    const endY = endPosition[1];

    for (
      let i = 0;
      i < this.config.BUCKET_SYNCHRONISATION_TIME / interval;
      i++
    ) {
      // check for collision in increments of 10 seconds

      this.move(0.3);

      const currentX = this.position[0];
      const currentY = this.position[1];

      // check if current x and y values are ahead of end position
      const diffX = diff(currentX, endX);
      const diffY = diff(currentY, endY);

      if (diffX < 2 && diffY < 2) break;

      collided = super.checkCollision(obj);

      if (collided) break;
    }
    // reset the current position
    this.position = endPosition.slice();
    // Update the last position to current position
    this.lastPosition = endPosition.slice();

    return collided;
  }
}

module.exports = Bullet;
