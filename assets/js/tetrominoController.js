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

        this.isRotationRightPressed = false;
        this.isRotationLeftPressed = false;
        this.isHoldPressed = false;
        this.isDownPressed = false;
        this.isDropPressed  = false;


        
    }

    init() {
        this.position = new Vector2D((PLAYFIELD_WIDTH / 2) - 1, 1);
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
                nextPos.x < 0 ||
                nextPos.y < 0 ||
                nextPos.x > PLAYFIELD_WIDTH - 1 ||
                nextPos.y > PLAYFIELD_HEIGHT - 1 ||
                this.playfield.cells[nextPos.x][nextPos.y].isFilled
            ) {
                return false;
            }
        }

        
        this.currentRotation = tempRotation;
        this.blocks = this.tetromino.rotations[this.currentRotation];

        this.ghostedTetromino.blocks = this.blocks;
        this.ghostedTetromino.updatePosition();

        SoundManager.playFx('assets/audio/sfx/rotate.ogg');

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

            if(nextPos.x > PLAYFIELD_WIDTH - 1 || this.playfield.cells[nextPos.x][nextPos.y].isFilled) {
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

            if(nextPos.y > PLAYFIELD_HEIGHT - 1 || this.playfield.cells[nextPos.x][nextPos.y].isFilled) {
                return false;
            }
        }

        return true;
    }

    moveDown() {
        this.position.y++;
    }

    placeTetromino(isDrop = false) {
        this.playfield.placeTetromino(this);

        if(!isDrop) {
            SoundManager.playFx('assets/audio/sfx/place.ogg');
        }
    }

    drop() {
        this.position = this.ghostedTetromino.position;
        this.placeTetromino();
        this.game.updateTetrominoFromStack();

        SoundManager.playFx('assets/audio/sfx/drop.ogg');
    }
}