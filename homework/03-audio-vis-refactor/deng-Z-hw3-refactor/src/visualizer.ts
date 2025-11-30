/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils';
import { TeslaSprite } from './tesla-sprite';
import { BGCircle } from './bg-circle'

let ctx: CanvasRenderingContext2D;
let ctxBG: CanvasRenderingContext2D;
let canvasWidth: number;
let canvasHeight: number;
let analyserNode: AnalyserNode;
let audioData: Uint8Array<ArrayBuffer>;

type DrawParams = {
    showGradient: boolean,
    showBars: boolean,
    showCircles: boolean,
    showTeslas: boolean,
    timeDomain: boolean,
    coilCenter: number
}

type GradientEntry = {
    percent: number,
    color: string
}

let teslaSprites = [];

const TESLA_COLORS = ["rgba(144, 255, 70, 1)", "rgba(255, 171, 81, 1)"];
const CIRCLE_COLORS = ["rgba(58, 99, 166, 1)", "rgba(88, 66, 184, 1)", "rgba(40, 121, 91, 1)"];

let circles = [];
const NUM_CIRCLES: number = 20;

const setupCanvas = (canvasElement: HTMLCanvasElement, analyserNodeRef: AnalyserNode) => {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);

    // get drawing context for BG
    ctxBG = (document.querySelector("#bg-canvas") as HTMLCanvasElement).getContext("2d");

    // create tesla sprites
    teslaSprites.push(
        new TeslaSprite({
            x: 200,
            y: 200,
            color: TESLA_COLORS[0],
            radius: 200,
            radiusVariance: 100,
            arcs: 10,
            segments: 20,
            segmentJitter: 5,
            lineWidth: 1,
            dataStart: 0.0,
            dataEnd: 0.5
        }),
        new TeslaSprite({
            x: 600,
            y: 200,
            color: TESLA_COLORS[1],
            radius: 200,
            radiusVariance: 100,
            arcs: 10,
            segments: 20,
            segmentJitter: 5,
            lineWidth: 1,
            dataStart: 0.5,
            dataEnd: 1.0
        })
    );

    for (let i = 0; i < NUM_CIRCLES; i++) {
        const radius = utils.getRandom(canvasWidth / 15, canvasWidth / 5);

        const x = utils.getRandom(radius, canvasWidth - radius);
        const y = utils.getRandom(radius, canvasHeight - radius);
        const dx = utils.getRandom(-canvasWidth / 1000, canvasWidth / 1000);
        const dy = utils.getRandom(-canvasHeight / 1000, canvasHeight / 1000);

        circles.push(new BGCircle(
            {
                x: x,
                y: y,
                radius: radius,
                dx: dx,
                dy: dy,
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
                color: CIRCLE_COLORS[Math.floor(Math.random() * CIRCLE_COLORS.length)]
            }
        ))
    }
}

const draw = (params: DrawParams) => {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference"

    if (params.timeDomain) {
        analyserNode.getByteTimeDomainData(audioData);
    }
    else {
        analyserNode.getByteFrequencyData(audioData);
    }

    // get coil slider middle
    let middle = params.coilCenter;

    // update ranges
    teslaSprites[0].dataEnd = middle;
    teslaSprites[1].dataStart = middle;

    // 2 - draw background
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 3 - draw gradient
    ctxBG.fillStyle = "#4b2386ff";
    ctxBG.fillRect(0, 0, canvasWidth, canvasHeight);
    if (params.showGradient) {

        circles.forEach(circle => {
            circle.update();
            circle.draw(ctxBG);
        })
    }

    // 4 - draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;

        const middleIndex = middle * audioData.length;

        // update tesla coil x
        const spriteOneX = margin + middleIndex * (barWidth + barSpacing) / 2;
        const spriteTwoX = canvasWidth - (canvasWidth - (spriteOneX * 2)) / 2;

        teslaSprites[0].updateX(spriteOneX);
        teslaSprites[1].updateX(spriteTwoX);

        ctx.save();
        ctx.globalAlpha = 0.5;

        ctx.beginPath();

        let coords = [];

        // draw top part with quadratic curves
        ctx.moveTo(margin, canvasHeight / 2 - (audioData[0] / 2));
        for (let i = 0; i < audioData.length; i++) {
            let x = margin + i * (barWidth + barSpacing);
            let y = canvasHeight / 2 - (audioData[i] / 2);

            // add coordinates to draw mirrored image
            coords.push([x, canvasHeight / 2 + (audioData[i] / 2)]);

            if (i < audioData.length - 1) {
                let nextX = margin + (i + 1) * (barWidth + barSpacing);
                let nextY = canvasHeight / 2 - (audioData[i + 1] / 2);

                if (i === 0) {
                    ctx.lineTo(x, y);
                }

                // use the midpoint as the control point, interpolating smoothly
                let midX = (nextX + x) / 2;
                let midY = (nextY + y) / 2;

                ctx.quadraticCurveTo(x, y, midX, midY);
            }
            else {
                // line to the last point
                ctx.lineTo(x, y);
            }
        }

        // draw bottom part, mirrored to be symmetric
        for (let i = coords.length - 1; i > 0; i--) {
            let x = coords[i][0];
            let y = coords[i][1];

            if (i < audioData.length - 1) {
                let nextX = coords[i - 1][0];
                let nextY = coords[i - 1][1];

                if (i === 0) {
                    ctx.lineTo(x, y);
                }

                let midX = (nextX + x) / 2;
                let midY = (nextY + y) / 2;

                ctx.quadraticCurveTo(x, y, midX, midY);
            }
            else {
                // line to the last point
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();

        let gradient = utils.getLinearGradient(ctx, 0, 0, canvasWidth, 0, [
            { percent: 0, color: TESLA_COLORS[0] },
            { percent: +middle - 0.05 < 0.01 ? 0 : +middle - 0.05, color: TESLA_COLORS[0] },
            { percent: +middle + 0.05 > 0.99 ? 0.99 : +middle + 0.05, color: TESLA_COLORS[1] },
            { percent: middle, color: TESLA_COLORS[1] }
        ]);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
    }

    // 5 - draw circles
    if (params.showCircles) {
        let maxRadius = canvasHeight / 4;
        ctx.save();
        ctx.globalAlpha = 0.5;

        audioData.forEach((element, i) => {
            let percent = element / 255;

            // red-ish circles
            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(58, 99, 166, 0.34 - percent / 3.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            // blue-ish circles, bigger, more transparent
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(88, 66, 184, 0.1 - percent / 10.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            // yellow-ish circles, smaller
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(40, 121, 91, 0.5 - percent / 5.0);
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 0.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        });

        ctx.restore();
    }

    if (params.showTeslas) {
        teslaSprites.forEach(sprite => {
            sprite.update(audioData);
            sprite.draw(ctx);
        })
    }
}

export { setupCanvas, draw, DrawParams, GradientEntry };