const mainCanvas = document.getElementById("game-canvas");
const holdCanvas =  document.getElementById("hold-canvas");
const nextCanvas = document.getElementById("next-canvas");


const ctx = mainCanvas.getContext("2d");
const ctxHold = holdCanvas.getContext("2d");
const ctxNext = nextCanvas.getContext("2d");


const game = new TetrisGame(ctx, ctxHold, ctxNext);

window.addEventListener('load', () => {
    game.start();
  
    // iteration - 2: add key listeners to the game
    document.addEventListener('keydown', (e) => game.onKeyDownEvent(e));
    document.addEventListener('keyup', (e) => game.onKeyUpEvent(e));
  });
  