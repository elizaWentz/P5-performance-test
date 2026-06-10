const VIEWER_SCALE = Number(new URLSearchParams(window.location.search).get("scale") || 1);

const W = 1920, H = 1080;
let mx = W / 2, my = H / 2;
let targetMx = W / 2, targetMy = H / 2;

const layers = [
  { scale: 1.00, alpha: 180, col: [80,  30, 140] },
  { scale: 0.90, alpha: 200, col: [60,  20, 160] },
  { scale: 0.80, alpha: 210, col: [30,  80, 180] },
  { scale: 0.72, alpha: 220, col: [20, 160, 180] },
  { scale: 0.64, alpha: 230, col: [60, 200, 160] },
  { scale: 0.57, alpha: 235, col: [200,140,  40] },
  { scale: 0.50, alpha: 240, col: [240,100,  20] },
  { scale: 0.43, alpha: 245, col: [255,160,  30] },
  { scale: 0.36, alpha: 250, col: [255,210,  80] },
  { scale: 0.28, alpha: 255, col: [255,240, 180] },
  { scale: 0.20, alpha: 255, col: [255,255, 230] },
];

// Each layer gets a fixed random home position offset from center
const homeOffsets = [];
for (let i = 0; i < layers.length; i++) {
  homeOffsets.push({
    hx: (Math.random() - 0.5) * 500,
    hy: (Math.random() - 0.5) * 400,
    baseAngle: Math.random() * Math.PI * 2,
  });
}

let offsets = [];
let t = 0;

function triPts(cx, cy, r, angle) {
  let pts = [];
  for (let i = 0; i < 3; i++) {
    let a = angle + (i * TWO_PI / 3) - HALF_PI;
    pts.push({ x: cx + r * cos(a), y: cy + r * sin(a) });
  }
  return pts;
}

function drawAuraTriangle(cx, cy, r, angle, col, alpha, blurSteps) {
  noFill();
  let pts = triPts(cx, cy, r, angle);
  for (let b = blurSteps; b >= 0; b--) {
    let spread = b * 6;
    let a = map(b, blurSteps, 0, 0, alpha);
    stroke(col[0], col[1], col[2], a * 0.9);
    strokeWeight(spread + 2);
    beginShape();
    for (let pt of pts) vertex(pt.x, pt.y);
    endShape(CLOSE);
  }
}

function setup() {
  createCanvas(W, H);
  colorMode(RGB, 255, 255, 255, 255);
  pixelDensity(1);
  
  // Initialize offsets
  for (let i = 0; i < layers.length; i++) {
    offsets.push({
      ox: 0, 
      oy: 0,
      phase: i * 0.4
    });
  }
}

function mouseMoved() {
  targetMx = mouseX;
  targetMy = mouseY;
}

function draw() {
  t += 0.012;

  mx += (targetMx - mx) * 0.06;
  my += (targetMy - my) * 0.06;

  background(55, 20, 110);
  scale(VIEWER_SCALE);

  // Draw background glow
  for (let r = 700; r > 0; r -= 30) {
    let a = map(r, 0, 700, 60, 0);
    noStroke();
    fill(90, 30, 160, a);
    ellipse(W / 2, H / 2, r * 1.6, r * 1.2);
  }

  let baseR = 380;
  let mdx = (mx - W / 2) / W;
  let mdy = (my - H / 2) / H;

  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    let off = offsets[i];
    let home = homeOffsets[i];

    // Mouse pulls each layer differently
    let strength = map(i, 0, layers.length - 1, 60, 10);
    let lag = 0.03 + i * 0.01;

    off.ox += (mdx * strength - off.ox) * lag;
    off.oy += (mdy * strength - off.oy) * lag;

    // Organic drift around its own home position
    let drift = 18 + i * 2;
    let driftX = cos(t * 0.6 + off.phase) * drift;
    let driftY = sin(t * 0.45 + off.phase * 1.3) * drift;

    let cx = W / 2 + home.hx + off.ox + driftX;
    let cy = H / 2 + home.hy + off.oy + driftY;

    let r = baseR * layer.scale;

    // Each triangle rotates independently
    let angle = home.baseAngle + t * (0.1 + i * 0.015) + sin(t * 0.3 + off.phase) * 0.2;
    let blurSteps = map(i, 0, layers.length - 1, 14, 6);

    drawAuraTriangle(cx, cy, r, angle, layer.col, layer.alpha, blurSteps);
  }

  // Add noise/grain effect
  loadPixels();
  for (let i = 0; i < 6000; i++) {
    let x = floor(random(width));
    let y = floor(random(height));
    let idx = 4 * (y * width + x);
    let g = random(60);
    pixels[idx]     = min(255, pixels[idx]     + g);
    pixels[idx + 1] = min(255, pixels[idx + 1] + g);
    pixels[idx + 2] = min(255, pixels[idx + 2] + g);
  }
  updatePixels();
}
