

class TetrisGame {
    constructor(ctx, ctxHold, ctxNext) {
        this.ctx = ctx;
        this.ctxHold = ctxHold;
        this.ctxNext = ctxNext;

        this.previousUpdateTime = 0;
        this.previousDrawTime = 0;

        this.isRunning = false;

        this.scoreManager = new ScoreManager(this);
        
        this.tetrominosStack = [];
        this.playField = new PlayField(this, this.scoreManager);
        this.tetrominoController = undefined;
        this.currentTetromino = undefined;

        this.holdedTetromino = undefined;
        this.alreadyHolded = false;

        this.currentTime = 0;
        this.maxCountDownNumber = 3;
        this.countDownNumber = this.maxCountDownNumber;
        this.timeIntervalInCountDown = 1000;
        this.countDownInterval = undefined;

        this.holdedTetrominoDisplay = new TetrominoDisplay(0);

        this.logoImage = new Image();
        this.logoImage.src = LOGO_IMAGE;

        this.playerName = "";

        this.nextTetrominoDisplay = [
            new TetrominoDisplay(0),
            new TetrominoDisplay(1),
            new TetrominoDisplay(2)
        ];
        

        this.stateMachine = {
            STATE_START: {
                enterState: this.enterStateStart.bind(this),
                update: this.updateStart.bind(this),
                draw: this.drawStart.bind(this)
            },
            STATE_PLAYING: {
                enterState: this.enterStatePlaying.bind(this),
                update: this.updatePlaying.bind(this),
                draw: this.drawPlaying.bind(this)
            },
            STATE_GAME_OVER: {
                enterState:  this.enterStateGameOver.bind(this),
                update: this.updateGameOver.bind(this),
                draw: this.drawGameOver.bind(this)
            },
            STATE_PAUSED: {
                enterState:  this.enterStatePaused.bind(this),
                update: this.updatePaused.bind(this),
                draw: this.drawPaused.bind(this)
            },
            STATE_COUNTDOWN: {
                enterState: this.enterStateCountDown.bind(this),
                update: this.updateCountDown.bind(this),
                draw: this.drawCountDown.bind(this)
            },
            STATE_ENTERNAME: {
                enterState: this.enterStateEnterName.bind(this),
                update: this.updateEnterName.bind(this),
                draw: this.drawEnterName.bind(this)
            } 
        };
    }

    start() {
        this.isRunning = true;

        this.playField.init();

        this.fillTetrominosStack();
        this.updateTetrominoFromStack();

        SoundManager.setSong(GAME_SONG);

        requestAnimationFrame(this.gameLoop.bind(this));

        this.changeState(STATE_START);
    }

    reset() {
        this.currentTetromino = undefined;

        this.tetrominosStack = [];
        this.holdedTetromino = undefined;
        this.holdedTetrominoDisplay.setHoldedTetromino(undefined);
        
        this.playField.init();

        this.fillTetrominosStack();
        this.updateTetrominoFromStack(); 
    }

    onKeyDownEvent(e) {

        if(this.state === STATE_START) {
            if(e.keyCode === KEY_SPACE) {
                this.changeState(STATE_COUNTDOWN);       
            }
        }

        if(this.state === STATE_PLAYING) {
            this.tetrominoController.onKeyDownEvent(e);

            if(e.keyCode === KEY_C) {
                this.hold();        
            }
        }

        if(e.keyCode === KEY_ESC) {
            this.togglePause();
        }
       
    }

    onKeyUpEvent(e) {
        if(this.state === STATE_PLAYING) {
            this.tetrominoController.onKeyUpEvent(e);
        }

        if(this.state === STATE_ENTERNAME) {
            this.enterName(e);
        }
        
    }

    gameLoop(timeStamp) {
        if(!this.isRunning) return;

        const deltaTime = (timeStamp - this.previousUpdateTime) / 1000;
        this.previousUpdateTime = timeStamp;

        this.update(deltaTime);

        if(timeStamp - this.previousDrawTime >= (1000 / FRAME_RATE)) {
            this.draw();
            this.previousDrawTime = timeStamp;
        }

        requestAnimationFrame(this.gameLoop.bind(this));
    }


