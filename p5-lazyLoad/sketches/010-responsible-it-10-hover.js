let triangles = [];

function setup() {
  createCanvas(960, 540);
  noStroke();

  // create triangle ribbons
  for (let i = 0; i < 580; i++) {

    triangles.push({
      x: random(width),
      y: random(height),

      baseX: random(width),
      baseY: random(height),

      size: random(12, 80),

      angle: random(TWO_PI),

      speed: random(0.03, 0.18),

      turn: random(-0.002, 0.002),

      wave: random(1000),

      palette: floor(random(5))
    });
  }

  background(2, 3, 10);
}

function draw() {

  // smooth fading trails
  fill(2, 3, 10, 10);
  rect(0, 0, width, height);

  blendMode(ADD);

  for (let t of triangles) {

    // slow movement
    t.angle += t.turn;

    t.baseX += cos(t.angle) * t.speed;
    t.baseY += sin(t.angle) * t.speed;

    // subtle floating
    t.baseY += sin(frameCount * 0.003 + t.wave) * 0.08;

    // wrapping
    if (t.baseX < -100) t.baseX = width + 100;
    if (t.baseX > width + 100) t.baseX = -100;

    if (t.baseY < -100) t.baseY = height + 100;
    if (t.baseY > height + 100) t.baseY = -100;

    // --- MOUSE REPULSION ---

    let dx = t.baseX - mouseX;
    let dy = t.baseY - mouseY;

    let d = sqrt(dx * dx + dy * dy);

    let repelRadius = 180;

    let offsetX = 0;
    let offsetY = 0;

    if (d < repelRadius) {

      let force = map(d, 0, repelRadius, 22, 0);

      let angle = atan2(dy, dx);

      offsetX = cos(angle) * force;
      offsetY = sin(angle) * force;
    }

    t.x = lerp(t.x || t.baseX, t.baseX + offsetX, 0.08);
    t.y = lerp(t.y || t.baseY, t.baseY + offsetY, 0.08);

    // muted palettes
    let c;

    if (t.palette === 0) {
      c = color(20, 80, 75, 10);
    }
    else if (t.palette === 1) {
      c = color(110, 70, 35, 9);
    }
    else if (t.palette === 2) {
      c = color(70, 60, 120, 10);
    }
    else if (t.palette === 3) {
      c = color(90, 45, 60, 8);
    }
    else {
      c = color(60, 90, 50, 7);
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

    // soft center glow
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

  // cinematic dark overlay
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 20, 120);

    stroke(0, 0, 0, alpha);
    line(0, i, width, i);
  }
}