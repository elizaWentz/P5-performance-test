let triangles = [];

function setup() {
  createCanvas(960, 540);

  createLayer(color(255, 90, 110, 120), 25);
  createLayer(color(0, 140, 180, 120), 25);
  createLayer(color(255, 200, 40, 100), 20);
}

function draw() {
  background(245, 240, 230);

  drawPaperTexture();

  for (let t of triangles) {
    t.display();
  }

  drawInkGrain();
}

function createLayer(c, count) {
  for (let i = 0; i < count; i++) {
    triangles.push({
      x: random(width),
      y: random(height),
      size: random(40, 180),
      angle: random(TWO_PI),
      color: c
    });
  }
}

function drawPaperTexture() {
  strokeWeight(1);

  for (let i = 0; i < 400; i++) {
    stroke(0, 5);
    point(random(width), random(height));
  }
}

function drawInkGrain() {
  noStroke();

  for (let i = 0; i < 1500; i++) {
    fill(0, 8);
    circle(random(width), random(height), random(0.5, 2));
  }
}

class TriangleShape {
  constructor(data) {
    Object.assign(this, data);
  }

  display() {
    let d = dist(mouseX, mouseY, this.x, this.y);

    let influence = map(
      constrain(d, 0, 250),
      0,
      250,
      1,
      0
    );

    let pushX =
      (this.x - mouseX) * influence * 0.08;

    let pushY =
      (this.y - mouseY) * influence * 0.08;

    let rot =
      this.angle + influence * 0.6;

    let offset =
      influence * 6;

    push();
    translate(
      this.x + pushX,
      this.y + pushY
    );
    rotate(rot);

    noStroke();

    // Riso misregistration
    fill(0, 40);
    triangle(
      -this.size * 0.5 + offset,
      this.size * 0.4 + offset,
      this.size * 0.5 + offset,
      this.size * 0.4 + offset,
      offset,
      -this.size * 0.6 + offset
    );

    fill(
      red(this.color),
      green(this.color),
      blue(this.color),
      alpha(this.color) + influence * 80
    );

    triangle(
      -this.size * 0.5,
      this.size * 0.4,
      this.size * 0.5,
      this.size * 0.4,
      0,
      -this.size * 0.6
    );

    pop();
  }
}

let originalTriangles = [];

function createLayer(c, count) {
  for (let i = 0; i < count; i++) {
    originalTriangles.push(
      new TriangleShape({
        x: random(width),
        y: random(height),
        size: random(40, 180),
        angle: random(TWO_PI),
        color: c
      })
    );
  }

  triangles = originalTriangles;
}