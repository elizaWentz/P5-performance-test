let paperGrain;
let inkSpeckles;
let triangles = [];
let gaps = [];

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
  noiseSeed(35);
  randomSeed(35);
  paperGrain = createPaperGrain();
  inkSpeckles = createInkSpeckles();
  triangles = createTriangleField();
  gaps = createInkGaps();
}

function draw() {
  background(risoPalette.paper);
  image(paperGrain, 0, 0);

  const hover = getHoverPoint();
  const pull = hover.inside ? 1 : 0;
  const driftX = map(hover.x, 0, width, -9, 9) * pull;
  const driftY = map(hover.y, 0, height, -9, 9) * pull;

  push();
  translate(width * 0.5, height * 0.52);
  rotate(radians(-8 + driftX * 0.2));
  drawRisoLayer(risoPalette.sunflower, driftX * 0.35, driftY * 0.35, 1.04, hover);
  drawRisoLayer(risoPalette.fluorescentPink, -8 - driftX * 0.8, 5 + driftY * 0.6, 0.98, hover);
  drawRisoLayer(risoPalette.teal, 9 + driftX, -7 - driftY * 0.8, 0.92, hover);
  drawKeyTriangles(hover);
  pop();

  drawHoverRegistration(hover);
  drawBorderMarks(hover);
  image(inkSpeckles, 0, 0);
}

function drawRisoLayer(inkColor, xOffset, yOffset, scaleAmount, hover) {
  const alphaInk = color(inkColor);
  alphaInk.setAlpha(160);

  push();
  translate(xOffset, yOffset);
  scale(scaleAmount);
  noStroke();
  fill(alphaInk);

  for (const tri of triangles) {
    const worldX = width * 0.5 + tri.x;
    const worldY = height * 0.52 + tri.y;
    const d = dist(hover.x, hover.y, worldX, worldY);
    const lift = hover.inside ? constrain(1 - d / 150, 0, 1) : 0;
    const spread = lift * 16;
    const anglePush = lift * radians(34) * tri.turn;

    push();
    translate(tri.x, tri.y);
    rotate(tri.angle + anglePush + sin(frameCount * 0.035 + tri.seed) * lift * 0.05);
    triangle(
      -tri.size * 0.56 - spread,
      tri.size * 0.42 + spread * 0.35,
      tri.size * 0.56 + spread,
      tri.size * 0.42 - spread * 0.2,
      0,
      -tri.size * 0.58 - spread
    );
    pop();
  }

  eraseSmallInkGaps();
  pop();
}

function drawKeyTriangles(hover) {
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
      const worldX = width * 0.5 + x;
      const worldY = height * 0.52 + y;
      const d = dist(hover.x, hover.y, worldX, worldY);
      const glow = hover.inside ? constrain(1 - d / 135, 0, 1) : 0;

      push();
      translate(x, y);
      rotate(a + HALF_PI + glow * radians(28));
      const wobble = sin(i * 12.989 + frameCount * 0.05) * (5 + glow * 9);
      const s = ring.size + glow * 24;
      triangle(
        -s * 0.5,
        s * 0.38 + wobble,
        s * 0.5,
        s * 0.38 - wobble,
        0,
        -s * 0.56
      );
      pop();
    }
  }

  blendMode(BLEND);
}

function drawHoverRegistration(hover) {
  if (!hover.inside) {
    return;
  }

  blendMode(MULTIPLY);
  noFill();
  strokeWeight(2);

  const pulse = 18 + sin(frameCount * 0.08) * 5;
  const marks = [
    { c: risoPalette.fluorescentPink, x: -5, y: 4 },
    { c: risoPalette.teal, x: 5, y: -4 },
    { c: risoPalette.sunflower, x: 0, y: 0 }
  ];

  for (const mark of marks) {
    stroke(mark.c);
    push();
    translate(hover.x + mark.x, hover.y + mark.y);
    rotate(frameCount * 0.015);
    triangle(-pulse, pulse * 0.72, pulse, pulse * 0.72, 0, -pulse);
    pop();
  }

  blendMode(BLEND);
}

function eraseSmallInkGaps() {
  const paper = color(risoPalette.paper);
  paper.setAlpha(32);
  fill(paper);

  for (const gap of gaps) {
    push();
    translate(gap.x, gap.y);
    rotate(gap.angle);
    triangle(0, -gap.size, gap.size * 0.9, gap.size * 0.7, -gap.size * 0.9, gap.size * 0.7);
    pop();
  }
}

function drawBorderMarks(hover) {
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

    const d = dist(hover.x, hover.y, x, y);
    const nudge = hover.inside ? constrain(1 - d / 120, 0, 1) * 10 : 0;

    push();
    translate(x, y);
    rotate(side * HALF_PI + radians(45 + nudge * 5));
    triangle(-8 - nudge, 7 + nudge, 8 + nudge, 7, 0, -9 - nudge);
    pop();
  }

  blendMode(BLEND);
}

function createTriangleField() {
  const field = [];
  const step = 62;

  for (let row = -4; row <= 4; row++) {
    for (let col = -4; col <= 4; col++) {
      const x = col * step + ((row % 2) * step) / 2;
      const y = row * step * 0.9;
      const size = 48 + noise(row * 0.35, col * 0.35) * 36;
      const turn = (row + col) % 2 === 0 ? 1 : -1;

      field.push({
        x,
        y,
        size,
        turn,
        angle: radians((row * 9 + col * 13) * turn),
        seed: random(TWO_PI)
      });
    }
  }

  return field;
}

function createInkGaps() {
  const flecks = [];

  for (let i = 0; i < 198; i++) {
    flecks.push({
      x: random(-width * 0.48, width * 0.48),
      y: random(-height * 0.48, height * 0.48),
      size: random(2, 8),
      angle: random(TWO_PI)
    });
  }

  return flecks;
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

function getHoverPoint() {
  return {
    x: mouseX,
    y: mouseY,
    inside: mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height
  };
}
