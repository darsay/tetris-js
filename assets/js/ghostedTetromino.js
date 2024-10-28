class GhostedTetromino {
    constructor(controller, playfield) {
        this.controller  = controller;
        this.playfield = playfield;
        this.position = new Vector2D(0,0);
        this.blocks = this.controller.blocks;
    }

    draw() {

        this.blocks.forEach(c => {
            const gridPos = Vector2D.add(c, this.position);
            this.playfield.drawCell(gridPos.x, gridPos.y, this.controller.tetromino.color, true);
        });
    }

    updatePosition() {
        let finalPos = this.controller.position;
        const height = this.controller.position.y;

        for(let i = 0; i + height < this.playfield.playfieldHeight; i++) {
            for(let j = 0; j < this.controller.blocks.length; j++) {
                let nextPos = Vector2D.add(Vector2D.add(this.controller.position, this.controller.blocks[j]), new Vector2D(0, i));

                if(nextPos.y > this.playfield.playfieldHeight - 1 || this.playfield.cells[nextPos.x][nextPos.y].isFilled) {
                    this.position = Vector2D.add(finalPos,  new Vector2D(0, -1));
                    return;
                }
            }

            finalPos = Vector2D.add(finalPos, new Vector2D(0, 1));
        }

        this.position = Vector2D.add(finalPos,  new Vector2D(0, -1));
    }
    
}