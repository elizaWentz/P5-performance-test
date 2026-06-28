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
  let waveSpeed = map(mouseX, 0, width, 0.25, 1.6);
  let waveHeight = map(mouseY, 0, height, 3, 22);
  let pulse = sin((col * waveSpeed) + (row * 1.15)) * waveHeight;
  let s = step + pulse;
  let c1 = palette[abs(col + row) % palette.length];
  let c2 = palette[abs(col * 2 - row + 3) % palette.length];

  fill(c1);
  if ((col + row) % 2 === 0) {
    triangle(x, y, x + s, y, x, y + s);
  } else {
    triangle(x + s, y, x + s, y + s, x, y + s);
  }

  fill(c2);
  if ((col - row) % 3 === 0) {
    triangle(x + s, y, x + s * 0.5, y + s * 0.5, x + s, y + s);
  } else {
    triangle(x, y, x + s * 0.5, y + s * 0.5, x, y + s);
  }
}

function drawTriangleBursts() {
  for (let x = -30; x < width + 80; x += 94) {
    let waveStretch = map(mouseX, 0, width, 0.008, 0.04);
    let waveDepth = map(mouseY, 0, height, 28, 105);
    let y = height / 2 + sin(x * waveStretch) * waveDepth;
    let size = 34 + sin(x * waveStretch * 2.2) * 12;

    fill(255, 245, 215, 190);
    triangle(x, y - size, x - size * 0.65, y + size * 0.55, x + size * 0.65, y + size * 0.55);

    fill(17, 40, 108, 180);
    triangle(x, y + size * 0.9, x - size * 0.52, y - size * 0.2, x + size * 0.52, y - size * 0.2);
  }
}
