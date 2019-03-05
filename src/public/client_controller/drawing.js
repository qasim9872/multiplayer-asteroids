class Drawing {
    static create(context, canvasWidth, canvasHeight) {
        return new Drawing(context, canvasWidth, canvasHeight);
    }

    constructor(context, canvasWidth, canvasHeight) {
        this.context = context;

        this.setDefaultStyle();

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.stars = [];
        this.starsCount = 100;

        // Init stars array
        for (var i = 0; i < this.starsCount; i++) {
            this.stars.push([Math.random() * this.canvasWidth, Math.random() * this.canvasHeight]);
        }
    }

    setDefaultStyle() {
        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';
    }

    clear() {
        this.context.clearRect(0, 0, this.canvasWidth,
            this.canvasHeight);
    }

    drawStars() {
        this.setDefaultStyle();

        var ii = this.stars.length;
        for (var i = 0; i < ii; i++) {
            this.context.fillRect(this.stars[i][0], this.stars[i][1], 1, 1);
        }
    }

    drawCircle() {
        this.context.beginPath();
        this.context.arc(0, 0, 40, 0, 2 * Math.PI);
        this.context.stroke();
    }

    drawShip() {
        this.context.beginPath();

        const shipPath = [-5, 4,
            0, -12,
            5, 4
        ]

        this.context.moveTo(shipPath[0], shipPath[1]);
        for (var i = 1; i < shipPath.length / 2; i++) {
            var xi = i * 2;
            var yi = xi + 1;
            this.context.lineTo(shipPath[xi], shipPath[yi]);
        }

        this.context.stroke();
        this.context.closePath();
    }

    drawExplosion(object) {
        this.context.save();

        const pathArr = object.path;
        const direction = object.direction;
        const scale = object.scale;
        const position = object.position;

        this.context.lineWidth = 1.0 / scale;

        this.context.setTransform(Math.cos(direction) * scale, Math.sin(direction) * scale,
            -Math.sin(direction) * scale, Math.cos(direction) * scale,
            position[0], position[1]);


        pathArr.forEach(path => {
            this.drawFromPath(path);
        });

        this.context.setTransform(1, 0, 0, 1, 0, 0);

        this.context.restore();
    }

    draw(object, fillColor) {
        if (!object || object.dead) return;

        object.children.forEach(child => this.draw(child, fillColor));

        const position = object.position;
        const direction = object.direction;
        const scale = object.scale;
        const path = object.path;

        this.context.lineWidth = 1.0 / scale;

        this.context.setTransform(Math.cos(direction) * scale, Math.sin(direction) * scale,
            -Math.sin(direction) * scale, Math.cos(direction) * scale,
            position[0], position[1]);

        // Draw from path array
        this.drawFromPath(path, fillColor);

        // Check special conditions
        this.handleSpecialCases(object);

        // Reset tranformation matrix
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    handleSpecialCases(object) {
        if (Input.COLLISION_BOX) {
            this.context.beginPath();
            this.context.arc(0, 0, object.radius, 0, 2 * Math.PI);
            this.context.stroke();
        }
    }

    drawFromPath(path, fillColor) {
        this.context.beginPath();

        this.context.moveTo(path[0][0], path[0][1]);

        for (let i = 1; i < path.length; i++) {
            this.context.lineTo(path[i][0], path[i][1]);
        }

        if (fillColor) {
            this.context.fillStyle = fillColor;
            this.context.strokeStyle = fillColor;
        } else {
            this.setDefaultStyle();
        }

        this.context.stroke();
        this.context.closePath();
    }

    writeTextInCenter(text) {
        this.context.save();

        // Place text in middle
        const x = this.canvasWidth / 2;
        const y = this.canvasHeight / 2;

        this.context.font = "25px Arial";
        this.context.textAlign = "center";
        this.context.fillText(text, x, y);

        this.context.restore();
    }

    startingText() {
        this.writeTextInCenter("Press space to begin");
    }

    restartText() {
        this.writeTextInCenter("GAME OVER - Press space to restart");
    }
}