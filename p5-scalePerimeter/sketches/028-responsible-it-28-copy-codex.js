let blobs = [];
let palette = [];
let hoverX;
let hoverY;
let hoverStrength = 0;
let pointerActive = false;

function setup() {
  createCanvas(1128, 308);
  pixelDensity(1);

  palette = [
    color(8, 18, 30),
    color(0, 95, 110),
    color(0, 190, 170),
    color(210, 255, 92),
    color(255, 95, 135),
    color(255, 235, 170)
  ];

  hoverX = width * 0.5;
  hoverY = height * 0.5;

  for (let i = 0; i < 8; i++) {
    blobs.push({
      homeX: random(width),
      homeY: random(height),
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      size: random(80, 160),
      phase: random(TWO_PI),
      drift: random(0.006, 0.016)
    });
  }
}

function draw() {
  background(8, 18, 30);

  hoverX = lerp(hoverX, mouseX, 0.18);
  hoverY = lerp(hoverY, mouseY, 0.18);
  let mouseInside = pointerActive && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  hoverStrength = lerp(hoverStrength, mouseInside ? 1 : 0, 0.08);

  moveBlobs();
  drawPixelLava();
  drawBackgroundTriangles();
}

function moveBlobs() {
  for (let b of blobs) {
    let t = frameCount * b.drift + b.phase;
    let targetX = b.homeX + sin(t * 1.7) * 85 + sin(t * 0.6) * 45;
    let targetY = b.homeY + cos(t * 1.3) * 38 + sin(t * 0.9) * 24;

    b.vx += (targetX - b.x) * 0.004;
    b.vy += (targetY - b.y) * 0.004;

    let dx = b.x - hoverX;
    let dy = b.y - hoverY;
    let d = max(18, sqrt(dx * dx + dy * dy));
    let push = max(0, 1 - d / 230) * hoverStrength;
    let wobble = sin(frameCount * 0.08 + b.phase) * 0.45;

    b.vx += (dx / d) * push * (4.5 + wobble);
    b.vy += (dy / d) * push * (3.4 - wobble);
    b.vx *= 0.88;
    b.vy *= 0.88;

    b.x += b.vx;
    b.y += b.vy;
    b.x = constrain(b.x, -120, width + 120);
    b.y = constrain(b.y, -120, height + 120);
  }
}

function drawPixelLava() {
  let pxSize = 4;
  let cols = width / pxSize;
  let rows = height / pxSize;

  noStroke();

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let sx = x * pxSize;
      let sy = y * pxSize;
      let energy = 0;

      for (let b of blobs) {
        energy += triangleBlobEnergy(sx, sy, b);
      }

      let md = dist(sx, sy, hoverX, hoverY);
      let mouseDent = max(0, 1 - md / 190) * hoverStrength;
      energy -= mouseDent * 3.2;

      let ripple = sin(sx * 0.034 + frameCount * 0.035) * cos(sy * 0.052 - frameCount * 0.028);
      let verticalMelt = sin((sy + energy * 18) * 0.045 + frameCount * 0.03);
      let value = energy * 0.24 + ripple * 0.28 + verticalMelt * 0.16;
      value = smoothstep(0.35, 2.45, value);

      let banded = floor(value * 9) / 9;
      let colorPosition = constrain(banded * (palette.length - 1), 0, palette.length - 1.001);
      let index = floor(colorPosition);
      let amt = smoothstep(0.12, 0.92, fract(colorPosition));

      fill(lerpColor(palette[index], palette[index + 1], amt));
      rect(sx, sy, pxSize, pxSize);
    }
  }
}

function triangleBlobEnergy(px, py, b) {
  let angle = frameCount * b.drift * 0.7 + b.phase;
  let radius = b.size * 0.72;
  let x1 = b.x + cos(angle - HALF_PI) * radius;
  let y1 = b.y + sin(angle - HALF_PI) * radius;
  let x2 = b.x + cos(angle + TWO_PI / 3 - HALF_PI) * radius;
  let y2 = b.y + sin(angle + TWO_PI / 3 - HALF_PI) * radius;
  let x3 = b.x + cos(angle + TWO_PI * 2 / 3 - HALF_PI) * radius;
  let y3 = b.y + sin(angle + TWO_PI * 2 / 3 - HALF_PI) * radius;

  let edgeDistance = signedTriangleDistance(px, py, x1, y1, x2, y2, x3, y3);
  let cornerGlow =
    0.24 / (dist(px, py, x1, y1) / b.size + 0.18) +
    0.24 / (dist(px, py, x2, y2) / b.size + 0.18) +
    0.24 / (dist(px, py, x3, y3) / b.size + 0.18);

  return smoothstep(70, -18, edgeDistance) * 2.9 + cornerGlow;
}

function signedTriangleDistance(px, py, ax, ay, bx, by, cx, cy) {
  let d1 = segmentDistance(px, py, ax, ay, bx, by);
  let d2 = segmentDistance(px, py, bx, by, cx, cy);
  let d3 = segmentDistance(px, py, cx, cy, ax, ay);
  let outsideDistance = min(d1, min(d2, d3));
  let inside = pointInTriangle(px, py, ax, ay, bx, by, cx, cy);

  return inside ? -outsideDistance : outsideDistance;
}

function segmentDistance(px, py, ax, ay, bx, by) {
  let vx = bx - ax;
  let vy = by - ay;
  let wx = px - ax;
  let wy = py - ay;
  let c = constrain((wx * vx + wy * vy) / (vx * vx + vy * vy), 0, 1);
  let dx = px - (ax + vx * c);
  let dy = py - (ay + vy * c);

  return sqrt(dx * dx + dy * dy);
}

function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
  let d1 = sign(px, py, ax, ay, bx, by);
  let d2 = sign(px, py, bx, by, cx, cy);
  let d3 = sign(px, py, cx, cy, ax, ay);
  let hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
  let hasPositive = d1 > 0 || d2 > 0 || d3 > 0;

  return !(hasNegative && hasPositive);
}

function sign(px, py, ax, ay, bx, by) {
  return (px - bx) * (ay - by) - (ax - bx) * (py - by);
}

function drawBackgroundTriangles() {
  let step = 130;
  let triHeight = 96;

  noFill();
  strokeWeight(1);

  for (let x = -step; x < width + step; x += step) {
    for (let y = -triHeight; y < height + triHeight; y += triHeight) {
      let offset = (floor(y / triHeight) % 2) * step * 0.5;
      let cx = x + offset;
      let cy = y + sin(frameCount * 0.006 + x * 0.01 + y * 0.02) * 2;
      let flip = (floor(x / step) + floor(y / triHeight)) % 2 === 0 ? 1 : -1;
      let alpha = 18 + noise(x * 0.01, y * 0.01, frameCount * 0.004) * 12;

      stroke(255, 235, 170, alpha);
      triangle(
        cx,
        cy - flip * 34,
        cx - 46,
        cy + flip * 34,
        cx + 46,
        cy + flip * 34
      );
    }
  }
}

function smoothstep(edge0, edge1, x) {
  x = constrain((x - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function mouseMoved() {
  pointerActive = true;
}

function mouseDragged() {
  pointerActive = true;
}
