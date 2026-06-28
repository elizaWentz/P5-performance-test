let shards = [];
let sparks = [];
let horizon = [];

function setup() {
  createCanvas(960, 540);
  colorMode(HSB, 360, 100, 100, 100);
  pixelDensity(1);
  noFill();

  randomSeed(21);

  for (let i = 0; i < 54; i++) {
    shards.push({
      x: map(i, 0, 33, -110, width + 110) + random(-18, 18),
      y: random(56, height - 40),
      size: random(34, 118),
      spin: random(-0.55, 0.55),
      phase: random(TWO_PI),
      hue: random([185, 204, 328, 24, 52]),
      weight: random(0.7, 2.2),
      sliceCount: floor(random(5, 12)),
      direction: random() < 0.5 ? -1 : 1
    });
  }

  for (let i = 0; i < 70; i++) {
    sparks.push({
      x: random(width),
      y: random(height),
      z: random(0.2, 1),
      phase: random(TWO_PI)
    });
  }

  for (let x = -60; x <= width + 60; x += 26) {
    horizon.push({
      x,
      top: random(26, 126),
      bottom: random(height - 128, height - 18),
      hue: random([188, 210, 320, 42])
    });
  }
}

function draw() {
  drawAtmosphere();
  drawHorizonMesh();
  drawPulseRings();
  drawShardField();
  drawSparks();
  drawScanlines();
}

function drawAtmosphere() {
  background(225, 58, 7);

  for (let y = 0; y < height; y++) {
    let n = y / height;
    let hue = lerp(224, 252, n);
    let sat = lerp(64, 82, n);
    let bri = lerp(12, 5, n);
    stroke(hue, sat, bri, 100);
    line(0, y, width, y);
  }

  noStroke();
  for (let r = 0; r < 12; r++) {
    let alpha = map(r, 0, 11, 20, 0);
    fill(190, 58, 48, alpha);
    ellipse(width * 0.48, height * 0.54, 760 + r * 72, 108 + r * 18);
  }
}

function drawHorizonMesh() {
  let drift = sin(frameCount * 0.009) * 12;

  strokeWeight(1);
  for (let i = 0; i < horizon.length - 1; i++) {
    let a = horizon[i];
    let b = horizon[i + 1];
    let pulse = sin(frameCount * 0.022 + i * 0.55);

    stroke(a.hue, 65, 70, 13 + pulse * 8);
    line(a.x + drift, a.top, b.x - drift, b.bottom);
    line(a.x - drift * 0.4, a.bottom, b.x + drift * 0.5, b.top);
  }
}

function drawPulseRings() {
  let mx = mouseIsInside() ? mouseX : width * 0.5 + sin(frameCount * 0.012) * 220;
  let my = mouseIsInside() ? mouseY : height * 0.52 + cos(frameCount * 0.018) * 50;

  push();
  translate(mx, my);
  rotate(sin(frameCount * 0.01) * 0.08);

  for (let i = 0; i < 8; i++) {
    let s = 74 + i * 42 + sin(frameCount * 0.026 + i) * 8;
    stroke(186 + i * 9, 64, 86, 13 - i);
    strokeWeight(1);
    triangle(0, -s * 0.56, -s * 0.62, s * 0.48, s * 0.62, s * 0.48);
  }

  pop();
}

function drawShardField() {
  blendMode(ADD);

  for (let shard of shards) {
    let sway = sin(frameCount * 0.018 + shard.phase) * 16;
    let bob = cos(frameCount * 0.014 + shard.phase) * 10;
    let parallax = mouseIsInside() ? map(mouseX, 0, width, -18, 18) * shard.direction : 0;

    push();
    translate(shard.x + sway + parallax, shard.y + bob);
    rotate(shard.spin + sin(frameCount * 0.006 + shard.phase) * 0.24);
    drawPrism(shard);
    pop();
  }

  blendMode(BLEND);
}

function drawPrism(shard) {
  let s = shard.size;
  let h = s * 0.88;
  let flash = sin(frameCount * 0.035 + shard.phase) * 12;
  let a = createVector(0, -h * 0.58);
  let b = createVector(-s * 0.58, h * 0.46);
  let c = createVector(s * 0.58, h * 0.46);

  noStroke();
  fill(shard.hue, 80, 30 + flash, 12);
  triangle(a.x, a.y, b.x, b.y, c.x, c.y);

  strokeWeight(shard.weight);
  stroke(shard.hue, 68, 92, 52);
  triangle(a.x, a.y, b.x, b.y, c.x, c.y);

  strokeWeight(1);
  for (let i = 1; i < shard.sliceCount; i++) {
    let t = i / shard.sliceCount;
    let left = p5.Vector.lerp(a, b, t);
    let right = p5.Vector.lerp(a, c, t);
    let offset = sin(frameCount * 0.05 + shard.phase + i * 0.7) * 5;

    stroke(shard.hue + t * 34, 72, 96, 20 + t * 20);
    line(left.x + offset, left.y, right.x - offset, right.y);
  }

  let core = p5.Vector.lerp(b, c, 0.5);
  stroke(shard.hue + 132, 55, 100, 24);
  line(a.x, a.y, core.x, core.y);
  line(b.x, b.y, c.x, c.y);

  noStroke();
  fill(shard.hue + 160, 26, 100, 42);
  circle(a.x, a.y, 3.8);
  circle(b.x, b.y, 2.8);
  circle(c.x, c.y, 2.8);
}

function drawSparks() {
  blendMode(ADD);
  noStroke();

  for (let spark of sparks) {
    let x = (spark.x + frameCount * spark.z * 0.42) % width;
    let y = spark.y + sin(frameCount * 0.025 + spark.phase) * 10;
    let glow = 1.8 + spark.z * 3.2 + sin(frameCount * 0.06 + spark.phase) * 1.2;

    fill(190 + spark.z * 76, 46, 98, 32);
    circle(x, y, glow);
  }

  blendMode(BLEND);
}

function drawScanlines() {
  strokeWeight(1);
  for (let y = 0; y < height; y += 4) {
    stroke(230, 50, 0, 8);
    line(0, y, width, y);
  }

  noStroke();
  fill(0, 0, 100, 8);
  rect(0, 0, width, 1);
  rect(0, height - 1, width, 1);
}

function mouseIsInside() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}
