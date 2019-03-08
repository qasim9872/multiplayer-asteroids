function move(object, config, delta) {
  object.position[0] += object.velocity[0] * delta;
  if (object.position[0] < 0)
    object.position[0] = config.GAME_WIDTH + object.position[0];
  else if (object.position[0] > config.GAME_WIDTH)
    object.position[0] -= config.GAME_WIDTH;

  object.position[1] += object.velocity[1] * delta;
  if (object.position[1] < 0)
    object.position[1] = config.GAME_HEIGHT + object.position[1];
  else if (object.position[1] > config.GAME_HEIGHT)
    object.position[1] -= config.GAME_HEIGHT;
}

function rotate(object, rad) {
  if (!object.dead) {
    object.direction += rad;
  }
}

function moveAsteroidLocally(asteroids, config, delta) {
  for (let roid of asteroids) {
    // console.log(`rotation before: ${roid.direction}`);
    move(roid, config, delta);
    rotate(roid, roid.rotation);
    // console.log(`rotation after: ${roid.direction}`);
  }
}