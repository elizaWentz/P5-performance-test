let triangles = [];

function setup() {
  createCanvas(1128, 308);
  noStroke();

  // create triangle ribbons
  for (let i = 0; i < 180; i++) {

    triangles.push({
      x: random(width),
      y: random(height),

      size: random(12, 80),

      angle: random(TWO_PI),

      speed: random(0.2, 1),

      turn: random(-0.01, 0.01),

      wave: random(1000),

      palette: floor(random(5))
    });
  }

  background(3, 4, 12);
}

function draw() {

  // long smooth trails
  fill(3, 4, 12, 18);
  rect(0, 0, width, height);

  blendMode(ADD);

  for (let t of triangles) {

    // flowing movement
    t.angle += t.turn;

    t.x += cos(t.angle) * t.speed;
    t.y += sin(t.angle) * t.speed;

    // organic drifting
    t.y += sin(frameCount * 0.01 + t.wave) * 0.3;

    // screen wrapping
    if (t.x < -100) t.x = width + 100;
    if (t.x > width + 100) t.x = -100;

    if (t.y < -100) t.y = height + 100;
    if (t.y > height + 100) t.y = -100;

    // palettes
    let c;

    if (t.palette === 0) {
      c = color(30, 180, 160, 22); // teal
    }
    else if (t.palette === 1) {
      c = color(220, 120, 40, 18); // orange
    }
    else if (t.palette === 2) {
      c = color(120, 80, 220, 20); // violet
    }
    else if (t.palette === 3) {
      c = color(220, 70, 120, 16); // pink-red
    }
    else {
      c = color(120, 220, 90, 14); // green
    }

    push();

    translate(t.x, t.y);
    rotate(t.angle);

    // layered triangle ribbon
    for (let i = 0; i < 6; i++) {

      let scaleAmt = 1 - i * 0.12;

      fill(
        red(c),
        green(c),
        blue(c),
        alpha(c) - i * 2
      );

      let offset = i * 10;

      // long ribbon triangles
      triangle(
        -t.size * 0.5 * scaleAmt - offset,
        t.size * 0.4 * scaleAmt,

        0,
        -t.size * scaleAmt - offset,

        t.size * 0.5 * scaleAmt - offset,
        t.size * 0.4 * scaleAmt
      );
    }

    // glowing core
    fill(255, 12);

    triangle(
      -t.size * 0.12,
      t.size * 0.1,

      0,
      -t.size * 0.25,

      t.size * 0.12,
      t.size * 0.1
    );

    pop();
  }

  blendMode(BLEND);

  // subtle gradient atmosphere
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 5, 90);

    stroke(0, 0, 0, alpha);
    line(0, i, width, i);
  }
}