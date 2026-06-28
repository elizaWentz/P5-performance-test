let palette;
let hoverX = 564;
let hoverY = 154;
let hoverPower = 0;

function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noSmooth();

  palette = [
    color(12, 17, 32),
    color(0, 121, 188),
    color(30, 210, 205),
    color(93, 205, 76),
    color(255, 222, 48),
    color(255, 131, 96),
    color(255, 112, 194),
    color(255, 228, 212)
  ];
}

function draw() {
  background(13, 17, 30);

  hoverX = lerp(hoverX, mouseX || width * 0.5, 0.07);
  hoverY = lerp(hoverY, mouseY || height * 0.5, 0.07);
  let inside = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  hoverPower = lerp(hoverPower, inside ? 1 : 0, 0.05);

  drawWarpedPixelField();
  drawPanelCuts();
  drawTrianglePrisms();
  drawHalftoneSkin();
}

function drawWarpedPixelField() {
  let step = 4;
  noStroke();

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let nx = x / width;
      let ny = y / height;
      let t = frameCount * 0.012;

      let cell = floor(x / 188);
      let localX = fract(x / 188);
      let localY = y / height;
      let panelFold = sin((localX - 0.5) * PI) * cos((localY - 0.5) * PI);

      let d1 = dist(x, y, 180 + sin(t) * 35, height * 0.48);
      let d2 = dist(x, y, 648 + sin(t * 1.3) * 44, 120 + cos(t) * 38);
      let d3 = dist(x, y, width - 92, height * 0.5);
      let md = dist(x, y, hoverX, hoverY);

      let spiral = atan2(y - 112, x - 668) * 3.8 + d2 * 0.066;
      let moire = sin(d1 * 0.103 - t * 4.2) + cos(d3 * 0.142 + x * 0.022);
      let melt = sin((x * 0.012 + y * 0.033) + panelFold * 6.5 + t * 2.4);
      let mouseRipple = sin(md * 0.12 - frameCount * 0.08) * max(0, 1 - md / 230) * hoverPower;

      let tri = triangleField(x, y, width * 0.5, height * 0.52, 355, 236);
      let value = moire * 0.34 + sin(spiral) * 0.32 + melt * 0.2 + mouseRipple * 0.7 + tri * 0.44;
      value += sin((cell + 1) * 1.7 + ny * 8.0) * 0.13;
      value = fract(value * 0.33 + 0.56);

      let banded = floor(value * 13) / 13;
      let c = sampledColor(banded);

      if ((floor(x / step) + floor(y / step)) % 2 === 0) {
        c = lerpColor(c, color(255, 238, 201), 0.08);
      }

      fill(c);
      rect(x, y, step, step);
    }
  }
}

function drawPanelCuts() {
  blendMode(MULTIPLY);
  noStroke();
  for (let x = 0; x < width; x += 188) {
    fill(8, 12, 24, 64);
    rect(x - 5, 0, 10, height);
    fill(255, 211, 46, 36);
    rect(x + 8, 0, 5, height);
  }
  blendMode(BLEND);

  noFill();
  strokeWeight(3);
  for (let x = 0; x < width; x += 188) {
    stroke(0, 146, 235, 130);
    line(x + 1, 18, x + 1, height - 18);
    stroke(255, 244, 108, 105);
    line(x + 8, 0, x + 8, height);
  }
}

function drawTrianglePrisms() {
  let cx = width * 0.5 + sin(frameCount * 0.012) * 18;
  let cy = height * 0.52;

  noFill();
  for (let i = 0; i < 9; i++) {
    let grow = i * 18;
    strokeWeight(i < 2 ? 5 : 2);
    stroke(palette[(i + 2) % palette.length], 125 - i * 10);
    triangle(
      cx, cy - 124 - grow * 0.2,
      cx - 300 - grow, cy + 112 + grow * 0.1,
      cx + 300 + grow, cy + 112 + grow * 0.1
    );
  }

  blendMode(SCREEN);
  noStroke();
  fill(255, 226, 68, 48);
  triangle(cx - 285, cy + 106, cx, cy - 108, cx - 28, cy + 86);
  fill(0, 190, 255, 50);
  triangle(cx + 285, cy + 106, cx, cy - 108, cx + 28, cy + 86);
  fill(255, 98, 188, 44);
  triangle(cx - 54, cy + 92, cx + 54, cy + 92, cx, cy - 80);
  blendMode(BLEND);

  drawSmallTriangleTiles();
}

function drawSmallTriangleTiles() {
  let size = 44;
  noStroke();

  for (let x = 24; x < width; x += size) {
    for (let y = 10; y < height + size; y += size * 0.86) {
      let wobble = sin(x * 0.018 + y * 0.037 + frameCount * 0.025);
      let alpha = map(wobble, -1, 1, 10, 52);
      let c = palette[(floor(x / size) + floor(y / size)) % palette.length];
      fill(red(c), green(c), blue(c), alpha);

      if ((floor(x / size) + floor(y / size)) % 2 === 0) {
        triangle(x, y - size * 0.45, x - size * 0.5, y + size * 0.42, x + size * 0.5, y + size * 0.42);
      } else {
        triangle(x, y + size * 0.45, x - size * 0.5, y - size * 0.42, x + size * 0.5, y - size * 0.42);
      }
    }
  }
}

function drawHalftoneSkin() {
  noStroke();
  blendMode(MULTIPLY);
  for (let y = 1; y < height; y += 6) {
    fill(255, 116, 178, 18);
    rect(0, y, width, 2);
  }
  for (let x = 2; x < width; x += 8) {
    fill(0, 140, 190, 14);
    rect(x, 0, 2, height);
  }
  blendMode(BLEND);

  noFill();
  stroke(255, 236, 175, 80);
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    let ox = sin(frameCount * 0.01 + i) * 12;
    arc(730 + ox, 154, 70 + i * 28, 44 + i * 18, -HALF_PI, PI + QUARTER_PI);
  }
}

function triangleField(x, y, cx, cy, w, h) {
  let ax = cx;
  let ay = cy - h * 0.55;
  let bx = cx - w * 0.5;
  let by = cy + h * 0.5;
  let px = cx + w * 0.5;
  let py = cy + h * 0.5;

  let d = min(distanceToSegment(x, y, ax, ay, bx, by), distanceToSegment(x, y, bx, by, px, py));
  d = min(d, distanceToSegment(x, y, px, py, ax, ay));
  return sin(d * 0.105 - frameCount * 0.035);
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  let vx = bx - ax;
  let vy = by - ay;
  let wx = px - ax;
  let wy = py - ay;
  let t = constrain((wx * vx + wy * vy) / (vx * vx + vy * vy), 0, 1);
  let dx = px - (ax + vx * t);
  let dy = py - (ay + vy * t);
  return sqrt(dx * dx + dy * dy);
}

function sampledColor(v) {
  v = constrain(v, 0, 0.999);
  let p = v * (palette.length - 1);
  let i = floor(p);
  let amt = smoothstep(0.14, 0.9, fract(p));
  return lerpColor(palette[i], palette[i + 1], amt);
}

function smoothstep(edge0, edge1, x) {
  x = constrain((x - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function fract(n) {
  return n - floor(n);
}
