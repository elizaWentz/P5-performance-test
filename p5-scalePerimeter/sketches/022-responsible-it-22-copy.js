const CANVAS_W = 1128;
const CANVAS_H = 308;
const TILE = 42;
const ROW_H = 36;
const SHIMMER_RADIUS = 240;

let palette;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  pixelDensity(1);
  colorMode(RGB, 255, 255, 255, 255);
  noStroke();

  palette = [
    color(250, 86, 45),
    color(255, 188, 42),
    color(34, 156, 218),
    color(9, 39, 104),
    color(248, 250, 235)
  ];
}

function draw() {
  drawSkywash();
  drawTriangleField();
  drawPrismRibbon();
  drawTinySparks();
}

function drawSkywash() {
  background(8, 18, 48);

  for (let y = 0; y < height; y++) {
    let t = y / height;
    let midGlow = pow(1 - abs(t - 0.5) * 2, 1.6);
    let r = lerp(8, 26, midGlow);
    let g = lerp(18, 70, midGlow);
    let b = lerp(48, 128, midGlow);

    stroke(r, g, b, 255);
    line(0, y, width, y);
  }

  noStroke();
  fill(255, 211, 91, 18);
  ellipse(width * 0.62, height * 0.46, 620, 170);
  fill(28, 178, 218, 18);
  ellipse(width * 0.28, height * 0.58, 520, 130);
}

function drawTriangleField() {
  for (let row = -2; row < height / ROW_H + 3; row++) {
    let y = row * ROW_H;
    let rowShift = (row % 2) * TILE * 0.5;

    for (let col = -2; col < width / TILE + 3; col++) {
      let x = col * TILE + rowShift;
      drawCrystalCell(x, y, col, row);
    }
  }
}

function drawCrystalCell(x, y, col, row) {
  let cx = x + TILE * 0.5;
  let cy = y + ROW_H * 0.5;
  let shimmer = shimmerAt(cx, cy);
  let wave = sin(col * 0.73 + row * 1.21 + frameCount * 0.012);
  let lean = sin(row * 0.85) * 5 + shimmer.x * 0.45;
  let lift = wave * 5 + shimmer.y * 0.4;
  let size = TILE + wave * 4 + shimmer.force * 12;
  let tone = abs(col * 2 + row * 3) % palette.length;
  let sideTone = abs(col - row * 2 + 7) % palette.length;
  let bright = color(255, 246, 197, 230);
  let c1 = lerpColor(palette[tone], bright, shimmer.force * 0.7);
  let c2 = lerpColor(palette[sideTone], color(255, 111, 68, 220), shimmer.force * 0.55);
  let flip = (col + row) % 2 === 0;

  fill(red(c1), green(c1), blue(c1), 178);
  if (flip) {
    triangle(
      x + lean,
      y + lift,
      x + size + lean,
      y + ROW_H * 0.1 - lift * 0.25,
      x + TILE * 0.48 - lean * 0.35,
      y + ROW_H + lift
    );
  } else {
    triangle(
      x + size + lean,
      y + ROW_H + lift,
      x + lean,
      y + ROW_H * 0.9 - lift * 0.25,
      x + TILE * 0.52 - lean * 0.35,
      y + lift
    );
  }

  fill(red(c2), green(c2), blue(c2), 128);
  let pinch = 0.28 + shimmer.force * 0.16;
  if ((col + row) % 3 === 0) {
    triangle(
      cx + lean,
      cy - ROW_H * pinch,
      cx + TILE * 0.54 + lean * 0.2,
      cy,
      cx + lean,
      cy + ROW_H * pinch
    );
  } else {
    triangle(
      cx + lean,
      cy - ROW_H * pinch,
      cx - TILE * 0.54 + lean * 0.2,
      cy,
      cx + lean,
      cy + ROW_H * pinch
    );
  }
}

function drawPrismRibbon() {
  for (let x = -TILE; x < width + TILE; x += TILE * 1.5) {
    let drift = sin(x * 0.015 + frameCount * 0.01);
    let y = height * 0.5 + drift * 42;
    let s = 44 + sin(x * 0.031) * 14;
    let shimmer = shimmerAt(x, y);

    fill(255, 241, 202, 72 + shimmer.force * 92);
    triangle(x, y - s * 0.9, x - s * 0.68, y + s * 0.42, x + s * 0.18, y + s * 0.7);

    fill(34, 167, 218, 74 + shimmer.force * 80);
    triangle(x + s * 0.24, y - s * 0.55, x + s * 0.92, y + s * 0.52, x - s * 0.18, y + s * 0.38);

    fill(255, 94, 54, 62 + shimmer.force * 70);
    triangle(x - s * 0.12, y + s * 0.88, x - s * 0.76, y - s * 0.18, x + s * 0.62, y - s * 0.06);
  }
}

function drawTinySparks() {
  for (let i = 0; i < 56; i++) {
    let x = (i * 83 + sin(i * 9.7) * 31) % width;
    let y = height * 0.5 + sin(i * 1.8) * 128;
    let blink = 0.5 + 0.5 * sin(frameCount * 0.025 + i);
    let s = 6 + blink * 7;

    fill(255, 247, 206, 62 + blink * 80);
    triangle(x, y - s, x - s * 0.65, y + s * 0.48, x + s * 0.65, y + s * 0.48);
  }
}

function shimmerAt(x, y) {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return { x: 0, y: 0, force: 0 };
  }

  let dx = x - mouseX;
  let dy = y - mouseY;
  let d = sqrt(dx * dx + dy * dy);
  let t = constrain(d / SHIMMER_RADIUS, 0, 1);
  let force = pow(1 - t, 2);
  let ripple = sin(d * 0.08 - frameCount * 0.08) * force;

  return {
    x: dx / max(d, 1) * ripple * 22,
    y: dy / max(d, 1) * ripple * 12,
    force: force
  };
}
