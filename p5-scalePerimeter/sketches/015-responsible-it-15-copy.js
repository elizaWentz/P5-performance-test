let triSizeBase = 40;

function setup() {
  createCanvas(1128, 308);   // change if you want it full-screen
  noStroke();
}

function draw() {
  background(20);
  colorMode(RGB);

  // triangle size depends on mouseY
  let triSize = map(mouseY, 0, height, triSizeBase * 0.4, triSizeBase * 1.6);
  triSize = constrain(triSize, 10, 100);

  let h = triSize * Math.sqrt(3) / 2;

  // center of the gradient follows mouseX (but limited)
  let centerX = map(mouseX, 0, width, width * 0.25, width * 0.75);

  // colors
  let centerCol = color(0, 15, 70);      // dark center
  let midCol    = color(0, 90, 190);     // medium
  let edgeCol   = color(170, 240, 255);  // light edges

  for (let row = 0, y = -h; y < height + h; row++, y += h) {
    let offset = (row % 2 === 0) ? 0 : triSize / 2;

    for (let col = 0, x = -triSize; x < width + triSize; col++, x += triSize) {
      let cx = x + offset;
      let cy = y;

      // horizontal distance from interactive center
      let t = abs(cx - centerX) / (width * 0.5);
      t = constrain(t, 0, 1);

      let c;
      if (t < 0.5) {
        let tt = map(t, 0, 0.5, 0, 1);
        c = lerpColor(centerCol, midCol, tt);
      } else {
        let tt = map(t, 0.5, 1, 0, 1);
        c = lerpColor(midCol, edgeCol, tt);
      }

      fill(c);

      // full triangle grid
      drawTriangle(cx, cy, triSize, h, true);
      drawTriangle(cx, cy, triSize, h, false);
    }
  }
}

function drawTriangle(cx, cy, w, h, up) {
  if (up) {
    triangle(
      cx,         cy - h / 2,
      cx - w / 2, cy + h / 2,
      cx + w / 2, cy + h / 2
    );
  } else {
    triangle(
      cx,         cy + h / 2,
      cx - w / 2, cy - h / 2,
      cx + w / 2, cy - h / 2
    );
  }
}

// optional: make canvas responsive
function windowResized() {
  // if you want full screen, replace with: resizeCanvas(windowWidth, windowHeight);
  resizeCanvas(982, 456);
}