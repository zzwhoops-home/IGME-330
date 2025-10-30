class BGCircle {
    constructor({ x, y, radius, dx, dy, canvasWidth, canvasHeight, color }) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.color = color;
    }

    update() {
        if (this.x + this.radius > this.canvasWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > this.canvasHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }
}

export { BGCircle };