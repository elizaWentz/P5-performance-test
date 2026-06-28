let triSize = 40; // size of triangles

function setup() {
  createCanvas(960, 540);
  noStroke();
}

function draw() {
  background(color(15, 30, 70));
  colorMode(RGB);

  let h = triSize * Math.sqrt(3) / 2;

  // ---- subtle interaction controls ----
  // brightness: top = brighter, bottom = darker
  let brightAmt = map(mouseY, 0, height, 0.3, -0.3); // -0.3..0.3 later used for lerp
  // hue-ish shift: left = base blue, right = more cyan
  let hueAmt = map(mouseX, 0, width, 0, 0.25);       // 0..0.25

  // base gradient colors (no interaction)
  let baseCenterCol = color(0, 15, 70);
  let baseMidCol    = color(0, 90, 190);
  let baseEdgeCol   = color(170, 240, 255);

  // alternate palette we blend toward for subtle hue change
  let altCenterCol = color(10, 0, 80);
  let altMidCol    = color(0, 120, 220);
  let altEdgeCol   = color(190, 250, 255);

  // blend base palette with alternate palette based on mouseX
  let centerCol = lerpColor(baseCenterCol, altCenterCol, hueAmt);
  let midCol    = lerpColor(baseMidCol,    altMidCol,    hueAmt);
  let edgeCol   = lerpColor(baseEdgeCol,   altEdgeCol,   hueAmt);

  for (let row = 0, y = -h; y < height + h; row++, y += h) {
    let offset = (row % 2 === 0) ? 0 : triSize / 2;

    for (let col = 0, x = -triSize; x < width + triSize; col++, x += triSize) {
      let cx = x + offset;
      let cy = y;

      // horizontal distance from fixed center (no shifting)
      let t = abs(cx - width / 2) / (width / 2);
      t = constrain(t, 0, 1);

      // center -> mid -> edge gradient
      let c;
      if (t < 0.5) {
        let tt = map(t, 0, 0.5, 0, 1);
        c = lerpColor(centerCol, midCol, tt);
      } else {
        let tt = map(t, 0.5, 1, 0, 1);
        c = lerpColor(midCol, edgeCol, tt);
      }

      // apply global brightness adjustment based on mouseY
      if (brightAmt > 0) {
        c = lerpColor(c, color(255), brightAmt); // toward white
      } else if (brightAmt < 0) {
        c = lerpColor(c, color(0), -brightAmt);  // toward black
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