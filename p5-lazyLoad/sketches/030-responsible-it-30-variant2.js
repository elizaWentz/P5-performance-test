let paper;
let grain;
let inks;
let triangles = [];

function setup() {
  createCanvas(1128, 308);
  pixelDensity(1);
  noSmooth();
  randomSeed(30);
  noiseSeed(30);

  paper = color(250, 248, 240);
  inks = {
    fluorescentPink: color(255, 46, 143),
    sunflower: color(255, 194, 33),
    seaBlue: color(0, 128, 206),
    ink: color(20, 28, 54)
  };

  buildTrianglePlate();
  grain = createGraphics(width, height);
  grain.pixelDensity(1);
  makePaperGrain();
}

function draw() {
  background(paper);
  image(grain, 0, 0);

  drawRisoMixerTriangles();
  drawTrianglePlate();
  drawTriangleMesh();
  drawHalftoneFields();
  drawDryRollerTexture();
  drawEdgeNoise();
}

function buildTrianglePlate() {
  let centers = [
    [88, 220, 128, 1],
    [154, 86, 94, -1],
    [250, 176, 168, 1],
    [384, 112, 118, -1],
    [500, 210, 204, 1],
    [616, 86, 130, -1],
    [742, 190, 178, 1],
    [874, 102, 112, -1],
    [982, 218, 150, 1],
    [1070, 126, 96, -1]
  ];

  for (let i = 0; i < centers.length; i++) {
    let c = centers[i];
    triangles.push({
      x: c[0],
      y: c[1],
      r: c[2],
      flip: c[3],
      skew: random(-0.22, 0.22),
      wobble: random(TAU)
    });
  }
}

function drawRisoMixerTriangles() {
  let cellW = 76;
  let cellH = 48;
  let startX = 190;
  let startY = 38;

  noStroke();
  blendMode(BLEND);

  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 5; row++) {
      let x = startX + col * cellW;
      let y = startY + row * cellH;
      let ink = [inks.seaBlue, inks.fluorescentPink, inks.sunflower][(col + row) % 3];
      let alphaValue = map(col + row, 0, 13, 44, 118);

      fill(red(ink), green(ink), blue(ink), alphaValue);
      if ((col + row) % 2 === 0) {
        triangle(x + 4, y + 4, x + cellW - 4, y + 4, x + 4, y + cellH - 4);
      } else {
        triangle(x + cellW - 4, y + 4, x + cellW - 4, y + cellH - 4, x + 4, y + cellH - 4);
      }
    }
  }

  blendMode(BLEND);
}

function drawTrianglePlate() {
  let mainInks = [inks.seaBlue, inks.fluorescentPink, inks.sunflower];
  let offsets = [
    { x: -3, y: 2 },
    { x: 3, y: -2 },
    { x: 1, y: 3 }
  ];

  blendMode(BLEND);
  noStroke();

  for (let i = 0; i < triangles.length; i++) {
    let t = triangles[i];
    let ink = mainInks[i % mainInks.length];
    let offset = offsets[i % offsets.length];
    let pulse = sin(frameCount * 0.018 + t.wobble) * 1.8;
    let points = trianglePoints(t.x + pulse + offset.x, t.y - pulse + offset.y, t.r, t.flip, t.skew);

    fill(red(ink), green(ink), blue(ink), 192);
    triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);

    fill(250, 248, 240, 76);
    let inner = trianglePoints(t.x + pulse + offset.x, t.y - pulse + offset.y, t.r * 0.5, -t.flip, -t.skew * 0.5);
    triangle(inner[0].x, inner[0].y, inner[1].x, inner[1].y, inner[2].x, inner[2].y);
  }

  blendMode(BLEND);
}

