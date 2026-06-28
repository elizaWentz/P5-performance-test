function setup() {
  createCanvas(1128, 308);
  noStroke();

  // remove noLoop() for animation
}

function draw() {
  background(8, 6, 28);

  let s = 62;

  // fake camera movement
  let camX = map(mouseX, 0, width, -25, 25);

  // multiple depth layers
  for (let layer = 0; layer < 3; layer++) {

    // layer depth
    let depth = map(layer, 0, 2, 0.4, 1.4);

    for (let y = 0; y < height + s; y += s) {
      for (let x = 0; x < width + s; x += s) {

        // parallax offset
        let offsetX = camX * depth;

        // slow movement
        let drift =
          sin(frameCount * 0.003 * depth + y * 0.08)
          * 8
          * depth;

        // subtle breathing rotation
        let rot =
          sin(frameCount * 0.004 + x * 0.01 + y * 0.02)
          * 0.08
          * depth;

        // deterministic colors
        let c1 = color(
          30 * depth + sin(x * 0.02) * 20,
          15 * depth,
          90 * depth + cos(y * 0.02) * 40,
          130
        );

        let c2 = color(
          5,
          5,
          35,
          110
        );

        let c3 = color(
          120,
          80,
          255,
          70 * depth
        );

        push();

        translate(x + offsetX + drift, y);

        // alternating orientation
        if ((x / s + y / s + layer) % 2 === 0) {
          rotate(HALF_PI);
          translate(0, -s);
        }

        rotate(rot);

        // scale based on depth
        scale(depth);

        // big base triangle
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

        // inner highlight
        fill(c3);
        triangle(
          s * 0.5, 0,
          s, s * 0.5,
          s * 0.5, s * 0.5
        );

        // detail triangle
        fill(
          140,
          100,
          255,
          40 * depth
        );

        triangle(
          0, s,
          s * 0.35, s * 0.65,
          0, s * 0.65
        );

        pop();
      }
    }
  }

  // cinematic overlay
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 15, 90);

    stroke(0, 0, 20, alpha);
    line(0, i, width, i);
  }
}