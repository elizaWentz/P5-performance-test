let flock = [];
let constellations = [];
let target;
let lastMouse;
let bg;

function setup() {
  createCanvas(960, 540);
  noStroke();
  colorMode(RGB);
  bg = color(7, 10, 16);
  target = createVector(width * 0.52, height * 0.5);
  lastMouse = target.copy();

  for (let i = 0; i < 52; i++) {
    flock.push(new Kite(i));
  }

  for (let i = 0; i < 34; i++) {
    constellations.push({
      x: random(width),
      y: random(height),
      r: random(18, 74),
      phase: random(TWO_PI),
      speed: random(0.003, 0.011)
    });
  }
}

function draw() {
  background(red(bg), green(bg), blue(bg), 42);

  let cursor = cursorVector();
  target.lerp(cursor, 0.045);

  drawQuietField();
  drawConstellations();

  for (let kite of flock) {
    kite.flock(flock);
    kite.follow(target);
    kite.update();
    kite.wrap();
    kite.show();
  }

  drawTargetGlow(target);
}

function cursorVector() {
  let inside = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

  if (inside) {
    lastMouse.set(mouseX, mouseY);
    return lastMouse;
  }

  let driftX = width * 0.52 + sin(frameCount * 0.012) * width * 0.18;
  let driftY = height * 0.5 + cos(frameCount * 0.017) * height * 0.18;
  lastMouse.lerp(createVector(driftX, driftY), 0.02);
  return lastMouse;
}

function drawQuietField() {
  strokeWeight(1);
  for (let x = 0; x <= width; x += 46) {
    let shade = 16 + sin(x * 0.01 + frameCount * 0.006) * 7;
    stroke(shade, shade + 4, shade + 13, 34);
    line(x, 0, x - 62, height);
  }
  noStroke();
}

function drawConstellations() {
  strokeWeight(1);

  for (let i = 0; i < constellations.length; i++) {
    let dot = constellations[i];
    let x = dot.x + sin(frameCount * dot.speed + dot.phase) * dot.r;
    let y = dot.y + cos(frameCount * dot.speed * 1.4 + dot.phase) * dot.r * 0.36;

    fill(68, 118, 135, 46);
    circle(x, y, 2.6);

    if (i % 3 === 0) {
      let next = constellations[(i + 7) % constellations.length];
      let nx = next.x + sin(frameCount * next.speed + next.phase) * next.r;
      let ny = next.y + cos(frameCount * next.speed * 1.4 + next.phase) * next.r * 0.36;
      let d = dist(x, y, nx, ny);

      if (d < 260) {
        stroke(59, 104, 122, map(d, 0, 260, 42, 0));
        line(x, y, nx, ny);
      }
    }
  }

  noStroke();
}

function drawTargetGlow(pos) {
  let pulse = 16 + sin(frameCount * 0.045) * 4;

  fill(80, 170, 190, 16);
  circle(pos.x, pos.y, pulse * 3.2);
  fill(180, 225, 220, 36);
  circle(pos.x, pos.y, pulse * 0.52);
}

class Kite {
  constructor(index) {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.7, 1.7));
    this.acc = createVector();
    this.size = random(7, 16);
    this.maxSpeed = random(1.45, 2.65);
    this.maxForce = random(0.025, 0.055);
    this.phase = index * 0.67;
    this.tint = random(130, 205);
    this.offset = createVector(
      cos(index * 2.399) * random(70, 300),
      sin(index * 2.399) * random(36, 118)
    );
  }

  flock(kites) {
    let alignment = createVector();
    let cohesion = createVector();
    let separation = createVector();
    let total = 0;

    for (let other of kites) {
      if (other === this) {
        continue;
      }

      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (d < 72) {
        alignment.add(other.vel);
        cohesion.add(other.pos);
        total++;
      }

      if (d < 28) {
        let push = p5.Vector.sub(this.pos, other.pos);
        push.div(max(d * d, 1));
        separation.add(push);
      }
    }

    if (total > 0) {
      alignment.div(total).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce);
      cohesion.div(total).sub(this.pos).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce * 0.55);
      separation.setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce * 1.8);

      this.acc.add(alignment);
      this.acc.add(cohesion);
      this.acc.add(separation);
    }
  }

  follow(pos) {
    let spread = this.offset.copy();
    spread.rotate(sin(frameCount * 0.006 + this.phase) * 0.72);

    let personalTarget = p5.Vector.add(pos, spread);
    personalTarget.x = constrain(personalTarget.x, 36, width - 36);
    personalTarget.y = constrain(personalTarget.y, 30, height - 30);

    let desired = p5.Vector.sub(personalTarget, this.pos);
    let d = desired.mag();
    let pull = map(constrain(d, 0, 520), 0, 520, 0.35, this.maxSpeed);

    desired.setMag(pull);
    desired.sub(this.vel);
    desired.limit(this.maxForce * 1.55);
    this.acc.add(desired);

    let orbit = createVector(
      sin(frameCount * 0.012 + this.phase),
      cos(frameCount * 0.015 + this.phase)
    );
    orbit.mult(0.012);
    this.acc.add(orbit);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  wrap() {
    let margin = 24;

    if (this.pos.x < -margin) this.pos.x = width + margin;
    if (this.pos.x > width + margin) this.pos.x = -margin;
    if (this.pos.y < -margin) this.pos.y = height + margin;
    if (this.pos.y > height + margin) this.pos.y = -margin;
  }

  show() {
    let angle = this.vel.heading();
    let breathe = sin(frameCount * 0.032 + this.phase) * 1.8;
    let s = this.size + breathe;

    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle + HALF_PI);

    fill(28, 36, 48, 70);
    triangle(0, -s * 2.2, -s * 0.72, s * 1.5, s * 0.72, s * 1.5);

    fill(this.tint * 0.48, this.tint * 0.78, this.tint, 152);
    triangle(0, -s * 1.5, -s * 0.52, s * 0.75, s * 0.52, s * 0.75);

    fill(218, 242, 230, 82);
    triangle(0, -s * 1.5, -s * 0.15, s * 0.25, s * 0.15, s * 0.25);
    pop();
  }
}
