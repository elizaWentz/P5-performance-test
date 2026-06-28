let blobs = [];
let palette = [];
let hoverX;
let hoverY;
let hoverStrength = 0;
let pointerActive = false;

function setup() {
  createCanvas(960, 540);
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
  drawGlowRidges();
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
        let dx = sx - b.x;
        let dy = sy - b.y;
        let d2 = dx * dx + dy * dy + 120;
        energy += (b.size * b.size) / d2;
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

function drawGlowRidges() {
  noFill();

  for (let i = 0; i < 5; i++) {
    let wobble = sin(frameCount * 0.025 + i) * 22;
    stroke(255, 235, 170, 28 - i * 4);
    strokeWeight(1.5);
    beginShape();
    for (let x = -20; x <= width + 20; x += 28) {
      let y = height * 0.5 + sin(x * 0.012 + frameCount * 0.028 + i) * 42 + wobble;
      let d = dist(x, y, hoverX, hoverY);
      let push = max(0, 1 - d / 210) * hoverStrength * 80;
      vertex(x, y + push);
    }
    endShape();
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
