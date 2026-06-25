function setup() {
  createCanvas(1920, 1080); // Changed canvas size to 1080 x 1920 for 90-degree rotation
  pixelDensity(1);
  noLoop(); // één stilstaand beeld
}

function draw() {
  colorMode(RGB, 255);
  background(10);

  let stripeH = 8; // Adjusted stripe height to maintain proportionality
  let topPurple = color('#bba4ff');
  let midPurple = color('#7b63d1');
  let bottomPurple = color('#110018');

  let hot1 = color('#ff9f8a');
  let hot2 = color('#ff4f5c');

  noStroke();

  // -------------------------
  // HORIZONTALE RIBBELS + GLOED
  // -------------------------
  for (let y = 0; y < height; y += stripeH) {
    let cy = y + stripeH * 0.5; // midden van de ribbel

    for (let x = 0; x < width; x += 2) {
      let nx = x / width;

      // Basis paarse horizontale gradient (drie‑staps)
      let baseCol;
      if (nx < 0.5) {
        baseCol = lerpColor(topPurple, midPurple, nx * 2.0);
      } else {
        baseCol = lerpColor(midPurple, bottomPurple, (nx - 0.5) * 2.0);
      }

      // Golvende "banden" waar warm licht zit
      // Eerste band (meer naar boven)
      let center1 =
        height * 0.25 +
        sin(x * 0.008) * height * 0.18 +
        sin(x * 0.0025) * height * 0.10;

      // Tweede band (meer naar beneden)
      let center2 =
        height * 0.7 +
        sin(x * 0.006) * height * 0.20 +
        sin(x * 0.0018) * height * 0.12;

      let d1 = abs(cy - center1);
      let d2 = abs(cy - center2);

      // Hoe dichter bij de middenlijn, hoe feller.
      let glow1 = exp(-sq(d1) * 0.0006);
      let glow2 = exp(-sq(d2) * 0.0006);

      let glow = constrain(glow1 + glow2, 0, 1.3);

      // Meng warm rood/roze in de paarse basis
      let hotBlend = lerpColor(hot1, hot2, nx);
      let mixAmount = glow; // hoeveel warm licht erdoor komt
      let col = lerpColor(baseCol, hotBlend, mixAmount);

      // subtiele donkerte tussen de ribbels (ribbelstructuur)
      let stripeFactor = map(abs((cy % stripeH) - stripeH / 2), 0, stripeH / 2, 1.0, 0.7);
      col.setRed(col.levels[0] * stripeFactor);
      col.setGreen(col.levels[1] * stripeFactor);
      col.setBlue(col.levels[2] * stripeFactor);

      fill(col);
      rect(x, y, 2, stripeH * 0.9);
    }
  }

  // -------------------------
  // FILM GRAIN / RUIS
  // -------------------------
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    let n = random(-25, 25); // sterkte van de ruis
    pixels[i] = constrain(pixels[i] + n, 0, 255); // R
    pixels[i + 1] = constrain(pixels[i + 1] + n, 0, 255); // G
    pixels[i + 2] = constrain(pixels[i + 2] + n, 0, 255); // B
    // alpha (pixels[i+3]) laten we zoals het is
  }
  updatePixels();
}