function drawTriangleMesh() {
  blendMode(BLEND);
  strokeWeight(2);
  noFill();

  for (let i = 0; i < triangles.length; i++) {
    let t = triangles[i];
    let p = trianglePoints(t.x, t.y, t.r * 0.86, t.flip, t.skew);
    stroke(red(inks.seaBlue), green(inks.seaBlue), blue(inks.seaBlue), 70);
    triangle(p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y);

    stroke(red(inks.fluorescentPink), green(inks.fluorescentPink), blue(inks.fluorescentPink), 58);
    line(p[0].x, p[0].y, p[1].x, p[1].y);
    line(p[1].x, p[1].y, p[2].x, p[2].y);
    line(p[2].x, p[2].y, p[0].x, p[0].y);
  }

  for (let x = -20; x < width + 80; x += 82) {
    for (let y = 18; y < height + 80; y += 71) {
      let flip = (floor(x / 82) + floor(y / 71)) % 2 === 0 ? 1 : -1;
      let r = 35 + noise(x * 0.01, y * 0.01) * 28;
      let p = trianglePoints(x, y, r, flip, 0);
      let c = (floor(x / 82) + floor(y / 71)) % 3 === 0 ? inks.seaBlue : inks.fluorescentPink;
      stroke(red(c), green(c), blue(c), 24);
      triangle(p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y);
    }
  }

  blendMode(BLEND);
}

function drawHalftoneFields() {
  blendMode(BLEND);
  noStroke();

  drawDotField(134, 158, 210, 150, inks.seaBlue, 9, 0.03);
  drawDotField(558, 154, 220, 148, inks.fluorescentPink, 9, 0.08);
  drawDotField(936, 160, 230, 150, inks.sunflower, 10, 0.0);

  blendMode(BLEND);
}

function drawDotField(cx, cy, w, h, ink, spacing, phase) {
  for (let y = cy - h * 0.5; y <= cy + h * 0.5; y += spacing) {
    for (let x = cx - w * 0.5; x <= cx + w * 0.5; x += spacing) {
      let dx = (x - cx) / (w * 0.5);
      let dy = (y - cy) / (h * 0.5);
      let d = dx * dx + dy * dy;
      if (d > 1) continue;

      let pattern = sin((x + y) * 0.075 + phase * frameCount) * 0.5 + 0.5;
      let r = map(d, 0, 1, 3.8, 0.6) * map(pattern, 0, 1, 0.55, 1.2);
      fill(red(ink), green(ink), blue(ink), 34);
      ellipse(x + sin(y * 0.07) * 1.2, y, r, r);
    }
  }
}

function drawDryRollerTexture() {
  randomSeed(3017);
  blendMode(BLEND);
  noStroke();

  for (let i = 0; i < 520; i++) {
    let x = random(width);
    let y = random(height);
    let len = random(8, 46);
    let c = random([inks.fluorescentPink, inks.sunflower, inks.seaBlue]);
    fill(red(c), green(c), blue(c), random(7, 18));
    rect(x, y, len, random(1, 3));
  }

  blendMode(SCREEN);
  for (let i = 0; i < 360; i++) {
    fill(255, 255, 248, random(18, 42));
    rect(random(width), random(height), random(2, 11), 1);
  }

  blendMode(BLEND);
}

function drawEdgeNoise() {
  randomSeed(830);
  noFill();
  strokeWeight(1);
  blendMode(BLEND);

  for (let i = 0; i < 24; i++) {
    let c = random([inks.seaBlue, inks.fluorescentPink, inks.sunflower]);
    stroke(red(c), green(c), blue(c), 10);
    let inset = i * 2;
    rect(inset, inset, width - inset * 2, height - inset * 2);
  }

  blendMode(BLEND);
}

function makePaperGrain() {
  grain.clear();
  grain.noStroke();
  grain.background(250, 248, 240);

  for (let i = 0; i < 26000; i++) {
    let shade = random() < 0.5 ? 120 : 255;
    grain.fill(shade, random(3, 8));
    grain.rect(random(width), random(height), random(1, 2.8), random(1, 2.8));
  }

  grain.blendMode(BLEND);
  for (let y = 0; y < height; y += 4) {
    grain.fill(0, 128, 206, 4);
    grain.rect(0, y, width, 1);
  }
  grain.blendMode(BLEND);
}

function trianglePoints(cx, cy, radius, flip, skew) {
  let angleOffset = flip > 0 ? -HALF_PI : HALF_PI;
  let pts = [];

  for (let i = 0; i < 3; i++) {
    let a = angleOffset + i * TAU / 3;
    pts.push({
      x: cx + cos(a) * radius + sin(a * 2) * radius * skew,
      y: cy + sin(a) * radius * 0.82
    });
  }

  return pts;
}
