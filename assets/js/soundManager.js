class SoundManager {
    static currentSong = undefined;
    static songVolume = 0.1;
    static sfxVolume = 0.4;

    static sfxMap = {};


    static setSong(src) {
        this.currentSong = new Audio(src);
    }

    static playSong() {
        if(this.currentSong) {
            this.currentSong.volume = this.songVolume;
            this.currentSong.play();
        } 
    }

    static stopSong() {
        if(this.currentSong) {
            this.currentSong.pause();
        }
    }

    static playFx(src) {
        if(!this.sfxMap.hasOwnProperty(src)) {
            this.sfxMap[src] = new Audio(src);
        } 

        this.sfxMap[src].volume = this.sfxVolume;
        this.sfxMap[src].currentTime = 0;
        this.sfxMap[src].play();
    }
}