// Riso-inspired triangle composition
// Canvas: 1128 x 308
// p5.js for VS Code

function setup() {
  createCanvas(1128, 308);
  noLoop();

  // Paper color
  background(245, 240, 230);

  // Subtle paper texture
  drawPaperTexture();

  // Risograph-style color layers
  drawTriangleLayer(color(255, 90, 110, 120), 60);   // fluorescent pink
  drawTriangleLayer(color(0, 140, 180, 120), 60);    // teal blue
  drawTriangleLayer(color(255, 200, 40, 100), 50);   // sunflower yellow

  // Grain overlay
  drawInkGrain();
}

function drawTriangleLayer(c, count) {
  noStroke();

  for (let i = 0; i < count; i++) {

    // Slight registration offset
    let offsetX = random(-4, 4);
    let offsetY = random(-4, 4);

    fill(red(c), green(c), blue(c), alpha(c));

    let x = random(width);
    let y = random(height);

    let size = random(30, 180);
    let angle = random(TWO_PI);

    push();
    translate(x + offsetX, y + offsetY);
    rotate(angle);

    triangle(
      -size * 0.5, size * 0.4,
      size * 0.5, size * 0.4,
      0, -size * 0.6
    );

    pop();
  }
}

function drawPaperTexture() {
  strokeWeight(1);

  for (let i = 0; i < 15000; i++) {
    stroke(255, 255, 255, random(5, 15));
    point(random(width), random(height));
  }

  for (let i = 0; i < 8000; i++) {
    stroke(0, 0, 0, random(3, 10));
    point(random(width), random(height));
  }
}

function drawInkGrain() {
  noStroke();

  for (let i = 0; i < 35000; i++) {
    fill(0, random(4, 15));

    let x = random(width);
    let y = random(height);

    let d = random(0.3, 1.8);
    ellipse(x, y, d, d);
  }

  // Imperfect riso speckles
  for (let i = 0; i < 3000; i++) {
    fill(255, random(5, 25));

    let x = random(width);
    let y = random(height);

    let d = random(1, 4);
    ellipse(x, y, d, d);
  }
}