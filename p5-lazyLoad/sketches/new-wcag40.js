// Constants for canvas and design
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const TRIANGLE_SIDE = 300; // Reduced side length of the equilateral triangle
const TRIANGLE_HEIGHT = TRIANGLE_SIDE * Math.sqrt(3) / 2; // Height of equilateral triangle
const TILE_WIDTH = TRIANGLE_SIDE;
const TILE_HEIGHT = TRIANGLE_HEIGHT;

// Color palette with warmer tones
const COLORS = {
    warmYellow:  '#B77C2A', // ochre / mustard brown
    mutedRed:    '#8C3A24', // deep brick-brown
    softOrange:  '#B86533', // clay / burnt orange-brown
    teal:        '#3F6356', // muted, dirty teal
    darkOlive:   '#3A3F30', // dark olive/forest brown
    background:  '#3B2A1A'  // warm parchment, darker than before
};

// Setup function
function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    noLoop();
    noStroke();
    background(COLORS.background); // Set the background color

    drawPattern();
    drawVintageOverlay();
    addRisoEffect();
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
    push();
    translate(x, y);
    rotate(PI); // Rotate the design by 180 degrees (upside down)
    drawMainTriangle(0, 0);
    drawInnerTriangle(0, 0);
    drawSidePrisms(0, 0);
    drawBaseBand(0, 0);
    pop();
}

// Draw the large downward equilateral triangle
function drawMainTriangle(x, y) {
    fill(COLORS.warmYellow);
    beginShape();
    vertex(x, y);
    vertex(x + TRIANGLE_SIDE / 2, y + TRIANGLE_HEIGHT);
    vertex(x - TRIANGLE_SIDE / 2, y + TRIANGLE_HEIGHT);
    endShape(CLOSE);
}

// Draw the smaller inner triangle
function drawInnerTriangle(x, y) {
    const innerSide = TRIANGLE_SIDE * 0.5;
    const innerHeight = innerSide * Math.sqrt(3) / 2;
    fill(COLORS.mutedRed);
    beginShape();
    vertex(x, y + innerHeight * 0.5);
    vertex(x + innerSide / 2, y + innerHeight * 1.5);
    vertex(x - innerSide / 2, y + innerHeight * 1.5);
    endShape(CLOSE);
}

// Draw the left and right side prisms
function drawSidePrisms(x, y) {
    fill(COLORS.teal);
    beginShape();
    vertex(x - TRIANGLE_SIDE / 2, y + TRIANGLE_HEIGHT);
    vertex(x - TRIANGLE_SIDE * 0.25, y + TRIANGLE_HEIGHT * 0.5);
    vertex(x, y + TRIANGLE_HEIGHT);
    endShape(CLOSE);

    fill(COLORS.darkOlive);
    beginShape();
    vertex(x + TRIANGLE_SIDE / 2, y + TRIANGLE_HEIGHT);
    vertex(x + TRIANGLE_SIDE * 0.25, y + TRIANGLE_HEIGHT * 0.5);
    vertex(x, y + TRIANGLE_HEIGHT);
    endShape(CLOSE);
}

// Draw the base band connecting triangles
function drawBaseBand(x, y) {
    fill(COLORS.softOrange);
    beginShape();
    vertex(x - TRIANGLE_SIDE / 2, y + TRIANGLE_HEIGHT);
    vertex(x + TRIANGLE_SIDE / 2, y + TRIANGLE_HEIGHT);
    vertex(x + TRIANGLE_SIDE * 0.4, y + TRIANGLE_HEIGHT + TRIANGLE_HEIGHT * 0.2);
    vertex(x - TRIANGLE_SIDE * 0.4, y + TRIANGLE_HEIGHT + TRIANGLE_HEIGHT * 0.2);
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

// Add a Riso effect to the canvas
function addRisoEffect() {
    const risoColors = [COLORS.warmYellow, COLORS.mutedRed, COLORS.softOrange, COLORS.teal, COLORS.darkOlive];
    loadPixels();
    for (let i = 0; i < pixels.length; i += 4) {
        const randomColor = color(random(risoColors));
        const r = red(randomColor);
        const g = green(randomColor);
        const b = blue(randomColor);

        pixels[i] = lerp(pixels[i], r, 0.1);     // Red
        pixels[i + 1] = lerp(pixels[i + 1], g, 0.1); // Green
        pixels[i + 2] = lerp(pixels[i + 2], b, 0.1); // Blue
    }
    updatePixels();
}