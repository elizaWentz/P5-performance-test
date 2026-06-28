function setup() {
  createCanvas(1000, 1400);
  noLoop();

  background(245, 240, 230);

  drawPaperTexture();

  // Riso colors
  const blue = color(40, 75, 190, 180);
  const red = color(255, 95, 95, 180);
  const black = color(30, 30, 40, 180);

  // Layer 1
  drawTriangleLayer(blue, -8, 4);

  // Layer 2 with slight misregistration
  drawTriangleLayer(red, 6, -5);

  // Accent layer
  drawAccentTriangles(black);

  drawGrain();
}

function drawTriangleLayer(c, offsetX, offsetY) {
  fill(c);
  noStroke();

  for (let i = 0; i < 12; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(150, 500);

    push();
    translate(x + offsetX, y + offsetY);
    rotate(random(TWO_PI));

    triangle(
      -s / 2,
      s / 2,
      s / 2,
      s / 2,
      0,
      -s / 2
    );

    pop();
  }
}

function drawAccentTriangles(c) {
  fill(c);
  noStroke();

  for (let i = 0; i < 8; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(80, 250);

    push();
    translate(x, y);
    rotate(random(TWO_PI));

    triangle(
      -s / 2,
      s / 2,
      s / 2,
      s / 2,
      0,
      -s / 2
    );

    pop();
  }
}

function drawPaperTexture() {
  stroke(255, 20);

  for (let i = 0; i < 25000; i++) {
    point(random(width), random(height));
  }

  stroke(0, 10);

  for (let i = 0; i < 12000; i++) {
    point(random(width), random(height));
  }
}

function drawGrain() {
  loadPixels();

  for (let i = 0; i < pixels.length; i += 4) {
    let grain = random(-20, 20);

    pixels[i] += grain;
    pixels[i + 1] += grain;
    pixels[i + 2] += grain;
  }

  updatePixels();
}