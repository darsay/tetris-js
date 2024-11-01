//ASSETS
const ART_PATH = '/assets/art';
const LOGO_IMAGE = ART_PATH + '/Tetrisjs_logo.png';

// FPS
const FRAME_RATE = 60;


//DIMENTIONS
const BLOCKSIZE = 25;
const PLAYFIELD_WIDTH = 10;
const PLAYFIELD_HEIGHT = 20;


// INPUT
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const KEY_SPACE = 32;
const KEY_Z = 90;
const KEY_C = 67;
const KEY_ESC = 27;

//GAME STATES
const STATE_START = "STATE_START";
const STATE_PLAYING = "STATE_PLAYING";
const STATE_PAUSED = "STATE_PAUSED";
const STATE_GAME_OVER = "STATE_GAME_OVER";
const STATE_COUNTDOWN = "STATE_COUNTDOWN";

// G TABLE

// IN BLOCKS PER FRAME

const FALL_COEFICIENT = 0.9;

const G_TABLE = [
    /*Level 1: */ FALL_COEFICIENT * 0.01667,
    /*Level 2: */ FALL_COEFICIENT * 0.021017,
    /*Level 3: */ FALL_COEFICIENT * 0.026977,
    /*Level 4: */ FALL_COEFICIENT * 0.035256,
    /*Level 5: */ FALL_COEFICIENT * 0.04693,
    /*Level 6: */ FALL_COEFICIENT * 0.06361,
    /*Level 7: */ FALL_COEFICIENT * 0.0879,
    /*Level 8: */ FALL_COEFICIENT * 0.1236,
    /*Level 9: */ FALL_COEFICIENT * 0.1775,
    /*Level 11 */ FALL_COEFICIENT * 0.388,
    /*Level 10 */ FALL_COEFICIENT * 0.2598,
    /*Level 12 */ FALL_COEFICIENT * 0.59,
    /*Level 13 */ FALL_COEFICIENT * 0.92,
    /*Level 14 */ FALL_COEFICIENT * 1.46,    
    /*Level 15 */ FALL_COEFICIENT * 2.36
]
