function setup() {
  createCanvas(960, 540);
  pixelDensity(1);
  noLoop();
}

function draw() {
  randomSeed(54);
  noiseSeed(54);

  const L = 145;
  const R = width;
  const C = 1036;

  background(223, 221, 207);

  noStroke();

  // left black bar
  fill(11, 14, 20);
  rect(0, 0, L, height);

  // base red field
  fill(212, 30, 43);
  rect(L, 0, R - L, height);

  // top red variations
  fill(203, 29, 39, 190);
  rect(L, 0, R - L, 120);

  fill(220, 51, 48, 170);
  rect(L, 118, R - L, 258);

  fill(207, 27, 43);
  rect(L, 376, R - L, 34);

  // pale pink area hidden under yellow triangle
  fill(216, 109, 151);
  rect(C, 150, R - C, 225);

  // top left orange block
  fill(235, 111, 0);
  quad(L, 312, C, 0, C, 380, L, 380);

  // top right yellow block
  fill(238, 220, 0);
  triangle(C, 380, R, 0, R, 380);

  // middle band
  fill(197, 29, 48);
  rect(L, 410, R - L, 318);

  fill(154, 38, 91, 150);
  rect(L, 542, R - L, 186);

  // middle left green block
  fill(30, 136, 101);
  quad(L, 654, C, 410, C, 728, L, 728);

  // middle right yellow-green block
  fill(196, 205, 37);
  quad(C, 654, R, 410, R, 728, C, 728);

  // lower red stripe and orange field
  fill(207, 38, 45);
  rect(L, 728, R - L, 74);

  fill(225, 58, 19);
  rect(L, 802, R - L, 278);

  fill(218, 43, 38, 125);
  rect(L, 782, R - L, 62);

  // bottom black block
  fill(5, 7, 9);
  quad(L, 1012, C, 748, C, height, L, height);

  // bottom blue block
  fill(12, 82, 181);
  quad(C, 1012, R, 760, R, height, C, height);

  addPaintTexture(L, R);
  addCanvasGrain();
}

function addPaintTexture() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (y * width + x);

      const n1 = noise(x * 0.006, y * 0.006);
      const n2 = noise(x * 0.035 + 40, y * 0.035 + 80);
      const grain = random(-10, 10);
      const paper = map(n1, 0, 1, -9, 8) + map(n2, 0, 1, -4, 4) + grain;

      pixels[i + 0] = constrain(pixels[i + 0] + paper, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + paper, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + paper, 0, 255);

      if (random() < 0.045) {
        const fleck = random(-18, 16);
        pixels[i + 0] = constrain(pixels[i + 0] + fleck, 0, 255);
        pixels[i + 1] = constrain(pixels[i + 1] + fleck, 0, 255);
        pixels[i + 2] = constrain(pixels[i + 2] + fleck, 0, 255);
      }
    }
  }

  updatePixels();

  noFill();

  for (let i = 0; i < 1800; i++) {
    stroke(255, random(5, 18));
    strokeWeight(random(0.4, 1.2));
    const x = random(width);
    const y = random(height);
    line(x, y, x + random(-40, 40), y + random(-2, 2));
  }

  for (let i = 0; i < 900; i++) {
    stroke(0, random(3, 12));
    strokeWeight(random(0.3, 0.8));
    const x = random(width);
    const y = random(height);
    line(x, y, x + random(-25, 25), y + random(-1.5, 1.5));
  }
}

function addCanvasGrain() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let i = 4 * (y * width + x);
      let grain = random(-10, 10);
      let weave = sin(y * 0.2) * 2 + sin(x * 0.35) * 1;

      pixels[i] = constrain(pixels[i] + grain + weave, 0, 255);
      pixels[i + 1] = constrain(pixels[i + 1] + grain + weave, 0, 255);
      pixels[i + 2] = constrain(pixels[i + 2] + grain + weave, 0, 255);
    }
  }

  updatePixels();

  noFill();
  stroke(240, 235, 208, 120);
  strokeWeight(8);
  rect(4, 4, width - 8, height - 8);

  stroke(7, 8, 12, 70);
  strokeWeight(3);
  line(145, 0, 145, height);
  line(1036, 0, 1036, height);
  line(145, 380, width, 380);
  line(145, 728, width, 728);
}