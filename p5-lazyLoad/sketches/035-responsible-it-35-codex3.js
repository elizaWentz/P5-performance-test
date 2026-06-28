let printTexture;
let triangles = [];

const risoInks = [
  "#ff4f9a",
  "#00a8a8",
  "#f6d447",
  "#2d2a78",
  "#f26b3a",
];

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  noLoop();
  generateComposition();
}

function draw() {
  background("#f8efd8");
  drawPaperFibers();
  drawRisoTriangles();
  drawRegistrationMarks();
  image(printTexture, 0, 0);
}

function mousePressed() {
  generateComposition();
  redraw();
}

function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("riso-triangles", "png");
  }
}

function generateComposition() {
  randomSeed(floor(random(100000)));
  noiseSeed(floor(random(100000)));

  triangles = [];
  printTexture = createGraphics(width, height);
  printTexture.pixelDensity(1);
  printTexture.clear();

  const grid = 86;
  for (let y = -grid; y < height + grid; y += grid) {
    for (let x = -grid; x < width + grid; x += grid) {
      const cx = x + random(-18, 18);
      const cy = y + random(-18, 18);
      const size = random(62, 132);
      const angle = random(TWO_PI);
      const ink = random(risoInks);
      const flip = random() > 0.5 ? 1 : -1;

      triangles.push({ cx, cy, size, angle, ink, flip });
    }
  }

  for (let i = 0; i < 9000; i++) {
    const x = random(width);
    const y = random(height);
    const alpha = random(8, 30);
    const d = random(0.4, 1.7);
    printTexture.noStroke();
    printTexture.fill(34, 28, 45, alpha);
    printTexture.circle(x, y, d);
  }

  for (let i = 0; i < 1600; i++) {
    const x = random(width);
    const y = random(height);
    const alpha = random(7, 22);
    printTexture.stroke(255, 248, 224, alpha);
    printTexture.strokeWeight(random(0.35, 1.2));
    printTexture.line(x, y, x + random(-10, 10), y + random(-2, 2));
  }
}

function drawRisoTriangles() {
  blendMode(MULTIPLY);

  for (const tri of triangles) {
    const inkColor = color(tri.ink);
    const passes = [
      { offsetX: -2.5, offsetY: 2.2, alpha: 105 },
      { offsetX: 2.1, offsetY: -1.6, alpha: 88 },
      { offsetX: 0, offsetY: 0, alpha: 155 },
    ];

    for (const pass of passes) {
      push();
      translate(tri.cx + pass.offsetX, tri.cy + pass.offsetY);
      rotate(tri.angle + pass.offsetX * 0.005);
      scale(1, tri.flip);

      inkColor.setAlpha(pass.alpha);
      fill(inkColor);
      noStroke();
      roughTriangle(0, 0, tri.size);

      pop();
    }
  }

  drawLargeOverprints();
  blendMode(BLEND);
}

function roughTriangle(x, y, size) {
  beginShape();
  for (let i = 0; i < 3; i++) {
    const a = -HALF_PI + i * TWO_PI / 3;
    const jitter = size * 0.07;
    vertex(
      x + cos(a) * size * 0.56 + random(-jitter, jitter),
      y + sin(a) * size * 0.56 + random(-jitter, jitter)
    );
  }
  endShape(CLOSE);
}

function drawLargeOverprints() {
  const anchors = [
    { x: width * 0.2, y: height * 0.18, s: 260, c: "#ff4f9a", a: -0.35 },
    { x: width * 0.77, y: height * 0.33, s: 310, c: "#00a8a8", a: 0.42 },
    { x: width * 0.48, y: height * 0.77, s: 330, c: "#f6d447", a: -0.08 },
  ];

  for (const anchor of anchors) {
    push();
    translate(anchor.x, anchor.y);
    rotate(anchor.a);
    const ink = color(anchor.c);
    ink.setAlpha(86);
    fill(ink);
    noStroke();
    roughTriangle(0, 0, anchor.s);

    ink.setAlpha(48);
    translate(random(-7, 7), random(-7, 7));
    rotate(0.04);
    roughTriangle(0, 0, anchor.s * 0.88);
    pop();
  }
}

function drawPaperFibers() {
  strokeWeight(1);
  for (let i = 0; i < 700; i++) {
    const x = random(width);
    const y = random(height);
    const fiber = color(random(["#e6d7b6", "#fff7df", "#d7c7a7"]));
    fiber.setAlpha(random(24, 62));
    stroke(fiber);
    line(x, y, x + random(-20, 20), y + random(-3, 3));
  }
}

function drawRegistrationMarks() {
  const ink = color("#2d2a78");
  ink.setAlpha(120);
  stroke(ink);
  strokeWeight(1.5);
  noFill();

  const margin = 26;
  for (const x of [margin, width - margin]) {
    for (const y of [margin, height - margin]) {
      line(x - 10, y, x + 10, y);
      line(x, y - 10, x, y + 10);
      triangle(x - 5, y - 15, x + 5, y - 15, x, y - 6);
    }
  }
}
