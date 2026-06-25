// --- PALETTE (tuned to the reference image) ---
const COLORS = {
  bg:           '#E4D6C7', // warm beige background
  sand:         '#D0B4A1', // light warm brown
  lightCream:   '#F1E6D7', // small central cream arch
  blueGrey:     '#B5C1C9', // pale blue/grey
  softGrey:     '#C6C9CC', // light grey arch
  midGrey:      '#7D8287', // medium grey
  darkGrey:     '#4C5157', // darker grey
  nearBlack:    '#36393E', // almost black
  roseClay:     '#B4776F', // muted pink/terracotta
  mauveBrown:   '#8C6B64', // brownish mauve
};

// how much space to leave between the tallest arches and the top
const TOP_MARGIN = 140;

function setup() {
  createCanvas(1920, 1080);
  noLoop(); // static frame

  noiseDetail(3, 0.45); // nicer, leathery noise

  drawBackground();
  drawArches();
  drawTexture();          // main leather texture
  enhanceGrainyTexture(); // subtle extra grain
}

// Draw the background
function drawBackground() {
  const ctx = drawingContext;
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, width, height);
}

// Draw arches and vertical shapes
function drawArches() {
  const ctx = drawingContext;

  // Ordered back-to-front to approximate the reference layout
  const arches = [
    // LEFT SIDE
    { x: 110,  width: 230, height: 880, color: COLORS.blueGrey,  alpha: 0.85 },
    { x: 260,  width: 330, height: 860, color: COLORS.sand,      alpha: 0.85 },
    { x: 430,  width: 160, height: 650, color: COLORS.lightCream,alpha: 0.95 },

    // CENTRAL LARGE LIGHT ARCH
    { x: 560,  width: 430, height: 900, color: COLORS.softGrey,  alpha: 0.80 },

    // SMALLER CENTRAL LIGHT ARCH
    { x: 820,  width: 260, height: 640, color: COLORS.lightCream,alpha: 0.95 },

    // RIGHT SIDE GREYS
    { x: 980,  width: 320, height: 910, color: COLORS.midGrey,   alpha: 0.90 },
    { x: 1180, width: 260, height: 760, color: COLORS.darkGrey,  alpha: 0.92 },

    // ROSE / TERRACOTTA ARCH
    { x: 1320, width: 260, height: 800, color: COLORS.roseClay,  alpha: 0.90 },

    // VERY TALL DARK ARCH
    { x: 1470, width: 360, height: 1020,color: COLORS.nearBlack, alpha: 0.92 },

    // FAR RIGHT MAUVE / BROWN ARCH
    { x: 1680, width: 320, height: 900, color: COLORS.mauveBrown,alpha: 0.90 },
  ];

  arches.forEach((shape) => {
    drawColumnShape(
      ctx,
      shape.x,
      0, // Start from the top of the canvas
      shape.width,
      shape.height - TOP_MARGIN,
      shape.color,
      shape.alpha
    );
  });
}

// Draw a single column shape with rounded bottom (flipped)
function drawColumnShape(ctx, x, y, w, h, color, alpha = 0.8) {
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;

  const radius = w / 2;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h - radius);
  ctx.arcTo(x, y + h, x + radius, y + h, radius);
  ctx.arcTo(x + w, y + h, x + w, y + h - radius, radius);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1.0;
}

// Main leather-like texture
function drawTexture() {
  const ctx = drawingContext;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  let i = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Large-scale blotchy variation
      const n1 = noise(x * 0.015, y * 0.015);
      // Smaller-scale grain
      const n2 = noise(x * 0.08 + 1000, y * 0.08 + 500);

      // Base light value, modulated to get a soft, worn look
      let v = 235 + n1 * 18 - n2 * 25;
      v = constrain(v, 195, 248);

      data[i]     = v;
      data[i + 1] = v;
      data[i + 2] = v;
      // Use alpha for “pores”/grain strength
      data[i + 3] = 50 + n2 * 80;
      i += 4;
    }
  }

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = width;
  textureCanvas.height = height;
  const textureCtx = textureCanvas.getContext('2d');
  textureCtx.putImageData(imageData, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.35; // overall leather strength
  ctx.drawImage(textureCanvas, 0, 0);
  ctx.restore();
}

// Fine grain on top to make it feel more tactile
function enhanceGrainyTexture() {
  const ctx = drawingContext;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  let i = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gray = 230 + Math.random() * 20; // very subtle
      data[i]     = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
      data[i + 3] = Math.random() * 40; // light alpha
      i += 4;
    }
  }

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = width;
  textureCanvas.height = height;
  const textureCtx = textureCanvas.getContext('2d');
  textureCtx.putImageData(imageData, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.18;
  ctx.drawImage(textureCanvas, 0, 0);
  ctx.restore();
}