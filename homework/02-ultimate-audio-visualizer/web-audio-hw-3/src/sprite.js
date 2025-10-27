class TeslaSprite {
    constructor({ x, y, color, radius, radiusVariance, arcs, segments, segmentJitter, lineWidth, dataStart, dataEnd }) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.radiusVariance = radiusVariance;
        this.arcs = arcs;
        this.segments = segments;
        this.segmentJitter = segmentJitter;
        this.lineWidth = lineWidth;
        this.dataStart = dataStart;
        this.dataEnd = dataEnd;
    }

    update(audioData) {
        // creates a split of data, then finds the average value from that data to update the lightning
        const length = audioData.length || 0;
        const start = Math.floor(this.dataStart * length);
        const end = Math.round(this.dataEnd * length);

        const split = audioData.slice(start, end);

        const audioAvg = split.reduce((total, num) => total + num, 0) / (end - start);

        this.radius = audioAvg;
        this.radiusVariance = audioAvg;
        this.arcs = Math.round(audioAvg / 30);

        // animate the lightning by bouncing it around
        this.y = 400 - audioAvg;
    }

    draw(ctx) {
        ctx.save();

        for (let i = 1; i <= this.arcs; i++) {
            const vec = this.randomVec();

            let prevSegmentVec = new Vector2(0, 0);
            let curSegmentVec = new Vector2(0, 0);

            for (let j = 0; j < this.segments; j++) {
                curSegmentVec = vec.scaled(j / this.segments);

                curSegmentVec = curSegmentVec.addNoise(this.segmentJitter);

                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.lineWidth;

                ctx.globalAlpha = this.radius / 255;

                ctx.beginPath();
                ctx.moveTo(this.x + prevSegmentVec.x, this.y + prevSegmentVec.y);
                ctx.lineTo(this.x + curSegmentVec.x, this.y + curSegmentVec.y);
                ctx.closePath();
                ctx.stroke();
                prevSegmentVec = curSegmentVec;
            }
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

    scaled(value) {
        return new Vector2(this.x * value, this.y * value);
    }

    addNoise(value) {
        return new Vector2(this.x + getRandomFloat(-value, value), this.y + getRandomFloat(-value, value));
    }
}

const getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
}

export { TeslaSprite };