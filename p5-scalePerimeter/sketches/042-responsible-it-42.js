function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  noLoop();
}

function draw() {
  randomSeed(7);
  noiseSeed(7);

  const yellow = color(220, 187, 43);
  const orange = color(221, 76, 37);

  background(yellow);

  const tile = 736;
  const s = height / tile;
  const scaledTile = tile * s;

  noStroke();

  for (let x = 0; x < width + scaledTile; x += scaledTile) {
    push();
    translate(x, 0);
    scale(s);
    drawPatternTile(orange);
    pop();
  }

  addFabricTexture();
  blendMode(BLEND);
  drawGrain();
}

function drawPatternTile(orange) {
  fill(orange);

  quad(184, 0, 368, 184, 184, 368, 0, 184);

  rect(368, 0, 92, 92);
  triangle(460, 92, 552, 0, 644, 92);
  rect(644, 0, 92, 92);

  triangle(368, 184, 460, 92, 460, 276);
  quad(552, 92, 644, 184, 552, 276, 460, 184);
  triangle(644, 92, 736, 184, 644, 276);

  rect(368, 276, 92, 92);
  triangle(460, 276, 552, 368, 644, 276);
  rect(644, 276, 92, 92);

  quad(552, 368, 736, 552, 552, 736, 368, 552);

  rect(0, 368, 92, 92);
  triangle(92, 460, 184, 368, 276, 460);
  rect(276, 368, 92, 92);

  triangle(0, 552, 92, 460, 92, 644);
  quad(184, 460, 276, 552, 184, 644, 92, 552);
  triangle(276, 460, 368, 552, 276, 644);

  rect(0, 644, 92, 92);
  triangle(92, 644, 184, 736, 276, 644);
  rect(276, 644, 92, 92);
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