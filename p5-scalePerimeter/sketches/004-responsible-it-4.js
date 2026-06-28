let particles = [];

function setup() {
  createCanvas(1128, 308);
  noStroke();

  // particles with depth
  for (let i = 0; i < 140; i++) {

    let depth = random(0.3, 1.8);

    particles.push({
      x: random(width),
      y: random(height),
      depth: depth,
      speed: random(0.05, 0.3) * depth,
      size: random(2, 5) * depth,
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(8, 6, 28);

  let s = 62;

  // mouse-controlled depth movement
  let mx = map(mouseX, 0, width, -20, 20);

  // --- DEPTH TRIANGLE LAYERS ---
  for (let layer = 0; layer < 3; layer++) {

    let depth = map(layer, 0, 2, 0.4, 1.4);

    for (let y = 0; y < height + s; y += s) {
      for (let x = 0; x < width + s; x += s) {

        // parallax movement
        let offsetX = mx * depth * 0.25;

        // slow drifting wave
        let wave =
          sin(frameCount * 0.005 * depth + y * 0.08) * 8 * depth;

        // subtle rotation
        let rot =
          sin(frameCount * 0.003 + x * 0.01 + y * 0.02)
          * 0.08 * depth;

        // glowing pulse
        let glow =
          map(
            sin(frameCount * 0.01 + x * 0.01 + y * 0.02),
            -1,
            1,
            0.7,
            1.15
          );

        // depth-based colors
        let c1 = color(
          25 * depth * glow,
          15 * depth,
          100 * depth * glow,
          140
        );

        let c2 = color(
          5,
          5,
          35,
          120
        );

        let c3 = color(
          140 * glow,
          100 * glow,
          255,
          70 * depth
        );

        push();

        translate(x + offsetX + wave, y);

        if ((x / s + y / s + layer) % 2 === 0) {
          rotate(HALF_PI);
          translate(0, -s);
        }

        rotate(rot);

        scale(depth);

        // main triangle
        fill(c1);
        triangle(
          0, 0,
          s, 0,
          0, s
        );

        // shadow
        fill(c2);
        triangle(
          s, 0,
          s, s,
          0, s
        );

        // inner glow
        fill(c3);
        triangle(
          s * 0.5, 0,
          s, s * 0.5,
          s * 0.5, s * 0.5
        );

        // detail triangle
        fill(
          130 * glow,
          80 * glow,
          255,
          50 * depth
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

  // --- PARTICLE DEPTH SYSTEM ---
  blendMode(ADD);

  for (let p of particles) {

    // different speed per layer
    p.x += p.speed;

    // floating movement
    p.y += sin(frameCount * 0.003 + p.offset) * 0.12;

    // wrap
    if (p.x > width + 20) {
      p.x = -20;
      p.y = random(height);
    }

    // glow intensity based on depth
    let alpha = 40 * p.depth;

    // particle trail
    for (let i = 0; i < 5; i++) {

      let tx = p.x - i * 8 * p.depth;

      fill(
        150,
        100,
        255,
        alpha - i * 8
      );

      triangle(
        tx,
        p.y,

        tx - p.size,
        p.y + p.size,

        tx + p.size,
        p.y + p.size
      );
    }
  }

  blendMode(BLEND);

  // --- CINEMATIC VIGNETTE ---
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 20, 100);

    stroke(0, 0, 20, alpha);
    line(0, i, width, i);
  }
}