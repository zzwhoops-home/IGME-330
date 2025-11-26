type BGCircleParams = {
    x: number,
    y: number,
    radius: number,
    dx: number,
    dy: number,
    canvasWidth: number,
    canvasHeight: number,
    color: string
};

class BGCircle {
    x: number; y: number;
    radius: number;
    dx: number; dy: number;
    canvasWidth: number; canvasHeight: number;
    color: string;

    constructor({ x, y, radius, dx, dy, canvasWidth, canvasHeight, color }: BGCircleParams) {
        Object.assign(this, { x, y, radius, dx, dy, canvasWidth, canvasHeight, color });
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

    draw(ctx: CanvasRenderingContext2D) {
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