const drawLineWithPath = (ctx, ...points) => {
    ctx.beginPath();

    ctx.moveTo(...points[0])

    points.forEach(p => ctx.lineTo(...p));

    // before stroke you can close the path
    // ctx.closePath();
    ctx.stroke();
};

const drawTriangle = (ctx, point1, point2, point3) => {
    ctx.fillStyle = "red";

    drawLineWithPath(
        ctx,
        point1, point2, point3, point1
    )
    ctx.fill();
}

export { drawLineWithPath, drawTriangle };