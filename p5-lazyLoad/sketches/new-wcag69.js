const colors = {
  burntOrange: '#E66B26',
  lightBlue: '#A9C9CF',
  darkBrown: '#3F2A24',
  mediumBrown: '#7B4C34',
  cream: '#EFDDBE',
  nearBlack: '#151515'
};

const canvasWidth = 1920;
const canvasHeight = 1080;

// Elke entry bepaalt de breedte en de kleur van de volgende grens.
// Omdat drawStripe de kleur van de linker boundary gebruikt,
// verschijnen de strepen in deze volgorde: cream (startkleur), daarna
// nearBlack, cream, lightBlue, mediumBrown, darkBrown, cream, burntOrange, cream, ...
const stripePlan = [
  { width: 42, color: colors.nearBlack },   // donker
  { width: 38, color: colors.cream },       // licht
  { width: 64, color: colors.lightBlue },   // lichtblauw
  { width: 32, color: colors.mediumBrown }, // middenbruin
  { width: 48, color: colors.darkBrown },   // donkerbruin
  { width: 38, color: colors.cream },       // licht
  { width: 54, color: colors.burntOrange }, // oranje accent
  { width: 32, color: colors.cream }        // licht
];

const amplitude = 54;
const waveFrequency = (Math.PI * 2) / 360;
const sampleCount = 170;
const boundaryPhaseStep = 0.16;
const edgeBleed = 260;

const textureStep = 3;
const textureIntensity = 10;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  pixelDensity(1);
  noLoop();
  noStroke();
  randomSeed(31);
  noiseSeed(31);
}

function draw() {
  background(colors.cream);
  drawPattern();
  addRisoTexture();
}

function drawPattern() {
  const boundaries = buildBoundaries();

  for (let i = 0; i < boundaries.length - 1; i++) {
    drawStripe(i, boundaries[i], boundaries[i + 1]);
  }
}

function buildBoundaries() {
  const boundaries = [];
  let x = -edgeBleed;

  // startkleur
  boundaries.push({
    x: x,
    color: colors.cream
  });

  while (x < canvasWidth + edgeBleed) {
    for (let i = 0; i < stripePlan.length; i++) {
      x += stripePlan[i].width;
      boundaries.push({
        x: x,
        color: stripePlan[i].color
      });
    }
  }

  return boundaries;
}

function drawStripe(index, leftBoundary, rightBoundary) {
  fill(leftBoundary.color);
  beginShape();

  for (let s = 0; s <= sampleCount; s++) {
    const y = map(s, 0, sampleCount, -20, height + 20);
    vertex(getWavyX(leftBoundary.x, y, index), y);
  }

  for (let s = sampleCount; s >= 0; s--) {
    const y = map(s, 0, sampleCount, -20, height + 20);
    vertex(getWavyX(rightBoundary.x, y, index + 1), y);
  }

  endShape(CLOSE);
}

function getWavyX(baseX, y, boundaryIndex) {
  const sharedWave =
    amplitude * sin(y * waveFrequency) +
    22 * sin(y * waveFrequency * 2.05 + 1.4);

  const localWave =
    14 * sin(y * waveFrequency * 1.18 + boundaryIndex * boundaryPhaseStep);

  return baseX + sharedWave + localWave;
}

function addRisoTexture() {
  blendMode(MULTIPLY);
  randomSeed(1080);

  // kleuren die we voor de korrel gebruiken (alle 6, maar donker/licht krijgt iets meer gewicht)
  const textureColors = [
    { c: colors.nearBlack, weight: 3 },
    { c: colors.cream, weight: 3 },
    { c: colors.darkBrown, weight: 2 },
    { c: colors.mediumBrown, weight: 2 },
    { c: colors.burntOrange, weight: 1 },
    { c: colors.lightBlue, weight: 1 }
  ];
  const totalWeight = textureColors.reduce((sum, t) => sum + t.weight, 0);

  function pickTextureColor() {
    let r = random(totalWeight);
    for (let i = 0; i < textureColors.length; i++) {
      if (r < textureColors[i].weight) {
        return textureColors[i].c;
      }
      r -= textureColors[i].weight;
    }
    return colors.nearBlack;
  }

  for (let y = 0; y < height; y += textureStep) {
    for (let x = 0; x < width; x += textureStep) {
      const n = noise(x * 0.01, y * 0.01);
      const alpha = random(1, textureIntensity) * n;

      const col = color(pickTextureColor());
      col.setAlpha(alpha);
      fill(col);
      rect(x, y, textureStep, textureStep);
    }
  }

  blendMode(BLEND);
}