class Info {
    constructor(container, config) {
        this.pane = document.createElement('div');
        this.pane.innerHTML = 'ASTEROIDS';

        this.lives = document.createElement('span');
        this.lives.className = 'lives';
        this.lives.innerHTML = 'LIVES: ' + config.PLAYER_LIVES;

        this.score = document.createElement('span');
        this.score.className = 'score';
        this.score.innerHTML = 'SCORE: 0';

        this.level = document.createElement('span');
        this.level.className = 'level';
        this.level.innerHTML = 'LEVEL: 1';

        this.pane.appendChild(this.lives);
        this.pane.appendChild(this.score);
        this.pane.appendChild(this.level);
        container.appendChild(this.pane);
    }

    setLives(l) {
        this.lives.innerHTML = 'LIVES: ' + l;
    }

    setScore(s) {
        this.score.innerHTML = 'SCORE: ' + s;
    }
    setLevel(_level) {
        this.level.innerHTML = 'LEVEL: ' + _level;
    }
    getPane() {
        return this.pane;
    }
}