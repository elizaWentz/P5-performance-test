function setup() {
  createCanvas(1920, 1080);
  noLoop();
  pixelDensity(1);
}

function draw() {
  background("#f4ead8");

  const palette = [
    "#1f3d5a", "#3f6f73", "#8fb9a8", "#f2c166",
    "#d97745", "#a63d40", "#6b4b7a", "#f7e6b5"
  ];

  const cell = 120;
  const cols = ceil(width / cell);
  const rows = ceil(height / cell);

  noStroke();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * cell;
      const py = y * cell;
      const flip = (x + y) % 2 === 0;

      const a = palette[(x * 2 + y) % palette.length];
      const b = palette[(x + y * 3 + 2) % palette.length];
      const c = palette[(x * 5 + y * 2 + 4) % palette.length];
      const d = palette[(x * 7 + y + 1) % palette.length];

      fill(a);
      triangle(px, py, px + cell, py, px, py + cell);

      fill(b);
      triangle(px + cell, py, px + cell, py + cell, px, py + cell);

      fill(c);
      if (flip) {
        triangle(px, py, px + cell / 2, py + cell / 2, px, py + cell);
        triangle(px + cell, py, px + cell / 2, py + cell / 2, px + cell, py + cell);
      } else {
        triangle(px, py, px + cell / 2, py + cell / 2, px + cell, py);
        triangle(px, py + cell, px + cell / 2, py + cell / 2, px + cell, py + cell);
      }

      fill(d);
      const inset = cell * 0.25;
      triangle(
        px + cell / 2,
        py + inset,
        px + cell - inset,
        py + cell / 2,
        px + cell / 2,
        py + cell - inset
      );
    }
  }

  drawStitching(cell);
  drawFabricGrain();
  addFabricTexture()
}

function drawStitching(cell) {
  stroke("#2b241c55");
  strokeWeight(2);
  noFill();

  for (let x = 0; x <= width; x += cell) {
    dashedLine(x, 0, x, height, 12, 10);
  }

  for (let y = 0; y <= height; y += cell) {
    dashedLine(0, y, width, y, 12, 10);
  }

  for (let y = -height; y < height; y += cell) {
    dashedLine(0, y, width, y + width, 10, 12);
    dashedLine(width, y, 0, y + width, 10, 12);
  }

  stroke("#fff7e680");
  strokeWeight(1);
  for (let y = cell / 2; y < height; y += cell) {
    dashedLine(0, y, width, y, 5, 18);
  }
}

function drawFabricGrain() {
  strokeWeight(1);

  for (let i = 0; i < 9000; i++) {
    const x = random(width);
    const y = random(height);
    const len = random(4, 18);
    const alpha = random(12, 34);

    stroke(255, 248, 225, alpha);
    line(x, y, x + len, y + random(-1, 1));

    stroke(40, 30, 22, alpha * 0.45);
    line(x, y + random(-2, 2), x + len * 0.7, y + random(-2, 2));
  }
}

function addFabricTexture() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (y * width + x);

      const grain =
        noise(x * 0.015, y * 0.015) * 11 +
        noise(x * 0.08, y * 0.08) * 5 +
        sin(x * 0.7) * 1.7 +
        sin(y * 0.75) * 1.7 +
        random(-2.2, 2.2) -
        8;

      pixels[i] = constrain(pixels[i] + grain, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + grain * 0.85, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + grain * 0.55, 0, 255);
    }
  }

  updatePixels();

  push();
  blendMode(MULTIPLY);
  stroke(110, 90, 35, 10);
  strokeWeight(1);

  for (let y = 0; y < height; y += 3) {
    line(0, y, width, y);
  }

  for (let x = 0; x < width; x += 4) {
    line(x, 0, x, height);
  }

  pop();
}

function dashedLine(x1, y1, x2, y2, dash, gap) {
  const distance = dist(x1, y1, x2, y2);
  const steps = distance / (dash + gap);

  for (let i = 0; i < steps; i++) {
    const start = i * (dash + gap) / distance;
    const end = min((i * (dash + gap) + dash) / distance, 1);

    line(
      lerp(x1, x2, start),
      lerp(y1, y2, start),
      lerp(x1, x2, end),
      lerp(y1, y2, end)
    );
  }
}
