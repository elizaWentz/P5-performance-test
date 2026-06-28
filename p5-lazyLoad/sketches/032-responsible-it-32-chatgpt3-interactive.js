let triangles = [];

function setup() {
  createCanvas(1000, 1000);

  for (let i = 0; i < 40; i++) {
    triangles.push({
      x: random(width),
      y: random(height),
      s: random(100, 300)
    });
  }
}

function draw() {
  background("#f5f1e8");

  drawLayer("#ff6b6b", -6, 4);
  drawLayer("#00a0e9", 5, -4);
  drawLayer("#ffd400", 2, 6);

  drawPaperTexture();
}

function drawLayer(col, baseOffsetX, baseOffsetY) {

  push();

  for (let t of triangles) {

    let d = dist(mouseX, mouseY, t.x, t.y);

    let influence = map(d, 0, 250, 1, 0);
    influence = constrain(influence, 0, 1);

    let offsetX =
      baseOffsetX +
      (mouseX - t.x) * 0.05 * influence;

    let offsetY =
      baseOffsetY +
      (mouseY - t.y) * 0.05 * influence;

    fill(col);
    noStroke();

    triangle(
      t.x + offsetX,
      t.y - t.s/2 + offsetY,
      t.x - t.s/2 + offsetX,
      t.y + t.s/2 + offsetY,
      t.x + t.s/2 + offsetX,
      t.y + t.s/2 + offsetY
    );

    drawInteractiveHalftone(
      t.x + offsetX,
      t.y + offsetY,
      t.s,
      influence
    );
  }

  pop();
}

function drawInteractiveHalftone(
  x,
  y,
  s,
  influence
) {

  fill(255, 30);
  noStroke();

  let spacing = lerp(14, 6, influence);

  for (
    let py = y - s/2;
    py < y + s/2;
    py += spacing
  ) {

    for (
      let px = x - s/2;
      px < x + s/2;
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

  stroke(255, 10);

  for (let i = 0; i < 3000; i++) {
    point(
      random(width),
      random(height)
    );
  }

  stroke(0, 8);

  for (let i = 0; i < 2000; i++) {
    point(
      random(width),
      random(height)
    );
  }
}