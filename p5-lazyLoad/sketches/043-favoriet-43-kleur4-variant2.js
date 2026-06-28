const palette = [
  "#e5232a",
  "#78001f",
  "#f6bd22",
  "#fb8624",
  "#e43b11",
  "#a90034",
];

function setup() {
  createCanvas(1920, 1080);
  noLoop();
  pixelDensity(1);
}

function draw() {
  background(palette[0]);

  const cols = {
    rust: palette[1],
    yellow: palette[2],
    blue: palette[3],
    peach: palette[5],
    pink: palette[4]
  };

  const bands = 16;
  const bandW = width / bands;

  noStroke();

  for (let i = 0; i < bands; i++) {
    const x = i * bandW;
    const left = x;
    const right = x + bandW;
    const flip = i % 2 === 1;

    fill(cols.rust);
    rect(x, 0, bandW, height);

    if (!flip) {
      fill(cols.yellow);
      triangle(left, yDiagonal(0.355, i, bands), right, yDiagonal(0.475, i, bands), left, yDiagonal(0.595, i, bands));

      fill(cols.blue);
      quad(right, yDiagonal(0.595, i, bands), right, yDiagonal(0.745, i, bands), left, yDiagonal(0.845, i, bands), left, yDiagonal(0.695, i, bands));

      fill(cols.peach);
      triangle(right, yDiagonal(0.745, i, bands), left, yDiagonal(0.845, i, bands), right, yDiagonal(0.945, i, bands));

      fill(cols.pink);
      quad(left, yDiagonal(0.845, i, bands), left, yDiagonal(1, i, bands), right, yDiagonal(1, i, bands), right, yDiagonal(0.945, i, bands));
    } else {
      fill(cols.pink);
      quad(right, yDiagonal(0, i, bands), right, yDiagonal(0.055, i, bands), left, yDiagonal(0.155, i, bands), left, yDiagonal(0, i, bands));

      fill(cols.peach);
      triangle(right, yDiagonal(0.055, i, bands), left, yDiagonal(0.155, i, bands), right, yDiagonal(0.255, i, bands));

      fill(cols.blue);
      quad(right, yDiagonal(0.255, i, bands), right, yDiagonal(0.445, i, bands), left, yDiagonal(0.345, i, bands), left, yDiagonal(0.155, i, bands));

      fill(cols.yellow);
      triangle(right, yDiagonal(0.445, i, bands), left, yDiagonal(0.565, i, bands), left, yDiagonal(0.345, i, bands));
    }
  }

  drawDiagonalEchoes(bandW, bands, cols);
  addFabricTexture();
  blendMode(BLEND);
  drawGrain();
}

function yDiagonal(value, bandIndex, bandCount) {
  const diagonalOffset = (bandIndex - (bandCount - 1) * 0.5) * height * 0.032;
  return height * value + diagonalOffset;
}

function drawDiagonalEchoes(bandW, bandCount, cols) {
  push();
  blendMode(MULTIPLY);
  noStroke();

  for (let i = 0; i < bandCount; i++) {
    const x = i * bandW;
    const midX = x + bandW * 0.5;
    const topY = yDiagonal(i % 2 === 0 ? 0.405 : 0.555, i, bandCount);
    const bottomY = topY + height * 0.09;

    fill(red(cols.yellow), green(cols.yellow), blue(cols.yellow), 70);
    quad(midX, topY, x + bandW * 0.84, topY + height * 0.045, midX, bottomY, x + bandW * 0.16, topY + height * 0.045);
  }

  pop();
}

function addFabricTexture() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (y * width + x);

      const grain =
        noise(x * 0.015, y * 0.015) * 11 +
        noise(x * 0.08, y * 0.08) * 5 +
        sin(x * 0.7) * 1.7 +
        sin(y * 0.75) * 1.7 +
        random(-2.2, 2.2) -
        8;

      pixels[i] = constrain(pixels[i] + grain, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + grain * 0.85, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + grain * 0.55, 0, 255);
    }
  }

  updatePixels();

  push();
  blendMode(MULTIPLY);
  stroke(110, 90, 35, 10);
  strokeWeight(1);

  for (let y = 0; y < height; y += 3) {
    line(0, y, width, y);
  }

  for (let x = 0; x < width; x += 4) {
    line(x, 0, x, height);
  }

  pop();
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
