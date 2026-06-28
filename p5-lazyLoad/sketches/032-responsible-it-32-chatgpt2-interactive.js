let triangles = [];

function setup() {
  createCanvas(1000, 1400);

  for (let i = 0; i < 20; i++) {
    triangles.push({
      x: random(width),
      y: random(height),
      size: random(150, 400),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  background(245, 240, 230);

  drawPaperTexture();

  for (let t of triangles) {
    let d = dist(mouseX, mouseY, t.x, t.y);

    let influence = map(
      constrain(d, 0, 250),
      0,
      250,
      1,
      0
    );

    drawRisoTriangle(
      t.x,
      t.y,
      t.size,
      t.rotation,
      influence
    );
  }

  drawGrain();
}

function drawRisoTriangle(x, y, s, rot, influence) {

  let shift = influence * 25;

  // Blue layer
  drawTriangle(
    x - shift,
    y + shift,
    s,
    rot,
    color(40, 75, 190, 180)
  );

  // Red layer
  drawTriangle(
    x + shift,
    y - shift,
    s,
    rot + influence * 0.15,
    color(255, 95, 95, 180)
  );

  // Black layer
  if (influence > 0.1) {
    drawTriangle(
      x,
      y,
      s * 0.4,
      rot,
      color(20, 20, 20, 120)
    );
  }
}

function drawTriangle(x, y, s, rot, c) {
  push();

  translate(x, y);
  rotate(rot);

  fill(c);
  noStroke();

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

function drawPaperTexture() {
  stroke(255, 15);

  for (let i = 0; i < 1500; i++) {
    point(random(width), random(height));
  }

  stroke(0, 8);

  for (let i = 0; i < 800; i++) {
    point(random(width), random(height));
  }
}

function drawGrain() {
  loadPixels();

  for (let i = 0; i < pixels.length; i += 16) {
    let grain = random(-15, 15);

    pixels[i] += grain;
    pixels[i + 1] += grain;
    pixels[i + 2] += grain;
  }

  updatePixels();
}