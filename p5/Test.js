let player;
let enemy;
let bgImg; 
let platformHeight = 50; 
let gravity = 0.5; 
let slashRightImgs = [];
let slashLeftImgs = [];
let slashFrame = 0; 
let slashing = false; 
let slashFrameCount = 0; 
let slashScale = 150; 
let slashOffsetX = 50; 
let slashOffsetY = -20; 
let worldWidth = 2000;
let worldHeight = 1000; 
let gameOver = false; 
let gameOverMessage = "";


let playerIdleRight, playerIdleLeft;
let playerWalkRight1, playerWalkRight2;
let playerWalkLeft1, playerWalkLeft2, playerWalkLeft3;
let walkRightFrames = [];
let walkLeftFrames = [];
let walkFrameIndex = 0;
let walkFrameCount = 0;
let lastDirection = null; 

// Enemy animation frames
let enemyWalkLeftFrames = [];
let enemyWalkRightFrames = [];
let enemyIdleFrame;


let projectiles = [];

function preloadGame() {
  // Right-facing animations
  playerIdleRight = loadImage("assets/MC.png");
  playerWalkRight1 = loadImage("assets/MC2.png");
  playerWalkRight2 = loadImage("assets/MC3.png");

  // Left-facing animations
  playerIdleLeft = loadImage("assets/flip1.png");
  playerWalkLeft1 = loadImage("assets/flip1.png");
  playerWalkLeft2 = loadImage("assets/flip2.png");
  playerWalkLeft3 = loadImage("assets/flip3.png");

  // Enemy & background
  enemyImg = loadImage("assets/Demon 1.png");
  bgImg = loadImage("assets/baggrund.jpg");

  // Store frames in arrays
  walkRightFrames = [playerWalkRight1, playerWalkRight2];
  walkLeftFrames = [playerWalkLeft1, playerWalkLeft2, playerWalkLeft3];

  // Load enemy walk animations (Left & Right)
  enemyWalkLeftFrames = [
    loadImage("assets/Demon 1.png"),
    loadImage("assets/Demon 2.png"),
    loadImage("assets/Demon 3.png")
  ];

  enemyWalkRightFrames = [
    loadImage("assets/Dæmon1.png"),
    loadImage("assets/Dæmon2.png"),
    loadImage("assets/Dæmon3.png"),
    loadImage("assets/Dæmon4.png")
  ];

  
  slashRightImgs = [
    loadImage("assets/slash1.png"),
    loadImage("assets/slash2.png"),
    loadImage("assets/slash3.png"),
    loadImage("assets/slash4.png")
  ];

  slashLeftImgs = [
    loadImage("assets/dash1.png"),
    loadImage("assets/dash2.png"),
    loadImage("assets/dash3.png")
  ];
}


function drawGame() {
  if (gameOver) {
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(gameOverMessage, width / 2, height / 2);
    return;
  }
  console.log("drawGame");
  image(bgImg, 0,0, width, height);

  /* skifter det orginale (x,y) position til vores spillers position, 
   så spillet føles som om det er centreret omkring spilleren*/
  translate(-player.x + width / 2, 0);

  // Opdatere spillerens position, bevægelse og animation
  player.update();
  // Tegner spilleren på skærmen
  player.display();
  // Opdatere position og animation
  enemy.update();
  // Tegner fjenden på skærmen
  enemy.display();

  // Update and display projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    projectiles[i].display();
    if (projectiles[i].offscreen()) {
      projectiles.splice(i, 1);
    } else if (collides(projectiles[i].x, projectiles[i].y, projectiles[i].size, projectiles[i].size, player.x, player.y, 100, 100)) {
      gameOver = true;
      gameOverMessage = "Game Over";
    }
  }

  // Usyndlig platform (virker stadig)
  noFill();
  noStroke(); // Så der ikke er sorte hjørner
  rect(0, windowHeight - platformHeight, worldWidth, platformHeight);

  if (slashing) {
    // øger "slashFrameCount" med 1"
    slashFrameCount++;
    // Hver 5. frame, skift til næste frame
    if (slashFrameCount % 5 === 0) {
      //skifter til næste frame
      slashFrame++;
      // Co-pilot anvender (?) operator til at håndtere forskellige antal frames for venstre og højre 
      let maxFrames = player.facingLeft ? slashLeftImgs.length : slashRightImgs.length;
      // stopper animationen, når vi har nået sidste frame
      if (slashFrame >= maxFrames) {
        slashing = false;
        slashFrame = 0;
      }
    }
    // bestemmer "slashing" position og retning  
    if (slashing) {
      let slashX = player.x + (player.facingLeft ? -50 : slashOffsetX);
      let slashY = player.y + slashOffsetY;
      let slashImg = player.facingLeft ? slashLeftImgs[slashFrame] : slashRightImgs[slashFrame];
      // tegner "slashing" på skærmen  
      image(slashImg, slashX, slashY, slashScale, slashScale);

      // Tjekker "collision" mellem "slashing" og fjenden
      if (enemy && collides(slashX, slashY, slashScale, slashScale, enemy.x, enemy.y, 75, 75)) {
        enemy = null; // Remove enemy
        gameOver = true;
        gameOverMessage = "You're now tax free";
      }
    }
  }

  // Check if player collides with enemy
  if (enemy && collides(player.x, player.y, 100, 100, enemy.x, enemy.y, 75, 75)) {
    gameOver = true;
    gameOverMessage = "Game Over";
  }

  // Holder minimappen på højre side af skærmen ved at nulstille koordinatsystemet vha "resetMatrix".
  resetMatrix();
  drawMinimap();
}
 // funktion til minimap
