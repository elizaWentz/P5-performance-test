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

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  noLoop(); // static frame

  const ctx = drawingContext;

  drawBackground(ctx);
  drawArches(ctx);
  drawTexture(ctx);
  addMoreShapes(ctx);
  enhanceGrainyTexture(ctx);
}

// Draw the background
function drawBackground(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(0, 0, w, h);
}

// Main arches (gelijkmatig over 1920px verdeeld en in beeld)
function drawArches(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  // iets bóven de onderrand zodat ze goed in beeld komen
  const yBase = h * 0.9;
  const baseWidth = w * 0.16;
  const baseHeight = h * 0.8;

  // x-posities als percentage van de breedte → gelijkmatig over het canvas
  const xPerc = [0.08, 0.25, 0.42, 0.59, 0.76, 0.93];
  const colors = [
    COLORS.mustard,
    COLORS.burntOrange,
    COLORS.darkGreen,
    COLORS.gold,
    COLORS.oliveGreen,
    COLORS.darkRedBrown,
  ];

  const shapes = xPerc.map((p, i) => ({
    x: p * w - baseWidth / 2,
    y: yBase,
    width: baseWidth * (0.8 + Math.random() * 0.3),   // kleine variatie
    height: baseHeight * (0.8 + Math.random() * 0.3), // niet super lang
    color: colors[i % colors.length],
  }));

  shapes.forEach((shape) => {
    drawRotatedShape(ctx, shape.x, shape.y, shape.width, shape.height, shape.color);
  });
}

// Draw a single rotated column shape
function drawRotatedShape(ctx, x, y, width, height, color) {
  ctx.save();
  ctx.translate(x + width / 2, y - height / 2); // Move to the center of the shape
  ctx.rotate((45 * Math.PI) / 180); // Rotate 45 degrees
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.7; // slightly transparent
  ctx.beginPath();
  ctx.moveTo(-width / 2, height / 1);
  ctx.lineTo(-width / 2, -height / 2 + width / 2);
  ctx.arcTo(-width / 2, -height / 2, 0, -height / 2, width / 2);
  ctx.arcTo(width / 2, -height / 2, width / 2, -height / 2 + width / 2, width / 2);
  ctx.lineTo(width / 2, height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1.0; // Reset alpha
  ctx.restore();
}

// Subtle noise texture
function drawTexture(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.random() * 255;
    data[i] = gray;     // Red
    data[i + 1] = gray; // Green
    data[i + 2] = gray; // Blue
    data[i + 3] = Math.random() * 50; // Alpha
  }

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = w;
  textureCanvas.height = h;
  const textureCtx = textureCanvas.getContext('2d');
  textureCtx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 0.05;
  ctx.drawImage(textureCanvas, 0, 0);
  ctx.globalAlpha = 1.0;
}

// Extra vormen (tweede laag), ook gelijkmatig over de breedte en zichtbaar
function addMoreShapes(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const yBase = h * 0.85;
  const baseWidth = w * 0.12;
  const baseHeight = h * 0.75;

  const xPerc = [0.03, 0.18, 0.33, 0.48, 0.63, 0.78, 0.93];
  const colors = [
    COLORS.gold,
    COLORS.darkRedBrown,
    COLORS.mustard,
    COLORS.burntOrange,
    COLORS.oliveGreen,
    COLORS.darkGreen,
  ];

  const shapes = xPerc.map((p, i) => ({
    x: p * w - baseWidth / 2,
    y: yBase,
    width: baseWidth * (0.7 + Math.random() * 0.4),
    height: baseHeight * (0.7 + Math.random() * 0.4),
    color: colors[i % colors.length],
  }));

  shapes.forEach((shape) => {
    drawRotatedShape(ctx, shape.x, shape.y, shape.width, shape.height, shape.color);
  });
}

// Stronger grainy texture
function enhanceGrainyTexture(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.random() * 255;
    data[i] = gray;     // Red
    data[i + 1] = gray; // Green
    data[i + 2] = gray; // Blue
    data[i + 3] = Math.random() * 80; // Alpha
  }

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = w;
  textureCanvas.height = h;
  const textureCtx = textureCanvas.getContext('2d');
  textureCtx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 0.1;
  ctx.drawImage(textureCanvas, 0, 0);
  ctx.globalAlpha = 1.0;
}