// Cell : {
//     isFilled -> bool
//     color ->  Color
// }

class PlayField {
    constructor() {
        this.cells = []; // GRID

        this.width = PLAYFIELD_WIDTH *  BLOCKSIZE;
        this.height = PLAYFIELD_HEIGHT * BLOCKSIZE;

        this.gridTrace = 0.3;
        this.cellSize = this.width / PLAYFIELD_WIDTH;

        this.tetrominoTileResource = new Image();
        this.tetrominoTileResource.src = '/assets/art/minos00.png';
    }

    init() {
        this.initPlayField();
    }

    initPlayField() {
        for (let i = 0; i < PLAYFIELD_WIDTH; i++) {
            this.cells.push([]);
            this.cells[i].fill({isFilled : false, color: undefined})
            for(let j = 0; j < PLAYFIELD_HEIGHT; j++) {
                this.cells[i].push( {isFilled : false, color: undefined} );
            }
        }
    }

    draw(ctx) {
        // Draw Bg
        ctx.save();

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.restore();

        this.drawGrid(ctx);
        
        this.drawCells(ctx);       
    }
    

    drawGrid(ctx) {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = this.gridTrace;

        for (let i = this.cellSize; i < this.height; i+=this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(this.width, i);
            ctx.stroke();
        }

        for (let i = this.cellSize; i < this.width; i+=this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.height);
            ctx.stroke();
        }
    }
   
    drawCells() {       
        for(let i  = 0; i < PLAYFIELD_HEIGHT; i++) {
            for(let j = 0; j <  PLAYFIELD_WIDTH; j++) {
                const cell =  this.cells[j][i];

                if (cell.isFilled) {
                    this.drawCell(j, i, cell.color);
                }
            }
        }
    }

    drawCell(x, y, color, isGhosted = false) {
        const tileSize = 48;
        const margin = 4;

        const cell =  this.cells[x][y];

        const initialY = isGhosted ? margin*5 + tileSize*2 : margin;

        ctx.drawImage(this.tetrominoTileResource,
            margin + (margin*2 + tileSize) * tetrominoColorsToIdx[color],
            initialY,
            tileSize,
            tileSize,
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize,
            this.cellSize
        )
    }
    

    placeTetromino(tetrominoController) {
        tetrominoController.blocks.forEach(c => {
            const gridPos = Vector2D.add(c, tetrominoController.position);

            this.cells[gridPos.x][gridPos.y].isFilled = true;
            this.cells[gridPos.x][gridPos.y].color = tetrominoController.tetromino.color;
        });

        this.checkLines();
    }

    checkLines() {
        let lineCount = 0;
        const linesToClear = [];

        for(let i = 0; i < PLAYFIELD_HEIGHT; i++) {
            let isLineFull = true;

            for(let j = 0; j < PLAYFIELD_WIDTH; j++) {
                if(!this.cells[j][i].isFilled) {
                    isLineFull = false;
                    break;
                }
            }

            if(isLineFull) {
                linesToClear.push(i);
                this.clearLine(i);
                lineCount++;
            }
        }

        if(linesToClear.length > 0) {
            linesToClear.forEach(l => this.updateCellsAfterLine(l));

            SoundManager.playFx('assets/audio/sfx/line.ogg');
        }
    }

    clearLine(line) {
        for(let i = 0; i < PLAYFIELD_WIDTH; i++) {
            this.cells[i][line].isFilled = false;
        }
    }

    updateCellsAfterLine(line) {
        for(let i = line; i > 1; i--) {
            for(let j = 0; j < PLAYFIELD_WIDTH; j++) {
                console.log
                if(this.cells[j][i-1].isFilled) {
                    this.cells[j][i].isFilled = true;
                    this.cells[j][i].color = this.cells[j][i-1].color;
                    this.cells[j][i-1].isFilled = false;
                }
            }
        }
    }
    
}