const palette = {
  burntOrange: '#E66B26',
  lightBlue: '#A9C9CF',
  darkBrown: '#3F2A24',
  mediumBrown: '#7B4C34',
  cream: '#EFDDBE',
  nearBlack: '#7B4C34',
};

const squareSize = 112;
const slantRun = squareSize;
const tileWidth = squareSize * 3.4;
const tileHeight = squareSize * 1.52;
const rowOffset = tileWidth / 2;
const patternBleed = tileWidth;

const squareInk = palette.lightBlue;

const grainStep = 3;
const grainAlpha = 11;
const mottleStep = 10;

function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  noLoop();
  noStroke();
  noiseSeed(42);
  randomSeed(42);
}

function draw() {
  background(palette.cream);
  drawPattern();
  addRisoTexture();
}

function drawPattern() {
  let rowIndex = 0;

  for (let y = -patternBleed; y < height + patternBleed; y += tileHeight) {
    const offsetX = rowIndex % 2 === 0 ? 0 : rowOffset;

    for (let x = -patternBleed - offsetX; x < width + patternBleed; x += tileWidth) {
      drawTile(round(x + offsetX), round(y), rowIndex);
    }

    rowIndex++;
  }
}

function drawTile(x, y, rowIndex) {
  const squareX = x + slantRun;
  const squareY = y;
  const bandInk = rowIndex % 2 === 0 ? palette.nearBlack : palette.darkBrown;

  drawParallelogram(
    squareX - slantRun,
    squareY - squareSize,
    squareX,
    squareY,
    squareX,
    squareY + squareSize,
    squareX - slantRun,
    squareY,
    bandInk
  );

  drawParallelogram(
    squareX + squareSize,
    squareY,
    squareX + squareSize + slantRun,
    squareY + squareSize,
    squareX + squareSize + slantRun,
    squareY + squareSize * 2,
    squareX + squareSize,
    squareY + squareSize,
    bandInk
  );

  drawSquare(squareX, squareY, rowIndex);
}

function drawSquare(x, y, rowIndex) {
  const accent = rowIndex % 3 === 0 ? palette.burntOrange : squareInk;

  fill(accent);
  rect(round(x), round(y), squareSize, squareSize);

  addShapeMottle(x, y, squareSize, squareSize);
}

function drawParallelogram(x1, y1, x2, y2, x3, y3, x4, y4, ink) {
  fill(ink);
  quad(
    round(x1), round(y1),
    round(x2), round(y2),
    round(x3), round(y3),
    round(x4), round(y4)
  );

  addShapeMottle(
    min(x1, x2, x3, x4),
    min(y1, y2, y3, y4),
    max(x1, x2, x3, x4) - min(x1, x2, x3, x4),
    max(y1, y2, y3, y4) - min(y1, y2, y3, y4)
  );
}

function addShapeMottle(x, y, w, h) {
  for (let iy = y; iy < y + h; iy += mottleStep) {
    for (let ix = x; ix < x + w; ix += mottleStep) {
      const n = noise(ix * 0.025, iy * 0.025);

      if (n > 0.66) {
        fill(255, 245, 220, 8);
        rect(round(ix), round(iy), 4, 4);
      }
    }
  }
}

function addRisoTexture() {
  randomSeed(1080);

  for (let y = 0; y < height; y += grainStep) {
    for (let x = 0; x < width; x += grainStep) {
      if (random() < 0.5) {
        fill(0, random(2, grainAlpha));
      } else {
        fill(255, random(2, grainAlpha));
      }

      rect(x, y, grainStep, grainStep);
    }
  }
}