class TeslaSprite {
    constructor(x, y, color, radius, radiusVariance, arcs) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.radiusVariance = radiusVariance;
        this.arcs = arcs;
    }

    update(radius) {
        this.radius = radius;
    }

    draw(ctx) {
        ctx.save();

        for (let i = 0; i < this.arcs.length; i++) {
            const vec = this.randomVec();

            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + vec.x, this.y + vec.y);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore();
    }

    randomVec() {
        // get random direction, multiplied by radius with jitter
        let radius = this.radius + getRandomFloat(-this.radiusVariance, this.radiusVariance);
        // clamp to 0
        if (radius < 0) {
            radius = 0;
        }

        const angle = getRandomFloat(0, Math.PI * 2);

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return new Vector2(x, y);
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    normalized() {
        let length = this.length();
        return new Vector2(this.x / length, this.y / length);
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}

const getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
}