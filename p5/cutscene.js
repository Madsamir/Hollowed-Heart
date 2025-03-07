let texts = [
  "You're a lonely farmer working to get by",
  "But you're constantly paying taxes",
  "You stole some armor and is going to fight for your hard earned money",
  "Get your moni up not your funny up, skrrr bap",
];

let currentTextIndex = 0;
let textElement = null;
let cutsceneContainer = null;
let gameContainer = null;
// github co-pilot
document.addEventListener("DOMContentLoaded", () => {
  textElement = document.getElementById("cutscene-text");
  cutsceneContainer = document.getElementById("cutscene-container");
  gameContainer = document.getElementById("game-container");

  showNextText();
});
// github co-pilot
document.addEventListener("click", () => {
  transitionToGame();
});

function showNextText() {
  if (currentTextIndex < texts.length) {
    textElement.textContent = texts[currentTextIndex];
    textElement.style.opacity = 1;

    setTimeout(() => {
      textElement.style.opacity = 0;
      setTimeout(() => {
        currentTextIndex++;
        showNextText();
      }, 1000); // Wait for fade out before switching text
    }, 3000); // Display text for 3 seconds
  } else {
    setTimeout(transitionToGame, 1000); // Wait for fade-out before starting the game
  }
}
// anvender gamestate til at skifte fra cutscene til game
function transitionToGame() {
  cutsceneContainer.style.display = "none";
  gameContainer.style.display = "block";

  if (gameState == 0) { gameState = 1; }
  setupGame(); // Initialize the game
  console.log("transitioned to game");

}