function drawMinimap() {
  let minimapScale = 0.1;
  let minimapWidth = worldWidth * minimapScale;
  let minimapHeight = worldHeight * minimapScale;
  let minimapX = width - minimapWidth - 20;
  let minimapY = 20;

  // Minimap baggrund
  fill(200, 200, 200, 150);
  rect(minimapX, minimapY, minimapWidth, minimapHeight);

  // Draw player on minimap
  fill(0, 0, 255);
  let playerMinimapX = minimapX + player.x * minimapScale;
  let playerMinimapY = minimapY + player.y * minimapScale;
  rect(playerMinimapX, playerMinimapY, 10, 10);

  // Draw enemy on minimap
  if (enemy) {
    fill(255, 0, 0);
    let enemyMinimapX = minimapX + enemy.x * minimapScale;
    let enemyMinimapY = minimapY + enemy.y * minimapScale;
    rect(enemyMinimapX, enemyMinimapY, 10, 10);
  }
}
// tjekker om de 2 figurer på minimapen kolliderer
function collides(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}

function keyPressed() {
  player.handleInput(keyCode, true);
}

function keyReleased() {
  player.handleInput(keyCode, false);
}

class Sprite {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.speed = 7;
  }

  display() {
    image(this.img, this.x, this.y, 100, 100);
  }
}

class Player extends Sprite {
  constructor(x, y, img) {
    super(x, y, img);
    this.moving = { left: false, right: false };
    this.velocityY = 0;
    this.jumpStrength = 15; // Increased jump strength
    this.onGround = false;
    this.isWalking = false;
    this.facingLeft = false;
  }

  update() {
    // spilleren falder hurtigere over tid
    this.velocityY += gravity;
    // spilleren falder nedad
    this.y += this.velocityY;
    // sørger for at spilderen ikke falder igennem platformen
    if (this.y > windowHeight - platformHeight - 100) {
      this.y = windowHeight - platformHeight - 100;
      this.velocityY = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
    // variabel til at gemme spillerens retning
    let prevFacingLeft = this.facingLeft;
    // holder øje med hvis "player" bevæger sig til venstre eller højre
    if (this.moving.left) {
      this.x -= this.speed;
      this.isWalking = true;
      this.facingLeft = true;
    } else if (this.moving.right) {
      this.x += this.speed;
      this.isWalking = true;
      this.facingLeft = false;
    } else {
      this.isWalking = false;
    }
    
    this.x = constrain(this.x, 0, worldWidth - 100);

    if (prevFacingLeft !== this.facingLeft) {
      walkFrameIndex = 0;
    }

    if (this.isWalking) {
      walkFrameCount++;
      if (walkFrameCount % 10 === 0) {
        let frameArray = this.facingLeft ? walkLeftFrames : walkRightFrames;
        walkFrameIndex = (walkFrameIndex + 1) % frameArray.length;
      }
      this.img = this.facingLeft ? walkLeftFrames[walkFrameIndex] : walkRightFrames[walkFrameIndex];
    } else {
      this.img = this.facingLeft ? playerIdleLeft : playerIdleRight;
    }
  }

  handleInput(key, isPressed) {
    if (key === 87 && isPressed && this.onGround) {
      this.velocityY = -this.jumpStrength;
    }
    if (key === 65) this.moving.left = isPressed;
    if (key === 68) this.moving.right = isPressed;
    if (key === 82 && isPressed && !slashing) {
      slashing = true;
      slashFrame = 0;
      slashFrameCount = 0;
    }
  }
}

class Enemy extends Sprite {
  constructor(x, y, img) {
    super(x, y, img);
    this.walkingLeft = true;
    this.walkingRight = false;
    this.walkFrameIndex = 0;
    this.walkFrameCount = 0;
    this.walkTimer = 0;
    this.originalX = x;
    this.shootTimer = 0;
    this.speed = 1; // Slower walking speed
  }

  display() {
    image(this.img, this.x, this.y, 75, 75); // Adjusted size
  }

  update() {
    this.walkTimer++;
    this.shootTimer++;

    if (this.walkingLeft) {
      this.x -= this.speed;
      this.walkFrameCount++;
      if (this.walkFrameCount % 10 === 0) {
        this.walkFrameIndex = (this.walkFrameIndex + 1) % enemyWalkLeftFrames.length;
      }
      this.img = enemyWalkLeftFrames[this.walkFrameIndex];

      if (this.walkTimer >= 300) { // 5 seconds at 60 FPS
        this.walkingLeft = false;
        this.walkingRight = true;
        this.walkTimer = 0;
      }
    } else if (this.walkingRight) {
      this.x += this.speed;
      this.walkFrameCount++;
      if (this.walkFrameCount % 10 === 0) {
        this.walkFrameIndex = (this.walkFrameIndex + 1) % enemyWalkRightFrames.length;
      }
      this.img = enemyWalkRightFrames[this.walkFrameIndex];

      if (this.x >= this.originalX) {
        this.walkingRight = false;
        this.walkingLeft = true;
        this.walkTimer = 0;
      }
    }

    // Shoot projectiles every 2 seconds
    if (this.shootTimer >= 120) {
      this.shoot();
      this.shootTimer = 0;
    }
  }

  shoot() {
    let projectile = new Projectile(this.x, this.y + 37.5, -5); // Adjusted position and speed
    projectiles.push(projectile);
  }
}

class Projectile {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = 10;
  }

  update() {
    this.x += this.speed;
  }

  display() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  offscreen() {
    return this.x < 0 || this.x > worldWidth;
  }
}
