function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  noLoop();
}

function draw() {
  colorMode(RGB, 255);
  background(10);

  let stripeW = 8;
  let topPurple = color('#bba4ff');
  let midPurple = color('#7b63d1');
  let bottomPurple = color('#110018');

  let hot1 = color('#ff9f8a');
  let hot2 = color('#ff4f5c');

  noStroke();

  for (let x = 0; x < width; x += stripeW) {
    let cx = x + stripeW * 0.5;

    for (let y = 0; y < height; y += 2) {
      let ny = y / height;

      let baseCol;
      if (ny < 0.5) {
        baseCol = lerpColor(topPurple, midPurple, ny * 2.0);
      } else {
        baseCol = lerpColor(midPurple, bottomPurple, (ny - 0.5) * 2.0);
      }

      let center1 =
        width * 0.25 -
        sin(y * 0.008) * width * 0.18 -
        sin(y * 0.0025) * width * 0.10;

      let center2 =
        width * 0.7 -
        sin(y * 0.006) * width * 0.20 -
        sin(y * 0.0018) * width * 0.12;

      let d1 = abs(cx - center1);
      let d2 = abs(cx - center2);

      let glow1 = exp(-sq(d1) * 0.0006);
      let glow2 = exp(-sq(d2) * 0.0006);

      let glow = constrain(glow1 + glow2, 0, 1.3);

      let hotBlend = lerpColor(hot1, hot2, ny);
      let mixAmount = glow;
      let col = lerpColor(baseCol, hotBlend, mixAmount);

      let stripeFactor = map(
        abs((cx % stripeW) - stripeW / 2),
        0,
        stripeW / 2,
        1.0,
        0.7
      );
      col.setRed(col.levels[0] * stripeFactor);
      col.setGreen(col.levels[1] * stripeFactor);
      col.setBlue(col.levels[2] * stripeFactor);

      fill(col);
      rect(x, y, stripeW * 0.9, 2);
    }
  }

  // Film grain
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    let n = random(-25, 25);
    pixels[i]     = constrain(pixels[i] + n, 0, 255);
    pixels[i + 1] = constrain(pixels[i + 1] + n, 0, 255);
    pixels[i + 2] = constrain(pixels[i + 2] + n, 0, 255);
  }
  updatePixels();

  // Rotate the finished design
  rotateCanvas();
}

function rotateCanvas() {
  // grab current frame
  let pg = createGraphics(width, height);
  pg.image(get(), 0, 0);

  clear();

  push();
  translate(width / 2, height / 2); // rotate around center
  rotate(PI);                       // 180° rotation
  imageMode(CENTER);
  image(pg, 0, 0);
  pop();
}