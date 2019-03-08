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

        const game = new Game(socket, config, drawing, info);
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

    constructor(socket, config, drawing, info) {
        this.socket = socket;
        this.config = config;
        this.drawing = drawing;
        this.info = info;

        this.self = null;
        this.players = [];
        this.asteroids = [];
        this.explosions = [];

        this.animationFrameId = 0;
        this.lastTick = null;

        this.lastKeyboardState = null;
    }

    init() {
        this.socket.on('update', ((data) => {
            this.receiveGameState(data);
        }).bind(this));
    }

    receiveGameState(state) {
        this.self = state.self;

        // The below entities will move based on dead reckoning
        // TO-DO Will have to merge the state
        this.players = state.players;
        this.asteroids = state.asteroids;
        this.explosions = state.explosions;

        // Update info panel
        this.info.setLives(this.self.lives);
        this.info.setScore(this.self.score);
    }

    run(currentTick) {

        let delta = 0;
        if (this.lastTick) {
            delta = currentTick - this.lastTick;
            delta /= 30;
        }
        this.lastTick = currentTick;

        this.update(delta);
        this.draw();
        this.animate();
    }

    update(delta) {
        // Emits an event for the containing the player's intention to move
        // or shoot to the server.

        const currentKeyboardState = {
            'UP': Input.UP,
            'RIGHT': Input.RIGHT,
            'LEFT': Input.LEFT,
            'SPACE': Input.SPACE,
            'BRAKE': Input.BRAKE
        };

        const differenceBetweenKeyboardState = difference(this.lastKeyboardState, currentKeyboardState);

        if (differenceBetweenKeyboardState) {
            let packet = {
                keyboardState: differenceBetweenKeyboardState,
                // We will always send the timestamp
                'timestamp': (new Date()).getTime()
            };

            console.log(differenceBetweenKeyboardState);

            this.lastKeyboardState = currentKeyboardState;

            // Uncomment below - the last intent sent by the client will still be executed
            // this.count = this.count ? this.count + 1 : 1;
            // if (this.count > 4) return;
            this.socket.emit('player-action', packet);
        }

        // TO-DO: Execute the actions locally
        this.updateLocalEntities(delta)
    }

    updateLocalEntities(delta) {
        // console.log(`rotation before: ${this.asteroids[0].rotation}`);
        // moveAsteroidLocally(this.asteroids, this.config, delta);
        // console.log(`rotation after: ${this.asteroids[0].rotation}`);
    }

    draw() {
        // Clear the canvas first
        this.drawing.clear();

        this.drawing.drawStars();

        // Draw game entities
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