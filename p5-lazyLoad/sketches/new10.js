const CANVAS_W = 1920;
const CANVAS_H = 1080;

const BG_COLS   = 32; const BG_ROWS   = 22;
const MID_COLS  = 22; const MID_ROWS  = 18;
const FORE_COLS = 14; const FORE_ROWS = 12;

const MOUSE_RADIUS  = 200;
const WIND_STRENGTH = 0.13;
const BREATH_SPEED  = 0.010;

let baseTriangles  = [];
let shaftTriangles = [];
let glintTriangles = [];

let colVoid, colSlate, colTeal, colDustTeal, colRose, colMauve, colGold, colPale;

let easedMX, easedMY;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  randomSeed(42);
  noiseSeed(42);

  easedMX = CANVAS_W / 2;
  easedMY = CANVAS_H / 2;

  colVoid     = color(200, 28, 10,  100);
  colSlate    = color(195, 32, 22,  100);
  colTeal     = color(188, 42, 38,  100);
  colDustTeal = color(182, 36, 52,  100);
  colRose     = color(340, 28, 52,  100);
  colMauve    = color(290, 22, 42,  100);
  colGold     = color( 52, 28, 58,  100);
  colPale     = color(185, 18, 72,  100);

  buildBase();
  buildShafts();
  buildGlints();
}

function draw() {
  const t = frameCount * BREATH_SPEED;

  easedMX = lerp(easedMX, mouseX, 0.032);
  easedMY = lerp(easedMY, mouseY, 0.032);

  drawBackdrop(t);

  for (let s of shaftTriangles) s.draw(t);
  for (let g of glintTriangles) g.draw(t);
  for (let b of baseTriangles)  b.draw(t);
}

// ── BACKDROP ─────────────────────────────────────────────────────────────────
function drawBackdrop(t) {
  background(200, 30, 8);

  // Left dark wedge
  fill(hue(colVoid), saturation(colVoid), brightness(colVoid), 95);
  triangle(0, 0, width * 0.42, 0, 0, height);

  // Right dark wedge
  fill(hue(colSlate), saturation(colSlate) + 4, brightness(colSlate), 90);
  triangle(width * 0.58, 0, width, 0, width, height);

  // Central vertical light corridor
  const cLight = lerpColor(colDustTeal, colPale, 0.38 + sin(t * 0.28) * 0.08);
  fill(hue(cLight), saturation(cLight), brightness(cLight), 28);
  triangle(width * 0.30, 0, width * 0.70, 0, width * 0.50, height * 1.1);

  // Inner tighter corridor
  const inner = lerpColor(colPale, colRose, 0.22 + sin(t * 0.18 + 1.2) * 0.06);
  fill(hue(inner), saturation(inner) * 0.7, brightness(inner), 14);
  triangle(width * 0.40, 0, width * 0.60, 0, width * 0.50, height * 1.1);

  // Bottom shadow
  fill(hue(colVoid), saturation(colVoid), brightness(colVoid) - 2, 88);
  triangle(-60, height, width * 0.5, height * 0.55, width + 60, height);

  // Top-right purple tint
  fill(270, 18, 28, 55);
  triangle(width * 0.62, 0, width, 0, width, height * 0.7);
}

// ── BASE TESSELLATION ────────────────────────────────────────────────────────
function buildBase() {
  baseTriangles = [];
  addLayer(BG_COLS,   BG_ROWS,   0);
  addLayer(MID_COLS,  MID_ROWS,  1);
  addLayer(FORE_COLS, FORE_ROWS, 2);
  baseTriangles.sort((a, b) => a.depth - b.depth);
}

function addLayer(cols, rows, depth) {
  const cw = CANVAS_W / cols;
  const ch = CANVAS_H / rows;

  for (let row = -2; row < rows + 2; row++) {
    for (let col = -2; col < cols + 2; col++) {
      const stagger = (row % 2 === 0) ? 0 : cw * 0.5;
      const x = col * cw + stagger;
      const y = row * ch;

      const jitter = depth === 0 ? 0.20 : depth === 1 ? 0.27 : 0.34;
      const lean   = map(noise(col * 0.18 + depth * 5, row * 0.16), 0, 1, -0.28, 0.28);

      const p0 = createVector(
        x + cw * map(noise(col + 1.1, row + depth * 9.3), 0, 1, -jitter, jitter),
        y + ch * map(noise(col + 6.1, row + depth * 7.9), 0, 1, -jitter, jitter)
      );
      const p1 = createVector(
        x + cw * (1 + lean + map(noise(col + 3.7, row + depth * 5.4), 0, 1, -jitter, jitter)),
        y + ch * map(noise(col + 9.2, row + depth * 8.8), 0, 1, -jitter, jitter)
      );
      const p2 = createVector(
        x + cw * (1 + map(noise(col + 2.5, row + depth * 2.7), 0, 1, -jitter, jitter)),
        y + ch * (1 + map(noise(col + 7.3, row + depth * 4.6), 0, 1, -jitter, jitter))
      );
      const p3 = createVector(
        x + cw * (lean * 0.4 + map(noise(col + 8.6, row + depth * 3.5), 0, 1, -jitter, jitter)),
        y + ch * (1 + map(noise(col + 4.1, row + depth * 6.3), 0, 1, -jitter, jitter))
      );

      const center = createVector(
        x + cw * (0.5 + map(noise(col * 0.33 + depth, row * 0.30), 0, 1, -0.16, 0.16)),
        y + ch * (0.5 + map(noise(col * 0.27, row * 0.35 + depth), 0, 1, -0.16, 0.16))
      );

      const sc = map(noise(col * 0.21, row * 0.21, depth), 0, 1, 0.84, 1.16);
      const pairs = [[p0,p1],[p1,p2],[p2,p3],[p3,p0]];

      for (let s = 0; s < 4; s++) {
        baseTriangles.push(new CrystalTriangle(pairs[s][0], pairs[s][1], center, depth, col, row, sc, s));
      }
    }
  }
}

