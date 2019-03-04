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

        this.animationFrameId = 0;
    }

    init() {
        this.socket.on('update', ((data) => {
            this.receiveGameState(data);
        }).bind(this));
    }

    receiveGameState(state) {
        // console.log(state);
        this.self = state.self;
        this.players = state.players;
        this.asteroids = state.asteroids;
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
                'SPACE': Input.SPACE
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
    }

    animate() {
        this.animationFrameId = window.requestAnimationFrame(
            (this.run).bind(this));
    }

    stopAnimation() {
        window.cancelAnimationFrame(this.animationFrameId);
    }
}