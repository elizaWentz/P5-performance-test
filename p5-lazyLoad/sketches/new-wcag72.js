const colors = {
  burntOrange: '#E66B26',
  lightBlue:   '#A9C9CF',
  darkBrown:   '#3F2A24',
  mediumBrown: '#7B4C34',
  cream:       '#EFDDBE',
  nearBlack:   '#151515'
};

const canvasWidth = 1920;
const canvasHeight = 1080;

// Band structure
const bandCount = 9;
const bandHeight = canvasHeight / 10;
const topMargin = 35;
const bottomMargin = 85;

// Shape controls
const sampleCount = 120;
const amplitude = 150;
const phaseStep = 0.42;
const diagonalStep = 82;

// Leaf controls
const leafWidth = 650;
const leafHeight = 108;
const leafTilt = -0.18;

// Texture controls
const textureStep = 4;
const textureIntensity = 18;

function setup() {
  createCanvas(1920, 1080);
  noLoop();
  noiseSeed(10);
  randomSeed(14);
}

function draw() {
  background(colors.cream);
  drawPattern();
  addRisoTexture();
}

function drawPattern() {
  // Draw all bands as flat horizontal poster shapes.
  for (let i = 0; i < bandCount; i++) {
    drawBand(i);
  }

  // Draw cream leaves on top, so they read as gaps cut out
  // between the colored horizontal bands.
  for (let i = 0; i < bandCount - 1; i++) {
    drawLeaf(i);
  }
}

function drawBand(index) {
  const y = topMargin + index * bandHeight;
  const h = bandHeight * 0.78;

  fill(getBandColor(index));
  noStroke();

  beginShape();

  // Top edge: mostly straight, like the reference image.
  vertex(0, y);
  vertex(width, y);

  // Right side.
  vertex(width, y + h);

  // Bottom edge: this is where the band becomes organic.
  // The curved edge lets the cream leaves and warm bands weave diagonally.
  for (let s = sampleCount; s >= 0; s--) {
    const x = map(s, 0, sampleCount, 0, width);
    const edgeY = bandBottomEdge(index, x, y, h);
    vertex(x, edgeY);
  }

  endShape(CLOSE);
}

function drawLeaf(index) {
  // The reference has the cream lens shapes marching down a diagonal column.
  // This x/y offset creates that stepped movement from upper-left to lower-right.
  const cx = width * 0.48 + index * diagonalStep * 0.18;
  const cy = topMargin + index * bandHeight + bandHeight * 0.18;

  fill(colors.cream);
  noStroke();

  beginShape();

  // Upper half of the leaf.
  for (let s = 0; s <= sampleCount; s++) {
    const u = map(s, 0, sampleCount, -1, 1);
    const x = cx + u * leafWidth * 0.5;
    const thickness = leafHeight * 0.5 * sqrt(max(0, 1 - u * u));
    const y = cy + u * leafTilt * leafWidth - thickness;
    vertex(x, y);
  }

  // Lower half of the leaf.
  for (let s = sampleCount; s >= 0; s--) {
    const u = map(s, 0, sampleCount, -1, 1);
    const x = cx + u * leafWidth * 0.5;
    const thickness = leafHeight * 0.5 * sqrt(max(0, 1 - u * u));
    const y = cy + u * leafTilt * leafWidth + thickness;
    vertex(x, y);
  }

  endShape(CLOSE);
}

function bandBottomEdge(index, x, y, h) {
  // Each band shifts horizontally so the curved parts line up diagonally.
  const phase = index * phaseStep;
  const center = width * 0.33 + index * diagonalStep;

  // A smooth central bulge: narrow near the edges, strongest near the curve.
  const d = abs(x - center) / (width * 0.36);
  const bulge = pow(max(0, 1 - d), 2.35);

  // A very subtle wave keeps the edges organic without becoming jagged.
  const softWave = sin((x / width) * TWO_PI + phase) * 7;

  return y + h - bulge * amplitude + softWave;
}

function getBandColor(index) {
  // Alternates dark bands with warm “green-like” bands using only your palette.
  if (index % 2 === 0) {
    return index % 4 === 0 ? colors.nearBlack : colors.darkBrown;
  }

  if (index === 5) {
    return colors.burntOrange;
  }

  if (index === 7) {
    return colors.lightBlue;
  }

  return colors.mediumBrown;
}

function addRisoTexture() {
  push();

  // Multiply makes the dots interact with the flat colors like printed ink.
  blendMode(MULTIPLY);
  noStroke();

  for (let y = 0; y < height; y += textureStep) {
    for (let x = 0; x < width; x += textureStep) {
      const n = noise(x * 0.016, y * 0.016);

      // Dark speckles.
      if (n > 0.56) {
        const alpha = map(n, 0.56, 1, 2, textureIntensity);
        fill(21, 21, 21, alpha);
        circle(x + random(-1, 1), y + random(-1, 1), random(1, 2.4));
      }

      // A few pale blue/cream flecks for a softer risograph feel.
      if (n < 0.15 && random() < 0.35) {
        fill(169, 201, 207, 8);
        circle(x, y, random(1, 2));
      }
    }
  }

  pop();
}