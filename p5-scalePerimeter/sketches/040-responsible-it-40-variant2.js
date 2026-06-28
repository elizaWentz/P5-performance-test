const W = 960;
const H = 540;

const palette = {
  paper: "#f5eecf",
  teal: "#008b8f",
  coral: "#ff5a3c",
  violet: "#5943a8",
  yellow: "#f6c945",
  ink: "#17324d",
};

let grainLayer;

function setup() {
  createCanvas(W, H);
  pixelDensity(1);
  noLoop();
  randomSeed(34);
  noiseSeed(34);

  grainLayer = createGraphics(W, H);
  grainLayer.pixelDensity(1);
  buildPaperGrain();
}

function draw() {
  background(palette.paper);
  image(grainLayer, 0, 0);

  drawRisoField();
  drawTriangleStack();
  drawTinyRegistrationMarks();
  addInkGrain();
}

function buildPaperGrain() {
  grainLayer.clear();
  grainLayer.noStroke();

  for (let i = 0; i < 18000; i++) {
    const x = random(W);
    const y = random(H);
    const a = random(8, 28);
    grainLayer.fill(54, 45, 35, a);
    grainLayer.rect(x, y, random(0.4, 1.6), random(0.4, 1.6));
  }

  for (let y = 0; y < H; y += 3) {
    grainLayer.stroke(255, 252, 221, 13);
    grainLayer.line(0, y + random(-0.6, 0.6), W, y + random(-0.6, 0.6));
  }
}

function drawRisoField() {
  noStroke();

  const sourceCenter = { x: 566, y: 157 };
  const targetCenter = { x: W / 2, y: H / 2 };

  centeredRisoTriangle(palette.teal, 0.88, -52, 34, 210, 270, 462, 42, 2, -1, sourceCenter, targetCenter);
  centeredRisoTriangle(palette.coral, 0.82, 112, 274, 340, 40, 504, 280, -2, 2, sourceCenter, targetCenter);
  centeredRisoTriangle(palette.yellow, 0.78, 408, 254, 620, 48, 778, 268, 3, 0, sourceCenter, targetCenter);
  centeredRisoTriangle(palette.violet, 0.76, 690, 46, 842, 272, 1010, 54, -3, 2, sourceCenter, targetCenter);
  centeredRisoTriangle(palette.teal, 0.72, 854, 280, 1038, 44, 1184, 250, 2, -2, sourceCenter, targetCenter);

  for (let x = -80; x < W + 120; x += 112) {
    const y = H - 22 + sin(x * 0.018) * 12;
    risoTriangle(palette.coral, 0.22, x, y, x + 78, y - 78, x + 158, y, 1, 1);
  }
}

function centeredRisoTriangle(hex, alpha, x1, y1, x2, y2, x3, y3, ox, oy, sourceCenter, targetCenter) {
  const p1 = centerPoint(x1, y1, sourceCenter, targetCenter);
  const p2 = centerPoint(x2, y2, sourceCenter, targetCenter);
  const p3 = centerPoint(x3, y3, sourceCenter, targetCenter);

  risoTriangle(hex, alpha, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, ox, oy);
}

function centerPoint(x, y, sourceCenter, targetCenter) {
  return {
    x: targetCenter.x + x - sourceCenter.x,
    y: targetCenter.y + y - sourceCenter.y,
  };
}

function drawTriangleStack() {
  const rows = [
    { y: 58, s: 42, c: palette.ink, a: 0.23 },
    { y: 104, s: 58, c: palette.teal, a: 0.32 },
    { y: 164, s: 74, c: palette.coral, a: 0.28 },
    { y: 230, s: 54, c: palette.violet, a: 0.25 },
  ];

  for (const row of rows) {
    for (let x = 36; x < W; x += row.s * 1.48) {
      const jitter = noise(x * 0.01, row.y * 0.02) * 18 - 9;
      const flip = floor((x + row.y) / row.s) % 2 === 0;
      risoSmallTriangle(row.c, row.a, x + jitter, row.y, row.s, flip);
    }
  }

  blendMode(MULTIPLY);
  stroke(ink(palette.ink, 0.26));
  strokeWeight(1.1);
  noFill();
  for (let x = 18; x < W; x += 64) {
    const h = random(28, 96);
    triangle(x, 154 - h * 0.5, x + h * 0.64, 154 + h * 0.5, x - h * 0.64, 154 + h * 0.5);
  }
  blendMode(BLEND);
}

function risoTriangle(hex, alpha, x1, y1, x2, y2, x3, y3, ox, oy) {
  const c = color(hex);
  c.setAlpha(255 * alpha);

  blendMode(MULTIPLY);
  fill(c);
  noStroke();
  triangle(x1 + ox, y1 + oy, x2 + ox, y2 + oy, x3 + ox, y3 + oy);

  for (let i = 0; i < 520; i++) {
    const a = random();
    const b = random();
    if (a + b > 1) {
      continue;
    }
    const px = lerp(lerp(x1, x2, a), lerp(x1, x3, a), b) + ox + random(-1.8, 1.8);
    const py = lerp(lerp(y1, y2, a), lerp(y1, y3, a), b) + oy + random(-1.8, 1.8);
    fill(red(c), green(c), blue(c), random(18, 54));
    rect(px, py, random(1, 3.8), random(1, 3.8));
  }
  blendMode(BLEND);
}

function risoSmallTriangle(hex, alpha, x, y, s, flip) {
  const h = s * 0.86;
  const c = color(hex);
  c.setAlpha(255 * alpha);

  blendMode(MULTIPLY);
  fill(c);
  noStroke();

  if (flip) {
    triangle(x, y - h * 0.52, x + s * 0.5, y + h * 0.48, x - s * 0.5, y + h * 0.48);
  } else {
    triangle(x, y + h * 0.52, x + s * 0.5, y - h * 0.48, x - s * 0.5, y - h * 0.48);
  }

  fill(255, 246, 203, 30);
  for (let i = 0; i < 18; i++) {
    circle(x + random(-s * 0.35, s * 0.35), y + random(-h * 0.3, h * 0.3), random(1.2, 3.4));
  }
  blendMode(BLEND);
}

function drawTinyRegistrationMarks() {
  blendMode(MULTIPLY);
  noFill();
  strokeWeight(1);
  stroke(ink(palette.teal, 0.6));
  line(30, 28, 50, 28);
  line(40, 18, 40, 38);
  stroke(ink(palette.coral, 0.6));
  line(1078, 280, 1098, 280);
  line(1088, 270, 1088, 290);
  stroke(ink(palette.violet, 0.5));
  rect(64, 252, 18, 18);
  triangle(1022, 30, 1040, 60, 1004, 60);
  blendMode(BLEND);
}

function ink(hex, alpha) {
  const c = color(hex);
  c.setAlpha(255 * alpha);
  return c;
}

function addInkGrain() {
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    const n = random(-12, 12);
    pixels[i] = constrain(pixels[i] + n, 0, 255);
    pixels[i + 1] = constrain(pixels[i + 1] + n, 0, 255);
    pixels[i + 2] = constrain(pixels[i + 2] + n, 0, 255);
  }
  updatePixels();
}
