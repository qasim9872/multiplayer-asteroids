class Game {
    static create(socket, canvasElement) {
        const canvasContext = canvasElement.getContext('2d');

        const canvasWidth = canvasElement.width;
        const canvasHeight = canvasElement.height;

        const drawing = Drawing.create(canvasContext, canvasWidth, canvasHeight);

        const game = new Game(socket, drawing, canvasWidth, canvasHeight);
        game.init();
        return game;
    }

    constructor(socket, drawing, canvasWidth, canvasHeight) {
        this.socket = socket;
        this.drawing = drawing;

        this.animationFrameId = 0;

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // LOCAL GAME STATE VARIABLES
        this.score = 0;
        this.totalAsteroids = 5;
        this.lives = 0;

        this.sprites = [];
        this.asteroids = [];
        this.ships = [];
    }

    init() {
        this.socket.on('update', ((data) => {
            this.receiveGameState(data);
        }).bind(this));
    }

    receiveGameState(state) {
        this.score = state.score;
        this.asteroids = state.asteroids;
    }

    run() {
        this.update();
        this.draw();
        this.animate();
    }

    update() {
        // console.log(`update ${this.animationFrameId}`)
    }

    draw() {
        // Clear the canvas first
        this.drawing.clear();

        this.drawing.drawStars();

        for (let asteroid of this.asteroids) {
            this.drawing.draw(asteroid);
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