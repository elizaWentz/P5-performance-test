// Export single risograph-style triangles as transparent PNGs.
// Press 1-5 to preview a color, then press S to save that triangle.
// Press A to save all colors.
let palette;
let currentIndex = 0;
let trianglePoints;

function setup() {
  createCanvas(1000, 1000);
  pixelDensity(1);
  noLoop();

  palette = [
    { name: "fluorescent-red", hex: "#FF6D6A" },
    { name: "cyan-blue", hex: "#00A7E1" },
    { name: "yellow", hex: "#FFD23F" },
    { name: "teal", hex: "#1B998B" },
    { name: "orange", hex: "#F46036" }
  ];

  trianglePoints = makeTrianglePoints(width / 2, height / 2, 330, -HALF_PI);
}

function draw() {
  drawTriangleExport(currentIndex, false);
}

function keyPressed() {
  if (key >= "1" && key <= "5") {
    currentIndex = Number(key) - 1;
    redraw();
    return;
  }

  if (key === "s" || key === "S") {
    saveTriangle(currentIndex);
    return;
  }

  if (key === "a" || key === "A") {
    for (let i = 0; i < palette.length; i++) {
      saveTriangle(i);
    }
  }
}

function saveTriangle(index) {
  drawTriangleExport(index, true);
  saveCanvas(`triangle-${palette[index].name}`, "png");
  drawTriangleExport(currentIndex, false);
}

function drawTriangleExport(index, isExporting) {
  clear();
  randomSeed(index + 10);

  const ink = color(palette[index].hex);
  let inkPalette = palette
    .filter((item, itemIndex) => itemIndex !== index)
    .map((item) => color(item.hex));

  // A faint preview checkerboard makes transparency visible on screen.
  if (!isExporting) {
    drawTransparencyPreview();
  }

  blendMode(MULTIPLY);
  noStroke();

  // Choose 2-3 ink layers for the triangle.
  let layers = floor(random(2, 4));
  shuffle(inkPalette, true);
  inkPalette = [ink, ...inkPalette];

  for (let i = 0; i < layers; i++) {
    let col = inkPalette[i];
    let alphaVal = random(120, 200);

    fill(red(col), green(col), blue(col), alphaVal);
    noStroke();

    // Slight offset per layer to mimic misalignment.
    let offX = random(-6, 6);
    let offY = random(-6, 6);

    beginShape();
    for (let p of trianglePoints) {
      vertex(p.x + offX, p.y + offY);
    }
    endShape(CLOSE);
  }

  blendMode(BLEND);
  drawGrain(ink);

  if (!isExporting) {
    drawPreviewLabel(index);
  }
}

function makeTrianglePoints(cx, cy, radius, angle) {
  const pts = [];

  for (let i = 0; i < 3; i++) {
    const a = angle + (i * TAU) / 3;
    pts.push(createVector(cx + cos(a) * radius, cy + sin(a) * radius));
  }

  return pts;
}

function drawPaperTexture() {
  strokeWeight(1);
  for (let i = 0; i < 7000; i++) {
    let x = random(width);
    let y = random(height);
    let v = random(230, 255);
    stroke(v, v, v, 20);
    point(x, y);
  }
}

// Fine grain / speckle to get risograph noise
function drawGrain(ink) {
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

  // A few colored specks on top, kept inside the triangle for transparent PNGs.
  let specks = 0;

  while (specks < 1200) {
    let x = random(width);
    let y = random(height);

    if (!isInsideTriangle(x, y, trianglePoints)) {
      continue;
    }

    stroke(red(ink), green(ink), blue(ink), random(40, 90));
    strokeWeight(random(0.5, 1.3));
    point(x, y);
    specks++;
  }
}

function isInsideTriangle(x, y, pts) {
  const d1 = triangleSign(x, y, pts[0], pts[1]);
  const d2 = triangleSign(x, y, pts[1], pts[2]);
  const d3 = triangleSign(x, y, pts[2], pts[0]);

  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;

  return !(hasNegative && hasPositive);
}

function triangleSign(x, y, p1, p2) {
  return (x - p2.x) * (p1.y - p2.y) - (p1.x - p2.x) * (y - p2.y);
}

function drawTransparencyPreview() {
  const tile = 50;

  noStroke();
  for (let y = 0; y < height; y += tile) {
    for (let x = 0; x < width; x += tile) {
      const isLight = (x / tile + y / tile) % 2 === 0;
      fill(isLight ? "#f6f6f6" : "#e8e8e8");
      rect(x, y, tile, tile);
    }
  }
}

function drawPreviewLabel(index) {
  fill("#222222");
  noStroke();
  textSize(28);
  textAlign(LEFT, BASELINE);
  text(`Preview: ${palette[index].name} | 1-5 change color | S save | A save all`, 40, height - 40);
}
