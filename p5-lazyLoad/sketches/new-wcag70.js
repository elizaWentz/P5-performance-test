const colors = {
  burntOrange: '#E66B26',
  lightBlue: '#A9C9CF',
  darkBrown: '#3F2A24',
  mediumBrown: '#7B4C34',
  cream: '#EFDDBE',
  nearBlack: '#151515'
};

// Constants for geometry and styling
const canvasWidth = 1920;
const canvasHeight = 1080;
const bandHeight = canvasHeight / 12;
const amplitude = bandHeight / 2;
const phaseStep = canvasWidth / 10;
const bandCount = Math.round(canvasHeight / bandHeight);
const textureStep = 5;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  noLoop();
}

function draw() {
  background(colors.cream);
  drawPattern();
  addRisoTexture();
}

// Draw all bands and cream "leaves"
function drawPattern() {
  for (let i = 0; i < bandCount; i++) {
    drawBand(i); // Draw the horizontal colored band
    if (i < bandCount - 1) {
      drawLeaf(i); // Draw the cream "leaf-shaped" gap between the bands
    }
  }
}

// Draw a horizontal colored band
function drawBand(index) {
  const isDark = index % 2 === 0; // Alternate colors based on the index
  const color = isDark ? random([colors.nearBlack, colors.darkBrown]) : random([colors.burntOrange, colors.mediumBrown]);
  
  noStroke();
  fill(color);
  
  const yTop = index * bandHeight;
  const yBottom = yTop + bandHeight;

  beginShape();
  for (let x = 0; x <= width; x += 2) {
    // Add a sine wave offset for the top and bottom edges of the band
    const offset = amplitude * sin(TWO_PI * (x / width) + (index * phaseStep) / width);
    vertex(x, yTop + (isDark ? offset : -offset));
  }
  vertex(width, yBottom);
  vertex(0, yBottom);
  endShape(CLOSE);
}

// Draw a cream "leaf-shaped" space between two bands
function drawLeaf(index) {
  noStroke();
  fill(colors.cream);

  const yTop = index * bandHeight + bandHeight;
  const yBottom = yTop + bandHeight;

  beginShape();
  for (let x = 0; x <= width; x += 2) {
    const phase = index * phaseStep;
    const t = map(x, 0, width, -PI, PI);
    const leafBulge = (amplitude + 5) * sin(t) ** 2; // Create a symmetric bulge at the center
    vertex(x, yTop + amplitude * sin(TWO_PI * (x / width) + phase));
    vertex(x, yBottom + amplitude * sin(TWO_PI * (x / width) + phase) - leafBulge);
  }
  endShape(CLOSE);
}

// Add a subtle Riso print-style texture
function addRisoTexture() {
  loadPixels();
  for (let y = 0; y < height; y += textureStep) {
    for (let x = 0; x < width; x += textureStep) {
      const noiseValue = noise(x * 0.01, y * 0.01);
      if (noiseValue > 0.7) {
        set(x, y, color(0, 0, 0, random(50)));
      } else if (noiseValue > 0.5) {
        set(x, y, color(colors.lightBlue, random(20)));
      }
    }
  }
  updatePixels();
}