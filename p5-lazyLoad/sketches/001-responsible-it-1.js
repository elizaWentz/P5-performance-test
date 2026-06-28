

function setup() {
  createCanvas(1128, 308);
  noStroke();
}

function draw() {
  background(8, 6, 28);

  let s = 62;

  for (let y = 0; y < height + s; y += s) {
    for (let x = 0; x < width + s; x += s) {

      // pulsing brightness
      let pulse =
        map(
          sin(frameCount * 0.04 + x * 0.03 + y * 0.02),
          -1,
          1,
          0.6,
          1.4
        );

      // glowing colors
      let c1 = color(
        45 * pulse,
        25 * pulse,
        140 * pulse
      );

      let c2 = color(
        10,
        10,
        50
      );

      let c3 = color(
        180 * pulse,
        120 * pulse,
        255,
        180
      );

      push();

      translate(x, y);

      // stable tile rotation
      if ((x / s + y / s) % 2 === 0) {
        rotate(HALF_PI);
        translate(0, -s);
      }

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

      // glowing inner triangle
      fill(c3);
      triangle(
        s * 0.5, 0,
        s, s * 0.5,
        s * 0.5, s * 0.5
      );

      // extra detail
      fill(
        120 * pulse,
        80 * pulse,
        255,
        120
      );

      triangle(
        0, s,
        s * 0.35, s * 0.65,
        0, s * 0.65
      );

      pop();
    }
  }

  // subtle bloom overlay
  blendMode(ADD);

  for (let i = 0; i < 8; i++) {
    fill(80, 40, 255, 6);

    rect(
      0,
      random(height),
      width,
      random(40, 120)
    );
  }

  blendMode(BLEND);

  // dark cinematic gradient
  for (let i = 0; i < height; i++) {
    let alpha = map(i, 0, height, 20, 90);

    stroke(0, 0, 20, alpha);
    line(0, i, width, i);
  }
}