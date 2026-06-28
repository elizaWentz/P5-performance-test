function setup() {
  createCanvas(1000, 1000);
  noLoop();
}

function draw() {
  background("#f5f1e8");

  // Risograph layers with slight misregistration
  drawTriangleLayer("#ff6b6b", -8, 4);
  drawTriangleLayer("#00a0e9", 6, -5);
  drawTriangleLayer("#ffd400", 2, 8);

  // Paper texture
  drawPaperTexture();

  // Ink noise
  drawInkSpeckles();
}

function drawTriangleLayer(col, offsetX, offsetY) {
  push();
  translate(offsetX, offsetY);

  for (let i = 0; i < 60; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(60, 300);

    fill(col);
    noStroke();

    triangle(
      x,
      y - s / 2,
      x - s / 2,
      y + s / 2,
      x + s / 2,
      y + s / 2
    );

    // Fake risograph halftone
    fill(255, 25);
    drawHalftoneTriangle(x, y, s);
  }

  pop();
}

function drawHalftoneTriangle(x, y, s) {
  let spacing = 12;

  for (let py = y - s / 2; py < y + s / 2; py += spacing) {
    for (let px = x - s / 2; px < x + s / 2; px += spacing) {
      let d = dist(px, py, x, y);
      let size = map(d, 0, s / 2, 4, 1);

      circle(
        px + random(-1, 1),
        py + random(-1, 1),
        size
      );
    }
  }
}

function drawPaperTexture() {
  stroke(255, 15);

  for (let i = 0; i < 15000; i++) {
    point(
      random(width),
      random(height)
    );
  }

  stroke(0, 8);

  for (let i = 0; i < 8000; i++) {
    point(
      random(width),
      random(height)
    );
  }
}

function drawInkSpeckles() {
  noStroke();

  for (let i = 0; i < 4000; i++) {
    fill(0, random(5, 20));

    circle(
      random(width),
      random(height),
      random(0.5, 2)
    );
  }
}