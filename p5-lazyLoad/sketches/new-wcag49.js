// Geometric watercolor pattern inspired by:
// https://i.pinimg.com/736x/ae/a8/a7/aea8a7e2aa72faedd79f39cbeccd7145.jpg

let colPink, colLightPink, colDark;
let tileW = 240;
let tileH = 180;

function setup() {
    createCanvas(1920, 1080);
    noLoop();

    // Colors (subtle dark pink tones)
    colPink = color(150, 50, 80);      // dark pink
    colLightPink = color(200, 150, 160); // light pink
    colDark = color(30, 20, 30);       // dark charcoal

    background(colDark);
}

function draw() {
    let cols = width / tileW;
    let rows = height / tileH;

    // Draw tiled pattern
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let x = i * tileW;
            let y = j * tileH;
            let flip = (i + j) % 2 === 0;
            drawTile(x, y, tileW, tileH, flip);
        }
    }

    // Global paper / watercolor texture
    addPaperTexture();
}

// Draw one rectangular tile with triangular shapes
function drawTile(x, y, w, h, flip) {
    let midX = x + w / 2;
    let midY = y + h / 2;

    // 1) Slightly textured dark background rectangle
    watercolorRect(x, y, w, h, colDark, 35, 3);

    // 2) Two large triangles that form a zigzag arrow
    if (!flip) {
        // Left pink triangle pointing right
        watercolorTriangle(
            x, y,
            x, y + h,
            midX, midY,
            colPink,
            60, 3
        );

        // Right light pink triangle pointing left
        watercolorTriangle(
            x + w, y,
            x + w, y + h,
            midX, midY,
            colLightPink,
            60, 3
        );
    } else {
        // Flipped orientation
        watercolorTriangle(
            x, y,
            x + w, y,
            midX, midY,
            colPink,
            60, 3
        );

        watercolorTriangle(
            x, y + h,
            x + w, y + h,
            midX, midY,
            colLightPink,
            60, 3
        );
    }
}

// --- Watercolor helper functions ---

// Draw a watercolor-style triangle by layering many semi-transparent triangles
function watercolorTriangle(x1, y1, x2, y2, x3, y3, baseCol, layers, jitter) {
    noStroke();
    for (let i = 0; i < layers; i++) {
        let j = jitter;
        let v1x = x1 + random(-j, j);
        let v1y = y1 + random(-j, j);
        let v2x = x2 + random(-j, j);
        let v2y = y2 + random(-j, j);
        let v3x = x3 + random(-j, j);
        let v3y = y3 + random(-j, j);

        let c = color(
            constrain(red(baseCol) + random(-10, 10), 0, 255),
            constrain(green(baseCol) + random(-10, 10), 0, 255),
            constrain(blue(baseCol) + random(-10, 10), 0, 255)
        );
        c.setAlpha(25);

        fill(c);
        triangle(v1x, v1y, v2x, v2y, v3x, v3y);
    }
}

// Watercolor rectangle by layering jittered quads
function watercolorRect(x, y, w, h, baseCol, layers, jitter) {
    noStroke();
    for (let i = 0; i < layers; i++) {
        let j = jitter;
        let x1 = x + random(-j, j);
        let y1 = y + random(-j, j);
        let x2 = x + w + random(-j, j);
        let y2 = y + random(-j, j);
        let x3 = x + w + random(-j, j);
        let y3 = y + h + random(-j, j);
        let x4 = x + random(-j, j);
        let y4 = y + h + random(-j, j);

        let c = color(
            constrain(red(baseCol) + random(-8, 8), 0, 255),
            constrain(green(baseCol) + random(-8, 8), 0, 255),
            constrain(blue(baseCol) + random(-8, 8), 0, 255)
        );
        c.setAlpha(20);

        fill(c);
        quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }
}

// Subtle paper / grain texture over the whole canvas
function addPaperTexture() {
    noStroke();
    for (let i = 0; i < 25000; i++) {
        let x = random(width);
        let y = random(height);
        let r = random(0.5, 1.5);

        let c = color(255, 255, 255, random(5, 15));
        if (random() < 0.5) {
            c = color(0, 0, 0, random(5, 15));
        }

        fill(c);
        ellipse(x, y, r, r);
    }
}