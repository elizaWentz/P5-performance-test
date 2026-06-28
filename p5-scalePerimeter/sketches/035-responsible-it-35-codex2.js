let paperGrain;
let inkSpeckles;

const risoPalette = {
  paper: "#f7efcf",
  soy: "#1f2520",
  fluorescentPink: "#ff4fa3",
  sunflower: "#ffb000",
  teal: "#008f8c",
  cornflower: "#3d6cff",
  red: "#ff665a"
};

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  noLoop();
  paperGrain = createPaperGrain();
  inkSpeckles = createInkSpeckles();
}

function draw() {
  background(risoPalette.paper);
  image(paperGrain, 0, 0);

  push();
  translate(width * 0.5, height * 0.52);
  rotate(radians(-8));
  drawRisoLayer(risoPalette.sunflower, 0, 0, 1.04);
  drawRisoLayer(risoPalette.fluorescentPink, -8, 5, 0.98);
  drawRisoLayer(risoPalette.teal, 9, -7, 0.92);
  drawKeyTriangles();
  pop();

  drawBorderMarks();
  image(inkSpeckles, 0, 0);
}

function drawRisoLayer(inkColor, xOffset, yOffset, scaleAmount) {
  const alphaInk = color(inkColor);
  alphaInk.setAlpha(160);

  push();
  translate(xOffset, yOffset);
  scale(scaleAmount);
  noStroke();
  fill(alphaInk);

  const bands = 9;
  const step = 62;
  for (let row = -4; row <= 4; row++) {
    for (let col = -4; col <= 4; col++) {
      const x = col * step + ((row % 2) * step) / 2;
      const y = row * step * 0.9;
      const size = 48 + noise(row * 0.35, col * 0.35) * 36;
      const turn = (row + col) % 2 === 0 ? 1 : -1;

      push();
      translate(x, y);
      rotate(radians((row * 9 + col * 13) * turn));
      triangle(-size * 0.56, size * 0.42, size * 0.56, size * 0.42, 0, -size * 0.58);
      pop();
    }
  }

  eraseSmallInkGaps(bands);
  pop();
}

function drawKeyTriangles() {
  blendMode(MULTIPLY);
  strokeWeight(3);
  stroke(risoPalette.soy);
  noFill();

  const rings = [
    { radius: 206, count: 10, size: 74 },
    { radius: 126, count: 7, size: 64 },
    { radius: 48, count: 3, size: 55 }
  ];

  for (const ring of rings) {
    for (let i = 0; i < ring.count; i++) {
      const a = (TWO_PI / ring.count) * i + ring.radius * 0.001;
      const x = cos(a) * ring.radius;
      const y = sin(a) * ring.radius;

      push();
      translate(x, y);
      rotate(a + HALF_PI);
      const wobble = sin(i * 12.989) * 5;
      triangle(
        -ring.size * 0.5,
        ring.size * 0.38 + wobble,
        ring.size * 0.5,
        ring.size * 0.38 - wobble,
        0,
        -ring.size * 0.56
      );
      pop();
    }
  }

  blendMode(BLEND);
}

function eraseSmallInkGaps(amount) {
  const paper = color(risoPalette.paper);
  paper.setAlpha(35);
  fill(paper);

  for (let i = 0; i < amount * 22; i++) {
    const x = random(-width * 0.48, width * 0.48);
    const y = random(-height * 0.48, height * 0.48);
    const s = random(2, 8);
    triangle(x, y - s, x + s * 0.9, y + s * 0.7, x - s * 0.9, y + s * 0.7);
  }
}

function drawBorderMarks() {
  blendMode(MULTIPLY);
  noFill();
  strokeWeight(2);
  stroke(risoPalette.cornflower);

  for (let i = 0; i < 18; i++) {
    const t = i / 17;
    const side = i % 4;
    const margin = 34;
    let x = lerp(margin, width - margin, t);
    let y = margin;

    if (side === 1) {
      x = width - margin;
      y = lerp(margin, height - margin, t);
    } else if (side === 2) {
      x = lerp(width - margin, margin, t);
      y = height - margin;
    } else if (side === 3) {
      x = margin;
      y = lerp(height - margin, margin, t);
    }

    push();
    translate(x, y);
    rotate((side * HALF_PI) + radians(45));
    triangle(-8, 7, 8, 7, 0, -9);
    pop();
  }

  blendMode(BLEND);
}

function createPaperGrain() {
  const grain = createGraphics(width, height);
  grain.pixelDensity(1);
  grain.background(0, 0);

  grain.noStroke();
  for (let i = 0; i < 34000; i++) {
    const shade = random() > 0.5 ? 25 : 255;
    grain.fill(shade, random(8, 24));
    grain.circle(random(width), random(height), random(0.35, 1.4));
  }

  return grain;
}

function createInkSpeckles() {
  const speckles = createGraphics(width, height);
  speckles.pixelDensity(1);
  speckles.clear();
  speckles.blendMode(MULTIPLY);
  speckles.noStroke();

  const colors = [
    risoPalette.fluorescentPink,
    risoPalette.sunflower,
    risoPalette.teal,
    risoPalette.cornflower,
    risoPalette.red
  ];

  for (let i = 0; i < 5600; i++) {
    const c = color(random(colors));
    c.setAlpha(random(14, 52));
    speckles.fill(c);
    speckles.circle(random(width), random(height), random(0.5, 2.2));
  }

  return speckles;
}

function mousePressed() {
  redraw();
}
