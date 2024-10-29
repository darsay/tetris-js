class TetrominoController {
    constructor(game, tetromino, playfield) {
        this.game = game;
        this.tetromino = tetromino;
        this.currentRotation = 0;
        this.position = new Vector2D(0,0);
        this.blocks = [];
        this.playfield = playfield;

        this.inputRate = 0.3;
        this.currentTime = 0;
        this.timeToFall = 2;

        this.isRotationPressed = false;
        this.isDownPressed = false;
        this.isDropPressed  = false;


        
    }

    init() {
        this.position = new Vector2D((this.playfield.playfieldWidth / 2) - 1, 0);
        this.blocks = this.tetromino.rotations[0];

        this.ghostedTetromino = new GhostedTetromino(this, this.playfield);
        this.ghostedTetromino.updatePosition();
        this.currentTime = 0;
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

        if(this.currentTime > this.timeToFall) {
            this.currentTime = 0;          

            if(!this.canMoveDown()) {
                this.placeTetromino();
                this.game.updateTetrominoFromStack();
            } else {
                this.moveDown();
            }
        }
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
                    if(!this.canMoveDown()) {
                        this.placeTetromino();
                        this.game.updateTetrominoFromStack();
                    } else {
                        this.moveDown();
                    }
                break;
            case KEY_SPACE:
                this.isDropPressed = true;
                this.drop();

        }
    }

    onKeyUpEvent(e) {
        switch(e.keyCode) {
            case KEY_UP:
                this.isRotationPressed = false;
                break;
            case KEY_SPACE:
                this.isDropPressed = false;

        }
    }

    canMovePiece() {
        if(this.currentTime  > this.inputRate) {
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

        if(!this.canMoveDown()) {
            this.currentTime = 0;
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

        if(!this.canMoveDown()) {
            this.currentTime = 0;
        }

        return true;
    }

    canMoveDown() {
        for(let i = 0; i < this.blocks.length; i++) {
            const gridPos = Vector2D.add(this.blocks[i], this.position);
            const nextPos = new Vector2D(gridPos.x, gridPos.y+1);

            if(nextPos.y > this.playfield.playfieldHeight - 1 || this.playfield.cells[nextPos.x][nextPos.y].isFilled) {
                return false;
            }
        }

        return true;
    }

    moveDown() {
        this.position.y++;
    }

    placeTetromino() {
        this.playfield.placeTetromino(this);
    }

    drop() {
        this.position = this.ghostedTetromino.position;
        this.placeTetromino();
        this.game.updateTetrominoFromStack();
    }
}