// ── LIGHT SHAFTS ─────────────────────────────────────────────────────────────
function buildShafts() {
  shaftTriangles = [];
  for (let i = 0; i < 22; i++) {
    const topX = width * random(0.22, 0.78);
    const botX = width * 0.5 + random(-220, 220);
    const w    = random(55, 180);
    const sc   = random() < 0.55 ? colDustTeal : (random() < 0.5 ? colRose : colPale);
    shaftTriangles.push(new ShaftTriangle(
      createVector(topX - w, -60),
      createVector(topX + w, -60),
      createVector(botX, height * random(0.5, 1.1)),
      random(4, 14),
      random(TWO_PI),
      sc
    ));
  }
}

// ── GLINTS ───────────────────────────────────────────────────────────────────
function buildGlints() {
  glintTriangles = [];
  for (let i = 0; i < 36; i++) {
    const y    = random(40, height * 0.95);
    const pull = random(-0.4, 0.4) * (1 - y / height);
    const x    = width * (0.5 + pull) + random(-240, 240);
    const gc   = random([colRose, colMauve, colGold, colPale, colDustTeal]);
    glintTriangles.push(new GlintTriangle(
      x, y,
      random(120, 380),
      random(TWO_PI),
      gc,
      random(3, 10),
      random(0.6, 1.9),
      random(TWO_PI)
    ));
  }
}

// ── CRYSTAL TRIANGLE ─────────────────────────────────────────────────────────
class CrystalTriangle {
  constructor(a, b, c, depth, col, row, sc, side) {
    this.a = a.copy();
    this.b = b.copy();
    this.c = c.copy();
    this.depth = depth;
    this.col   = col;
    this.row   = row;
    this.side  = side;
    this.sc    = sc;
    this.cx = (a.x + b.x + c.x) / 3;
    this.cy = (a.y + b.y + c.y) / 3;
    this.phase     = noise(col * 0.30 + side * 2.2, row * 0.26 + depth) * TWO_PI;
    this.swaySeed  = random(1000);
    this.toneSeed  = noise(this.cx * 0.006, this.cy * 0.006, depth * 0.4);
    this.facetSeed = noise(this.cx * 0.022 + depth * 11, this.cy * 0.022);
    this.alpha     = depth === 0 ? 52 : depth === 1 ? 68 : 86;
  }

  draw(t) {
    const vert   = constrain(this.cy / height, 0, 1);
    const corr   = abs(this.cx - width * 0.5) / (width * 0.5);
    const cNoise = noise(this.cx * 0.005, this.cy * 0.006, t * 0.07);
    const fNoise = noise(this.cx * 0.016 + 40, this.cy * 0.016, t * 0.045);

    const d     = dist(easedMX, easedMY, this.cx, this.cy);
    const wind  = smooth01(1 - d / MOUSE_RADIUS);
    const sway  = sin(t + this.phase) * 0.022 + (noise(this.swaySeed, t * 0.13) - 0.5) * 0.038;
    const windA = wind * WIND_STRENGTH * sin(atan2(this.cy - easedMY, this.cx - easedMX) + this.phase);

    const inCorr = smooth01(1 - corr);

    let base = lerpColor(colVoid, colSlate, 0.3 + cNoise * 0.45);
    let mid  = lerpColor(colTeal, colDustTeal, smooth01(fNoise));
    let accent;
    if      (this.toneSeed > 0.62) accent = lerpColor(colRose,     colMauve,    smooth01(this.toneSeed - 0.62) * 2);
    else if (this.toneSeed > 0.38) accent = lerpColor(colDustTeal, colPale,     smooth01((this.toneSeed - 0.38) * 4));
    else                           accent = lerpColor(colMauve,    colGold,     smooth01(this.toneSeed * 2.6));

    let c = lerpColor(base, mid, depth === 0 ? 0.38 : depth === 1 ? 0.52 : 0.66);
    c = lerpColor(c, accent,  smooth01(this.toneSeed - 0.18) * (depth === 0 ? 0.22 : 0.42));
    c = lerpColor(c, colPale, inCorr * 0.18 * (depth + 1) * 0.28);
    c = lerpColor(c, colVoid, smooth01(corr - 0.55) * 0.55);
    c = lerpColor(c, colVoid, smooth01(vert - 0.72) * 0.38);
    c = brightenHSB(c, wind * 5 + sin(t * 0.65 + this.phase) * 1.1);

    const angle   = sway + windA;
    const breathe = 1 + sin(t * 0.75 + this.phase) * 0.016;
    const shift   = wind * (this.depth + 1) * 2.8;
    const ctr     = createVector(this.cx, this.cy);

    const aa = rotScalePt(this.a, ctr, angle, breathe, shift, this.phase);
    const bb = rotScalePt(this.b, ctr, angle, breathe, shift, this.phase);
    const cc = rotScalePt(this.c, ctr, angle, breathe, shift, this.phase);

    fill(hue(c), saturation(c), brightness(c), this.alpha);
    triangle(aa.x, aa.y, bb.x, bb.y, cc.x, cc.y);
    this.drawFacet(aa, bb, cc, c, wind, t);
  }

