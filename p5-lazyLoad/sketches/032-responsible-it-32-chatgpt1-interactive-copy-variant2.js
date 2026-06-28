// RISOGRAPH TRIANGLE POSTER
// Interactive p5.js sketch
// Move your mouse near triangles to create
// misregistration and halftone distortion effects.

let triangles = [];

function setup() {
  createCanvas(800, 800);

  for (let i = 0; i < 30; i++) {
    triangles.push({
      x: random(width),
      y: random(height),
      s: random(100, 300),
      rot: random(TWO_PI),
      speed: random(0.001, 0.004)
    });
  }

  noStroke();
}

function draw() {
  background("#f5f1e8");

  // Animated floating motion
  for (let t of triangles) {
    t.offsetX = map(
      noise(t.x * 0.001, frameCount * t.speed),
      0,
      1,
      -15,
      15
    );

    t.offsetY = map(
      noise(t.y * 0.001, frameCount * t.speed),
      0,
      1,
      -15,
      15
    );
  }

  // Riso color layers
  drawLayer("#ff6b6b", -8, 4);
  drawLayer("#00a0e9", 6, -5);
  drawLayer("#ffd400", 2, 8);

  drawPaperTexture();
  drawInkSpeckles();
}

function drawLayer(col, baseOffsetX, baseOffsetY) {
  push();

  blendMode(MULTIPLY);

  for (let t of triangles) {
    let tx = t.x + t.offsetX;
    let ty = t.y + t.offsetY;

    let d = dist(mouseX, mouseY, tx, ty);

    let influence = map(d, 0, 250, 1, 0);
    influence = constrain(influence, 0, 1);

    let offsetX =
      baseOffsetX +
      (mouseX - tx) * 0.06 * influence;

    let offsetY =
      baseOffsetY +
      (mouseY - ty) * 0.06 * influence;

    push();

    translate(
      tx + offsetX,
      ty + offsetY
    );

    rotate(t.rot);

    fill(col);

    triangle(
      0,
      -t.s / 2,
      -t.s / 2,
      t.s / 2,
      t.s / 2,
      t.s / 2
    );

    drawHalftone(
      0,
      0,
      t.s,
      influence
    );

    pop();
  }

  pop();
}

function drawHalftone(x, y, s, influence) {
  fill(255, 25);

  let spacing = lerp(14, 6, influence);

  for (
    let py = -s / 2;
    py < s / 2;
    py += spacing
  ) {
    for (
      let px = -s / 2;
      px < s / 2;
      px += spacing
    ) {
      let dotSize =
        lerp(1, 5, influence);

      circle(
        px + random(-0.5, 0.5),
        py + random(-0.5, 0.5),
        dotSize
      );
    }
  }
}

function drawPaperTexture() {
  push();

  strokeWeight(1);

  stroke(255, 12);

  for (let i = 0; i < 5000; i++) {
    point(
      random(width),
      random(height)
    );
  }

  stroke(0, 8);

  for (let i = 0; i < 3000; i++) {
    point(
      random(width),
      random(height)
    );
  }

  pop();
}

function drawInkSpeckles() {
  push();

  noStroke();

  for (let i = 0; i < 1500; i++) {
    fill(0, random(5, 15));

    circle(
      random(width),
      random(height),
      random(0.5, 2)
    );
  }

  pop();
}