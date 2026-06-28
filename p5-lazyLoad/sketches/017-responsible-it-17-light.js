let step = 44;
let palette;

function setup() {
  createCanvas(1128, 308);
  noStroke();
  colorMode(RGB);
  palette = [
    color(245, 92, 42),
    color(248, 180, 42),
    color(22, 118, 205),
    color(9, 33, 92),
    color(246, 246, 238)
  ];
}

function draw() {
  background(12, 18, 42);

  for (let y = -step; y < height + step; y += step) {
    for (let x = -step; x < width + step; x += step) {
      let col = floor(x / step);
      let row = floor(y / step);
      let shift = (row % 2) * (step / 2);
      let px = x + shift;

      drawTriangleCell(px, y, col, row);
    }
  }

  drawTriangleBursts();
}

function drawTriangleCell(x, y, col, row) {
  let centerX = x + step / 2;
  let centerY = y + step / 2;
  let mouseDistance = dist(mouseX, mouseY, centerX, centerY);
  let spotlight = max(0, 1 - mouseDistance / 190);
  let ripple = max(0, 1 - mouseDistance / 170);
  let pulse = sin((col * 0.7) + (row * 1.15)) * 8;
  let s = step + pulse;
  let c1 = palette[abs(col + row) % palette.length];
  let c2 = palette[abs(col * 2 - row + 3) % palette.length];
  let glow1 = lerpColor(c1, color(255, 246, 190), spotlight * 0.75);
  let glow2 = lerpColor(c2, color(255, 128, 64), spotlight * 0.65);
  let offset = ripple * 12;

  fill(glow1);
  if ((col + row) % 2 === 0) {
    triangle(x - offset, y - offset, x + s + offset, y, x, y + s + offset);
  } else {
    triangle(x + s + offset, y - offset, x + s, y + s + offset, x - offset, y + s);
  }

  fill(glow2);
  if ((col - row) % 3 === 0) {
    triangle(x + s + offset, y, x + s * 0.5, y + s * 0.5, x + s + offset, y + s);
  } else {
    triangle(x - offset, y, x + s * 0.5, y + s * 0.5, x - offset, y + s);
  }
}

function drawTriangleBursts() {
  for (let x = -30; x < width + 80; x += 94) {
    let y = height / 2 + sin(x * 0.018) * 78;
    let size = 34 + sin(x * 0.04) * 12;

    fill(255, 245, 215, 190);
    triangle(x, y - size, x - size * 0.65, y + size * 0.55, x + size * 0.65, y + size * 0.55);

    fill(17, 40, 108, 180);
    triangle(x, y + size * 0.9, x - size * 0.52, y - size * 0.2, x + size * 0.52, y - size * 0.2);
  }
}
