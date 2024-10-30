class SoundManager {
    constructor() {
        this.currentSong = undefined;
    }

    setSong(src) {
        this.currentSong = new Audio(src);
    }

    playSong() {
        if(this.currentSong) {
            this.currentSong.volume = 0.01;
            //this.currentSong.play();
        }
        
    }
}