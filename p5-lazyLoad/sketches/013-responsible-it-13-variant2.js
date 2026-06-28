let spacing = 24;
let h;

function setup() {
  createCanvas(960, 540);

  h = spacing * sqrt(3) / 2;

  noStroke();
}

function draw() {

  background(8, 10, 18);

  for (let y = -h; y < height + h; y += h) {

    for (let x = -spacing; x < width + spacing; x += spacing) {

      // hexagonal triangle offset
      let offset = (floor(y / h) % 2) * (spacing / 2);

      let px = x + offset;

      // fade to tiny triangles
      let fade = map(px, 0, width, 1, 0);

      // size decreases toward right
      let s = spacing * 0.9 * fade;

      // skip super tiny triangles
      if (s < 1) continue;

      // slight floating movement
      let wave =
        sin(frameCount * 0.01 + y * 0.04) * 2;

      // TECH COLOR GRADIENT
      let c;

      if (fade > 0.66) {

        // purple → blue
        c = lerpColor(
          color(120, 70, 255),
          color(0, 160, 255),
          map(fade, 1, 0.66, 0, 1)
        );
      }
      else if (fade > 0.33) {

        // blue → teal
        c = lerpColor(
          color(0, 160, 255),
          color(0, 220, 180),
          map(fade, 0.66, 0.33, 0, 1)
        );
      }
      else {

        // teal → gold
        c = lerpColor(
          color(0, 220, 180),
          color(255, 190, 60),
          map(fade, 0.33, 0, 0, 1)
        );
      }

      // glow opacity
      fill(
        red(c),
        green(c),
        blue(c),
        180 * fade + 20
      );

      push();

      translate(px + wave, y);

      // alternating triangle direction
      if ((floor(x / spacing) + floor(y / h)) % 2 === 0) {

        triangle(
          0, -s,
          s, s,
          -s, s
        );
      }
      else {

        triangle(
          0, s,
          s, -s,
          -s, -s
        );
      }

      pop();
    }
  }

  // subtle dark overlay
  for (let i = 0; i < height; i++) {

    let alpha = map(i, 0, height, 0, 80);

    stroke(0, 0, 0, alpha);
    line(0, i, width, i);
  }
}