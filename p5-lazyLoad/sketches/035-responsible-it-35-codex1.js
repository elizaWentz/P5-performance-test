const W = 1128;
const H = 308;

const riso = {
  paper: "#f7f0d8",
  blue: "#0078bf",
  pink: "#ff4f99",
  sunflower: "#ffc900",
  green: "#00a95c",
  ink: "#263247",
};

let paperLayer;

function setup() {
  createCanvas(W, H);
  pixelDensity(1);
  noLoop();
  randomSeed(35);
  noiseSeed(35);

  paperLayer = createGraphics(W, H);
  paperLayer.pixelDensity(1);
  makePaperLayer();
}

function draw() {
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
  softTriangle(riso.blue, 0.38, -64, 282, 188, 28, 404, 272, 2, -2);
  softTriangle(riso.pink, 0.42, 220, 38, 438, 280, 604, 62, -3, 2);
  softTriangle(riso.sunflower, 0.52, 516, 266, 706, 32, 900, 270, 3, 1);
  softTriangle(riso.green, 0.35, 820, 48, 1032, 278, 1190, 68, -2, -1);

  noFill();
  strokeWeight(2);
  stroke(withAlpha(riso.ink, 0.28));
  for (let x = 50; x < W; x += 118) {
    const y = 158 + sin(x * 0.022) * 26;
    const s = 42 + noise(x * 0.02) * 60;
    triangle(x, y - s * 0.78, x + s * 0.74, y + s * 0.48, x - s * 0.72, y + s * 0.44);
  }
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

  noStroke();
  fill(c);
  if (flip) {
    triangle(x, y - h * 0.55, x + size * 0.5, y + h * 0.45, x - size * 0.5, y + h * 0.45);
  } else {
    triangle(x, y + h * 0.55, x + size * 0.5, y - h * 0.45, x - size * 0.5, y - h * 0.45);
  }

  fill(red(c), green(c), blue(c), 34);
  for (let i = 0; i < 20; i++) {
    circle(x + random(-size * 0.38, size * 0.38), y + random(-h * 0.34, h * 0.34), random(1.1, 4.2));
  }
}

function softTriangle(hex, alpha, x1, y1, x2, y2, x3, y3, ox, oy) {
  const c = color(hex);
  c.setAlpha(255 * alpha);
  fill(c);
  noStroke();
  triangle(x1 + ox, y1 + oy, x2 + ox, y2 + oy, x3 + ox, y3 + oy);

  fill(red(c), green(c), blue(c), 28);
  for (let i = 0; i < 680; i++) {
    const p = randomPointInTriangle(x1, y1, x2, y2, x3, y3);
    rect(p.x + ox + random(-2, 2), p.y + oy + random(-2, 2), random(0.8, 3.5), random(0.8, 3.5));
  }
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
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    const grain = random(-15, 11);
    pixels[i] = constrain(pixels[i] + grain, 0, 255);
    pixels[i + 1] = constrain(pixels[i + 1] + grain, 0, 255);
    pixels[i + 2] = constrain(pixels[i + 2] + grain, 0, 255);
  }
  updatePixels();
}
