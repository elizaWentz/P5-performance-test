let triangles = [];
let palette;

function setup() {
  createCanvas(900, 1200);

  palette = [
    color(255, 80, 120, 180),
    color(0, 140, 255, 170),
    color(255, 210, 0, 160),
    color(20, 20, 40, 90)
  ];

  for (let i = 0; i < 80; i++) {
    triangles.push({
      x: random(width),
      y: random(height),
      size: random(80, 320),
      rotation: random(TWO_PI),
      color: random(palette),
      offsetX: random(-8, 8),
      offsetY: random(-8, 8)
    });
  }
}

function draw() {
  blendMode(BLEND);
  background(245, 238, 220);

  blendMode(MULTIPLY);

  for (let t of triangles) {
    let d = dist(mouseX, mouseY, t.x, t.y);

    let hoverAmount = map(d, 0, 250, 1.4, 1, true);
    let rotationOffset = map(d, 0, 250, 0.3, 0, true);

    drawTriangleLayer(
      t.x,
      t.y,
      t.size * hoverAmount,
      t.color,
      t.rotation + rotationOffset,
      d < 250
    );
  }

  addGrain(50000);
  drawHoverTexture();
}

function drawTriangleLayer(x, y, size, c, rotation, isHovered) {
  push();

  translate(x, y);
  rotate(rotation);

  noStroke();
  fill(c);

  triangle(
    0,
    -size * 0.5,
    -size * 0.5,
    size * 0.5,
    size * 0.5,
    size * 0.5
  );

  for (let i = 0; i < 12; i++) {
    fill(red(c), green(c), blue(c), random(20, 70));

    let tx = random(-size * 0.3, size * 0.3);
    let ty = random(-size * 0.2, size * 0.2);
    let ts = random(size * 0.04, size * 0.18);

    triangle(
      tx,
      ty - ts,
      tx - ts,
      ty + ts,
      tx + ts,
      ty + ts
    );
  }

  if (isHovered) {
    noFill();
    stroke(255, 120);
    strokeWeight(2);

    triangle(
      0,
      -size * 0.58,
      -size * 0.58,
      size * 0.58,
      size * 0.58,
      size * 0.58
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
    let grain = random(-25, 25);

    pixels[index] += grain;
    pixels[index + 1] += grain;
    pixels[index + 2] += grain;
  }

  updatePixels();

  for (let i = 0; i < 9000; i++) {
    noStroke();
    fill(255, random(5, 20));
    circle(random(width), random(height), random(0.5, 2));
  }
}

function drawHoverTexture() {
  push();

  noFill();
  stroke(0, 18);

  for (let i = 0; i < 20; i++) {
    let angle = random(TWO_PI);
    let radius = random(40, 120);

    beginShape();

    for (let a = 0; a < TWO_PI; a += 0.4) {
      let x = mouseX + cos(a + angle) * radius;
      let y = mouseY + sin(a + angle) * radius;

      vertex(x, y);
    }

    endShape(CLOSE);
  }

  pop();
}