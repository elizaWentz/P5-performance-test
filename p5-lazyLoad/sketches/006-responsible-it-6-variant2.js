let shards = [];

function setup() {
  createCanvas(1128, 308);
  noStroke();

  // create floating triangle shards
  for (let i = 0; i < 140; i++) {

    shards.push({
      x: random(width),
      y: random(height),

      size: random(20, 90),

      speed: random(0.1, 0.8),

      rot: random(TWO_PI),

      rotSpeed: random(-0.003, 0.003),

      drift: random(1000),

      type: floor(random(4))
    });
  }
}

function draw() {

  // transparent fade instead of full redraw
  fill(5, 4, 20, 35);
  rect(0, 0, width, height);

  blendMode(ADD);

  for (let s of shards) {

    // slow drifting motion
    s.x += s.speed;

    s.y += sin(frameCount * 0.01 + s.drift) * 0.25;

    s.rot += s.rotSpeed;

    // wrap around
    if (s.x > width + 120) {
      s.x = -120;
      s.y = random(height);
    }

    push();

    translate(s.x, s.y);
    rotate(s.rot);

    // neon palettes
    let c;

    if (s.type === 0) {
      c = color(120, 90, 255, 70);
    }
    else if (s.type === 1) {
      c = color(60, 220, 255, 70);
    }
    else if (s.type === 2) {
      c = color(255, 80, 180, 60);
    }
    else {
      c = color(180, 255, 120, 50);
    }

    fill(c);

    // DIFFERENT TRIANGLE STRUCTURES

    // giant stretched shard
    if (s.type === 0) {

      triangle(
        -s.size * 0.8, s.size * 0.4,
        0, -s.size,
        s.size * 0.8, s.size * 0.3
      );

      fill(255, 20);

      triangle(
        -s.size * 0.2, s.size * 0.1,
        0, -s.size * 0.4,
        s.size * 0.2, s.size * 0.1
      );
    }

    // crystal cluster
    else if (s.type === 1) {

      triangle(
        0, -s.size,
        s.size * 0.7, s.size * 0.3,
        -s.size * 0.7, s.size * 0.3
      );

      triangle(
        0, s.size * 0.8,
        s.size * 0.4, 0,
        -s.size * 0.4, 0
      );
    }

    // arrow shard
    else if (s.type === 2) {

      triangle(
        0, -s.size,
        s.size, s.size,
        0, s.size * 0.4
      );

      triangle(
        0, -s.size,
        -s.size, s.size,
        0, s.size * 0.4
      );
    }

    // layered techno triangle
    else {

      for (let i = 0; i < 4; i++) {

        let scaleAmt = 1 - i * 0.18;

        fill(
          red(c),
          green(c),
          blue(c),
          50 - i * 10
        );

        triangle(
          0,
          -s.size * scaleAmt,

          s.size * scaleAmt,
          s.size * scaleAmt,

          -s.size * scaleAmt,
          s.size * scaleAmt
        );
      }
    }

    pop();
  }

  blendMode(BLEND);

  // cinematic dark overlay
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 5, 70);

    stroke(0, 0, 20, alpha);
    line(0, i, width, i);
  }
}