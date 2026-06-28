// Risograph-inspired triangles with texture
// Paste into p5.js editor as sketch.js

let palette;

function setup() {
  createCanvas(800, 800);
  noLoop();
  noStroke();

  // Riso-like ink colors
  palette = [
    color(255, 90, 95),   // Fluorescent-ish red/pink
    color(0, 180, 170),   // Teal
    color(255, 205, 0),   // Yellow
    color(20, 20, 60)     // Dark indigo / navy
  ];
}

function draw() {
  // Slightly warm paper color
  background(248, 242, 230);

  // Paper grain first
  drawPaperGrain(12000);

  // Main triangle composition
  drawTriangleField();

  // Ink noise on top
  drawInkNoise(7000);
}

function drawTriangleField() {
  let cols = 6;
  let rows = 6;
  let margin = width * 0.1;
  let usableW = width - margin * 2;
  let usableH = height - margin * 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let u = x / (cols - 1);
      let v = y / (rows - 1);

      let cx = margin + u * usableW + random(-15, 15);
      let cy = margin + v * usableH + random(-15, 15);

      let baseSize = width * 0.12;
      let size = baseSize * random(0.7, 1.2);

      risographTriangle(cx, cy, size);
    }
  }
}

function risographTriangle(cx, cy, size) {
  // Number of ink layers for this triangle
  let layers = floor(random(2, 5));

  // Base orientation (like different screens)
  let baseAngle = random([0, PI / 6, -PI / 6, PI / 3, -PI / 3]);

  for (let i = 0; i < layers; i++) {
    push();
    translate(
      cx + random(-4, 4),  // misregistration in x
      cy + random(-4, 4)   // misregistration in y
    );
    rotate(baseAngle + random(-0.08, 0.08));

    let c = random(palette);
    let alpha = random(120, 210);

    fill(red(c), green(c), blue(c), alpha);
    
    // Slightly rough stroke around some triangles
    if (random() < 0.4) {
      stroke(red(c), green(c), blue(c), alpha * 0.7);
      strokeWeight(random(1, 2));
    } else {
      noStroke();
    }

    beginShape();
    for (let k = 0; k < 3; k++) {
      let angle = (TWO_PI / 3) * k - PI / 2;
      let r = size * random(0.95, 1.05); // rough edges
      let vx = cos(angle) * r;
      let vy = sin(angle) * r;
      vertex(vx, vy);
    }
    endShape(CLOSE);

    pop();
  }
}

function drawPaperGrain(count) {
  // Very subtle grey specks across the paper
  stroke(0, 10); // very transparent
  strokeWeight(1);
  for (let i = 0; i < count; i++) {
    let x = random(width);
    let y = random(height);
    point(x, y);
  }
  noStroke();
}

function drawInkNoise(count) {
  // Colored specks to mimic ink texture
  noStroke();
  for (let i = 0; i < count; i++) {
    let c = random(palette);
    let alpha = random(40, 100);

    fill(red(c), green(c), blue(c), alpha);
    let x = random(width);
    let y = random(height);
    let s = random(1, 3);
    ellipse(x, y, s, s);
  }
}