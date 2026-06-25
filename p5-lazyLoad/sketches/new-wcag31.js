const BURNT_ORANGE = "#E66B26";
const LIGHT_BLUE = "#A9C9CF";
const DARK_BROWN = "#3F2A24";
const MED_BROWN = "#7B4C34";
const CREAM = "#EFDDBE";
const NEAR_BLACK = "#151515";

function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    return canvas;
}

function drawPattern(context, canvasWidth, canvasHeight) {
    const tileWidth = 120;
    const tileHeight = 120;
    const skew = 20;
    const columns = Math.ceil(canvasWidth / tileWidth) + 2;
    const rows = Math.ceil(canvasHeight / tileHeight) + 2;

    context.fillStyle = NEAR_BLACK;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let col = 0; col < columns; col++) {
        drawPrismColumn(context, col, tileWidth, tileHeight, skew, rows);
    }
}

function drawPrismColumn(context, columnIndex, tileWidth, tileHeight, skew, rows) {
    const offsetX = columnIndex * tileWidth;
    const isOffsetRow = columnIndex % 2 === 0;
    const colors = columnIndex % 2 === 0
        ? [BURNT_ORANGE, LIGHT_BLUE, DARK_BROWN]
        : [CREAM, MED_BROWN, BURNT_ORANGE];

    for (let row = 0; row < rows; row++) {
        const offsetY = row * tileHeight;
        const baseX = offsetX - skew * (row % 2 === 0 ? 1 : 0);
        const baseY = offsetY - (isOffsetRow ? tileHeight / 2 : 0);

        drawParallelogram(context, [
            { x: baseX, y: baseY },
            { x: baseX + tileWidth, y: baseY + skew },
            { x: baseX + tileWidth, y: baseY + tileHeight + skew },
            { x: baseX, y: baseY + tileHeight }
        ], colors[0]);

        drawParallelogram(context, [
            { x: baseX + tileWidth, y: baseY + skew },
            { x: baseX + tileWidth * 2, y: baseY },
            { x: baseX + tileWidth * 2, y: baseY + tileHeight },
            { x: baseX + tileWidth, y: baseY + tileHeight + skew }
        ], colors[1]);

        drawParallelogram(context, [
            { x: baseX, y: baseY + tileHeight },
            { x: baseX + tileWidth, y: baseY + tileHeight + skew },
            { x: baseX + tileWidth, y: baseY + tileHeight * 2 + skew },
            { x: baseX, y: baseY + tileHeight * 2 }
        ], colors[2]);
    }
}

function drawParallelogram(context, points, fillStyle) {
    context.fillStyle = fillStyle;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    context.closePath();
    context.fill();
}

function setup() {
    const canvas = createCanvas(4000, 1080);
    const context = canvas.getContext("2d");
    drawPattern(context, canvas.width, canvas.height);
}

setup();