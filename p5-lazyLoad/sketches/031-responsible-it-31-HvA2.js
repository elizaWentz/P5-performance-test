// RISO-inspired triangle print
// Triangles, bold inks, misregistration & grain

let grainLayer;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  noLoop();

  // Pre-generate a grain texture
  grainLayer = createGraphics(width, height);
  grainLayer.colorMode(HSB, 360, 100, 100, 100);
  grainLayer.clear();
  grainLayer.noStroke();

  // Sparse speckle texture
  for (let i = 0; i < 80000; i++) {
    let x = random(width);
    let y = random(height);
    let alpha = random(3, 12);
    let c = color(40 + random(-10, 10), 10, 95, alpha); // warm-ish light ink specks
    grainLayer.fill(c);
    grainLayer.circle(x, y, random(0.6, 1.4));
  }
}

function draw() {
  // Off-white paper
  background(45, 10, 98);

  // RISO-like inks
  let risoPink  = color(330, 90, 95, 92);  // fluorescent pink
  let risoYellow = color(55, 95, 100, 92); // bright yellow
  let risoTeal   = color(182, 70, 70, 92); // teal / blue-green
  let risoBlue   = color(220, 80, 70, 92); // deep blue

  // Use multiply blending to simulate ink overprint
  blendMode(MULTIPLY);

  // Pink & yellow large background triangles
  drawTriangleLayer(risoPink,  3, 260);
  drawTriangleLayer(risoYellow, 3, 260);

  // Teal medium triangles
  drawTriangleLayer(risoTeal, 4, 180);

  // Blue smaller accents
  drawTriangleLayer(risoBlue, 5, 130);

  // Add registration offset overlays for that risograph misalignment feel
  drawMisregisteredTriangles(risoPink, risoYellow, risoTeal);

  // Return to normal blending and overlay grain
  blendMode(BLEND);
  image(grainLayer, 0, 0);
}

// Draw several triangles of one ink color
function drawTriangleLayer(inkColor, count, baseSize) {
  for (let i = 0; i < count; i++) {
    let x = random(-100, width + 100);
    let y = random(-100, height + 100);
    let s = baseSize * random(0.7, 1.4);
    let angle = random(TWO_PI);

    // Slight per-triangle registration jitter
    let offsetX = random(-6, 6);
    let offsetY = random(-6, 6);

    risoTriangle(x, y, s, angle, inkColor, offsetX, offsetY);
  }
}

// A single imperfect risograph triangle
function risoTriangle(cx, cy, size, angle, inkColor, offsetX, offsetY) {
  push();
  translate(cx + offsetX, cy + offsetY);
  rotate(angle);

  // Base polygon (equilateral-ish triangle)
  let r = size;
  let pts = [];
  for (let i = 0; i < 3; i++) {
    let a = i * TWO_PI / 3 - PI / 2;
    let radiusJitter = r * random(0.9, 1.05);
    pts.push(createVector(
      cos(a) * radiusJitter,
      sin(a) * radiusJitter
    ));
  }

  // Interior fill with tiny jitter using multiple passes
  noStroke();
  fill(inkColor);
  beginShape();
  for (let p of pts) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);

  // Slight “ink spread” by drawing a fat noisy border
  stroke(inkColor);
  strokeWeight(3);
  strokeJoin(ROUND);
  noFill();

  // Draw wobbly edges by re-drawing edges with minor noise
  for (let k = 0; k < 3; k++) {
    beginShape();
    for (let p of pts) {
      let jx = p.x + random(-1.5, 1.5);
      let jy = p.y + random(-1.5, 1.5);
      vertex(jx, jy);
    }
    endShape(CLOSE);
  }

  // Add speckle inside triangle to simulate uneven ink
  let bbox = getTriangleBounds(pts);
  let area = (bbox.w * bbox.h) / 6; // rough density scaling
  let specks = constrain(int(area * 0.03), 20, 120);

  strokeWeight(1);
  stroke(inkColor);
  for (let i = 0; i < specks; i++) {
    let px = random(bbox.x, bbox.x + bbox.w);
    let py = random(bbox.y, bbox.y + bbox.h);
    if (pointInTriangle(px, py, pts[0], pts[1], pts[2])) {
      point(px, py);
    }
  }

  pop();
}

// Extra misregistered outlines/triangles on top
function drawMisregisteredTriangles(c1, c2, c3) {
  let inks = [c1, c2, c3];
  for (let i = 0; i < 7; i++) {
    let ink = random(inks);
    let x = random(width * -0.1, width * 1.1);
    let y = random(height * -0.1, height * 1.1);
    let s = random(80, 220);
    let angle = random(TWO_PI);
    let offsetX = random(-10, 10);
    let offsetY = random(-10, 10);

    push();
    translate(x + offsetX, y + offsetY);
    rotate(angle);
    noFill();
    stroke(ink);
    strokeWeight(random(2, 4));
    strokeJoin(ROUND);

    beginShape();
    for (let i = 0; i < 3; i++) {
      let a = i * TWO_PI / 3 - PI / 2;
      let rr = s * random(0.9, 1.15);
      let vx = cos(a) * rr;
      let vy = sin(a) * rr;
      vertex(vx, vy);
    }
    endShape(CLOSE);
    pop();
  }
}

// Helpers

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

function pointInTriangle(px, py, a, b, c) {
  // Barycentric technique
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