// RISO-inspired interactive triangle print
// Hover to highlight triangles

let grainLayer;

let risoPink, risoYellow, risoTeal, risoBlue, paperColor;

let triangles = [];
let misTriangles = [];

function setup() {
  createCanvas(1920, 1080);
  colorMode(HSB, 360, 100, 100, 100);

  // Off-white paper
  paperColor = color(45, 10, 98);

  // RISO-like inks
  risoPink   = color(330, 90, 95, 92);  // fluorescent pink
  risoYellow = color(55, 95, 100, 92); // bright yellow
  risoTeal   = color(182, 70, 70, 92); // teal / blue-green
  risoBlue   = color(220, 80, 70, 92); // deep blue

  // Pre-generate a grain texture
  grainLayer = createGraphics(width, height);
  grainLayer.colorMode(HSB, 360, 100, 100, 100);
  grainLayer.clear();
  grainLayer.noStroke();

  for (let i = 0; i < 80000; i++) {
    let x = random(width);
    let y = random(height);
    let alpha = random(3, 12);
    let c = color(40 + random(-10, 10), 10, 95, alpha); // warm-ish light ink specks
    grainLayer.fill(c);
    grainLayer.circle(x, y, random(0.6, 1.4));
  }

  // Pre-generate triangles so they don't flicker
  createTriangleLayout();
}

function draw() {
  background(paperColor);

  let anyHover = false;

  blendMode(MULTIPLY);

  // Main filled triangles
  for (let tri of triangles) {
    let hovered = isMouseOverTriangle(tri);
    if (hovered) anyHover = true;
    risoTriangle(tri, hovered);
  }

  // Misregistered outline triangles
  for (let tri of misTriangles) {
    let hovered = isMouseOverTriangle(tri);
    if (hovered) anyHover = true;
    drawMisTriangle(tri, hovered);
  }

  blendMode(BLEND);
  image(grainLayer, 0, 0);

  // Change cursor if hovering any triangle
  if (anyHover) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

// ------------------------------------------------------------
// Layout & data
// ------------------------------------------------------------

function createTriangleLayout() {
  triangles = [];
  misTriangles = [];

  // Large pink & yellow background triangles
  addTriangleLayer(risoPink, 3, 260, 6);
  addTriangleLayer(risoYellow, 3, 260, 6);

  // Teal medium triangles
  addTriangleLayer(risoTeal, 4, 180, 6);

  // Blue smaller accents
  addTriangleLayer(risoBlue, 5, 130, 6);

  // Misregistered outline triangles
  let inks = [risoPink, risoYellow, risoTeal];
  for (let i = 0; i < 7; i++) {
    misTriangles.push({
      cx: random(width * -0.1, width * 1.1),
      cy: random(height * -0.1, height * 1.1),
      size: random(80, 220),
      angle: random(TWO_PI),
      offsetX: random(-10, 10),
      offsetY: random(-10, 10),
      inkColor: random(inks),
      seed: floor(random(1e9))
    });
  }
}

function addTriangleLayer(inkColor, count, baseSize, jitter) {
  for (let i = 0; i < count; i++) {
    triangles.push({
      cx: random(-100, width + 100),
      cy: random(-100, height + 100),
      size: baseSize * random(0.7, 1.4),
      angle: random(TWO_PI),
      offsetX: random(-jitter, jitter),
      offsetY: random(-jitter, jitter),
      inkColor: inkColor,
      seed: floor(random(1e9))
    });
  }
}

// ------------------------------------------------------------
// Geometry helpers (deterministic via per-triangle seeds)
// ------------------------------------------------------------

function getTriangleLocalPoints(tri) {
  // Deterministic jitter per triangle
  randomSeed(tri.seed);
  let pts = [];
  for (let i = 0; i < 3; i++) {
    let a = i * TWO_PI / 3 - PI / 2;
    let radiusJitter = tri.size * random(0.9, 1.05);
    let lx = cos(a) * radiusJitter;
    let ly = sin(a) * radiusJitter;
    pts.push(createVector(lx, ly));
  }
  return pts;
}

function getTriangleWorldPoints(tri) {
  let localPts = getTriangleLocalPoints(tri);
  let pts = [];
  let cosA = cos(tri.angle);
  let sinA = sin(tri.angle);
  let tx = tri.cx + tri.offsetX;
  let ty = tri.cy + tri.offsetY;

  for (let p of localPts) {
    let wx = p.x * cosA - p.y * sinA + tx;
    let wy = p.x * sinA + p.y * cosA + ty;
    pts.push(createVector(wx, wy));
  }
  return pts;
}

// Simple barycentric point-in-triangle
function pointInTriangle(px, py, a, b, c) {
  let v0x = c.x - a.x;
  let v0y = c.y - a.y;
  let v1x = b.x - a.x;
  let v1y = b.y - a.y;
  let v2x = px - a.x;
  let v2y = py - a.y;

  let dot00 = v0x * v0x + v0y * v0y;
  let dot01 = v0x * v1x + v0y * v1y;
  let dot02 = v0x * v2x + v0y * v2y;
  let dot11 = v1x * v1x + v1y * v1y;
  let dot12 = v1x * v2x + v1y * v2y;

  let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return u >= 0 && v >= 0 && (u + v < 1);
}

function getTriangleBounds(pts) {
  let xs = pts.map(p => p.x);
  let ys = pts.map(p => p.y);
  let minX = min(xs);
  let maxX = max(xs);
  let minY = min(ys);
  let maxY = max(ys);
  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY
  };
}

