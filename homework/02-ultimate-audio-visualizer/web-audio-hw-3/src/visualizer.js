/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import { TeslaSprite } from './tesla-sprite.js';
import { BGCircle } from './bg-circle.js'

let ctx, ctxBG, canvasWidth, canvasHeight, gradient, analyserNode, audioData;

let teslaSprites = [];

const TESLA_COLORS = ["rgba(128, 255, 44, 1)", "rgba(233, 156, 73, 1)"];
const CIRCLE_COLORS = ["rgba(58, 99, 166, 1)", "rgba(88, 66, 184, 1)", "rgba(40, 121, 91, 1)"];

let circles = [];
const NUM_CIRCLES = 20;

const setupCanvas = (canvasElement, analyserNodeRef) => {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: "#42047E" }, { percent: 1, color: "#0c6242ff" }]);
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);

    // get drawing context for BG
    ctxBG = document.querySelector("#bg-canvas").getContext("2d");

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

const draw = (params = {}) => {
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
    if (params.showGradient) {
        ctxBG.fillStyle = "#4b2386ff";
        ctxBG.fillRect(0, 0, canvasWidth, canvasHeight);

        circles.forEach(circle => {
            circle.update();
            circle.draw(ctxBG);
        })

        // ctx.save();
        // ctx.fillStyle = gradient;
        // ctx.globalAlpha = 0.3;
        // ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // ctx.restore();
    }

    // 4 - draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;

        const middleIndex = middle * audioData.length;

        // update tesla coil x
        const spriteOneX = margin + middleIndex * (barWidth + barSpacing) / 2;
        const spriteTwoX = canvasWidth - (canvasWidth - (spriteOneX * 2)) / 2;

        teslaSprites[0].updateX(spriteOneX);
        teslaSprites[1].updateX(spriteTwoX);

        ctx.save();
        ctx.globalAlpha = 0.5;

        // loop through the data and draw
        audioData.forEach((element, i) => {
            ctx.fillStyle = i < middleIndex ? TESLA_COLORS[0] : TESLA_COLORS[1];

            ctx.fillRect(margin + i * (barWidth + barSpacing), canvasHeight / 2 - (element / 2), barWidth, element);
        });
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

    teslaSprites.forEach(sprite => {
        sprite.update(audioData);
        sprite.draw(ctx);
    })
}

export { setupCanvas, draw };