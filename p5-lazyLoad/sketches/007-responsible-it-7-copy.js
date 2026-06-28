let shards = [];

function setup() {
  createCanvas(1128, 308);
  noStroke();

  background(3, 5, 12);

  // create floating shards
  for (let i = 0; i < 140; i++) {

    shards.push({
      x: random(width),
      y: random(height),

      size: random(20, 90),

      speed: random(0.08, 0.4),

      rot: random(TWO_PI),

      rotSpeed: random(-0.002, 0.002),

      drift: random(1000),

      type: floor(random(4))
    });
  }
}

function draw() {

  // soft motion trails
  fill(3, 5, 12, 24);
  rect(0, 0, width, height);

  blendMode(ADD);

  for (let s of shards) {

    // slow drift
    s.x += s.speed;

    s.y += sin(frameCount * 0.008 + s.drift) * 0.18;

    s.rot += s.rotSpeed;

    // wrap around
    if (s.x > width + 120) {
      s.x = -120;
      s.y = random(height);
    }

    push();

    translate(s.x, s.y);
    rotate(s.rot);

    // NEW DARK COLOR PALETTES
    let c;

    // deep teal
    if (s.type === 0) {
      c = color(20, 90, 110, 24);
    }

    // burnt orange
    else if (s.type === 1) {
      c = color(160, 70, 30, 20);
    }

    // dark emerald
    else if (s.type === 2) {
      c = color(30, 110, 70, 22);
    }

    // muted red
    else {
      c = color(120, 40, 50, 18);
    }

    fill(c);

    // stretched shard
    if (s.type === 0) {

      triangle(
        -s.size * 0.8, s.size * 0.4,
        0, -s.size,
        s.size * 0.8, s.size * 0.3
      );

      fill(80, 220, 255, 8);

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

      fill(255, 170, 80, 8);

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
          180,
          60,
          80,
          14 - i * 3
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

  // cinematic dark gradient
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 15, 120);

    stroke(0, 0, 0, alpha);
    line(0, i, width, i);
  }
}