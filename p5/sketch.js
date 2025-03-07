let myGif;
let showGif = false;
let gameState = 0;

function preload() {
  myGif = createImg("assets/GIFMaker_me.gif", "gif");
  preloadGame(); // preload game assets
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  
}

function setupGame() {

  myGif.size(width, height);
  myGif.position(0, 0);
  player = new Player(50, windowHeight - platformHeight - 102, playerIdleRight);
  enemy = new Enemy(worldWidth - 150, windowHeight - platformHeight - 102, enemyWalkLeftFrames[0]);
}

let startGame = false;



function draw() {
  background(0);
  console.log(gameState);

  if (gameState == 0) {
    myGif.hide();

  }
  else if (gameState == 1) {
    myGif.show();

  }
  else if (gameState == 2) {
    myGif.hide();
    drawGame();
  }

}

function mousePressed() {
  //setupGame(); // setup the game when mouse is pressed
  if (gameState == 1) {
    gameState = 2;
  }
  console.log(showGif);
}


