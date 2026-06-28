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

      // MUCH slower
      speed: random(0.03, 0.18),

      // softer turning
      turn: random(-0.002, 0.002),

      wave: random(1000),

      palette: floor(random(5))
    });
  }

  background(2, 3, 10);
}

function draw() {

  // smoother longer trails
  fill(2, 3, 10, 10);
  rect(0, 0, width, height);

  blendMode(ADD);

  for (let t of triangles) {

    // slow flowing movement
    t.angle += t.turn;

    t.x += cos(t.angle) * t.speed;
    t.y += sin(t.angle) * t.speed;

    // subtle drifting
    t.y += sin(frameCount * 0.003 + t.wave) * 0.08;

    // wrapping
    if (t.x < -100) t.x = width + 100;
    if (t.x > width + 100) t.x = -100;

    if (t.y < -100) t.y = height + 100;
    if (t.y > height + 100) t.y = -100;

    // MUTED palettes
    let c;

    if (t.palette === 0) {
      c = color(20, 80, 75, 10); // muted teal
    }
    else if (t.palette === 1) {
      c = color(110, 70, 35, 9); // muted orange
    }
    else if (t.palette === 2) {
      c = color(70, 60, 120, 10); // muted violet
    }
    else if (t.palette === 3) {
      c = color(90, 45, 60, 8); // muted pink-red
    }
    else {
      c = color(60, 90, 50, 7); // muted green
    }

    push();

    translate(t.x, t.y);
    rotate(t.angle);

    // layered ribbon triangles
    for (let i = 0; i < 6; i++) {

      let scaleAmt = 1 - i * 0.12;

      fill(
        red(c),
        green(c),
        blue(c),
        alpha(c) - i
      );

      let offset = i * 10;

      triangle(
        -t.size * 0.5 * scaleAmt - offset,
        t.size * 0.4 * scaleAmt,

        0,
        -t.size * scaleAmt - offset,

        t.size * 0.5 * scaleAmt - offset,
        t.size * 0.4 * scaleAmt
      );
    }

    // darker softer core
    fill(180, 180, 220, 4);

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

  // darker cinematic atmosphere
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 20, 120);

    stroke(0, 0, 0, alpha);
    line(0, i, width, i);
  }
}