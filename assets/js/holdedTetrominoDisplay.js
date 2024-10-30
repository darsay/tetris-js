class HoldedTetrominoDisplay {
    constructor() {
        this.displayWidth = 5;
        this.displayHeight = 4;

        this.width = this.displayWidth *  BLOCKSIZE;
        this.height = this.displayHeight * BLOCKSIZE;

        this.border = 5;
        this.gridTrace = 0.3;

        this.tetrominoTileResource = new Image();
        this.tetrominoTileResource.src = '/assets/art/minos00.png';

        this.holdedTetromino = undefined;

        this.drawOrigin = new Vector2D(0,0);
    }

    draw(ctx) {
        if(this.holdedTetromino) {
            this.holdedTetromino.rotations[0].forEach(b => this.drawBlock(ctx, b));
        }
        
    }

    drawBlock(ctx, b) {
        const tileSize = 48;
        const margin = 4;

        const drawPos = new Vector2D(0,0);
        drawPos.x = b.x * BLOCKSIZE + this.drawOrigin.x;
        drawPos.y = b.y * BLOCKSIZE + this.drawOrigin.y;

        ctx.drawImage(this.tetrominoTileResource,
            margin + (margin*2 + tileSize) * tetrominoColorsToIdx[this.holdedTetromino.color],
            margin,
            tileSize,
            tileSize,
            drawPos.x,
            drawPos.y,
            BLOCKSIZE,
            BLOCKSIZE
        );
    }

    setHoldedTetromino(tetromino) {
        this.holdedTetromino =  tetromino;

        this.setNewDrawOrigin();
    }

    setNewDrawOrigin() {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        this.holdedTetromino.rotations[0].forEach(block => {
            if (block.x < minX) minX = block.x;
            if (block.x > maxX) maxX = block.x;
            if (block.y < minY) minY = block.y;
            if (block.y > maxY) maxY = block.y;
        });
    
        const tetrominoWidth = maxX - minX + 1;
        const tetrominoHeight = maxY - minY + 1;

        const centerX = (this.displayWidth - tetrominoWidth) / 2;
        const centerY = (this.displayHeight - tetrominoHeight) / 2;
    
        this.drawOrigin.x = (centerX - minX) * BLOCKSIZE;
        this.drawOrigin.y = ((centerY - minY) * BLOCKSIZE);
    }
}