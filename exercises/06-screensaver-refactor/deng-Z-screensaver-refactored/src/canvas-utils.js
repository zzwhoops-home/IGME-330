
const drawRectangle = (ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") => {
    ctx.save();

    ctx.fillStyle = fillStyle;

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();

    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }

    ctx.restore();
};

const drawArc = (ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black", startAngle = 0, endAngle = Math.PI * 2, alpha = 0.3) => {
    ctx.save();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = fillStyle;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.closePath();

    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }

    ctx.restore();
};

const drawLine = (ctx, x1, y1, x2, y2, lineWidth = 1, strokeStyle = "black") => {
    ctx.save();

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;

    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.closePath();
    ctx.stroke();

    ctx.restore();
};

export { drawArc, drawLine, drawRectangle };