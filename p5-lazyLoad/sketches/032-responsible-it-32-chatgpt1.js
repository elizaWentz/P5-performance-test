function setup() {
  createCanvas(900, 1200);
  noLoop();
  blendMode(MULTIPLY);
}

function draw() {
  background(245, 238, 220);

  // Risograph-inspired palette
  const colors = [
    color(255, 80, 120, 180),   // fluorescent pink
    color(0, 140, 255, 170),    // cyan blue
    color(255, 210, 0, 160),    // sunflower yellow
    color(20, 20, 40, 90)       // soft black
  ];

  // Large layered triangles
  for (let i = 0; i < 80; i++) {
    drawTriangleLayer(random(width), random(height), random(80, 320), random(colors));
  }

  // Grain texture
  addGrain(70000);

  // Misprint offset effect
  offsetPrintLayer();
}

function drawTriangleLayer(x, y, size, c) {
  push();

  translate(x + random(-8, 8), y + random(-8, 8));
  rotate(random(TWO_PI));

  noStroke();
  fill(c);

  beginShape();
  vertex(-size * 0.5, size * 0.5);
  vertex(0, -size * 0.5);
  vertex(size * 0.5, size * 0.5);
  endShape(CLOSE);

  // Inner texture triangles
  for (let i = 0; i < 12; i++) {
    fill(red(c), green(c), blue(c), random(20, 60));

    let tx = random(-size * 0.3, size * 0.3);
    let ty = random(-size * 0.2, size * 0.2);
    let ts = random(size * 0.05, size * 0.25);

    triangle(
      tx,
      ty - ts,
      tx - ts,
      ty + ts,
      tx + ts,
      ty + ts
    );
  }

  pop();
}

function addGrain(amount) {
  loadPixels();

  for (let i = 0; i < amount; i++) {
    let x = floor(random(width));
    let y = floor(random(height));

    let index = (x + y * width) * 4;
    let grain = random(-30, 30);

    pixels[index] += grain;
    pixels[index + 1] += grain;
    pixels[index + 2] += grain;
  }

  updatePixels();

  // Extra paper speckle
  for (let i = 0; i < 12000; i++) {
    noStroke();
    fill(255, random(8, 25));
    circle(random(width), random(height), random(0.5, 2));
  }
}

function offsetPrintLayer() {
  push();

  translate(10, -6);
  stroke(0, 30);
  noFill();

  for (let i = 0; i < 25; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(40, 180);

    triangle(
      x,
      y - s,
      x - s,
      y + s,
      x + s,
      y + s
    );
  }

  pop();
}