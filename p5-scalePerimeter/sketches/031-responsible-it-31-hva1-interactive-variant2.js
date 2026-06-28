// Risograph-style interactive triangles
// Strong texture + interactive misregistration toward mouse

let palette;
let triangles = [];

function setup() {
  createCanvas(1128, 308);  // <-- updated size
  pixelDensity(1);

  palette = [
    color("#FF6D6A"), // fluorescent red
    color("#00A7E1"), // cyan blue
    color("#FFD23F"), // yellow
    color("#1B998B"), // teal
    color("#F46036")  // orange
  ];

  createTriangles();
}

function draw() {
  // Warm paper base
  background("#FFF7E8");

  // Underlay paper speckle
  drawPaperTexture();

  // Triangles with risograph layering & hover motion
  drawTriangles();

  // Heavy grain on top (pixel-level noise + colored specks)
  drawGrain();
}

// ---------------- TRIANGLES ----------------

function createTriangles() {
  triangles = [];
  let count = 8;

  for (let i = 0; i < count; i++) {
    let cx = random(width * -0.1, width * 1.1);
    let cy = random(height * -0.1, height * 1.1);
    let size = random(width * 0.4, width * 0.3);
    let angle = random(TAU);

    // Base triangle vertices
    let basePts = [];
    for (let j = 0; j < 3; j++) {
      let a = angle + (j * TAU) / 3.0;
      let r = size * random(0.5, 1.1);
      basePts.push(createVector(cx + cos(a) * r, cy + sin(a) * r));
    }

    let c = centroid(basePts);

    // Ink layers with base misregistration
    let layersCount = floor(random(2, 4));
    let cols = shuffle(palette.slice(), true);
    let layers = [];
    for (let k = 0; k < layersCount; k++) {
      let col = cols[k];
      layers.push({
        r: red(col),
        g: green(col),
        b: blue(col),
        a: random(120, 200),
        baseOffX: random(-6, 6),
        baseOffY: random(-6, 6)
      });
    }

    triangles.push({
      basePts,
      centroid: c,
      size,
      layers,
      hoverAmt: 0,            // 0..1
      noiseSeed: random(1000) // for stable wiggle
    });
  }
}

function drawTriangles() {
  blendMode(MULTIPLY);
  noStroke();

  for (let t of triangles) {
    // Hover detection: distance to centroid
    let d = dist(mouseX, mouseY, t.centroid.x, t.centroid.y);
    let hovered = d < t.size * 0.35;

    // Smooth hover amount
    let target = hovered ? 1 : 0;
    t.hoverAmt = lerp(t.hoverAmt, target, 0.18);

    // Direction from centroid to mouse
    let dir = createVector(mouseX - t.centroid.x, mouseY - t.centroid.y);
    if (dir.mag() > 0) dir.setMag(14 * t.hoverAmt); // how far triangle shifts

    // Draw ink layers with dynamic misregistration + wobble
    for (let i = 0; i < t.layers.length; i++) {
      let layer = t.layers[i];

      let time = frameCount * 0.05;
      let nx = noise(t.noiseSeed + i * 10 + time) - 0.5;
      let ny = noise(t.noiseSeed + i * 10 + 100 + time) - 0.5;
      let wobbleMag = 10 * t.hoverAmt;

      let offX = layer.baseOffX + dir.x + nx * wobbleMag;
      let offY = layer.baseOffY + dir.y + ny * wobbleMag;

      fill(layer.r, layer.g, layer.b, layer.a);
      beginShape();
      for (let p of t.basePts) {
        vertex(p.x + offX, p.y + offY);
      }
      endShape(CLOSE);
    }

    // Optional bright outline when strongly hovered
    if (t.hoverAmt > 0.4) {
      push();
      blendMode(SCREEN);
      stroke(255, 245, 230, map(t.hoverAmt, 0.4, 1, 0, 230));
      strokeWeight(3);
      noFill();
      beginShape();
      for (let p of t.basePts) {
        vertex(
          p.x + dir.x * 0.3,
          p.y + dir.y * 0.3
        );
      }
      endShape(CLOSE);
      pop();
    }
  }

  blendMode(BLEND);
}

function centroid(points) {
  let x = 0, y = 0;
  for (let p of points) {
    x += p.x;
    y += p.y;
  }
  return createVector(x / points.length, y / points.length);
}

// ---------------- TEXTURE ----------------

// Underlay: paper speckle
function drawPaperTexture() {
  strokeWeight(1);
  for (let i = 0; i < 9000; i++) {
    let x = random(width);
    let y = random(height);
    let v = random(220, 250); // darker for more visible grain
    stroke(v, v, v, 35);
    point(x, y);
  }
}

// Overlay: strong grain across the whole image
function drawGrain() {
  // Pixel-level brightness noise
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (y * width + x) * 4;
      let n = random(-18, 18); // raise this for even stronger grain

      pixels[idx + 0] = constrain(pixels[idx + 0] + n, 0, 255);
      pixels[idx + 1] = constrain(pixels[idx + 1] + n, 0, 255);
      pixels[idx + 2] = constrain(pixels[idx + 2] + n, 0, 255);
    }
  }
  updatePixels();

  // Colored specks on top (ink noise)
  for (let i = 0; i < 1400; i++) {
    let col = random(palette);
    stroke(red(col), green(col), blue(col), random(45, 90));
    strokeWeight(random(0.5, 1.4));
    point(random(width), random(height));
  }
}