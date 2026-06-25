// Constants for canvas and design
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const TRIANGLE_SIDE = 240; // Side length of the large equilateral triangle
const TRIANGLE_HEIGHT = TRIANGLE_SIDE * Math.sqrt(3) / 2; // Height of equilateral triangle
const TILE_WIDTH = TRIANGLE_SIDE;
const TILE_HEIGHT = TRIANGLE_HEIGHT;

// Color palette
const COLORS = {
    warmYellow: '#D9C86A',
    mutedRed: '#D8543F',
    softOrange: '#E9A35A',
    teal: '#186C6A',
    darkOlive: '#384326',
    background: '#F4F1E6' // Matching background color
};

// Setup function
function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    noLoop();
    noStroke();
    background(COLORS.background); // Set the background color

    drawPattern();
    drawVintageOverlay();
}

// Draw the full pattern
function drawPattern() {
    for (let row = 0; row * TILE_HEIGHT < CANVAS_HEIGHT; row++) {
        for (let col = 0; col * TILE_WIDTH < CANVAS_WIDTH; col++) {
            const xOffset = col * TILE_WIDTH + (row % 2 === 0 ? 0 : TILE_WIDTH / 2);
            const yOffset = row * TILE_HEIGHT;
            drawTile(xOffset, yOffset);
        }
    }
}

// Draw a single tile at a given position
function drawTile(x, y) {
    drawMainTriangle(x, y);
    drawInnerTriangle(x, y);
    drawSidePrisms(x, y);
    drawBaseBand(x, y);
}

// Draw the large rotated equilateral triangle
function drawMainTriangle(x, y) {
    fill(COLORS.warmYellow);
    beginShape();
    vertex(x, y - TRIANGLE_HEIGHT / 2);
    vertex(x + TRIANGLE_HEIGHT, y);
    vertex(x, y + TRIANGLE_HEIGHT / 2);
    endShape(CLOSE);
}

// Draw the smaller rotated inner triangle
function drawInnerTriangle(x, y) {
    const innerSide = TRIANGLE_SIDE * 0.5;
    const innerHeight = innerSide * Math.sqrt(3) / 2;
    fill(COLORS.mutedRed);
    beginShape();
    vertex(x, y - innerHeight * 0.5);
    vertex(x + innerHeight, y);
    vertex(x, y + innerHeight * 0.5);
    endShape(CLOSE);
}

// Draw the left and right side prisms
function drawSidePrisms(x, y) {
    fill(COLORS.teal);
    beginShape();
    vertex(x, y + TRIANGLE_HEIGHT / 2);
    vertex(x + TRIANGLE_HEIGHT * 0.5, y + TRIANGLE_HEIGHT * 0.25);
    vertex(x + TRIANGLE_HEIGHT, y);
    endShape(CLOSE);

    fill(COLORS.darkOlive);
    beginShape();
    vertex(x, y - TRIANGLE_HEIGHT / 2);
    vertex(x + TRIANGLE_HEIGHT * 0.5, y - TRIANGLE_HEIGHT * 0.25);
    vertex(x + TRIANGLE_HEIGHT, y);
    endShape(CLOSE);
}

// Draw the base band connecting triangles
function drawBaseBand(x, y) {
    fill(COLORS.softOrange);
    beginShape();
    vertex(x, y - TRIANGLE_HEIGHT / 2);
    vertex(x, y + TRIANGLE_HEIGHT / 2);
    vertex(x - TRIANGLE_HEIGHT * 0.2, y + TRIANGLE_HEIGHT * 0.6);
    vertex(x - TRIANGLE_HEIGHT * 0.2, y - TRIANGLE_HEIGHT * 0.6);
    endShape(CLOSE);
}

// Add a vintage overlay with subtle noise
function drawVintageOverlay() {
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
        const grain = random(-10, 10);
        pixels[i] += grain;     // Red
        pixels[i + 1] += grain; // Green
        pixels[i + 2] += grain; // Blue
    }
    updatePixels();
}