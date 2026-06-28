let grid = [];

function setup() {
  createCanvas(960, 540);
  noStroke();

  let spacing = 42;

  // build patterned grid
  for (let y = -spacing; y < height + spacing; y += spacing) {
    for (let x = -spacing; x < width + spacing; x += spacing) {

      grid.push({
        x,
        y,

        baseX: x,
        baseY: y,

        size: random(24, 44),

        rot: random([0, HALF_PI]),

        palette: floor(random(4)),

        offset: random(1000)
      });
    }
  }

  background(4, 5, 14);
}

function draw() {

  // soft motion trails
  fill(4, 5, 14, 28);
  rect(0, 0, width, height);

  blendMode(ADD);

  for (let t of grid) {

    // wave movement
    let waveX =
      sin(frameCount * 0.01 + t.y * 0.02 + t.offset) * 8;

    let waveY =
      cos(frameCount * 0.008 + t.x * 0.02) * 6;

    // mouse repulsion
    let dx = t.baseX - mouseX;
    let dy = t.baseY - mouseY;

    let d = sqrt(dx * dx + dy * dy);

    let repelRadius = 120;

    let repelX = 0;
    let repelY = 0;

    if (d < repelRadius) {

      let force = map(d, 0, repelRadius, 30, 0);

      let angle = atan2(dy, dx);

      repelX = cos(angle) * force;
      repelY = sin(angle) * force;
    }

    // smooth movement
    t.x = lerp(
      t.x,
      t.baseX + waveX + repelX,
      0.08
    );

    t.y = lerp(
      t.y,
      t.baseY + waveY + repelY,
      0.08
    );

    // muted modern palettes
    let c;

    if (t.palette === 0) {
      c = color(60, 90, 150, 18);
    }
    else if (t.palette === 1) {
      c = color(40, 120, 110, 16);
    }
    else if (t.palette === 2) {
      c = color(120, 70, 60, 15);
    }
    else {
      c = color(100, 100, 130, 14);
    }

    push();

    translate(t.x, t.y);

    // soft breathing rotation
    rotate(
      t.rot +
      sin(frameCount * 0.004 + t.offset) * 0.2
    );

    // MAIN TRIANGLE
    fill(c);

    triangle(
      0,
      -t.size,

      t.size,
      t.size,

      -t.size,
      t.size
    );

    // SIDE DETAIL TRIANGLES
    fill(
      red(c) + 20,
      green(c) + 10,
      blue(c) + 30,
      10
    );

    triangle(
      -t.size * 0.9,
      t.size * 0.4,

      -t.size * 0.3,
      t.size * 0.1,

      -t.size * 0.4,
      t.size * 0.8
    );

    triangle(
      t.size * 0.9,
      t.size * 0.4,

      t.size * 0.3,
      t.size * 0.1,

      t.size * 0.4,
      t.size * 0.8
    );

    pop();
  }

  blendMode(BLEND);

  // cinematic dark gradient
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 10, 100);

    stroke(0, 0, 0, alpha);
    line(0, i, width, i);
  }
}