class TetrominoController {
    constructor(tetromino, playfield) {
        this.tetromino = tetromino;
        this.currentRotation = 0;
        this.position = new Vector2D(0,0);
        this.blocks = [];
        this.playfield = playfield;

        this.inputRate = 0.3;
        this.currentTime = 0;

        this.isRotationPressed = false;
        this.isDownPressed = false;

        this.ghostedTetromino = new GhostedTetromino(this, playfield);
    }

    init() {
        this.position = new Vector2D((this.playfield.playfieldWidth / 2) - 1, 0);
        this.blocks = this.tetromino.rotations[0];

        this.ghostedTetromino.init();
    }

    draw() {
        this.ghostedTetromino.draw();

        this.blocks.forEach(c => {
            const gridPos = Vector2D.add(c, this.position);
            this.playfield.drawCell(gridPos.x, gridPos.y, this.tetromino.color);
        });
    }

    update(deltatime) {
        this.currentTime += deltatime;
    }

    onKeyDownEvent(e) {
        switch(e.keyCode) {
            case KEY_LEFT:
                this.moveLeft();
                break;
            case KEY_RIGHT:
                this.moveRight();
                break;
            case KEY_UP:
                if(!this.isRotationPressed) {
                    this.isRotationPressed = true;
                    this.rotate();
                }
                break;
            case KEY_DOWN:
                    this.isDownPressed = true;
                    if(!this.moveDown()) {
                        this.init();
                    }
                break;
        }
    }

    onKeyUpEvent(e) {
        switch(e.keyCode) {
            case KEY_UP:
                this.isRotationPressed = false;
                break;
            case KEY_DOWN:
                break;

        }
    }

    canMovePiece() {
        if(this.currentTime  > this.inputRate) {
            console.log("Nos fuimooo00");
            this.currentTime = 0;
            return true;
        }

        return false;
    }

    rotate() {
        const tempRotation = (this.currentRotation + 1) % this.tetromino.rotations.length;

        for(let i = 0; i < this.tetromino.rotations[tempRotation].length; i++) {
            const nextPos = Vector2D.add(this.tetromino.rotations[tempRotation][i], this.position);

            if(
                nextPos.x < 0 ||
                nextPos.y < 0 ||
                nextPos.x > this.playfield.playfieldWidth - 1 ||
                nextPos.y > this.playfield.playfieldHeight - 1 ||
                this.playfield.cells[nextPos.x][nextPos.y].isFilled
            ) {
                return false;
            }
        }

        
        this.currentRotation = tempRotation;
        this.blocks = this.tetromino.rotations[this.currentRotation];

        this.ghostedTetromino.blocks = this.blocks;
        this.ghostedTetromino.updatePosition();
        return true;
    }

    moveLeft() {
        for(let i = 0; i < this.blocks.length; i++) {
            const gridPos = Vector2D.add(this.blocks[i], this.position);
            const nextPos = new Vector2D(gridPos.x - 1, gridPos.y);

            if(nextPos.x < 0 || this.playfield.cells[nextPos.x][nextPos.y].isFilled) {
                return false;
            }
        }

        this.position.x--;
        this.ghostedTetromino.updatePosition();
        return true;
    }

    moveRight() {
        for(let i = 0; i < this.blocks.length; i++) {
            const gridPos = Vector2D.add(this.blocks[i], this.position);
            const nextPos = new Vector2D(gridPos.x + 1, gridPos.y);

            if(nextPos.x > this.playfield.playfieldWidth - 1 || this.playfield.cells[nextPos.x][nextPos.y].isFilled) {
                return false;
            }
        }

        this.position.x++;
        this.ghostedTetromino.updatePosition();
        return true;
    }

    moveDown() {
        for(let i = 0; i < this.blocks.length; i++) {
            const gridPos = Vector2D.add(this.blocks[i], this.position);
            const nextPos = new Vector2D(gridPos.x, gridPos.y+1);

            if(nextPos.y > this.playfield.playfieldHeight - 1 || this.playfield.cells[nextPos.x][nextPos.y].isFilled) {
                this.playfield.placeTetromino(this);
                return false;
            }
        }

        this.position.y++;
        return true;
    }
}