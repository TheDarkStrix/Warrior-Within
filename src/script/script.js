const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const movementVelocity = 5;
const movementJump = -20;
class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.lastKey;
  }

  draw() {
    canvasContext.fillStyle = "red";
    canvasContext.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    /** this.position.y + this.height + this.velocity.y is bottom end of the player
     */
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      /** set the velocity to 0 when player/ememy reacher the bottom of the canvas */
      this.velocity.y = 0;
    } else {
      /** Update the gravity if the player has not yet reached the bottom of the canvas */
      this.velocity.y += gravity;
    }
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 50,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

player.update();
enemy.update();

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  /** Reset the canvas on every frame */
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  /** handle movement when both keys are pressed
   * according the last key pressed
   */
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -movementVelocity;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = movementVelocity;
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -movementVelocity;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = movementVelocity;
  }
}

animate();

window.addEventListener("keydown", (e) => {
  console.log(e.key);
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = movementJump;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = movementJump;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  console.log(e.key);
  switch (e.key) {
    case "d":
      keys[e.key].pressed = false;
      break;
    case "a":
      keys[e.key].pressed = false;
      break;
    case "ArrowRight":
      keys[e.key].pressed = false;
      break;
    case "ArrowLeft":
      keys[e.key].pressed = false;
      break;
  }
});
