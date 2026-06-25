const colors = {
  burntOrange: '#E66B26',
  lightBlue: '#A9C9CF',
  darkBrown: '#3F2A24',
  mediumBrown: '#7B4C34',
  cream: '#EFDDBE',
  nearBlack: '#151515'
};

const bandHeight = 108; // canvasHeight / 10
const bandCount = 10; // Number of horizontal bands
const amplitude = 150; // Curviness of the band edge
const phaseStep = 0.5; // Horizontal phase shift for leaf shapes
const textureStep = 5; // Step size for texture overlay
const textureIntensity = 0.1; // Intensity of texture speckles

function setup() {
  createCanvas(1920, 1080);
  noLoop();
}

function draw() {
  background(colors.cream);
  drawPattern();
  addRisoTexture();
}

function drawPattern() {
  for (let i = 0; i < bandCount; i++) {
    drawBand(i);
    if (i < bandCount - 1) {
      drawLeaf(i);
    }
  }
}

function drawBand(index) {
  const y = index * bandHeight;
  const color = index % 2 === 0 ? colors.nearBlack : colors.mediumBrown;

  fill(color);
  noStroke();
  beginShape();
  vertex(0, y);
  for (let x = 0; x <= width; x += 10) {
    const t = map(x, 0, width, -PI, PI);
    const offset = amplitude * sin(t) ** 2;
    const phase = index * phaseStep;
    vertex(x, y + offset + sin(phase) * 10);
  }
  vertex(width, y);
  vertex(width, y + bandHeight);
  vertex(0, y + bandHeight);
  endShape(CLOSE);
}

function drawLeaf(index) {
  const y = index * bandHeight;
  const nextY = (index + 1) * bandHeight;
  const phase = index * phaseStep;

  fill(colors.cream);
  noStroke();
  beginShape();
  for (let x = 0; x <= width; x += 10) {
    const t = map(x, 0, width, -PI, PI);
    const offset = amplitude * sin(t) ** 2;
    vertex(x, y + bandHeight + offset + sin(phase) * 10);
  }
  for (let x = width; x >= 0; x -= 10) {
    const t = map(x, 0, width, -PI, PI);
    const offset = amplitude * sin(t) ** 2;
    vertex(x, nextY + offset + sin(phase + phaseStep) * 10);
  }
  endShape(CLOSE);
}

function addRisoTexture() {
  blendMode(SOFT_LIGHT);
  noStroke();
  for (let x = 0; x < width; x += textureStep) {
    for (let y = 0; y < height; y += textureStep) {
      const noiseVal = noise(x * 0.01, y * 0.01);
      if (noiseVal > 0.5) {
        fill(colors.nearBlack + '10'); // Low alpha for dark speckles
        ellipse(x, y, 2, 2);
      } else if (noiseVal > 0.3) {
        fill(colors.lightBlue + '05'); // Subtle light speckles
        ellipse(x, y, 1, 1);
      }
    }
  }
}
