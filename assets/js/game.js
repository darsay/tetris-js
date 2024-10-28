class TetrisGame {
    constructor(ctx) {
        this.ctx = ctx;

        this.previousUpdateTime = 0;
        this.previousDrawTime = 0;

        this.isRunning = false;
        
        this.tetrominosStack = [];
        this.playField = new PlayField(this.ctx);
        this.tetrominoController = new TetrominoController(tetrominoTypes.Z, this.playField);

        this.currentTime = 0;
    }

    start() {
        this.isRunning = true;

        this.playField.init();
        this.tetrominoController.init();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    onKeyDownEvent(e) {
        this.tetrominoController.onKeyDownEvent(e);
    }

    onKeyUpEvent(e) {
        this.tetrominoController.onKeyUpEvent(e);
    }

    gameLoop(timeStamp) {
        if(!this.isRunning) return;

        const deltaTime = (timeStamp - this.previousUpdateTime) / 1000;
        this.previousUpdateTime = timeStamp;

        this.update(deltaTime);

        if(timeStamp - this.previousDrawTime >= 1000 / FRAME_RATE) {
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

        this.tetrominoController.update(deltaTime);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.playField.draw(this.ctx);
        this.tetrominoController.draw();
        this.playField.drawBorder(this.ctx);
    }

}