function isMouseOverTriangle(tri) {
  let pts = getTriangleWorldPoints(tri);
  return pointInTriangle(mouseX, mouseY, pts[0], pts[1], pts[2]);
}

// ------------------------------------------------------------
// Drawing
// ------------------------------------------------------------

function risoTriangle(tri, hovered) {
  push();
  translate(tri.cx + tri.offsetX, tri.cy + tri.offsetY);
  rotate(tri.angle);

  let pts = getTriangleLocalPoints(tri);

  // Hover highlight: slightly brighter and less opaque
  let base = tri.inkColor;
  let h = hue(base);
  let s = saturation(base);
  let b = brightness(base);
  let a = alpha(base);

  let fillCol;
  if (hovered) {
    fillCol = color(h, s, min(100, b + 15), a * 0.9);
  } else {
    fillCol = base;
  }

  // Solid fill
  noStroke();
  fill(fillCol);
  beginShape();
  for (let p of pts) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);

  // Slight “ink spread” via wobbly edges
  stroke(fillCol);
  strokeWeight(hovered ? 4 : 3);
  strokeJoin(ROUND);
  noFill();

  for (let k = 0; k < 3; k++) {
    beginShape();
    for (let p of pts) {
      let jx = p.x + random(-1.5, 1.5);
      let jy = p.y + random(-1.5, 1.5);
      vertex(jx, jy);
    }
    endShape(CLOSE);
  }

  // Speckle inside triangle to simulate uneven ink
  let bbox = getTriangleBounds(pts);
  let area = (bbox.w * bbox.h) / 6;
  let specks = constrain(int(area * 0.03), 20, 120);

  strokeWeight(1);
  stroke(fillCol);
  for (let i = 0; i < specks; i++) {
    let px = random(bbox.x, bbox.x + bbox.w);
    let py = random(bbox.y, bbox.y + bbox.h);
    if (pointInTriangle(px, py, pts[0], pts[1], pts[2])) {
      point(px, py);
    }
  }

  // Extra white outline on hover
  if (hovered) {
    stroke(0, 0, 100, 60);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let p of pts) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }

  pop();
}

function drawMisTriangle(tri, hovered) {
  push();
  translate(tri.cx + tri.offsetX, tri.cy + tri.offsetY);
  rotate(tri.angle);

  // Deterministic jitter
  randomSeed(tri.seed);

  let pts = [];
  for (let i = 0; i < 3; i++) {
    let a = i * TWO_PI / 3 - PI / 2;
    let rr = tri.size * random(0.9, 1.15);
    let vx = cos(a) * rr;
    let vy = sin(a) * rr;
    pts.push(createVector(vx, vy));
  }

  noFill();
  let base = tri.inkColor;

  let h = hue(base);
  let s = saturation(base);
  let b = brightness(base);
  let a = alpha(base);

  let strokeCol = hovered
    ? color(h, s, min(100, b + 20), a * 0.95)
    : base;

  stroke(strokeCol);
  strokeWeight(hovered ? 5 : random(2, 4));
  strokeJoin(ROUND);

  beginShape();
  for (let p of pts) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);

  // Slight inner glow on hover
  if (hovered) {
    stroke(0, 0, 100, 40);
    strokeWeight(2);
    beginShape();
    for (let p of pts) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }

  pop();
}