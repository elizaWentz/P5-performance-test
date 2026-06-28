const W = 1980;
const H = 1080;

const riso = {
  paper: "#f7f0d8",
  blue: "#0078bf",
  pink: "#ff4f99",
  sunflower: "#ffc900",
  green: "#00a95c",
  ink: "#263247",
};

let paperLayer;
let finishGrainLayer;

function setup() {
  createCanvas(W, H);
  pixelDensity(1);
  frameRate(30);
  cursor(CROSS);
  randomSeed(35);
  noiseSeed(35);

  paperLayer = createGraphics(W, H);
  paperLayer.pixelDensity(1);
  makePaperLayer();

  finishGrainLayer = createGraphics(W, H);
  finishGrainLayer.pixelDensity(1);
  makeFinishGrainLayer();
}

function draw() {
  randomSeed(35);
  noiseSeed(35);

  background(riso.paper);
  image(paperLayer, 0, 0);

  blendMode(MULTIPLY);
  drawInkRun(riso.sunflower, 0.82, -4, 3, 0.001);
  drawInkRun(riso.pink, 0.72, 3, -2, -0.0015);
  drawInkRun(riso.blue, 0.67, -2, -4, 0.0018);
  drawLargeTriangleForms();
  drawScreenDots();
  blendMode(BLEND);

  drawRegistrationMarks();
  addFinalGrain();
}

function makePaperLayer() {
  paperLayer.noStroke();

  for (let i = 0; i < 22000; i++) {
    const x = random(W);
    const y = random(H);
    const warm = random() < 0.7;
    paperLayer.fill(warm ? 95 : 255, warm ? 78 : 250, warm ? 48 : 221, random(5, 21));
    paperLayer.rect(x, y, random(0.35, 1.8), random(0.35, 1.8));
  }

  paperLayer.stroke(255, 255, 238, 20);
  for (let y = 1; y < H; y += 4) {
    paperLayer.line(0, y + random(-0.8, 0.8), W, y + random(-0.8, 0.8));
  }
}

function makeFinishGrainLayer() {
  finishGrainLayer.clear();
  finishGrainLayer.noStroke();

  randomSeed(735);
  for (let i = 0; i < 42000; i++) {
    const shade = random() < 0.58 ? 40 : 255;
    finishGrainLayer.fill(shade, shade, shade, random(5, 21));
    finishGrainLayer.rect(random(W), random(H), random(0.5, 1.7), random(0.5, 1.7));
  }
}

function drawInkRun(hex, alpha, shiftX, shiftY, twist) {
  push();
  translate(W / 2 + shiftX, H / 2 + shiftY);
  rotate(twist);
  translate(-W / 2, -H / 2);

  const spacing = 74;
  for (let y = -spacing; y < H + spacing; y += spacing * 0.86) {
    const row = floor(y / spacing);
    for (let x = -spacing; x < W + spacing; x += spacing * 1.18) {
      const n = noise(x * 0.009, y * 0.018);
      if (n < 0.33) {
        continue;
      }

      const size = spacing * map(n, 0.33, 1, 0.58, 1.45);
      const flip = (row + floor(x / spacing)) % 2 === 0;
      const wobbleX = random(-9, 9);
      const wobbleY = random(-8, 8);
      risoTriangle(hex, alpha * random(0.68, 1), x + wobbleX, y + wobbleY, size, flip);
    }
  }

  pop();
}

function drawLargeTriangleForms() {
  const largeTriangleScale = 1.55;
  const sourceCenter = { x: 563, y: 154 };
  const targetCenter = { x: W / 2, y: H / 2 };

  centeredSoftTriangle(riso.blue, 0.38, -64, 282, 188, 28, 404, 272, 2, -2, sourceCenter, targetCenter, largeTriangleScale);
  centeredSoftTriangle(riso.pink, 0.42, 220, 38, 438, 280, 604, 62, -3, 2, sourceCenter, targetCenter, largeTriangleScale);
  centeredSoftTriangle(riso.sunflower, 0.52, 516, 266, 706, 32, 900, 270, 3, 1, sourceCenter, targetCenter, largeTriangleScale);
  centeredSoftTriangle(riso.green, 0.35, 820, 48, 1032, 278, 1190, 68, -2, -1, sourceCenter, targetCenter, largeTriangleScale);

  noFill();
  strokeWeight(2);
  stroke(withAlpha(riso.ink, 0.28));
  for (let x = 50; x < W; x += 118) {
    const y = 158 + sin(x * 0.022) * 26;
    const s = 42 + noise(x * 0.02) * 60;
    const hover = hoverInfluence(x, y, 150);
    const drift = hoverDrift(x, y, hover * 28);
    push();
    translate(x + drift.x, y + drift.y);
    rotate(hover * -0.3);
    scale(1 + hover * 0.24);
    triangle(0, -s * 0.78, s * 0.74, s * 0.48, -s * 0.72, s * 0.44);
    pop();
  }
}

