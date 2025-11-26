import { getRandom } from "./utils"

type TeslaParams = {
    x: number,
    y: number,
    color: string
    radius: number,
    radiusVariance: number,
    arcs: number,
    segments: number,
    segmentJitter: number,
    lineWidth: number,
    dataStart: number,
    dataEnd: number
};

class TeslaSprite {
    x: number; y: number;
    color: string;
    radius: number; radiusVariance: number;
    arcs: number; segments: number; segmentJitter: number;
    lineWidth: number;
    dataStart: number; dataEnd: number;

    constructor({ x, y, color, radius, radiusVariance, arcs, segments, segmentJitter, lineWidth, dataStart, dataEnd }: TeslaParams) {
        Object.assign(this, { x, y, color, radius, radiusVariance, arcs, segments, segmentJitter, lineWidth, dataStart, dataEnd });
    }

    update(audioData: Uint8Array) {
        // creates a split of data, then finds the average value from that data to update the lightning
        const length = audioData.length || 0;
        const start = Math.floor(this.dataStart * length);
        const end = Math.round(this.dataEnd * length);

        const split = audioData.slice(start, end);

        const audioAvg = split.reduce((total, num) => total + num, 0) / (end - start);

        this.radius = audioAvg;
        this.radiusVariance = audioAvg;
        this.arcs = Math.round(audioAvg / 30);
        this.segmentJitter = (1.3 - (this.dataEnd - this.dataStart)) * 8;
    }

    updateX(newX: number) {
        this.x = newX;
    }

    draw(ctx: CanvasRenderingContext2D) {
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
        let radius = this.radius + getRandom(-this.radiusVariance, this.radiusVariance);
        // clamp to 0
        if (radius < 0) {
            radius = 0;
        }

        const angle = getRandom(0, Math.PI * 2);

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return new Vector2(x, y);
    }
}

class Vector2 {
    x: number; y: number;

    constructor(x: number, y: number) {
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

    scaled(value: number) {
        return new Vector2(this.x * value, this.y * value);
    }

    addNoise(value: number) {
        return new Vector2(this.x + getRandom(-value, value), this.y + getRandom(-value, value));
    }
}

export { TeslaSprite };