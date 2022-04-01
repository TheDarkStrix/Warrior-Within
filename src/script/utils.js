const gravity = 0.7;
const movementVelocity = 5;
const movementJump = -20;

const assets = {
  env: {
    backgroundImage: "/static/textures/background.png",
    shop: "/static/textures/shop.png",
  },
  playerMax: {
    idleSprite: {
      image: "/static/textures/Max/Idle.png",
      frames: 11,
    },
    attackSprite: {
      image: "/static/textures/Max/Attack1.png",
      frames: 7,
    },
    runSprite: {
      image: "/static/textures/Max/Run.png",
      frames: 8,
    },
    jumpSprite: {
      image: "/static/textures/Max/Jump.png",
      frames: 3,
    },
    takeHitSprite: {
      image: "/static/textures/Max/TakeHit.png",
      frames: 4,
    },
    fallSprite: {
      image: "/static/textures/Max/Fall.png",
      frames: 3,
    },
    deathSprite: {
      image: "/static/textures/Max/Death.png",
      frames: 11,
    },
  },
  playerRobin: {
    idleSprite: {
      image: "/static/textures/Robin/Idle.png",
      frames: 4,
    },
    attackSprite: {
      image: "/static/textures/Robin/Attack1.png",
      frames: 4,
    },
    runSprite: {
      image: "/static/textures/Robin/Run.png",
      frames: 8,
    },
    jumpSprite: {
      image: "/static/textures/Robin/Jump.png",
      frames: 2,
    },
    takeHitSprite: {
      image: "/static/textures/Robin/TakeHit.png",
      frames: 3,
    },
    fallSprite: {
      image: "/static/textures/Robin/Fall.png",
      frames: 2,
    },
    deathSprite: {
      image: "/static/textures/Robin/Death.png",
      frames: 7,
    },
  },
};

const playerFighterData = {
  position: {
    x: 300,
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
  imageSrc: assets.playerMax.idleSprite.image,
  framesMax: 11,
  scale: 2.5,
  offset: {
    x: 215,
    y: 138,
  },
  sprites: {
    idle: {
      imageSrc: assets.playerMax.idleSprite.image,
      framesMax: assets.playerMax.idleSprite.frames,
    },
    run: {
      imageSrc: assets.playerMax.runSprite.image,
      framesMax: assets.playerMax.runSprite.frames,
    },
    jump: {
      imageSrc: assets.playerMax.jumpSprite.image,
      framesMax: assets.playerMax.jumpSprite.frames,
    },
    fall: {
      imageSrc: assets.playerMax.fallSprite.image,
      framesMax: assets.playerMax.fallSprite.frames,
    },
    attack: {
      imageSrc: assets.playerMax.attackSprite.image,
      framesMax: assets.playerMax.attackSprite.frames,
    },
    death: {
      imageSrc: assets.playerMax.deathSprite.image,
      framesMax: assets.playerMax.deathSprite.frames,
    },
    takeHit: {
      imageSrc: assets.playerMax.takeHitSprite.image,
      framesMax: assets.playerMax.takeHitSprite.frames,
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
};

const enemyFighterData = {
  position: {
    x: 600,
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
  imageSrc: assets.playerRobin.idleSprite.image,
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: assets.playerRobin.idleSprite.image,
      framesMax: assets.playerRobin.idleSprite.frames,
    },
    run: {
      imageSrc: assets.playerRobin.runSprite.image,
      framesMax: assets.playerRobin.runSprite.frames,
    },
    jump: {
      imageSrc: assets.playerRobin.jumpSprite.image,
      framesMax: assets.playerRobin.jumpSprite.frames,
    },
    fall: {
      imageSrc: assets.playerRobin.jumpSprite.image,
      framesMax: assets.playerRobin.jumpSprite.frames,
    },
    attack: {
      imageSrc: assets.playerRobin.attackSprite.image,
      framesMax: assets.playerRobin.attackSprite.frames,
    },
    death: {
      imageSrc: assets.playerRobin.deathSprite.image,
      framesMax: assets.playerRobin.deathSprite.frames,
    },
    takeHit: {
      imageSrc: assets.playerRobin.takeHitSprite.image,
      framesMax: assets.playerRobin.takeHitSprite.frames,
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
  clearInterval(timerCountDown);
  gameEndContainer.classList.replace("hidden", "gameEnd");
  if (player.health === enemy.health) {
    gameEnd.innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    gameEnd.innerHTML = "Max Won";
  } else {
    gameEnd.innerHTML = "Robin Won";
  }
  this.gameRunning = false;
}

let timer = 40;
let timerCountDown;
function decreaseTimer() {
  let timerHTMLContent = document.getElementById("gameTimer");
  if (timerCountDown) {
    clearInterval(timerCountDown);
    timerCountDown = null;
    console.log(timerCountDown);
  }
  console.log(timerCountDown);
  timerCountDown = setInterval(() => {
    if (timer > 0) {
      timer--;
      timerHTMLContent.innerHTML = timer;
    } else {
      checkGameState({ player, enemy });
    }
  }, 1000);
}