function centeredSoftTriangle(hex, alpha, x1, y1, x2, y2, x3, y3, ox, oy, sourceCenter, targetCenter, scaleAmount) {
  const p1 = scaleAroundCenter(x1, y1, sourceCenter, targetCenter, scaleAmount);
  const p2 = scaleAroundCenter(x2, y2, sourceCenter, targetCenter, scaleAmount);
  const p3 = scaleAroundCenter(x3, y3, sourceCenter, targetCenter, scaleAmount);

  softTriangle(hex, alpha, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, ox, oy);
}

function scaleAroundCenter(x, y, sourceCenter, targetCenter, scaleAmount) {
  return {
    x: targetCenter.x + (x - sourceCenter.x) * scaleAmount,
    y: targetCenter.y + (y - sourceCenter.y) * scaleAmount,
  };
}

function drawScreenDots() {
  noStroke();

  for (let x = 10; x < W; x += 13) {
    for (let y = 8; y < H; y += 13) {
      const n = noise(x * 0.028, y * 0.031);
      if (n > 0.45 && random() > 0.18) {
        fill(withAlpha(riso.ink, map(n, 0.45, 1, 0.02, 0.13)));
        circle(x + random(-1.4, 1.4), y + random(-1.4, 1.4), random(1.1, 3.8));
      }
    }
  }
}

function risoTriangle(hex, alpha, x, y, size, flip) {
  const h = size * 0.88;
  const c = color(hex);
  c.setAlpha(255 * alpha);
  const hover = hoverInfluence(x, y, 118);
  const drift = hoverDrift(x, y, hover * 18);

  push();
  translate(x + drift.x, y + drift.y);
  rotate(hover * 0.22 * (flip ? -1 : 1));
  scale(1 + hover * 0.32);
  noStroke();
  fill(c);
  if (flip) {
    triangle(0, -h * 0.55, size * 0.5, h * 0.45, -size * 0.5, h * 0.45);
  } else {
    triangle(0, h * 0.55, size * 0.5, -h * 0.45, -size * 0.5, -h * 0.45);
  }

  fill(red(c), green(c), blue(c), 34 + hover * 42);
  for (let i = 0; i < 20; i++) {
    circle(random(-size * 0.38, size * 0.38), random(-h * 0.34, h * 0.34), random(1.1, 4.2 + hover * 3));
  }
  pop();
}

function softTriangle(hex, alpha, x1, y1, x2, y2, x3, y3, ox, oy) {
  const c = color(hex);
  c.setAlpha(255 * alpha);
  const cx = (x1 + x2 + x3) / 3;
  const cy = (y1 + y2 + y3) / 3;
  const hover = hoverInfluence(cx, cy, 210);
  const drift = hoverDrift(cx, cy, hover * 24);

  push();
  translate(cx + ox + drift.x, cy + oy + drift.y);
  rotate(hover * 0.08 * (x2 < W / 2 ? 1 : -1));
  scale(1 + hover * 0.08);
  translate(-cx, -cy);
  fill(c);
  noStroke();
  triangle(x1, y1, x2, y2, x3, y3);

  fill(red(c), green(c), blue(c), 28 + hover * 22);
  for (let i = 0; i < 680; i++) {
    const p = randomPointInTriangle(x1, y1, x2, y2, x3, y3);
    rect(p.x + random(-2, 2), p.y + random(-2, 2), random(0.8, 3.5 + hover * 2), random(0.8, 3.5 + hover * 2));
  }
  pop();
}

function randomPointInTriangle(x1, y1, x2, y2, x3, y3) {
  let a = random();
  let b = random();
  if (a + b > 1) {
    a = 1 - a;
    b = 1 - b;
  }

  return {
    x: x1 + a * (x2 - x1) + b * (x3 - x1),
    y: y1 + a * (y2 - y1) + b * (y3 - y1),
  };
}

function drawRegistrationMarks() {
  blendMode(MULTIPLY);
  noFill();
  strokeWeight(1.2);

  stroke(withAlpha(riso.blue, 0.68));
  line(34, 28, 58, 28);
  line(46, 16, 46, 40);
  triangle(82, 17, 95, 40, 69, 40);

  stroke(withAlpha(riso.pink, 0.64));
  line(1070, 278, 1094, 278);
  line(1082, 266, 1082, 290);

  stroke(withAlpha(riso.sunflower, 0.75));
  rect(1016, 24, 22, 22);
  blendMode(BLEND);
}

function withAlpha(hex, alpha) {
  const c = color(hex);
  c.setAlpha(255 * alpha);
  return c;
}

function addFinalGrain() {
  image(finishGrainLayer, 0, 0);
}

function hoverInfluence(x, y, radius) {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return 0;
  }

  const d = dist(mouseX, mouseY, x, y);
  if (d > radius) {
    return 0;
  }

  return pow(1 - d / radius, 1.8);
}

function hoverDrift(x, y, amount) {
  if (amount === 0) {
    return { x: 0, y: 0 };
  }

  const a = atan2(y - mouseY, x - mouseX);
  const pulse = 0.75 + sin(frameCount * 0.11 + x * 0.01) * 0.25;
  return {
    x: cos(a) * amount * pulse,
    y: sin(a) * amount * pulse,
  };
}