    update(deltaTime) {
        this.currentTime += deltaTime;

        this.stateMachine[this.state].update(deltaTime);

    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctxHold.clearRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);
        this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);

        this.stateMachine[this.state].draw();
    }

    fillTetrominosStack() {
        const tetrominoKeys = Object.keys(tetrominoTypes);

        for (let i = tetrominoKeys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            const temp = tetrominoKeys[i];
            tetrominoKeys[i] = tetrominoKeys[j];
            tetrominoKeys[j] = temp;
        }

        this.tetrominosStack = tetrominoKeys.concat(this.tetrominosStack);
    }

    updateTetrominoFromStack() {
        const tetromino = this.tetrominosStack.pop();
        this.tetrominoController = new TetrominoController(this, tetrominoTypes[tetromino], this.playField);
        this.currentTetromino = tetromino;

        this.tetrominoController.init();

        if(this.tetrominosStack.length < 3) {
            this.fillTetrominosStack();
        }
   
        this.alreadyHolded = false;

        for(let i = 0; i < this.nextTetrominoDisplay.length; i++) {
            this.nextTetrominoDisplay[i].setHoldedTetromino(
                tetrominoTypes [
                    this.tetrominosStack[this.tetrominosStack.length - 1 - i
                    ]
                ]);
        }
    }

    hold() {
        if(this.alreadyHolded) {
            SoundManager.playFx(CAN_NOT_HOLD_SFX);
            return;
        }

        let previousHoldedTetromino = this.holdedTetromino;

        this.holdedTetromino = this.currentTetromino;

        if(previousHoldedTetromino) {
            this.tetrominoController = new TetrominoController(this, tetrominoTypes[previousHoldedTetromino], this.playField);
            this.tetrominoController.init();
        } else {
            this.updateTetrominoFromStack();
        }

        this.alreadyHolded = true;
        this.holdedTetrominoDisplay.setHoldedTetromino(tetrominoTypes[this.holdedTetromino]);
        SoundManager.playFx(HOLD_SFX);
    }

    gameOver() {
        this.changeState(STATE_GAME_OVER);
    }

    levelUp(level) {
        level = level > G_TABLE.length - 1 ? G_TABLE.length - 1 : level;
        
        this.tetrominoController.updateTimeToFall(level)
    }

    togglePause() {
        if(this.state == STATE_PLAYING) {
            this.changeState(STATE_PAUSED);
        } else if(this.state == STATE_PAUSED) {
            this.changeState(STATE_COUNTDOWN);
        }
    }

    //STATES

    changeState(state) {
        if(state === this.state) return;

        this.state = state;
        if(this.stateMachine[this.state].enterState) {
            this.stateMachine[this.state].enterState();
        }
    }

    //START STATE////////////////

    enterStateStart() {
        this.scoreManager.reset();
    }

    updateStart(deltaTime) {
    
    }

    drawStart() {
        this.ctx.save();
        
        const imageFactor = 0.2;

        ctx.drawImage(this.logoImage,
            this.ctx.canvas.width / 2 - this.logoImage.width* imageFactor / 2,
            50,
            this.logoImage.width * imageFactor,
            this.logoImage.height * imageFactor
        );

        ctx.font = '50px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        ctx.font = '20px Arial';
        ctx.fillText('Press SPACE to play!', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 50);

        this.ctx.restore();
    }

    /////////////////////////////////

    //COUNT DOWN STATE////////////////

    enterStateCountDown() {
        this.countDownInterval = setInterval(() => {
            this.countDownNumber--;
            if(this.countDownNumber < 0) {
                this.changeState(STATE_PLAYING);
                this.countDownNumber = this.maxCountDownNumber;
                clearInterval(this.countDownInterval);
            }
        },
        1000);
    }

    updateCountDown(deltaTime) {
    
    }

    drawCountDown() {
        this.ctx.save();
        ctx.font = '50px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        if(this.countDownNumber > 0) {
            ctx.fillText(this.countDownNumber, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        }
        else {
            ctx.fillText('GO!', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        }
    }

    /////////////////////////////////

    //PLAYING STATE////////////////

    enterStatePlaying() {
        SoundManager.playSong();
    }

    updatePlaying(deltaTime) {
        this.tetrominoController.update(deltaTime);
    }

    drawPlaying() {
        ctxHold.save();

        ctxHold.fillStyle = 'black';
        ctxHold.fillRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);
        ctxNext.fillRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
        
        ctx.restore();

        this.playField.draw(this.ctx);
        this.tetrominoController.draw();

        this.holdedTetrominoDisplay.draw(this.ctxHold);
        this.nextTetrominoDisplay.forEach(d => d.draw(this.ctxNext));
    }

    /////////////////////////////////

    //PAUSED STATE////////////////
    enterStatePaused() {
        SoundManager.stopSong();
    }

    updatePaused(deltaTime) {        
    }

    drawPaused() {
        this.ctx.save();
        ctx.font = '50px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        ctx.fillText('Pause', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

        ctx.font = '10px Arial';
        ctx.fillText('Press ESC to resume', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 50);

        this.ctx.restore();
    }
    /////////////////////////////////

    //GAME OVER STATE////////////////

    enterStateGameOver() {
        SoundManager.stopSong();
        this.changeState(STATE_ENTERNAME);
    }

    updateGameOver(deltaTime) {

    }
    drawGameOver() {
        this.playField.draw(this.ctx, true);
    }
    /////////////////////////////////


    //ENTER NAME STATE////////////////

    enterStateEnterName() {
       this.playerName = "";
       this.reset();
    }

    enterName(e) {
        if(e.keyCode === KEY_ENTER) {
            if(this.playerName.length === 0) {
                this.playerName = "NONE";
            }

            this.changeState(STATE_START);
        } else if(e.keyCode === KEY_BACKSPACE) {
            this.playerName = this.playerName.slice(0, -1);
        }
        else if(isAlphaNumeric(e.keyCode) && this.playerName.length < NAMES_LENGHT_LIMIT) {
            this.playerName += e.key.toUpperCase();
        }
    }

    updateEnterName(deltaTime) {
    }
    
    drawEnterName() {
        this.ctx.save();
        ctx.font = '21px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        ctx.fillText('Enter your name:', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

        ctx.font = '20px Arial';
        ctx.fillText(this.playerName, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 50);

        ctx.fillText('Press ENTER to continue', this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 150);

        this.ctx.restore();
    }
}