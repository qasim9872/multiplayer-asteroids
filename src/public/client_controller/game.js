class Game {
    static create(socket, container, config) {

        const {
            GAME_WIDTH,
            GAME_HEIGHT
        } = config;

        container.width = GAME_WIDTH;

        // Setup screen elements
        const info = new Info(container, config);
        const canvasElement = Game.setupCanvas(container, GAME_WIDTH, GAME_HEIGHT);

        // Setup event listeners
        Input.applyEventHandlers(canvasElement);

        const canvasContext = canvasElement.getContext('2d');

        const drawing = Drawing.create(canvasContext, GAME_WIDTH, GAME_HEIGHT);

        const game = new Game(socket, drawing, info);
        game.init();

        // Set focus on the canvas element
        canvasElement.focus();

        return game;
    }

    static setupCanvas(container, GAME_WIDTH, GAME_HEIGHT) {
        var canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.width = GAME_WIDTH;
        canvas.height = GAME_HEIGHT;
        container.appendChild(canvas);
        return canvas;
    }

    constructor(socket, drawing, info) {
        this.socket = socket;
        this.drawing = drawing;
        this.info = info;

        this.self = null;
        this.players = [];
        this.asteroids = [];
        this.explosions = [];

        this.animationFrameId = 0;
        this.endingGame = false;
    }

    init() {
        this.socket.on('update', ((data) => {
            this.receiveGameState(data);
        }).bind(this));
    }

    receiveGameState(state) {
        this.self = state.self;

        this.players = state.players;
        this.asteroids = state.asteroids;
        this.explosions = state.explosions;

        // console.log([`player position: ${this.self.position}`, `asteroid position: ${this.asteroids.length > 0 ? this.asteroids[0].position : null}`]);

        // Update info panel
        this.info.setLives(this.self.lives);
        this.info.setScore(this.self.score);
    }

    run() {
        this.update();
        this.draw();
        this.animate();
    }

    update() {
        // Emits an event for the containing the player's intention to move
        // or shoot to the server.
        var packet = {
            'keyboardState': {
                'UP': Input.UP,
                'RIGHT': Input.RIGHT,
                'LEFT': Input.LEFT,
                'SPACE': Input.SPACE,
                'BRAKE': Input.BRAKE
            },
            'timestamp': (new Date()).getTime()
        };
        this.socket.emit('player-action', packet);
    }

    draw() {
        // Clear the canvas first
        this.drawing.clear();

        this.drawing.drawStars();

        this.drawing.draw(this.self);

        for (let player of this.players) {
            this.drawing.draw(player, 'red');
        }

        for (let roid of this.asteroids) {
            this.drawing.draw(roid);
        }

        for (let explosion of this.explosions) {
            this.drawing.drawExplosion(explosion);
        }

        // overlay text based on game state 
        if (this.self && this.self.gamePlayState === 'starting') {
            this.drawing.startingText();
        } else if (this.self && this.self.gamePlayState === 'finished') {
            this.drawing.restartText();
        }
    }

    animate() {
        this.animationFrameId = window.requestAnimationFrame(
            (this.run).bind(this));
    }

    stopAnimation() {
        window.cancelAnimationFrame(this.animationFrameId);
    }
}