var printTexture;
var paperTexture;
var triangles = [];
var bigTriangles = [];

var risoInks = [
  "#ff4f9a",
  "#00a8a8",
  "#f6d447",
  "#2d2a78",
  "#f26b3a"
];

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  generateComposition();
}

function draw() {
  background("#f8efd8");
  image(paperTexture, 0, 0);
  drawRisoTriangles();
  drawHoverHalo();
  drawRegistrationMarks();
  image(printTexture, 0, 0);
}

function mousePressed() {
  generateComposition();
}

function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("interactive-riso-triangles", "png");
  }
}

function generateComposition() {
  randomSeed(floor(random(100000)));
  noiseSeed(floor(random(100000)));

  triangles = [];
  bigTriangles = [];

  printTexture = createGraphics(width, height);
  paperTexture = createGraphics(width, height);
  printTexture.pixelDensity(1);
  paperTexture.pixelDensity(1);
  printTexture.clear();
  paperTexture.clear();

  var grid = 86;
  for (var y = -grid; y < height + grid; y += grid) {
    for (var x = -grid; x < width + grid; x += grid) {
      var size = random(62, 132);
      triangles.push({
        cx: x + random(-18, 18),
        cy: y + random(-18, 18),
        size: size,
        angle: random(TWO_PI),
        ink: risoInks[floor(random(risoInks.length))],
        flip: random() > 0.5 ? 1 : -1,
        wobble: random(0.01, 0.035),
        vertices: makeTriangleVertices(size)
      });
    }
  }

  addBigTriangle(width * 0.2, height * 0.18, 260, "#ff4f9a", -0.35);
  addBigTriangle(width * 0.77, height * 0.33, 310, "#00a8a8", 0.42);
  addBigTriangle(width * 0.48, height * 0.77, 330, "#f6d447", -0.08);

  drawStaticPaper();
  drawStaticPrintGrain();
}

function addBigTriangle(x, y, size, ink, angle) {
  bigTriangles.push({
    x: x,
    y: y,
    size: size,
    ink: ink,
    angle: angle,
    vertices: makeTriangleVertices(size),
    innerVertices: makeTriangleVertices(size * 0.88)
  });
}

function makeTriangleVertices(size) {
  var vertices = [];
  for (var i = 0; i < 3; i++) {
    var a = -HALF_PI + i * TWO_PI / 3;
    var jitter = size * 0.07;
    vertices.push({
      x: cos(a) * size * 0.56 + random(-jitter, jitter),
      y: sin(a) * size * 0.56 + random(-jitter, jitter)
    });
  }
  return vertices;
}

function drawRisoTriangles() {
  blendMode(MULTIPLY);

  for (var i = 0; i < triangles.length; i++) {
    var tri = triangles[i];
    var distanceToMouse = dist(mouseX, mouseY, tri.cx, tri.cy);
    var hover = constrain(1 - distanceToMouse / 145, 0, 1);
    var pulse = sin(frameCount * 0.08 + tri.cx * 0.03 + tri.cy * 0.02) * hover;
    var pushAway = atan2(tri.cy - mouseY, tri.cx - mouseX);
    var drift = hover * 16;
    var scaleBoost = 1 + hover * 0.22;
    var angleBoost = tri.angle + pulse * tri.wobble * 18;

    drawInkPass(tri, -2.5 - hover * 9, 2.2 + hover * 6, 105 + hover * 50, pushAway, drift, scaleBoost, angleBoost);
    drawInkPass(tri, 2.1 + hover * 8, -1.6 - hover * 7, 88 + hover * 62, pushAway, drift, scaleBoost, angleBoost);
    drawInkPass(tri, 0, 0, 155 + hover * 55, pushAway, drift, scaleBoost, angleBoost);
  }

  drawLargeOverprints();
  blendMode(BLEND);
}

