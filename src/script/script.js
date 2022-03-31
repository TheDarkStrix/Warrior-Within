import "../css/style.css";
const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const movementVelocity = 5;
const movementJump = -20;
class Sprite {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    canvasContext.fillStyle = this.color;
    canvasContext.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    if (this.isAttacking) {
      canvasContext.fillStyle = "green";
      canvasContext.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

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

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
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
  color: "red",
  offset: {
    x: 0,
    y: 0,
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
  color: "blue",
  offset: {
    x: -50,
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

function detectCollisions({ player, enemy }) {
  return (
    player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.position.x + enemy.width &&
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
    player.attackBox.position.y <= enemy.position.y + enemy.height
  );
}

function checkGameState({ player, enemy }) {
  if (player.health === enemy.health) {
    gameEnd.innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    gameEnd.innerHTML = "Player Won";
  } else {
    gameEnd.innerHTML = "Enemy Won";
  }
}
let timer = 5;
let timerCountDown;
function decreaseTimer() {
  let timerHTMLContent = document.getElementById("gameTimer");
  let gameEnd = document.getElementById("gameEnd");
  timerCountDown = setInterval(() => {
    if (timer > 0) {
      timer--;
      timerHTMLContent.innerHTML = timer;
    } else {
      clearInterval(timerCountDown);
      checkGameState({ player, enemy });
    }
  }, 1000);
}

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

  /** Detect Collision */

  if (detectCollisions({ player, enemy }) && player.isAttacking) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.getElementById("enemyHealth").style.width = enemy.health + "%";
  }

  if (detectCollisions({ enemy, player }) && enemy.isAttacking) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.getElementById("playerHealth").style.width = player.health + "%";
  }

  if (player.health <= 0 || enemy.health <= 0) {
    checkGameState({ player, enemy });
    clearInterval(timerCountDown);
  }
}

animate();
decreaseTimer();

window.addEventListener("keydown", (e) => {
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
    case " ":
      player.isAttacking = true;
      break;
    case "ArrowDown":
      enemy.isAttacking = true;
      break;
  }
});

window.addEventListener("keyup", (e) => {
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
    case " ":
      player.isAttacking = false;
      break;
    case "ArrowDown":
      enemy.isAttacking = false;
      break;
  }
});
