// Define the color palette
const COLORS = [
  [10, 22, 12],   // 0 near-black forest green (outermost)
  [15, 30, 16],   // 1 very dark green
  [20, 38, 18],   // 2 dark forest green
  [25, 48, 20],   // 3 deep green
  [32, 58, 22],   // 4 forest green
  [42, 68, 25],   // 5 medium forest green
  [55, 78, 28],   // 6 olive-green
  [70, 90, 32],   // 7 muted green
  [88, 105, 38],  // 8 warm olive
  [108, 118, 48], // 9 olive
  [130, 135, 62], // 10 yellow-olive
  [155, 155, 80], // 11 pale olive
  [178, 175, 105],// 12 light olive-yellow
  [200, 198, 140],// 13 pale yellow-green
  [220, 218, 170],// 14 very pale green-cream
  [238, 235, 205] // 15 near-white cream-green (innermost)
];

// Initialize the canvas
function initCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  drawBackground(ctx);
  drawRotatedShapes(ctx);
}

// Draw the background
function drawBackground(ctx) {
  ctx.fillStyle = `rgb(${COLORS[15].join(',')})`; // Use the innermost color
  ctx.fillRect(0, 0, 1920, 1080);
}

// Draw rotated shapes
function drawRotatedShapes(ctx) {
  const shapes = [
    { x: 300, y: 540, width: 300, height: 800, colorIndex: 0 },
    { x: 700, y: 540, width: 400, height: 900, colorIndex: 3 },
    { x: 1200, y: 540, width: 350, height: 700, colorIndex: 6 },
    { x: 1600, y: 540, width: 300, height: 850, colorIndex: 9 },
    { x: 900, y: 540, width: 250, height: 600, colorIndex: 12 },
    { x: 1400, y: 540, width: 400, height: 950, colorIndex: 14 },
  ];

  shapes.forEach((shape) => {
    drawRotatedShape(ctx, shape.x, shape.y, shape.width, shape.height, shape.colorIndex);
  });
}

// Draw a single rotated shape
function drawRotatedShape(ctx, x, y, width, height, colorIndex) {
  ctx.save();
  ctx.translate(x, y); // Move to the shape's center
  ctx.rotate(Math.PI / 2); // Rotate 90 degrees
  ctx.fillStyle = `rgb(${COLORS[colorIndex].join(',')})`;
  ctx.globalAlpha = 0.7; // Slight transparency
  ctx.beginPath();
  ctx.moveTo(-width / 2, height / 2);
  ctx.lineTo(-width / 2, -height / 2 + width / 2);
  ctx.arcTo(-width / 2, -height / 2, 0, -height / 2, width / 2);
  ctx.arcTo(width / 2, -height / 2, width / 2, -height / 2 + width / 2, width / 2);
  ctx.lineTo(width / 2, height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1.0; // Reset alpha
  ctx.restore();
}

// Add subtle noise texture
function drawTexture(ctx) {
  const imageData = ctx.createImageData(1920, 1080);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.random() * 255;
    data[i] = gray; // Red
    data[i + 1] = gray; // Green
    data[i + 2] = gray; // Blue
    data[i + 3] = Math.random() * 50; // Alpha
  }

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 1920;
  textureCanvas.height = 1080;
  const textureCtx = textureCanvas.getContext('2d');
  textureCtx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 0.05;
  ctx.drawImage(textureCanvas, 0, 0);
  ctx.globalAlpha = 1.0;
}

// Initialize the canvas and start drawing
initCanvas();