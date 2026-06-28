let shards = [];

function setup() {
  createCanvas(960, 540);
  noStroke();

  background(4, 4, 14);

  // create floating triangle shards
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

  // darker trailing fade
  fill(4, 4, 14, 28);
  rect(0, 0, width, height);

  blendMode(ADD);

  for (let s of shards) {

    // slow drifting motion
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

    // MUCH DARKER palettes
    let c;

    if (s.type === 0) {
      c = color(55, 45, 120, 28);
    }
    else if (s.type === 1) {
      c = color(30, 90, 120, 24);
    }
    else if (s.type === 2) {
      c = color(120, 40, 80, 22);
    }
    else {
      c = color(70, 90, 55, 18);
    }

    fill(c);

    // giant stretched shard
    if (s.type === 0) {

      triangle(
        -s.size * 0.8, s.size * 0.4,
        0, -s.size,
        s.size * 0.8, s.size * 0.3
      );

      fill(120, 100, 255, 10);

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

      fill(80, 180, 220, 10);

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
          80,
          110,
          70,
          16 - i * 3
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

  // heavier cinematic vignette
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 15, 110);

    stroke(0, 0, 10, alpha);
    line(0, i, width, i);
  }
}