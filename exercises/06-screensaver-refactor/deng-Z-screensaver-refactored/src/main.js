import { getRandomColor, getRandomInt } from "./utils.js";
import { drawArc, drawLine, drawRectangle } from "./canvas-utils.js";

let canvas;
let ctx;

let paused = false;
let createRectangles = true;
let createArcs = true;
let createLines = true;

let frameId = 0;

const init = () => {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    // background
    drawRectangle(ctx, 20, 20, 600, 440, "red");

    // demo stuff
    // 400x300 rectangle
    drawRectangle(ctx, 120, 120, 400, 300, "#ABDD00", 5, "blue");

    // another rect
    drawRectangle(ctx, 120, 120, 400, 300, "yellow", 10, "black");

    // original lines with paths
    drawLine(ctx, 20, 20, 640, 460, 5, "black");
    drawLine(ctx, 620, 20, 20, 460, 5, "black");

    // circle path (default is 0 -> 2 PI)
    drawArc(ctx, 320, 240, 50, "green", 5, "purple", 0, Math.PI * 2, 1.0);

    // half arc
    drawArc(ctx, 320, 240, 20, "gray", 5, "yellow", 0, Math.PI, 1.0);

    // check it off!
    // 2 more circles as "eyes"
    drawArc(ctx, 300, 210, 10, "black", 0, "", 0, Math.PI * 2, 1.0);
    drawArc(ctx, 340, 210, 10, "black", 0, "", 0, Math.PI * 2, 1.0);

    // long line
    drawLine(ctx, 0, 300, 640, 300, 20, "orange");

    // setup UI function
    setupUI();

    // call update function for animation
    update();
};

const update = () => {
    if (paused) {
        return;
    }
    else {
        if (frameId) {
            cancelAnimationFrame(frameId);
        }
        frameId = requestAnimationFrame(update);
        if (createRectangles) {
            drawRandomRect(ctx);
        }
        if (createArcs) {
            drawRandomArc(ctx);
        }
        if (createLines) {
            drawRandomLine(ctx);
        }
    }
};

// event handlers
const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX, mouseY);

    // draw random arc when clicked ("spraypaint")
    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(20, 50);
        let color = getRandomColor();

        drawArc(ctx, x, y, radius, color);
    }
};

const drawRandomRect = (ctx) => {
    drawRectangle(
        ctx = ctx,
        getRandomInt(0, 640),
        getRandomInt(0, 480),
        getRandomInt(10, 90),
        getRandomInt(10, 90),
        getRandomColor(),
        getRandomInt(2, 12),
        getRandomColor(),
    );
};

const drawRandomArc = (ctx) => {
    drawArc(
        ctx = ctx,
        getRandomInt(0, 640),
        getRandomInt(0, 480),
        getRandomInt(50, 200),
        getRandomColor(),
        getRandomInt(2, 12),
        getRandomColor(),
        getRandomInt(0, 50) * (Math.PI / 50),
        getRandomInt(50, 100) * (Math.PI / 50),
    );
};

const drawRandomLine = (ctx) => {
    drawLine(
        ctx = ctx,
        getRandomInt(0, 640),
        getRandomInt(0, 480),
        getRandomInt(0, 640),
        getRandomInt(0, 480),
        getRandomInt(1, 10),
        getRandomColor(),
    )
};

const clearCanvas = () => {
    drawRectangle(
        ctx = ctx,
        0,
        0,
        canvas.width,
        canvas.height,
        "white",
    )
};

const setupUI = () => {
    document.querySelector("#btn-pause").addEventListener("click", () => paused = true);
    document.querySelector("#btn-play").addEventListener("click", () => {
        paused = false;
        update();
    });
    document.querySelector("#btn-clear").addEventListener("click", clearCanvas);

    document.querySelector("#cb-rectangles").addEventListener("click", (e) => {
        createRectangles = e.target.checked;
        update();
    });
    document.querySelector("#cb-arcs").addEventListener("click", (e) => {
        createArcs = e.target.checked;
        update();
    });
    document.querySelector("#cb-lines").addEventListener("click", (e) => {
        createLines = e.target.checked;
        update();
    });

    canvas.addEventListener("click", canvasClicked);
};

init();