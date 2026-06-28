

function setup() {
  createCanvas(1128, 308);
  noStroke();
}

function draw() {
  background(8, 6, 28);

  let s = 62;

  // mouse influence
  let mx = map(mouseX, 0, width, -20, 20);
  let my = map(mouseY, 0, height, -20, 20);

  for (let y = 0; y < height + s; y += s) {
    for (let x = 0; x < width + s; x += s) {

      // distance from center
      let dx = x - width / 2;
      let dy = y - height / 2;

      // layered parallax depth
      let depth = map(dist(x, y, width/2, height/2), 0, width/2, 1.8, 0.3);

      // subtle movement
      let offsetX = mx * depth * 0.15;
      let offsetY = my * depth * 0.15;

      // tiny reactive rotation
      let rot =
        sin(frameCount * 0.01 + x * 0.02 + y * 0.01) * 0.08 +
        mx * 0.002;

      // dark HvA palette
      let c1 = color(
        35 + depth * 20,
        20,
        90 + depth * 60
      );

      let c2 = color(
        10,
        10,
        40
      );

      let c3 = color(
        140,
        100,
        255,
        170
      );

      push();

      translate(x + offsetX, y + offsetY);

      // alternating orientation
      if ((x / s + y / s) % 2 === 0) {
        rotate(HALF_PI);
        translate(0, -s);
      }

      rotate(rot);

      // main triangle
      fill(c1);
      triangle(
        0, 0,
        s, 0,
        0, s
      );

      // shadow triangle
      fill(c2);
      triangle(
        s, 0,
        s, s,
        0, s
      );

      // glowing detail
      fill(c3);
      triangle(
        s * 0.5, 0,
        s, s * 0.5,
        s * 0.5, s * 0.5
      );

      // extra triangle accent
      fill(
        120,
        80,
        255,
        90
      );

      triangle(
        0, s,
        s * 0.35, s * 0.65,
        0, s * 0.65
      );

      pop();
    }
  }

  // soft vignette overlay
  for (let i = 0; i < height; i++) {
    let alpha = map(i, 0, height, 20, 90);

    stroke(0, 0, 20, alpha);
    line(0, i, width, i);
  }
}