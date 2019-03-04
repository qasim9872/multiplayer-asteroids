class Drawing {
    static create(context, canvasWidth, canvasHeight) {
        return new Drawing(context, canvasWidth, canvasHeight);
    }

    constructor(context, canvasWidth, canvasHeight) {
        this.context = context;

        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.stars = [];
        this.starsCount = 100;

        // Init stars array
        for (var i = 0; i < this.starsCount; i++) {
            this.stars.push([Math.random() * this.canvasWidth, Math.random() * this.canvasHeight]);
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvasWidth,
            this.canvasHeight);
    }

    drawStars() {
        var ii = this.stars.length;
        for (var i = 0; i < ii; i++) {
            this.context.fillRect(this.stars[i][0], this.stars[i][1], 1, 1);
        }
    }

    drawCircle() {
        this.context.beginPath();
        this.context.arc(95, 50, 40, 0, 2 * Math.PI);
        this.context.stroke();
    }

    draw(object) {
        // this.drawCircle()
        if (!object.visible) return;

        // this.context.lineWidth = 1.0 / object.scale;

        for (let child in object.children) {
            this.draw(object.children[child]);
        }

        this.context.beginPath();

        this.context.moveTo(object.points[0], object.points[1]);
        for (var i = 1; i < object.points.length / 2; i++) {
            var xi = i * 2;
            var yi = xi + 1;
            this.context.lineTo(object.points[xi], object.points[yi]);
        }

        this.context.closePath();
        this.context.stroke();
    }
}