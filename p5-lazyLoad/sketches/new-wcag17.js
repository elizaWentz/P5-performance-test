// Define the color palette
const COLORS = {
  mustard: '#D4A017',
  gold: '#B8860B',
  burntOrange: '#CC5500',
  darkGreen: '#013220',
  oliveGreen: '#556B2F',
  darkRedBrown: '#8B4513',
  cream: '#F5F5DC',
};

// how much space to leave between the tallest arches and the top
const TOP_MARGIN = 80;

function setup() {
  createCanvas(1920, 1080);
  noLoop(); // static frame

  drawBackground();
  drawArches();
  drawTexture();
  addMoreShapes();
  enhanceGrainyTexture();
}

// Draw the background
function drawBackground() {
  const ctx = drawingContext;
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(0, 0, width, height);
}

// Draw arches and vertical shapes
function drawArches() {
  const ctx = drawingContext;

  const shapes = [
    { x: 200,  y: height, width: 300, height: 800 },
    { x: 600,  y: height, width: 400, height: 900 },
    { x: 1100, y: height, width: 350, height: 700 },
    { x: 1550, y: height, width: 300, height: 850 },
    { x: 800,  y: height, width: 250, height: 600 },
    { x: 1400, y: height, width: 400, height: 950 },
  ];

  const colors = [
    COLORS.mustard,
    COLORS.burntOrange,
    COLORS.darkGreen,
    COLORS.gold,
    COLORS.oliveGreen,
    COLORS.darkRedBrown,
  ];

  shapes.forEach((shape, i) => {
    // shorten by TOP_MARGIN so it doesn't hit the very top
    drawColumnShape(
      ctx,
      shape.x,
      shape.y,
      shape.width,
      shape.height - TOP_MARGIN,
      colors[i]
    );
  });
}

// Draw a single column shape with rounded top
function drawColumnShape(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - h + w / 2);
  ctx.arcTo(x, y - h, x + w / 2, y - h, w / 2);
  ctx.arcTo(x + w, y - h, x + w, y - h + w / 2, w / 2);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

// Subtle noise texture
function drawTexture() {
  const ctx = drawingContext;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.random() * 255;
    data[i]     = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    data[i + 3] = Math.random() * 50;
  }

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = width;
  textureCanvas.height = height;
  const textureCtx = textureCanvas.getContext('2d');
  textureCtx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 0.05;
  ctx.drawImage(textureCanvas, 0, 0);
  ctx.globalAlpha = 1.0;
}

// More shapes in front
function addMoreShapes() {
  const ctx = drawingContext;

  const additionalShapes = [
    { x: 100,  y: height, width: 200, height: 700, color: COLORS.gold },
    { x: 500,  y: height, width: 300, height: 750, color: COLORS.darkRedBrown },
    { x: 1200, y: height, width: 250, height: 650, color: COLORS.mustard },
    { x: 1700, y: height, width: 350, height: 800, color: COLORS.burntOrange },
    { x: 400,  y: height, width: 150, height: 500, color: COLORS.oliveGreen },
    { x: 1000, y: height, width: 300, height: 850, color: COLORS.darkGreen },
  ];

  additionalShapes.forEach((shape) => {
    drawColumnShape(
      ctx,
      shape.x,
      shape.y,
      shape.width,
      shape.height - TOP_MARGIN,
      shape.color
    );
  });
}

// Stronger grain on top
function enhanceGrainyTexture() {
  const ctx = drawingContext;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.random() * 255;
    data[i]     = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    data[i + 3] = Math.random() * 80;
  }

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = width;
  textureCanvas.height = height;
  const textureCtx = textureCanvas.getContext('2d');
  textureCtx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 0.1;
  ctx.drawImage(textureCanvas, 0, 0);
  ctx.globalAlpha = 1.0;
}