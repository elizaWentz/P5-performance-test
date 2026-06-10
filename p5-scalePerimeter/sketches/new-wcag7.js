function setup() {
  createCanvas(1920, 1080);
  randomSeed(42); // Ensure reproducibility
  noLoop(); // Static composition
  background('#E3D39B'); // Licht crèmegeel background
  drawTileGrid();
  addWallTexture();
}

function draw() {
  // No animation, static composition
}

// Draw the base grid of tiles
function drawTileGrid() {
  const cols = 20; // Number of columns
  const rows = 12; // Number of rows
  const tileWidth = width / cols;
  const tileHeight = height / rows;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const xPos = x * tileWidth;
      const yPos = y * tileHeight;

      // Randomly choose between rectangle or triangle
      if (random() < 0.5) {
        drawRectangleTile(xPos, yPos, tileWidth, tileHeight);
      } else {
        drawTriangleTile(xPos, yPos, tileWidth, tileHeight);
      }
    }
  }
}

// Draw a rectangle tile with optional rotation
function drawRectangleTile(x, y, w, h) {
  push();
  translate(x + w / 2, y + h / 2);
  rotate(random([0, HALF_PI, PI, PI + HALF_PI])); // Random rotation
  fill(randomColor());
  strokeWeight(2);
  stroke('#4A2E2A'); // Donker warmbruin outline
  rectMode(CENTER);
  rect(0, 0, w, h);
  pop();
}

// Draw a triangle tile with random orientation
function drawTriangleTile(x, y, w, h) {
  push();
  translate(x, y);
  fill(randomColor());
  strokeWeight(2);
  stroke('#4A2E2A'); // Donker warmbruin outline
  const orientation = floor(random(4));
  beginShape();
  if (orientation === 0) {
    vertex(0, 0);
    vertex(w, 0);
    vertex(0, h);
  } else if (orientation === 1) {
    vertex(0, 0);
    vertex(w, 0);
    vertex(w, h);
  } else if (orientation === 2) {
    vertex(w, 0);
    vertex(w, h);
    vertex(0, h);
  } else {
    vertex(0, h);
    vertex(0, 0);
    vertex(w, h);
  }
  endShape(CLOSE);
  pop();
}

// Add texture to simulate a graffiti wall
function addWallTexture() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = (x + y * width) * 4;
      const noiseValue = noise(x * 0.01, y * 0.01) * 50; // Subtle noise
      pixels[index] += noiseValue; // Red
      pixels[index + 1] += noiseValue; // Green
      pixels[index + 2] += noiseValue; // Blue
    }
  }
  updatePixels();
}

// Generate a random color from the specified palette
function randomColor() {
  const palette = [
    color('#111216'), // Diep zwart
    color('#6E262A'), // Donker bordeaux
    color('#9B3E24'), // Gebrand rood/oranje
    color('#C48A3A'), // Oker / goudgeel
    color('#5E6641'), // Olijfgroen
    color('#6C777A'), // Blauwgrijs
    color('#4A2E2A'), // Donker warmbruin
    color('#E3D39B')  // Licht crèmegeel
  ];
  return random(palette);
}
