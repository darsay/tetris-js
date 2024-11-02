const mainCanvas = document.getElementById("game-canvas");
const holdCanvas =  document.getElementById("hold-canvas");
const nextCanvas = document.getElementById("next-canvas");


const ctx = mainCanvas.getContext("2d");
const ctxHold = holdCanvas.getContext("2d");
const ctxNext = nextCanvas.getContext("2d");


const game = new TetrisGame(ctx, ctxHold, ctxNext);

const musicToggle = document.getElementById("toggle-music");
const sfxToggle = document.getElementById("toggle-sfx");

window.addEventListener('load', () => {
    game.start();
  
    document.addEventListener('keydown', (e) => game.onKeyDownEvent(e));
    document.addEventListener('keyup', (e) => game.onKeyUpEvent(e));
  });

  musicToggle.addEventListener('change', (e) => {
        SoundManager.setMusicEnabled(e.target.checked);
  });

  sfxToggle.addEventListener('change', (e) => {
        SoundManager.setSfxEnabled(e.target.checked);
  });

  window.onblur = () => {
    if(game.state === STATE_PLAYING) {
      game.changeState(STATE_PAUSED);
    }
    
  };