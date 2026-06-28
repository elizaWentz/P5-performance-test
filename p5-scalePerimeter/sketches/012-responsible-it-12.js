let tiles = [];

function setup() {
  createCanvas(960, 540);
  noStroke();

  let size = 90;
  let h = size * 0.86;

  // build geometric grid
  for (let y = -h; y < height + h; y += h) {

    for (let x = -size; x < width + size; x += size) {

      let offsetX = (floor(y / h) % 2) * (size / 2);

      tiles.push({
        x: x + offsetX,
        y,
        size,

        rot: random([0, HALF_PI, PI, PI + HALF_PI]),

        offset: random(1000)
      });
    }
  }

  background(3, 6, 14);
}

function draw() {

  // darker smoother fade
  fill(3, 6, 14, 24);
  rect(0, 0, width, height);

  for (let t of tiles) {

    let s = t.size;

    // subtle floating motion
    let wave =
      sin(frameCount * 0.004 + t.offset) * 3;

    // mouse repulsion
    let dx = t.x - mouseX;
    let dy = t.y - mouseY;

    let d = sqrt(dx * dx + dy * dy);

    let repel = 0;

    if (d < 160) {
      repel = map(d, 0, 160, 18, 0);
    }

    let angle = atan2(dy, dx);

    let px = t.x + cos(angle) * repel;
    let py = t.y + sin(angle) * repel;

    push();

    translate(px + wave, py);

    rotate(
      t.rot +
      sin(frameCount * 0.002 + t.offset) * 0.05
    );

    // --- DARK TECH PALETTE ---

    let c1 = color(8, 20, 45, 220);    // deep navy
    let c2 = color(0, 95, 115, 180);   // cyber teal
    let c3 = color(20, 40, 75, 190);   // steel blue
    let c4 = color(40, 20, 70, 180);   // dark violet

    // top triangle
    fill(c1);

    triangle(
      0, -s,
      s, 0,
      0, 0
    );

    // right triangle
    fill(c2);

    triangle(
      s, 0,
      0, s,
      0, 0
    );

    // bottom triangle
    fill(c3);

    triangle(
      0, s,
      -s, 0,
      0, 0
    );

    // left triangle
    fill(c4);

    triangle(
      -s, 0,
      0, -s,
      0, 0
    );

    // --- TECH LINE DETAILS ---

    stroke(120, 220, 255, 28);
    strokeWeight(1);

    for (let i = 0; i < 10; i++) {

      let amt = map(i, 0, 9, 0, 1);

      line(
        lerp(0, -s, amt),
        lerp(-s, 0, amt),

        lerp(0, 0, amt),
        lerp(-s, 0, amt)
      );
    }

    // subtle inner glow edge
    stroke(0, 255, 220, 14);

    line(0, -s, 0, 0);
    line(0, 0, s, 0);

    noStroke();

    pop();
  }

  // dark cinematic vignette
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 20, 120);

    stroke(0, 0, 0, alpha);
    line(0, i, width, i);
  }

  noStroke();
}