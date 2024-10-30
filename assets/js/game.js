class TetrisGame {
    constructor(ctx, ctxHold, ctxNext) {
        this.ctx = ctx;
        this.ctxHold = ctxHold;
        this.ctxNext = ctxNext;

        this.previousUpdateTime = 0;
        this.previousDrawTime = 0;

        this.isRunning = false;
        
        this.tetrominosStack = [];
        this.playField = new PlayField(this.ctx);
        this.tetrominoController = undefined;
        this.currentTetromino = undefined;

        this.holdedTetromino = undefined;
        this.alreadyHolded = false;

        this.currentTime = 0;

        this.soundManager = new SoundManager();
        this.soundManager.setSong('assets/audio/music/tetris.mp3') ;

        this.holdedTetrominoDisplay = new HoldedTetrominoDisplay();
    }

    start() {
        this.isRunning = true;

        this.playField.init();

        this.fillTetrominosStack();
        this.updateTetrominoFromStack();

        this.soundManager.playSong();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    onKeyDownEvent(e) {
        this.tetrominoController.onKeyDownEvent(e);

        if(e.keyCode === KEY_C) {
            if(!this.alreadyHolded) {
                this.hold();
            }
            
        }
    }

    onKeyUpEvent(e) {
        this.tetrominoController.onKeyUpEvent(e);
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

    fillTetrominosStack() {
        const aux = Array.from(tetrominoTypes.keys);

        for(let i = keys.length-1;  i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const swap = aux[i];
            aux[i] =  aux[j];
            aux[j] =  swap;
        }

        this.aux.forEach(t => {
            this.tetrominosStack.push(t);
        });
    }

    update(deltaTime) {
        this.currentTime += deltaTime;

        this.tetrominoController.update(deltaTime);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctxHold.clearRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);
        this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);

        ctxHold.save();

        ctxHold.fillStyle = 'black';
        ctxHold.fillRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);
        ctxNext.fillRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
        
        ctx.restore();

        

        this.playField.draw(this.ctx);
        this.tetrominoController.draw();

        this.holdedTetrominoDisplay.draw(this.ctxHold);
    }

    fillTetrominosStack() {
        const tetrominoKeys = Object.keys(tetrominoTypes);

        for (let i = tetrominoKeys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            const temp = tetrominoKeys[i];
            tetrominoKeys[i] = tetrominoKeys[j];
            tetrominoKeys[j] = temp;
        }

        this.tetrominosStack = tetrominoKeys;
    }

    updateTetrominoFromStack() {
        if(!this.tetrominoController) {
            const tetromino = this.tetrominosStack.pop();
            this.tetrominoController = new TetrominoController(this, tetrominoTypes[tetromino], this.playField);
            this.currentTetromino = tetromino;
        } else {
            this.tetrominoController = new TetrominoController(this, tetrominoTypes[this.nextTetromino], this.playField);
            this.currentTetromino = this.nextTetromino;
        }

        this.tetrominoController.init();

        this.nextTetromino = this.tetrominosStack.pop();

        if(this.tetrominosStack.length === 0) {
            this.fillTetrominosStack();
        }
   
        this.alreadyHolded = false;
    }

    hold() {
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
    }

}