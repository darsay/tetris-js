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
        this.timeToFall = 0;
        this.timeToPlace = 0.5;

        this.isRotationRightPressed = false;
        this.isRotationLeftPressed = false;
        this.isHoldPressed = false;
        this.isDownPressed = false;
        this.isDropPressed  = false;
    }

    init() {
        this.updateTimeToFall(this.game.scoreManager.level);
        this.spawnTetromino();

        this.ghostedTetromino = new GhostedTetromino(this, this.playfield);
        this.ghostedTetromino.updatePosition();
        this.currentTime = 0;
    }

    spawnTetromino() {
        this.blocks = this.tetromino.rotations[0];
    
        this.position = new Vector2D((PLAYFIELD_WIDTH / 2) - 1, 1);

        let canPlaceAtOne = true;

        this.blocks.forEach(c => {
            const gridPos = Vector2D.add(c, this.position);

            
            if(gridPos.y >= 0 && this.playfield.cells[gridPos.x][gridPos.y].isFilled) {
                canPlaceAtOne = false;
            }    
        });

        if(!canPlaceAtOne) {
            this.position = new Vector2D((PLAYFIELD_WIDTH / 2) - 1, 0);

            let isGameOver = false;

            this.blocks.forEach(c => {
                const gridPos = Vector2D.add(c, this.position);
    
                
                if(gridPos.y >= 0 && this.playfield.cells[gridPos.x][gridPos.y].isFilled) {
                    isGameOver = true;
                }    
            });

            if(isGameOver) {
                this.game.gameOver();
            }
        }

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

        if(this.canMoveDown()) {
            if(this.currentTime > this.timeToFall) {
                this.currentTime = 0;
                this.moveDown();
            }
        } else {
            if(this.currentTime > this.timeToPlace) {
                this.currentTime = 0;
                this.placeTetromino();
                this.game.updateTetrominoFromStack();
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
                if(!this.isRotationRightPressed) {
                    this.isRotationRightPressed = true;
                    this.rotate(1);
                }
                break;
            case KEY_Z:
                if(!this.isRotationLeftPressed) {
                    this.isRotationLeftPressed = true;
                    this.rotate(-1);
                }
                break;
            case KEY_DOWN:
                    if(!this.canMoveDown()) {
                        this.placeTetromino();
                        this.game.updateTetrominoFromStack();
                    } else {
                        this.moveDown();
                        this.game.scoreManager.updateScore(1);
                    }
                break;
            case KEY_SPACE:
                if(!this.isDropPressed) {
                    this.isDropPressed = true;
                    this.drop();
                }

        }
    }

    onKeyUpEvent(e) {
        switch(e.keyCode) {
            case KEY_UP:
                this.isRotationRightPressed = false;
                break;
            case KEY_Z:
                this.isRotationLeftPressed = false;
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

    rotate(direction) {
        let tempRotation = (this.currentRotation + direction) % this.tetromino.rotations.length;

        
        if(tempRotation < 0) {
            tempRotation = this.tetromino.rotations.length-1;
        }

        for(let i = 0; i < this.tetromino.rotations[tempRotation].length; i++) {
            const nextPos = Vector2D.add(this.tetromino.rotations[tempRotation][i], this.position);


            if(
                nextPos.y >= 0 &&
                (nextPos.x < 0 ||
                nextPos.x > PLAYFIELD_WIDTH - 1 ||
                nextPos.y > PLAYFIELD_HEIGHT - 1 ||
                this.playfield.cells[nextPos.x][nextPos.y].isFilled)
            ) {
                return false;
            }
        }

        if(!this.canMoveDown()) {
            this.currentTime -= this.timeToPlace /4;
            if(this.currentTime < 0) {
                this.currentTime = 0;
            }
        }

        
        this.currentRotation = tempRotation;
        this.blocks = this.tetromino.rotations[this.currentRotation];

        this.ghostedTetromino.blocks = this.blocks;
        this.ghostedTetromino.updatePosition();

        SoundManager.playFx(ROTATE_SFX);

        return true;
    }

    moveLeft() {
        for(let i = 0; i < this.blocks.length; i++) {
            const gridPos = Vector2D.add(this.blocks[i], this.position);
            const nextPos = new Vector2D(gridPos.x - 1, gridPos.y);

            if(gridPos.y >= 0 && (nextPos.x < 0 || this.playfield.cells[nextPos.x][nextPos.y].isFilled)) {
                return false;
            }
        }

        if(!this.canMoveDown()) {
            this.currentTime = 0;
        }

        this.position.x--;
        this.ghostedTetromino.updatePosition();

        SoundManager.playFx(MOVE_SFX);

        return true;
    }

    moveRight() {
        for(let i = 0; i < this.blocks.length; i++) {
            const gridPos = Vector2D.add(this.blocks[i], this.position);
            const nextPos = new Vector2D(gridPos.x + 1, gridPos.y);

            if(gridPos.y >= 0 && (nextPos.x > PLAYFIELD_WIDTH - 1 || this.playfield.cells[nextPos.x][nextPos.y].isFilled)) {
                return false;
            }
        }

        if(!this.canMoveDown()) {
            this.currentTime = 0;
        }

        this.position.x++;
        this.ghostedTetromino.updatePosition();     

        SoundManager.playFx(MOVE_SFX);

        return true;
    }

    canMoveDown() {
        for(let i = 0; i < this.blocks.length; i++) {
            const gridPos = Vector2D.add(this.blocks[i], this.position);
            const nextPos = new Vector2D(gridPos.x, gridPos.y+1);

            if(nextPos.y > PLAYFIELD_HEIGHT - 1 || this.playfield.cells[nextPos.x][nextPos.y].isFilled) {
                return false;
            }
        }

        return true;
    }

    moveDown() {
        this.position.y++;
        this.currentTime = 0;
    }

    placeTetromino(isDrop = false) {
        this.playfield.placeTetromino(this);

        if(!isDrop) {
            SoundManager.playFx(PLACE_SFX);
        }
    }

    drop() {
        this.game.scoreManager.updateScore((this.ghostedTetromino.position.y - this.position.y) * 2);

        this.position = this.ghostedTetromino.position;
        this.placeTetromino(true);
        this.game.updateTetrominoFromStack();
    
        SoundManager.playFx(DROP_SFX);
    }

    updateTimeToFall(level) {
        this.timeToFall = 1 / (G_TABLE[level] * FRAME_RATE);
    }
}