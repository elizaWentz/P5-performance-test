const CANVAS_W = 980;
const CANVAS_H = 456;
const COLS = 16;
const ROW_H = 36;
const RIPPLE_RADIUS = 360;
const RIPPLE_STRENGTH = 16;

let colW;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  pixelDensity(1);
  colorMode(RGB, 255, 255, 255, 255);
  noStroke();
}

function draw() {
  colW = width / COLS;

  drawBaseGlow();
  drawDiamondLattice();
  drawVerticalVeils();
  drawCenterColumn();
  drawEdgeBloom();
}

function drawBaseGlow() {
  background(242, 252, 248);

  for (let x = 0; x < width; x += 1) {
    let t = abs(x - width * 0.5) / (width * 0.5);
    let sideGlow = pow(t, 1.7);
    let middle = pow(1 - t, 1.9);
    let r = lerp(8, 229, sideGlow);
    let g = lerp(35, 251, sideGlow);
    let b = lerp(100, 249, sideGlow);

    if (middle > 0.52) {
      r = lerp(r, 1, middle);
      g = lerp(g, 16, middle);
      b = lerp(b, 55, middle);
    }

    stroke(r, g, b);
    line(x, 0, x, height);
  }
}

function drawDiamondLattice() {
  noStroke();

  for (let row = -2; row < height / ROW_H + 3; row++) {
    let y = row * ROW_H;
    let rowShift = (row % 2) * colW * 0.5;

    for (let col = -2; col < COLS + 3; col++) {
      let x = col * colW + rowShift;
      drawDiamondPair(x, y, col, row);
    }
  }
}

function drawDiamondPair(x, y, col, row) {
  let cx = x + colW * 0.5;
  let cy = y + ROW_H * 0.5;
  let wave = rippleAt(cx, cy);

  cx += wave.x;
  cy += wave.y;

  let t = abs(cx - width * 0.5) / (width * 0.5);
  let side = cx < width * 0.5 ? -1 : 1;
  let alternating = (col + row) % 2 === 0;
  let centerPull = pow(1 - t, 1.45);
  let sidePull = pow(t, 1.25);
  let verticalTone = map(cy, 0, height, -16, 18);

  let leftBlue = color(
    lerp(58, 0, centerPull) + verticalTone * 0.15,
    lerp(215, 19, centerPull) + verticalTone * 0.25,
    lerp(235, 71, centerPull) + verticalTone * 0.15,
    154
  );
  let rightBlue = color(
    lerp(25, 13, centerPull) + sidePull * 28,
    lerp(126, 54, centerPull) + sidePull * 58,
    lerp(210, 170, centerPull) + sidePull * 44,
    164
  );
  let pale = color(238, 253, 249, 178);

  if (sidePull > 0.84) {
    leftBlue = lerpColor(leftBlue, pale, map(sidePull, 0.84, 1, 0.15, 0.76, true));
    rightBlue = lerpColor(rightBlue, pale, map(sidePull, 0.84, 1, 0.1, 0.72, true));
  }

  if (alternating) {
    fill(leftBlue);
    diamondTriangle(cx, cy, -side);
    fill(rightBlue);
    diamondTriangle(cx, cy, side);
  } else {
    fill(rightBlue);
    diamondTriangle(cx, cy, -side);
    fill(leftBlue);
    diamondTriangle(cx, cy, side);
  }
}

function diamondTriangle(cx, cy, direction) {
  if (direction < 0) {
    triangle(cx, cy - ROW_H * 0.5, cx - colW, cy, cx, cy + ROW_H * 0.5);
  } else {
    triangle(cx, cy - ROW_H * 0.5, cx + colW, cy, cx, cy + ROW_H * 0.5);
  }
}

function drawVerticalVeils() {
  noStroke();

  for (let i = 0; i <= COLS; i++) {
    let x = i * colW;
    let t = abs(x - width * 0.5) / (width * 0.5);
    let w = colW;

    if (t > 0.72) {
      fill(229, 255, 250, map(t, 0.72, 1, 26, 86));
      rect(x, 0, w, height);
    } else if (t < 0.2) {
      fill(0, 8, 42, map(1 - t, 0.8, 1, 26, 60));
      rect(x, 0, w, height);
    } else {
      fill(70, 218, 233, 26);
      rect(x, 0, w, height);
    }
  }

  for (let i = 0; i <= COLS; i++) {
    let x = i * colW;
    fill(252, 255, 255, i % 2 === 0 ? 22 : 12);
    rect(x - 1, 0, 2, height);
  }
}

function drawCenterColumn() {
  let x = width * 0.5;

  for (let y = -ROW_H; y < height + ROW_H; y += ROW_H) {
    let wave = rippleAt(x, y + ROW_H * 0.5);
    let cx = x + wave.x * 0.35;
    let cy = y + wave.y * 0.45;

    fill(0, 10, 46, 124);
    quad(cx, cy, cx + colW, cy + ROW_H * 0.5, cx, cy + ROW_H, cx - colW, cy + ROW_H * 0.5);
  }

  fill(0, 8, 38, 42);
  rect(x - colW, 0, colW * 2, height);
}

function rippleAt(x, y) {
  if (!mouseIsInside()) {
    return { x: 0, y: 0 };
  }

  let dx = x - mouseX;
  let dy = y - mouseY;
  let d = sqrt(dx * dx + dy * dy);
  let t = constrain(d / RIPPLE_RADIUS, 0, 1);
  let falloff = 1 - smoothstep(t);
  let pulse = sin(d * 0.032) * RIPPLE_STRENGTH * falloff;

  return {
    x: (dx / max(d, 1)) * pulse,
    y: (dy / max(d, 1)) * pulse * 0.38
  };
}

function mouseIsInside() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function drawEdgeBloom() {
  noStroke();

  for (let i = 0; i < 5; i++) {
    let a = 24 - i * 4;
    fill(247, 255, 252, a);
    rect(0, 0, colW * (1.2 + i * 0.42), height);
    rect(width - colW * (1.2 + i * 0.42), 0, colW * (1.2 + i * 0.42), height);
  }
}
