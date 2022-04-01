const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");
const gameEndContainer = document.getElementById("gameEndContainer");
const gameEnd = document.getElementById("gameEnd");
const gameStartContainer = document.getElementById("gameStartContainer");
const gameStart = document.getElementById("gameStart");
const mainWrapper = document.getElementById("main");

canvas.width = 1024;
canvas.height = 576;
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

let player;
let enemy;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: assets.env.backgroundImage,
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  scale: 2.75,
  imageSrc: assets.env.shop,
  framesMax: 6,
});

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

function restartGame() {
  window.location.reload();
}

function animate() {
  window.requestAnimationFrame(animate);
  /** Reset the canvas on every frame */
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  /** handle movement when both keys are pressed
   * according the last key pressed
   */

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -movementVelocity;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = movementVelocity;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -movementVelocity;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = movementVelocity;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  /** Detect Collision */
  if (
    detectCollisions({ p1: player, p2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 1
  ) {
    player.isAttacking = false;
    enemy.takeHit();
    document.getElementById("enemyHealth").style.width = enemy.health + "%";
  }

  /** If the player misses */
  if (player.isAttacking && player.framesCurrent === 1) {
    player.isAttacking = false;
  }

  if (
    detectCollisions({ p1: enemy, p2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 0
  ) {
    enemy.isAttacking = false;
    player.takeHit();
    document.getElementById("playerHealth").style.width = player.health + "%";
  }

  if (enemy.isAttacking && enemy.framesCurrent === 0) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    checkGameState({ player, enemy });
  }
}

window.addEventListener("keydown", (e) => {
  if (!player.dead) {
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

      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (e.key) {
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
      case "ArrowDown":
        enemy.attack();
        break;
    }
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

function init() {
  if (gameStartContainer.classList.contains("gameStart")) {
    mainWrapper.classList.replace("hidden", "main");
    gameStartContainer.classList.replace("gameStart", "hidden");
  }
  player = new Fighter({ ...playerFighterData });
  enemy = new Fighter({ ...enemyFighterData });

  // animate should can be called once
  if (!this.gameRunning) {
    animate();
    decreaseTimer();
    this.gameRunning = true;
  }
}

window.onload = () => {
  gameStartContainer.classList.add("gameStart");
  mainWrapper.classList.replace("main", "hidden");
};