function drawInkPass(tri, offsetX, offsetY, alpha, pushAway, drift, scaleBoost, angleBoost) {
  var inkColor = color(tri.ink);
  inkColor.setAlpha(alpha);

  push();
  translate(
    tri.cx + offsetX + cos(pushAway) * drift,
    tri.cy + offsetY + sin(pushAway) * drift
  );
  rotate(angleBoost + offsetX * 0.005);
  scale(scaleBoost, scaleBoost * tri.flip);
  fill(inkColor);
  noStroke();
  drawTriangleVertices(tri.vertices);
  pop();
}

function drawTriangleVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}

function drawLargeOverprints() {
  for (var i = 0; i < bigTriangles.length; i++) {
    var anchor = bigTriangles[i];
    var hover = constrain(1 - dist(mouseX, mouseY, anchor.x, anchor.y) / 250, 0, 1);
    var ink = color(anchor.ink);

    push();
    translate(anchor.x, anchor.y);
    rotate(anchor.angle + hover * 0.12);
    scale(1 + hover * 0.08);

    ink.setAlpha(86 + hover * 40);
    fill(ink);
    noStroke();
    drawTriangleVertices(anchor.vertices);

    ink.setAlpha(48 + hover * 50);
    translate(-5 + hover * 13, 4 - hover * 10);
    rotate(0.04);
    drawTriangleVertices(anchor.innerVertices);
    pop();
  }
}

function drawHoverHalo() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }

  blendMode(MULTIPLY);
  noFill();
  for (var r = 32; r < 155; r += 12) {
    var ink = color(r % 24 === 0 ? "#00a8a8" : "#ff4f9a");
    ink.setAlpha(map(r, 32, 155, 38, 5));
    stroke(ink);
    strokeWeight(2);
    triangle(
      mouseX,
      mouseY - r * 0.58,
      mouseX - r * 0.5,
      mouseY + r * 0.36,
      mouseX + r * 0.5,
      mouseY + r * 0.36
    );
  }
  blendMode(BLEND);
}

function drawStaticPaper() {
  var fiberColors = ["#e6d7b6", "#fff7df", "#d7c7a7"];

  paperTexture.strokeWeight(1);
  for (var i = 0; i < 700; i++) {
    var x = random(width);
    var y = random(height);
    var fiber = color(fiberColors[floor(random(fiberColors.length))]);
    fiber.setAlpha(random(24, 62));
    paperTexture.stroke(fiber);
    paperTexture.line(x, y, x + random(-20, 20), y + random(-3, 3));
  }
}

function drawStaticPrintGrain() {
  for (var i = 0; i < 9000; i++) {
    var x = random(width);
    var y = random(height);
    var alpha = random(8, 30);
    var d = random(0.4, 1.7);
    printTexture.noStroke();
    printTexture.fill(34, 28, 45, alpha);
    printTexture.ellipse(x, y, d, d);
  }

  for (var j = 0; j < 1600; j++) {
    var sx = random(width);
    var sy = random(height);
    var lineAlpha = random(7, 22);
    printTexture.stroke(255, 248, 224, lineAlpha);
    printTexture.strokeWeight(random(0.35, 1.2));
    printTexture.line(sx, sy, sx + random(-10, 10), sy + random(-2, 2));
  }
}

function drawRegistrationMarks() {
  var hoverNudge = dist(mouseX, mouseY, width / 2, height / 2) < 250 ? 3 : 0;
  var ink = color("#2d2a78");
  var margin = 26;

  ink.setAlpha(120);
  stroke(ink);
  strokeWeight(1.5);
  noFill();

  drawOneRegistrationMark(margin, margin, -hoverNudge, -hoverNudge);
  drawOneRegistrationMark(width - margin, margin, hoverNudge, -hoverNudge);
  drawOneRegistrationMark(margin, height - margin, -hoverNudge, hoverNudge);
  drawOneRegistrationMark(width - margin, height - margin, hoverNudge, hoverNudge);
}

function drawOneRegistrationMark(x, y, sx, sy) {
  line(x - 10 + sx, y + sy, x + 10 + sx, y + sy);
  line(x + sx, y - 10 + sy, x + sx, y + 10 + sy);
  triangle(x - 5 + sx, y - 15 + sy, x + 5 + sx, y - 15 + sy, x + sx, y - 6 + sy);
}
