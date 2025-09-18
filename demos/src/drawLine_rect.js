const drawLineWithRect = (ctx, point1, point2) => {
    const [x0, y0] = point1;
    const [x1, y1] = point2;

    const angle = Math.atan2(y1 - y0, x1 - x0);

    ctx.save();

    ctx.translate(x0, y0);
    ctx.rotate(angle);
    ctx.translate(-x0, -y0);
    
    const length = Math.sqrt(
        Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)
    );
    
    ctx.fillRect(x0, y0,
        length, 5);

    ctx.restore();
};

export { drawLineWithRect };