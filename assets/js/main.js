const canvas = document.getElementById("game-canvas");

const ctx = canvas.getContext("2d");

const game = new TetrisGame(ctx);

window.addEventListener('load', () => {
    game.start();
  
    // iteration - 2: add key listeners to the game
    document.addEventListener('keydown', (e) => game.onKeyDownEvent(e));
    document.addEventListener('keyup', (e) => game.onKeyUpEvent(e));
  });
  