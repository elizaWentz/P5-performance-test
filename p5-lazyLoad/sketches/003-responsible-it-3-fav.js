let particles = [];

function setup() {
  createCanvas(1128, 308);
  noStroke();

  // create glowing particles
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      speed: random(0.08, 0.35), // MUCH slower
      size: random(2, 5),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(8, 6, 28);

  let s = 62;

  // --- TRIANGLE GRID ---
  for (let y = 0; y < height + s; y += s) {
    for (let x = 0; x < width + s; x += s) {

      // slower ambient wave
      let wave =
        sin(frameCount * 0.008 + y * 0.08) * 6;

      // slower pulse
      let glow =
        map(
          sin(frameCount * 0.01 + x * 0.02 + y * 0.01),
          -1,
          1,
          0.75,
          1.15
        );

      // dark HvA palette
      let c1 = color(
        40 * glow,
        20 * glow,
        120 * glow
      );

      let c2 = color(
        8,
        8,
        45
      );

      let c3 = color(
        180 * glow,
        120 * glow,
        255,
        120
      );

      push();

      translate(x + wave, y);

      // alternating rotation
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
        80
      );

      triangle(
        0, s,
        s * 0.35, s * 0.65,
        0, s * 0.65
      );

      pop();
    }
  }

  // --- PARTICLE TRAILS ---
  blendMode(ADD);

  for (let p of particles) {

    // very slow movement
    p.x += p.speed;

    // calmer floating motion
    p.y += sin(frameCount * 0.005 + p.offset) * 0.15;

    // wrap around
    if (p.x > width + 20) {
      p.x = -20;
      p.y = random(height);
    }

    // glowing trail
    for (let i = 0; i < 6; i++) {

      let trailX = p.x - i * 10;
      let alpha = map(i, 0, 5, 70, 0);

      fill(
        140,
        100,
        255,
        alpha
      );

      triangle(
        trailX,
        p.y,

        trailX - p.size,
        p.y + p.size,

        trailX + p.size,
        p.y + p.size
      );
    }
  }

  blendMode(BLEND);

  // --- DARK OVERLAY ---
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 15, 90);

    stroke(0, 0, 20, alpha);
    line(0, i, width, i);
  }
}