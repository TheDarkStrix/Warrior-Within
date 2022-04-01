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
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  draw() {
    canvasContext.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "/textures/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  scale: 2.75,
  imageSrc: "/textures/shop.png",
  framesMax: 6,
});

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      imageSrc,
      scale,
      position,
      offset,
      framesMax,
    });
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // attack box
    // canvasContext.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    /** this.position.y + this.height + this.velocity.y is bottom end of the player
     */
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      /** set the velocity to 0 when player/ememy reacher the bottom of the canvas */
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      /** Update the gravity if the player has not yet reached the bottom of the canvas */
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite("attack");
    this.isAttacking = true;
  }

  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else this.switchSprite("takeHit");
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }

    /* override all other animations with the attack animation */
    if (
      this.image === this.sprites.attack.image &&
      this.framesCurrent < this.sprites.attack.framesMax - 1
    )
      return;

    /* override all other animations when fight gets hit */
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        {
          if (this.image !== this.sprites.jump.image) {
            this.image = this.sprites.jump.image;
            this.framesMax = this.sprites.jump.framesMax;
            this.framesCurrent = 0;
          }
        }
        break;
      case "fall":
        {
          if (this.image !== this.sprites.fall.image) {
            this.image = this.sprites.fall.image;
            this.framesMax = this.sprites.fall.framesMax;
            this.framesCurrent = 0;
          }
        }
        break;
      case "attack":
        {
          if (this.image !== this.sprites.attack.image) {
            this.image = this.sprites.attack.image;
            this.framesMax = this.sprites.attack.framesMax;
            this.framesCurrent = 0;
          }
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}

const player = new Fighter({
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
  imageSrc: "/textures/Max/Idle.png",
  framesMax: 11,
  scale: 2.5,
  offset: {
    x: 215,
    y: 138,
  },
  sprites: {
    idle: {
      imageSrc: "/textures/Max/Idle.png",
      framesMax: 11,
    },
    run: {
      imageSrc: "/textures/Max/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "/textures/Max/Jump.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "/textures/Max/Fall.png",
      framesMax: 3,
    },
    attack: {
      imageSrc: "/textures/Max/Attack1.png",
      framesMax: 7,
    },
    death: {
      imageSrc: "/textures/Max/Death.png",
      framesMax: 11,
    },
    takeHit: {
      imageSrc: "/textures/Max/TakeHit.png",
      framesMax: 4,
    },
  },
  attackBox: {
    offset: {
      x: 30,
      y: 50,
    },
    width: 80,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 50,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "/textures/Robin/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "/textures/Robin/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "/textures/Robin/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "/textures/Robin/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "/textures/Robin/Fall.png",
      framesMax: 2,
    },
    attack: {
      imageSrc: "/textures/Robin/Attack1.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "/textures/Robin/Death.png",
      framesMax: 7,
    },
    takeHit: {
      imageSrc: "/textures/Robin/TakeHit.png",
      framesMax: 3,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
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

function detectCollisions({ p1, p2 }) {
  return (
    p1.attackBox.position.x + p1.attackBox.width >= p2.position.x &&
    p1.attackBox.position.x <= p2.position.x + p2.width &&
    p1.attackBox.position.y + p1.attackBox.height >= p2.position.y &&
    p1.attackBox.position.y <= p2.position.y + p2.height
  );
}

function checkGameState({ player, enemy }) {
  if (player.health === enemy.health) {
    gameEnd.innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    gameEnd.innerHTML = "Max Won";
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

  if (player.isAttacking) {
    player.switchSprite("attack");
  }

  if (enemy.isAttacking) {
    enemy.switchSprite("attack");
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

  if (player.health <= 0 || enemy.health <= 0) {
    checkGameState({ player, enemy });
    clearInterval(timerCountDown);
  }
}

animate();
decreaseTimer();

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
        player.isAttacking = true;
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
        enemy.isAttacking = true;
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
