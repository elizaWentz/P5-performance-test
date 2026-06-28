function setup() {
  createCanvas(1920, 1080);
  noLoop();
  pixelDensity(1);
}

function draw() {
  background("#f7ead1");

  const palette = [
    "#25618f", "#2f8279", "#7fc0a7", "#e8b94e",
    "#d86b3f", "#f6e3b4"
  ];

  const cell = 180;
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
  addPrintTexture();
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

}

function addPrintTexture() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (x + y * width);
      const n = noise(x * 0.018, y * 0.018);
      const grain = random(-18, 14) + map(n, 0, 1, -10, 10);

      pixels[i] = constrain(pixels[i] + grain, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + grain, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + grain, 0, 255);
    }
  }

  updatePixels();

  noStroke();

  for (let i = 0; i < 32000; i++) {
    fill(255, random(5, 18));
    circle(random(width), random(height), random(0.4, 1.6));
  }

  for (let i = 0; i < 18000; i++) {
    fill(0, random(3, 10));
    circle(random(width), random(height), random(0.35, 1.1));
  }

  blendMode(MULTIPLY);
  for (let i = 0; i < 420; i++) {
    fill(30, 22, 38, random(3, 8));
    rect(random(width), random(height), random(30, 180), random(1, 4));
  }
  blendMode(BLEND);
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
