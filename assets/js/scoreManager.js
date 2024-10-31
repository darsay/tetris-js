class ScoreManager {
    constructor() {
        this.score = 0;
        this.level = 0;

        this.levelLineCount = 0;
        this.totalLineCount = 0;
        this.linesPerLevel = 10;

        this.scoreText = document.getElementById('score-value');
        this.linesText = document.getElementById('lines-value');
        this.levelText = document.getElementById('level-value');
    }

    updateScoreByLines(lineAmount) {
        let multiplier = 1;
        switch(lineAmount) {
            case 1:
                multiplier = 40;
                break;
            case 2:
                multiplier = 100;
                break;
            case 3:
                multiplier = 300;
                break;
            case 4:
                multiplier = 1200;
                break;
        }

        this.levelLineCount += lineAmount;
        this.totalLineCount += lineAmount;

        if(this.levelLineCount >= this.linesPerLevel) {
            this.level++;
            this.levelLineCount -= this.linesPerLevel;
            console.log(`Level Up: ${this.level}`);

            this.levelText.innerText = this.level + 1;
        }

        this.linesText.innerText = this.totalLineCount;
        
        this.updateScore(multiplier * this.level + 1);
    }

    updateScore(points) {
        this.score += points;

        this.scoreText.innerText = this.score;
    }
    
}