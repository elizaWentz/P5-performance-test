// RISO TRIANGLE POSTER
// p5.js sketch for VSCode
// Canvas: 1128 x 308

function setup() {
  createCanvas(1128, 308);
  noLoop();
  pixelDensity(2);
}

function draw() {
  // Paper background
  background(248, 240, 228);

  // Paper grain
  drawPaperTexture();

  // Large layered triangle fields
  blendMode(MULTIPLY);

  drawTriangleLayer(color(255, 60, 120, 180), 0.9, 40);
  drawTriangleLayer(color(20, 160, 220, 180), 1.1, 50);
  drawTriangleLayer(color(255, 210, 40, 170), 1.3, 35);

  // Overprint texture
  drawInkNoise();

  // Small misregistered triangles
  drawAccentTriangles();

  blendMode(BLEND);

  // Dust / imperfections
  drawDust();
}

// --------------------------------------------
// TRIANGLE LAYERS
// --------------------------------------------

function drawTriangleLayer(c, scaleFactor, amount) {
  fill(c);
  noStroke();

  push();

  translate(random(-40, 40), random(-20, 20));

  for (let i = 0; i < amount; i++) {
    let x = random(width);
    let y = random(height);

    let s = random(40, 220) * scaleFactor;

    push();

    translate(x, y);
    rotate(radians(random(360)));

    triangle(
      -s * 0.5,
      s * 0.4,
      0,
      -s * 0.5,
      s * 0.5,
      s * 0.4
    );

    pop();
  }

  pop();
}

// --------------------------------------------
// PAPER TEXTURE
// --------------------------------------------

function drawPaperTexture() {
  strokeWeight(1);

  for (let i = 0; i < 15000; i++) {
    let x = random(width);
    let y = random(height);

    let alpha = random(8, 22);

    stroke(120, alpha);
    point(x, y);
  }
}

// --------------------------------------------
// RISOGRAPH INK NOISE
// --------------------------------------------

function drawInkNoise() {
  noStroke();

  for (let i = 0; i < 22000; i++) {
    let x = random(width);
    let y = random(height);

    let size = random(0.5, 2);

    fill(0, random(8, 20));
    ellipse(x, y, size);
  }
}

// --------------------------------------------
// SMALL ACCENT TRIANGLES
// --------------------------------------------

function drawAccentTriangles() {
  noStroke();

  for (let i = 0; i < 120; i++) {
    let x = random(width);
    let y = random(height);

    let s = random(6, 28);

    fill(
      random([
        color(255, 80, 130, 220),
        color(0, 170, 220, 220),
        color(255, 220, 60, 220),
        color(20, 20, 20, 180)
      ])
    );

    push();

    translate(x, y);
    rotate(radians(random(360)));

    triangle(
      -s * 0.5,
      s * 0.5,
      0,
      -s * 0.5,
      s * 0.5,
      s * 0.5
    );

    pop();
  }
}

// --------------------------------------------
// DUST + PRINT IMPERFECTIONS
// --------------------------------------------

function drawDust() {
  noStroke();

  for (let i = 0; i < 3000; i++) {
    fill(255, random(10, 40));

    let x = random(width);
    let y = random(height);

    ellipse(x, y, random(1, 3));
  }
}