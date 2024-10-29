// Tetromino
// {
//     tileIdx -> number
//     rotations -> array[array[Vec2D]]
// }

const tetrominoColorsToIdx = {
    black: 0,
    blue: 1,
    green: 2,
    orange: 3,
    purple: 4,
    red:  5,
    cyan:  6,
    yellow: 7,
}

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
                new  Vector2D(1, 0),
                new  Vector2D(1, 1),
                new  Vector2D(1, 2),
                new  Vector2D(1, 3)
            ],
            [
                new Vector2D(-1, 1),
                new Vector2D(0, 1),
                new Vector2D(1, 1),
                new Vector2D(2, 1),
            ],
            [
                new  Vector2D(0, 0),
                new  Vector2D(0, 1),
                new  Vector2D(0, 2),
                new  Vector2D(0, 3)
            ]
        ]
    },
    J: {
        color : 'blue',
        rotations : [
            [
                new Vector2D(-1, 0),
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(-1, -1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(0, 1),
                new Vector2D(0, -1),
                new Vector2D(1, -1)
            ],
            [
                new Vector2D(-1, 0),
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(1, 1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(0, -1),
                new Vector2D(0, 1),
                new Vector2D(-1, 1)
            ]
            
        ]
    },
    L: {
        color : 'orange',
        rotations : [
            [
                new Vector2D(-1, 0),
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(1, -1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(0, -1),
                new Vector2D(0, 1),
                new Vector2D(1, 1)
            ],[
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(-1, 0),
                new Vector2D(-1, 1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(0, 1),
                new Vector2D(0, -1),
                new Vector2D(-1, -1)
            ]
        ]
    },
    O: {
        color : 'yellow',
        rotations : [
            [
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(0, -1),
                new Vector2D(1, -1)
            ]
        ]
    },
    S: {
        color: 'green',
        rotations: [
            [
                new Vector2D(0, 0),
                new Vector2D(-1, 0),
                new Vector2D(0, -1),
                new Vector2D(1, -1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(0, -1),
                new Vector2D(1, 1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(0, 1),
                new Vector2D(1, 0),
                new Vector2D(-1, 1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(-1, 0),
                new Vector2D(0, 1),
                new Vector2D(-1, -1)
            ]
        ]
    },
    T: {
        color: 'purple',
        rotations : [
            [
                new Vector2D(0, 0),
                new Vector2D(0, -1),
                new Vector2D(-1, 0),
                new Vector2D(1, 0)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(0, 1),
                new Vector2D(0, -1),
                new Vector2D(1, 0)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(-1, 0),
                new Vector2D(0, 1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(-1, 0),
                new Vector2D(0, -1),
                new Vector2D(0, 1)
            ]
        ]
    },
    Z : {
        color: 'red',
        rotations: [
            [
                new Vector2D(0, 0),
                new Vector2D(0, -1),
                new Vector2D(1, 0),
                new Vector2D(-1, -1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(1, 0),
                new Vector2D(1, -1),
                new Vector2D(0, 1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(-1, 0),
                new Vector2D(0, 1),
                new Vector2D(1, 1)
            ],
            [
                new Vector2D(0, 0),
                new Vector2D(-1, 0),
                new Vector2D(0, -1),
                new Vector2D(-1, 1)
            ]
        ]
    }
}
