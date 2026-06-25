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

// Draw arches and vertical shapes (flipped upside down: rounded bottoms)
function drawArches() {
  const ctx = drawingContext;

  const shapes = [
    { x: 200,  y: 0, width: 300, height: 800, color: COLORS.mustard },
    { x: 600,  y: 0, width: 400, height: 900, color: COLORS.burntOrange },
    { x: 1100, y: 0, width: 350, height: 700, color: COLORS.darkGreen },
    { x: 1550, y: 0, width: 300, height: 850, color: COLORS.gold },
    { x: 800,  y: 0, width: 250, height: 600, color: COLORS.oliveGreen },
    { x: 1400, y: 0, width: 400, height: 950, color: COLORS.darkRedBrown },
  ];

  shapes.forEach(shape => {
    drawColumnShape(ctx, shape.x, shape.y, shape.width, shape.height, shape.color);
  });
}

// Draw a single column shape with rounded bottom
function drawColumnShape(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.7; // slightly transparent
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h - w / 2);
  ctx.arcTo(x, y + h, x + w / 2, y + h, w / 2);
  ctx.arcTo(x + w, y + h, x + w, y + h - w / 2, w / 2);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

// Add subtle noise texture
function drawTexture() {
  const ctx = drawingContext;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.random() * 255;
    data[i]     = gray; // Red
    data[i + 1] = gray; // Green
    data[i + 2] = gray; // Blue
    data[i + 3] = Math.random() * 50; // Alpha
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

// Add more shapes to enhance the composition (flipped upside down)
function addMoreShapes() {
  const ctx = drawingContext;

  const additionalShapes = [
    { x: 100,  y: 0, width: 200, height: 700, color: COLORS.gold },
    { x: 500,  y: 0, width: 300, height: 750, color: COLORS.darkRedBrown },
    { x: 1200, y: 0, width: 250, height: 650, color: COLORS.mustard },
    { x: 1700, y: 0, width: 350, height: 800, color: COLORS.burntOrange },
    { x: 400,  y: 0, width: 150, height: 500, color: COLORS.oliveGreen },
    { x: 1000, y: 0, width: 300, height: 850, color: COLORS.darkGreen },
  ];

  additionalShapes.forEach(shape => {
    drawColumnShape(ctx, shape.x, shape.y, shape.width, shape.height, shape.color);
  });
}

// Enhance the texture with a more pronounced grainy effect
function enhanceGrainyTexture() {
  const ctx = drawingContext;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.random() * 255;
    data[i]     = gray; // Red
    data[i + 1] = gray; // Green
    data[i + 2] = gray; // Blue
    data[i + 3] = Math.random() * 80; // Alpha
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