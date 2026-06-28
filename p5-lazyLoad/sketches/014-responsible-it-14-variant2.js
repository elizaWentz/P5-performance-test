let tileW = 62;
let tileH = 35.6;
let waveCenter;

function setup() {
  createCanvas(1128, 308);
  pixelDensity(1);
  noStroke();
  waveCenter = width / 2;
}

function draw() {
  waveCenter = lerp(waveCenter, constrain(mouseX, 0, width), 0.25);

  background(235, 252, 252);

  drawSoftVerticalGlow();
  noStroke();
  drawTriangleWeave();
  drawMouseWaveGlow();
  drawTransparentColumns();
}

function drawSoftVerticalGlow() {
  for (let x = 0; x < width; x += 2) {
    let centerDistance = abs(x - width / 2) / (width / 2);
    let edgeGlow = pow(centerDistance, 1.35);

    let paleAqua = color(232, 255, 255);
    let electricCyan = color(57, 220, 238);
    let cobalt = color(29, 96, 189);
    let midnight = color(4, 19, 64);

    let c;
    if (centerDistance < 0.38) {
      c = lerpColor(midnight, cobalt, centerDistance / 0.38);
    } else {
      c = lerpColor(cobalt, electricCyan, (centerDistance - 0.38) / 0.62);
      c = lerpColor(c, paleAqua, edgeGlow * 0.35);
    }

    stroke(red(c), green(c), blue(c), 220);
    line(x, 0, x, height);
  }
}

function drawTriangleWeave() {
  for (let y = -tileH; y < height + tileH; y += tileH) {
    let row = floor(y / tileH);

    for (let x = -tileW; x < width + tileW; x += tileW / 2) {
      let col = floor(x / (tileW / 2));
      let cx = x + tileW / 4;
      let cy = y + tileH / 2;

      let distanceFromWave = abs(cx - getWaveCenter());
      let crest = max(0, 1 - distanceFromWave / 210);
      crest = pow(crest, 1.65);
      let wave = waveAmount(cx);
      let centerDistance = abs(cx - width / 2) / (width / 2);
      let verticalDistance = abs(cy - height / 2) / (height / 2);
      let diamond = abs(cx - width / 2) / 250 + abs(cy - height / 2) / 150;

      let base = colorForPosition(centerDistance, diamond, col, row);
      let alpha = map(centerDistance, 0, 1, 200, 130) + crest * 70;

      if (diamond < 0.55) {
        base = lerpColor(base, color(1, 12, 46), 0.72);
        alpha = 220 + crest * 45;
      }

      if (centerDistance > 0.9) {
        base = lerpColor(base, color(245, 255, 255), 0.55);
        alpha = 185;
      }

      if (verticalDistance > 0.74) {
        base = lerpColor(base, color(47, 211, 232), 0.18);
      }

      if (crest > 0) {
        base = lerpColor(base, color(205, 255, 255), crest * 0.38);
      } else {
        base = lerpColor(base, color(0, 18, 75), abs(wave) * 0.12);
      }

      fill(red(base), green(base), blue(base), alpha);

      if ((col + row) % 2 === 0) {
        waveTriangle(
          x, y,
          x, y + tileH,
          x + tileW / 2, y + tileH / 2
        );
      } else {
        waveTriangle(
          x + tileW / 2, y,
          x + tileW / 2, y + tileH,
          x, y + tileH / 2
        );
      }
    }
  }
}

function waveTriangle(x1, y1, x2, y2, x3, y3) {
  triangle(
    x1, y1 + waveAmount(x1),
    x2, y2 + waveAmount(x2),
    x3, y3 + waveAmount(x3)
  );
}

function waveAmount(x) {
  let distance = x - getWaveCenter();
  let envelope = max(0, 1 - abs(distance) / 260);
  envelope = pow(envelope, 1.35);

  return sin(distance * 0.04) * 38 * envelope;
}

function drawMouseWaveGlow() {
  let center = getWaveCenter();

  for (let x = -210; x < width + 210; x += 4) {
    let distance = abs(x - center);
    let crest = max(0, 1 - distance / 210);
    crest = pow(crest, 2);

    fill(190, 255, 255, crest * 45);
    rect(x, 0, 4, height);
  }
}

function getWaveCenter() {
  return waveCenter;
}

function colorForPosition(centerDistance, diamond, col, row) {
  let edge = color(109, 235, 242);
  let aqua = color(50, 198, 222);
  let blue = color(30, 107, 196);
  let deep = color(8, 45, 130);

  let c;
  if (centerDistance < 0.28) {
    c = lerpColor(deep, blue, centerDistance / 0.28);
  } else if (centerDistance < 0.7) {
    c = lerpColor(blue, aqua, (centerDistance - 0.28) / 0.42);
  } else {
    c = lerpColor(aqua, edge, (centerDistance - 0.7) / 0.3);
  }

  let diagonalShade = ((col - row) % 4 + 4) % 4;
  if (diagonalShade === 0) {
    c = lerpColor(c, color(3, 29, 104), 0.26);
  } else if (diagonalShade === 2) {
    c = lerpColor(c, color(180, 255, 255), 0.18);
  }

  if (diamond > 0.9 && diamond < 1.45) {
    c = lerpColor(c, color(12, 65, 158), 0.18);
  }

  return c;
}

function drawTransparentColumns() {
  for (let x = tileW / 2; x < width; x += tileW) {
    let centerDistance = abs(x - width / 2) / (width / 2);
    let lightness = map(centerDistance, 0, 1, 10, 70);

    fill(255, 255, 255, lightness);
    rect(x - tileW * 0.05, 0, tileW * 0.46, height);

    fill(0, 39, 127, map(centerDistance, 0, 1, 60, 10));
    rect(x + tileW * 0.41, 0, tileW * 0.08, height);
  }
}
