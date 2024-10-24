// Tetromino
// {
//     tileIdx -> number
//     rotations -> array[array[Vec2D]]
// }

const tetrominoTypes = {
    I: {
        color : 'cyan',
        rotations : [
            [
                new Vector2D(-1, 0),
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(2, 0),
            ],
            [
                new  Vector2D(0, 0),
                new  Vector2D(0, 1),
                new  Vector2D(0, 2),
                new  Vector2D(0, 3)
            ],
            // [
            //     new Vector2D(-1, 1),
            //     new Vector2D(0, 1),
            //     new Vector2D(1, 1),
            //     new Vector2D(2, 1),
            // ],
            // [
            //     new  Vector2D(-1, 0),
            //     new  Vector2D(-1, 1),
            //     new  Vector2D(-1, 2),
            //     new  Vector2D(-1, 3)
            // ],
        ]
    },

    O: {
        color : 'yellow',
        rotations : [
            [
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(0, 1),
                new Vector2D(1, 1)
            ]
        ]
    }
}
