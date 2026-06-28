// Interactive risograph-inspired triangles with hover highlight
let palette;
let triangles = [];
let bgTex; // pre-rendered paper + grain texture

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);

  // Bold risograph-like inks
  palette = [
    color("#FF6D6A"), // fluorescent red
    color("#00A7E1"), // cyan blue
    color("#FFD23F"), // yellow
    color("#1B998B"), // teal
    color("#F46036")  // orange
  ];

  // Pre-render background texture to a separate graphics buffer
  bgTex = createGraphics(width, height);
  drawBackgroundTexture(bgTex);

  // Create static triangle composition
  createTriangles();
}

function draw() {
  // Draw pre-rendered paper texture
  image(bgTex, 0, 0);

  // Draw triangles with hover interaction
  drawTriangles();
}

// ---------- TRIANGLES ----------

function createTriangles() {
  triangles = [];
  let count = 20;

  for (let i = 0; i < count; i++) {
    let cx = random(width * -0.1, width * 1.1);
    let cy = random(height * -0.1, height * 1.1);
    let size = random(width * 0.3, width * 0.7);
    let angle = random(TAU);

    // Base triangle vertices
    let pts = [];
    for (let j = 0; j < 3; j++) {
      let a = angle + (j * TAU) / 3.0;
      let r = size * random(0.5, 1.1);
      pts.push(createVector(cx + cos(a) * r, cy + sin(a) * r));
    }

    // Centroid for hover detection
    let c = centroid(pts);

    // Layers: precompute color and misregistration offsets
    let layersCount = floor(random(2, 4));
    let cols = shuffle(palette.slice(), true); // copy & shuffle
    let layers = [];

    for (let k = 0; k < layersCount; k++) {
      let col = cols[k];
      let alphaVal = random(120, 200);
      let offX = random(-6, 6);
      let offY = random(-6, 6);

      layers.push({
        r: red(col),
        g: green(col),
        b: blue(col),
        a: alphaVal,
        offX,
        offY
      });
    }

    triangles.push({
      cx,
      cy,
      size,
      pts,
      centroid: c,
      layers
    });
  }
}

function drawTriangles() {
  blendMode(MULTIPLY);
  noStroke();

  for (let t of triangles) {
    let hovered = isTriangleHovered(t);

    // Draw ink layers
    for (let layer of t.layers) {
      fill(layer.r, layer.g, layer.b, layer.a);

      beginShape();
      for (let p of t.pts) {
        vertex(p.x + layer.offX, p.y + layer.offY);
      }
      endShape(CLOSE);
    }

    // Hover effect: bright outline on top
    if (hovered) {
      push();
      blendMode(SCREEN);
      stroke(255, 245, 230, 230);
      strokeWeight(4);
      noFill();
      beginShape();
      for (let p of t.pts) {
        vertex(p.x, p.y);
      }
      endShape(CLOSE);
      pop();
    }
  }

  blendMode(BLEND);
}

function isTriangleHovered(t) {
  // Simple distance check to the centroid
  let d = dist(mouseX, mouseY, t.centroid.x, t.centroid.y);
  return d < t.size * 0.25;
}

function centroid(points) {
  let x = 0;
  let y = 0;
  for (let p of points) {
    x += p.x;
    y += p.y;
  }
  return createVector(x / points.length, y / points.length);
}

// ---------- BACKGROUND TEXTURE ----------

function drawBackgroundTexture(pg) {
  pg.push();
  pg.pixelDensity(1);

  // Warm paper base
  pg.background("#FFF7E8");

  // Subtle grey paper grain
  pg.strokeWeight(1);
  for (let i = 0; i < 9000; i++) {
    let x = random(pg.width);
    let y = random(pg.height);
    let v = random(230, 255);
    pg.stroke(v, v, v, 25);
    pg.point(x, y);
  }

  // A few colored specks (ink noise)
  for (let i = 0; i < 1500; i++) {
    let col = random(palette);
    pg.stroke(red(col), green(col), blue(col), random(40, 90));
    pg.strokeWeight(random(0.4, 1.3));
    pg.point(random(pg.width), random(pg.height));
  }

  pg.pop();
}