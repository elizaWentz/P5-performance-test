const palette = [
  "#d9825b",
  "#4f2f3b",
  "#d6a338",
  "#9dc9d3",
  "#b84f3a",
  "#d7a1a4",
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
    const flip = i % 2 === 1;

    fill(cols.rust);
    rect(x, 0, bandW, height);

    if (!flip) {
      fill(cols.yellow);
      triangle(x + bandW, height * 0.355, x, height * 0.475, x + bandW, height * 0.595);

      fill(cols.blue);
      quad(x, height * 0.595, x, height * 0.745, x + bandW, height * 0.845, x + bandW, height * 0.695);

      fill(cols.peach);
      triangle(x, height * 0.745, x + bandW, height * 0.845, x, height * 0.945);

      fill(cols.pink);
      quad(x + bandW, height * 0.845, x + bandW, height, x, height, x, height * 0.945);
    } else {
      fill(cols.pink);
      quad(x, 0, x, height * 0.055, x + bandW, height * 0.155, x + bandW, 0);

      fill(cols.peach);
      triangle(x, height * 0.055, x + bandW, height * 0.155, x, height * 0.255);

      fill(cols.blue);
      quad(x, height * 0.255, x, height * 0.445, x + bandW, height * 0.345, x + bandW, height * 0.155);

      fill(cols.yellow);
      triangle(x, height * 0.445, x + bandW, height * 0.565, x + bandW, height * 0.345);
    }
  }

  addFabricTexture();
  blendMode(BLEND);
  drawGrain();
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
