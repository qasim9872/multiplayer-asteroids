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
        // setup handler for network delay
        // Game.addNetworkDelayListener(socket)

        const canvasContext = canvasElement.getContext('2d');

        const drawing = Drawing.create(canvasContext, GAME_WIDTH, GAME_HEIGHT);

        const game = new Game(socket, config, drawing, info);
        game.init();

        // Set focus on the canvas element
        canvasElement.focus();

        return game;
    }

    static setupCanvas(container, GAME_WIDTH, GAME_HEIGHT) {
        // The below adds a canvas element into the container object and sets the attributes
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

        // The below tracks the local game state
        this.players = [];
        this.asteroids = [];
        this.explosions = [];

        this.animationFrameId = 0;
        this.lastTick = null;

        this.lastKeyboardState = null;
        this.serverUpdateCount = 0;
    }

    init() {
        // Sets up the listener for receiving game state from server
        this.socket.on('update', ((data) => {
            this.receiveGameState(data);
        }).bind(this));
    }

    receiveGameState(state) {
        this.self = state.self;

        // Set the local game state to that of the server
        this.players = state.players;
        this.asteroids = state.asteroids;
        this.explosions = state.explosions;

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

        const currentKeyboardState = {
            'UP': Input.UP,
            'RIGHT': Input.RIGHT,
            'LEFT': Input.LEFT,
            'SPACE': Input.SPACE,
            'BRAKE': Input.BRAKE,
            'INVINCIBLE': Input.INVINCIBLE
        };

        // we are only sending the difference between current and last keyboard state to conserve bandwidth
        const differenceBetweenKeyboardState = difference(this.lastKeyboardState, currentKeyboardState);

        if (differenceBetweenKeyboardState) {
            let packet = {
                keyboardState: differenceBetweenKeyboardState,
                // We will always send the timestamp
                timestamp: (new Date()).getTime(),
                updateCount: this.serverUpdateCount
            };

            console.log(differenceBetweenKeyboardState);

            this.lastKeyboardState = currentKeyboardState;


            const timeout = Input.DELAY ? this.config.ARTIFICIAL_NETWORK_DELAY_TIMEOUT : null;
            const socket = this.socket

            if (timeout) {
                setTimeout(() => {
                    console.log(`Emitting event at ${new Date()} with a timeout of ${timeout}`)
                    socket.emit('player-action', packet);
                    this.serverUpdateCount++;
                }, timeout);
            } else {
                this.socket.emit('player-action', packet);
                this.serverUpdateCount++;

            }

        }
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