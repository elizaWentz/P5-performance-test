let particles = [];

function setup() {
  createCanvas(960, 540);
  noStroke();

  // create glowing particles
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      speed: random(0.3, 1.2),
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

      // subtle ambient motion
      let wave =
        sin(frameCount * 0.02 + y * 0.08) * 10;

      // soft glow pulse
      let glow =
        map(
          sin(frameCount * 0.03 + x * 0.02 + y * 0.01),
          -1,
          1,
          0.7,
          1.2
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
        140
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

      // shadow
      fill(c2);
      triangle(
        s, 0,
        s, s,
        0, s
      );

      // inner glow triangle
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
        100
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

    // flowing movement
    p.x += p.speed;

    // floating sine motion
    p.y += sin(frameCount * 0.02 + p.offset) * 0.4;

    // wrap around
    if (p.x > width + 20) {
      p.x = -20;
      p.y = random(height);
    }

    // glowing trail
    for (let i = 0; i < 6; i++) {

      let trailX = p.x - i * 8;
      let alpha = map(i, 0, 5, 120, 0);

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

  // --- CINEMATIC OVERLAY ---
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 15, 90);

    stroke(0, 0, 20, alpha);
    line(0, i, width, i);
  }
}