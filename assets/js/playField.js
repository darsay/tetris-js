// Cell : {
//     isFilled -> bool
//     color ->  Color
// }

const BLOCKSIZE = 10;
const PLAYFIELD_WIDTH = 10;
const PLAYFIELD_HEIGHT = 20;



class PlayField {
    constructor() {
        this.cells = []; // GRID

        this.playfieldWidth = 10;
        this.playfieldHeight = 20;
        this.blockSize = 25;

        this.x =  400-125;
        this.y = 50;
        this.width = this.playfieldWidth *  this.blockSize;
        this.height = this.playfieldHeight * this.blockSize;

        this.border = 5;
        this.gridTrace = 0.3;
        this.cellSize = this.width / PLAYFIELD_WIDTH;

        this.tetrominoTileResource = new Image();
        this.tetrominoTileResource.src = '/assets/art/minos00.png';
    }

    init() {
        this.initPlayField();
    }

    initPlayField() {
        for (let i = 0; i <  this.playfieldWidth; i++) {
            this.cells.push([]);
            for(let j = 0; j < this.playfieldHeight; j++) {
                this.cells[i].push( {isFilled : j > 15, color: j%2 ?  'blue' : 'red'} );

            }
        }
    }

    draw(ctx) {
        // Draw Bg
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);    

        this.drawGrid(ctx);
        
        this.drawCells(ctx);       
    }
    

    drawGrid(ctx) {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = this.gridTrace;

        for (let i = this.y + this.cellSize; i < this.y + this.height; i+=this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(this.x, i);
            ctx.lineTo(this.x + this.width, i);
            ctx.stroke();
        }

        for (let i = this.x + this.cellSize; i < this.x + this.width; i+=this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(i, this.y);
            ctx.lineTo(i, this.y+this.height);
            ctx.stroke();
        }
    }
   
    drawCells() {       
        for(let i  = 0; i < this.playfieldHeight; i++) {
            for(let j = 0; j <  this.playfieldWidth; j++) {
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
            this.x + (x * this.cellSize),
            this.y +(y * this.cellSize),
            this.cellSize,
            this.cellSize
        )
    }
    

    drawBorder(ctx) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = this.border;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    placeTetromino(tetrominoController) {
        tetrominoController.blocks.forEach(c => {
            const gridPos = Vector2D.add(c, tetrominoController.position);

            this.cells[gridPos.x][gridPos.y].isFilled = true;
            this.cells[gridPos.x][gridPos.y].color = tetrominoController.tetromino.color;
        });
    }
    
}