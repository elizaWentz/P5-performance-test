// --- settings ---
let hexR = 60; // radius of hexagon (distance from center to any vertex)

let colOrange, colBlue, colDark;

function setup() {
  createCanvas(1128, 308);   // same size as your image (change if needed)
  noStroke();
  colorMode(RGB);

  // approximate colors from the image (tweak if you like)
  colOrange = color(245, 110, 40);  // orange
  colBlue   = color(30, 120, 210);  // blue
  colDark   = color(20, 10, 90);    // dark blue

  noLoop();
}

function draw() {
  background(255);

  // axial hex coordinates (q,r) mapped to pixel positions for a flat‑topped grid
  // x = R * (3/2 * q)
  // y = R * (sqrt(3) * (r + q/2))
  let r = hexR;
  let root3 = sqrt(3);

  // we loop over a range of axial coordinates big enough to cover the canvas
  for (let q = -10; q <= 20; q++) {
    for (let s = -10; s <= 10; s++) {
      // convert axial (q, s) to pixel
      let x = width / 2  + r * (1.5 * q);
      let y = height / 2 + r * (root3 * (s + q / 2));

      // only draw if inside (or just outside) the canvas
      if (x < -r || x > width + r || y < -r || y > height + r) continue;

      // choose color based on position to match repeating pattern
      // tweak this rule to shift where orange / blue / dark appear
      let t = (q - s) % 3;
      if (t < 0) t += 3;

      let c;
      if (t === 0)      c = colOrange;
      else if (t === 1) c = colBlue;
      else              c = colDark;

      fill(c);

      // --- added: hover effect (grow hex when mouse is near its center) ---
      let currentR = r;
      let d = dist(mouseX, mouseY, x, y);
      if (d < r) {
        currentR = r * 1.1; // growth factor (make smaller for subtler effect)
      }
      // --------------------------------------------------------------

      drawHex(x, y, currentR);
    }
  }
}

// draw one flat‑topped hexagon
function drawHex(cx, cy, r) {
  beginShape();
  for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
    let vx = cx + cos(a) * r;
    let vy = cy + sin(a) * r;
    vertex(vx, vy);
  }
  endShape(CLOSE);
}

// --- added: redraw whenever the mouse moves (because of noLoop) ---
function mouseMoved() {
  redraw();
}