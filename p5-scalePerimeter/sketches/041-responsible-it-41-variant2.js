const W = 1128;
const H = 308;
const SEED = 35;

let grainLayer;

function setup() {
  createCanvas(W, H);
  pixelDensity(1);
  randomSeed(SEED);
  noiseSeed(SEED);
  noLoop();

  grainLayer = createGraphics(W, H);
  grainLayer.pixelDensity(1);
}

function draw() {
  background("#f7edd1");

  drawPaper();
  drawInkWash();
  drawTriangleField();
  drawHalftone();
  drawRegistrationGhosts();
  drawGrain();
  drawDeckleEdges();
}

function drawPaper() {
  noStroke();
  for (let i = 0; i < 5200; i++) {
    const x = random(width);
    const y = random(height);
    const tone = random(210, 255);
    fill(tone, random(205, 235), random(170, 205), random(10, 26));
    rect(x, y, random(0.5, 2.5), random(0.5, 1.8));
  }
}

function drawInkWash() {
  const bands = [
    ["#ff4f73", -80, 0.42],
    ["#00a6a6", 260, 0.36],
    ["#f4c300", 620, 0.34],
    ["#2f4aa8", 880, 0.28],
  ];

  noStroke();
  for (const [col, startX, alpha] of bands) {
    fillWithAlpha(col, alpha * 255);
    beginShape();
    vertex(startX, -28);
    for (let x = startX; x <= startX + 430; x += 34) {
      const y = 38 + noise(x * 0.009, startX) * 62;
      vertex(x, y);
    }
    vertex(startX + 440, H + 40);
    for (let x = startX + 440; x >= startX; x -= 34) {
      const y = H - 24 - noise(x * 0.008, startX + 10) * 56;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function drawTriangleField() {
  const palette = ["#ff3f66", "#00a7a5", "#f7c600", "#263c96", "#111111"];

  for (let i = 0; i < 42; i++) {
    const x = random(-60, width + 60);
    const y = random(8, height - 8);
    const s = random(34, 128);
    const rot = random(TWO_PI);
    const col = random(palette);
    const inkAlpha = col === "#111111" ? random(42, 74) : random(108, 180);

    push();
    translate(x, y);
    rotate(rot);

    fillWithAlpha(col, inkAlpha);
    noStroke();
    risoTriangle(0, 0, s, random(0.08, 0.22));

    if (random() < 0.7) {
      strokeWithAlpha("#111111", random(18, 42));
      strokeWeight(random(1, 2.6));
      noFill();
      risoTriangle(random(-3, 3), random(-3, 3), s * random(0.84, 1.08), 0.12);
    }

    pop();
  }

  drawLargeAnchors();
}

function drawLargeAnchors() {
  const anchors = [
    { x: 72, y: 236, s: 188, r: -0.2, c: "#ff3f66", a: 165 },
    { x: 320, y: 80, s: 158, r: 0.86, c: "#00a7a5", a: 150 },
    { x: 568, y: 216, s: 212, r: -0.64, c: "#f7c600", a: 145 },
    { x: 818, y: 100, s: 172, r: 0.18, c: "#263c96", a: 130 },
    { x: 1034, y: 220, s: 188, r: -1.02, c: "#ff3f66", a: 140 },
  ];

  for (const t of anchors) {
    push();
    translate(t.x, t.y);
    rotate(t.r);
    fillWithAlpha(t.c, t.a);
    noStroke();
    risoTriangle(0, 0, t.s, 0.16);
    strokeWithAlpha("#111111", 36);
    strokeWeight(2);
    noFill();
    risoTriangle(4, -3, t.s * 0.96, 0.1);
    pop();
  }
}

function drawHalftone() {
  noStroke();

  for (let x = 18; x < width; x += 16) {
    for (let y = 16; y < height; y += 16) {
      const wave = sin(x * 0.018) + cos(y * 0.035);
      const n = noise(x * 0.012, y * 0.018);
      const radius = map(wave + n, -1, 3, 0.8, 5.8);

      if (n > 0.36) {
        fillWithAlpha("#263c96", map(n, 0.36, 1, 16, 54));
        circle(x + random(-1.4, 1.4), y + random(-1.4, 1.4), radius);
      }
    }
  }
}

function drawRegistrationGhosts() {
  blendMode(MULTIPLY);
  noFill();

  const offsets = [
    { dx: -5, dy: 2, c: "#00a7a5" },
    { dx: 4, dy: -3, c: "#ff3f66" },
    { dx: 2, dy: 4, c: "#f7c600" },
  ];

  for (const o of offsets) {
    push();
    translate(o.dx, o.dy);
    strokeWithAlpha(o.c, 65);
    strokeWeight(5);
    triangle(154, 42, 228, 246, 34, 214);
    triangle(464, 264, 582, 42, 684, 256);
    triangle(918, 38, 1092, 92, 974, 260);
    pop();
  }

  blendMode(BLEND);
}

function drawGrain() {
  grainLayer.clear();
  grainLayer.noStroke();
  grainLayer.blendMode(BLEND);

  for (let i = 0; i < 18000; i++) {
    const x = random(width);
    const y = random(height);
    const dark = random() < 0.52;
    grainLayer.fill(dark ? 25 : 255, dark ? random(14, 36) : random(10, 24));
    grainLayer.rect(x, y, random(0.45, 1.35), random(0.45, 1.35));
  }

  image(grainLayer, 0, 0);
}

function drawDeckleEdges() {
  noFill();
  strokeWeight(12);
  stroke(247, 237, 209, 145);
  rect(0, 0, width, height);

  strokeWeight(1);
  stroke(20, 18, 12, 18);
  rect(0.5, 0.5, width - 1, height - 1);
}

function risoTriangle(x, y, size, wobble) {
  const points = [];
  for (let i = 0; i < 3; i++) {
    const a = -HALF_PI + i * TWO_PI / 3;
    points.push({
      x: x + cos(a) * size * 0.58,
      y: y + sin(a) * size * 0.58,
    });
  }

  beginShape();
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const q = points[(i + 1) % points.length];
    for (let j = 0; j <= 8; j++) {
      const t = j / 8;
      const nx = lerp(p.x, q.x, t) + random(-size * wobble, size * wobble) * 0.08;
      const ny = lerp(p.y, q.y, t) + random(-size * wobble, size * wobble) * 0.08;
      vertex(nx, ny);
    }
  }
  endShape(CLOSE);
}

function fillWithAlpha(hex, alpha) {
  const c = color(hex);
  c.setAlpha(alpha);
  fill(c);
}

function strokeWithAlpha(hex, alpha) {
  const c = color(hex);
  c.setAlpha(alpha);
  stroke(c);
}
