// Risograph-inspired triangles with texture
let palette;

function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1); // grain looks more like print
  noLoop();

  // Bold jewel-tone risograph-like inks
  palette = [
    color("#1D2BD8"), // ultramarine
    color("#008F5A"), // emerald
    color("#C41230"), // crimson
    color("#6A1B9A"), // violet
    color("#E0A100")  // golden amber
  ];
}

function draw() {
  background("#F2E7D2"); // warm paper color

  // Subtle paper texture first
  drawPaperTexture();

  // Main triangle composition
  blendMode(MULTIPLY);
  for (let i = 0; i < 20; i++) {
    drawRisoTriangle();
  }

  // Return to normal blending for grain
  blendMode(BLEND);
  drawGrain();
}

// Draw a big triangle with slight "misregistration" and overlap
function drawRisoTriangle() {
  // Main triangle position
  let cx = random(width * -0.1, width * 1.1);
  let cy = random(height * -0.1, height * 1.1);
  let size = random(width * 0.2, width * 0.4);
  let angle = random(TAU);

  // Base triangle vertices
  let pts = [];
  for (let i = 0; i < 3; i++) {
    let a = angle + (i * TAU) / 3.0;
    let r = size * random(0.5, 1.1);
    pts.push(createVector(cx + cos(a) * r, cy + sin(a) * r));
  }

  // Choose 2–3 ink layers for the triangle
  let layers = floor(random(2, 4));
  shuffle(palette, true);
  for (let i = 0; i < layers; i++) {
    let col = palette[i];
    let alphaVal = random(120, 200); // transparency for ink

    fill(red(col), green(col), blue(col), alphaVal);
    noStroke();

    // Slight offset per layer to mimic misalignment
    let offX = random(-6, 6);
    let offY = random(-6, 6);

    beginShape();
    for (let p of pts) {
      vertex(p.x + offX, p.y + offY);
    }
    endShape(CLOSE);
  }
}

// Subtle background "paper" texture
function drawPaperTexture() {
  strokeWeight(1);
  for (let i = 0; i < 7000; i++) {
    let x = random(width);
    let y = random(height);
    let v = random(230, 255);
    stroke(v, v, v, 20);
    point(x, y);
  }
}

// Fine grain / speckle to get risograph noise
function drawGrain() {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (y * width + x) * 4;

      // Random tiny variation in brightness
      let n = random(-12, 12);
      pixels[idx + 0] = constrain(pixels[idx + 0] + n, 0, 255);
      pixels[idx + 1] = constrain(pixels[idx + 1] + n, 0, 255);
      pixels[idx + 2] = constrain(pixels[idx + 2] + n, 0, 255);
    }
  }
  updatePixels();

  // A few colored specks on top
  for (let i = 0; i < 1200; i++) {
    let col = random(palette);
    stroke(red(col), green(col), blue(col), random(40, 90));
    strokeWeight(random(0.5, 1.3));
    point(random(width), random(height));
  }
}
