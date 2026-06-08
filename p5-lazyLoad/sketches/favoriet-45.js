function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  noLoop();
}

function draw() {
  background(246, 240, 226);

  watercolorWash();
  triangleField();
  drawGrain();
}

function watercolorWash() {
  noStroke();

  const washes = [
    [42, 118, 156, 26],
    [228, 104, 92, 22],
    [238, 176, 84, 20],
    [86, 151, 117, 18],
    [94, 75, 145, 16]
  ];

  for (let w = 0; w < washes.length; w++) {
    const c = washes[w];

    for (let i = 0; i < 90; i++) {
      const x = random(width);
      const y = random(height);
      const r = random(180, 520);

      fill(c[0], c[1], c[2], c[3]);
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 36) {
        const wobble = noise(x * 0.004, y * 0.004, a, i) * 90;
        vertex(
          x + cos(a) * (r + wobble),
          y + sin(a) * (r * random(0.55, 1.05) + wobble)
        );
      }
      endShape(CLOSE);
    }
  }
}

function triangleField() {
  const palette = [
    color(32, 94, 130, 58),
    color(221, 87, 76, 52),
    color(240, 166, 71, 50),
    color(67, 137, 111, 48),
    color(97, 76, 145, 44),
    color(30, 45, 64, 38)
  ];

  const step = 135;
  const h = step * 0.866;

  for (let y = -h; y < height + h; y += h) {
    for (let x = -step; x < width + step; x += step) {
      const offset = (floor(y / h) % 2) * step * 0.5;
      const cx = x + offset;
      const cy = y;

      if (random() < 0.92) {
        const s = random(120, 245);
        const rot = random(TWO_PI);
        const base = random(palette);
        watercolorTriangle(cx, cy, s, rot, base);
      }
    }
  }

  for (let i = 0; i < 34; i++) {
    const s = random(260, 560);
    const x = random(width);
    const y = random(height);
    const rot = random(TWO_PI);
    const c = random(palette);
    c.setAlpha(random(18, 34));
    watercolorTriangle(x, y, s, rot, c);
  }
}

function watercolorTriangle(cx, cy, size, rot, col) {
  const points = [];

  for (let i = 0; i < 3; i++) {
    const a = rot + HALF_PI + i * TWO_PI / 3;
    points.push({
      x: cx + cos(a) * size * random(0.47, 0.58),
      y: cy + sin(a) * size * random(0.47, 0.58)
    });
  }

  noStroke();

  for (let layer = 0; layer < 26; layer++) {
    const alpha = map(layer, 0, 25, alphaOf(col) * 0.72, 3);
    fill(red(col), green(col), blue(col), alpha);

    beginShape();
    for (let i = 0; i < 3; i++) {
      const p = points[i];
      const prev = points[(i + 2) % 3];
      const next = points[(i + 1) % 3];

      for (let t = 0; t <= 1; t += 0.08) {
        const x = lerp(p.x, next.x, t);
        const y = lerp(p.y, next.y, t);

        const edgeNoise = noise(x * 0.009, y * 0.009, layer * 0.22);
        const pullX = (cx - x) * random(-0.015, 0.035);
        const pullY = (cy - y) * random(-0.015, 0.035);

        vertex(
          x + (edgeNoise - 0.5) * 28 + pullX,
          y + (noise(y * 0.008, x * 0.008, layer) - 0.5) * 28 + pullY
        );
      }
    }
    endShape(CLOSE);
  }

  stroke(red(col) * 0.75, green(col) * 0.75, blue(col) * 0.75, 34);
  strokeWeight(random(1.2, 2.8));
  noFill();

  beginShape();
  for (let i = 0; i < 3; i++) {
    const p = points[i];
    const next = points[(i + 1) % 3];

    for (let t = 0; t <= 1; t += 0.06) {
      const x = lerp(p.x, next.x, t);
      const y = lerp(p.y, next.y, t);
      vertex(
        x + random(-7, 7),
        y + random(-7, 7)
      );
    }
  }
    endShape(CLOSE);

  for (let bloom = 0; bloom < 18; bloom++) {
    const a = random(TWO_PI);
    const r = random(size * 0.05, size * 0.34);
    fill(red(col), green(col), blue(col), random(5, 16));
    circle(cx + cos(a) * r, cy + sin(a) * r, random(12, 46));
  }
}


// Fine grain / speckle to get risograph noise
function drawGrain() {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (y * width + x) * 4;

      // Random tiny variation in brightness
      let n = random(-12, 12);
      pixels[idx + 0] = constrain(pixels[idx + 0] + n, 0, 255);
      pixels[idx + 1] = constrain(pixels[idx + 1] + n, 0, 255);
      pixels[idx + 2] = constrain(pixels[idx + 2] + n, 0, 255);
    }
  }
  updatePixels();

  // A few colored specks on top
  for (let i = 0; i < 1200; i++) {
    let col = random(palette);
    stroke(red(col), green(col), blue(col), random(40, 90));
    strokeWeight(random(0.5, 1.3));
    point(random(width), random(height));
  }
}

function alphaOf(c) {
  return c._array ? c._array[3] * 255 : alpha(c);
}