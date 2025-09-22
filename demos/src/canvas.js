import { drawLineWithRect } from "./drawLine_rect.js"
import { drawLineWithPath, drawTriangle } from "./drawLine_path.js"

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// // you can use this to make "save points"
// ctx.save();

// // canvas is stateful, meaning that even if you change it out of scope, it will change permanently
// ctx.fillStyle = "#438fe3";
// ctx.fillRect(0, 0, canvas.width, canvas.height);

// ctx.fillStyle = "red";
// ctx.fillRect(
//     100, 130,
//     150, 100
// );

// // prevent "leakage" of changes
// ctx.restore();

ctx.fillStyle = "magenta";
ctx.strokeStyle = "red";
ctx.lineWidth = 5;

drawLineWithRect(ctx, [50, 100], [200, 200]);
drawLineWithRect(ctx, [10, 10], [100, 10]);

drawLineWithPath(ctx, [50, 50], [400, 250]);

let rotation = 0;
const animate = () => {
    rotation += 0.1;

    ctx.clearRect(0, 0, 500, 500);

    ctx.translate(200, 200);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-200, -200);
    
    drawTriangle(ctx, [123, 234], [20, 345], [234, 323])

    requestAnimationFrame(animate);
}
animate();

// ctx.fillRect(20, 20, 50, 50);

// ctx.clearRect(100, 100, 75, 50);