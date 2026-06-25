const COLORS = {
    burntOrange: '#E66B26',
    lightBlue: '#A9C9CF',
    darkBrown: '#3F2A24',
    mediumBrown: '#7B4C34',
    cream: '#EFDDBE',
    nearBlack: '#151515',
};

function setup() {
    createCanvas(1920, 1080);
    noLoop();
    noStroke();
    drawPattern();
}

function drawPattern() {
    const blockWidth = 120;
    const blockHeight = 60;
    const xOffset = blockWidth * 0.75; // Horizontal offset for diagonal alignment
    const yOffset = blockHeight * 0.5; // Vertical offset for diagonal alignment

    for (let y = 0; y < height + blockHeight; y += blockHeight) {
        for (let x = 0; x < width + blockWidth; x += xOffset) {
            drawBlock(x, y, blockWidth, blockHeight);
        }
    }
}

function drawBlock(x, y, w, h) {
    const halfW = w / 2;
    const halfH = h / 2;

    // Top parallelogram
    fill(COLORS.burntOrange);
    quad(
        x, y,
        x + halfW, y - halfH,
        x + w, y,
        x + halfW, y + halfH
    );

    // Left parallelogram
    fill(COLORS.mediumBrown);
    quad(
        x, y,
        x + halfW, y + halfH,
        x + halfW, y + h + halfH,
        x, y + h
    );

    // Right parallelogram
    fill(COLORS.darkBrown);
    quad(
        x + halfW, y + halfH,
        x + w, y,
        x + w, y + h,
        x + halfW, y + h + halfH
    );
}