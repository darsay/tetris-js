class SoundManager {
    constructor() {
        this.currentSong = undefined;
    }

    setSong(src) {
        this.currentSong = new Audio(src);
    }

    playSong() {
        this.currentSong.volume = 0;
        this.currentSong.play();
    }
}