  drawFacet(a, b, c, col, wind, t) {
    const ctr = createVector((a.x+b.x+c.x)/3, (a.y+b.y+c.y)/3);
    const ins = this.depth === 2 ? 0.22 : 0.30;
    const a1  = toward(a, ctr, ins);
    const b1  = toward(b, ctr, ins);
    const c1  = toward(c, ctr, ins);
    const v   = smooth01(this.facetSeed + sin(t + this.phase) * 0.07);

    if (v > 0.50) {
      const hi = brightenHSB(col, 6 + wind * 4);
      fill(hue(hi), saturation(hi) * 0.88, brightness(hi), 9 + v * 14);
    } else {
      const sh = darkenHSB(col, 7);
      fill(hue(sh), saturation(sh), brightness(sh), 8 + (1 - v) * 11);
    }
    triangle(a1.x, a1.y, b1.x, b1.y, c1.x, c1.y);
  }
}

// ── SHAFT TRIANGLE ───────────────────────────────────────────────────────────
class ShaftTriangle {
  constructor(a, b, c, alpha, phase, col) {
    this.a = a; this.b = b; this.c = c;
    this.alpha = alpha; this.phase = phase; this.col = col;
  }
  draw(t) {
    const shimmer = 0.72 + sin(t * 0.55 + this.phase) * 0.14;
    const c = lerpColor(this.col, colPale, shimmer * 0.35);
    const sway = sin(t * 0.26 + this.phase) * 14;
    fill(hue(c), saturation(c) * 0.75, brightness(c), this.alpha);
    triangle(
      this.a.x + sway,       this.a.y,
      this.b.x + sway * 0.4, this.b.y,
      this.c.x - sway * 0.2, this.c.y
    );
  }
}

// ── GLINT TRIANGLE ───────────────────────────────────────────────────────────
class GlintTriangle {
  constructor(x, y, r, angle, col, alpha, stretch, phase) {
    this.x = x; this.y = y; this.r = r; this.angle = angle;
    this.col = col; this.alpha = alpha; this.stretch = stretch; this.phase = phase;
  }
  draw(t) {
    const dx = sin(t * 0.42 + this.phase) * 7;
    const dy = noise(this.phase, t * 0.07) * 10 - 5;
    const br = 1 + sin(t * 0.52 + this.phase) * 0.03;
    const a  = this.angle + sin(t * 0.22 + this.phase) * 0.035;
    const p1 = polarPt(this.x + dx, this.y + dy, this.r * br, a);
    const p2 = polarPt(this.x + dx, this.y + dy, this.r * this.stretch * br, a + TWO_PI / 3);
    const p3 = polarPt(this.x + dx, this.y + dy, this.r * br, a + TWO_PI * 2 / 3);
    fill(hue(this.col), saturation(this.col), brightness(this.col), this.alpha);
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function rotScalePt(p, ctr, angle, sc, shift, phase) {
  const dx = p.x - ctr.x, dy = p.y - ctr.y;
  const ca = cos(angle), sa = sin(angle);
  return createVector(
    ctr.x + (dx * ca - dy * sa) * sc + cos(phase) * shift,
    ctr.y + (dx * sa + dy * ca) * sc + sin(phase) * shift
  );
}

function polarPt(x, y, r, a) {
  return createVector(x + cos(a) * r, y + sin(a) * r);
}

function toward(p, t, amt) {
  return createVector(lerp(p.x, t.x, amt), lerp(p.y, t.y, amt));
}

function smooth01(v) {
  const x = constrain(v, 0, 1);
  return x * x * (3 - 2 * x);
}

function brightenHSB(c, amt) {
  return color(
    hue(c),
    constrain(saturation(c) - amt * 0.2, 0, 100),
    constrain(brightness(c) + amt, 0, 100),
    alpha(c)
  );
}

function darkenHSB(c, amt) {
  return color(
    hue(c),
    constrain(saturation(c) + amt * 0.14, 0, 100),
    constrain(brightness(c) - amt, 0, 100),
    alpha(c)
  );
}