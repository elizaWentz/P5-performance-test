// Interactive Risograph Triangles with Hover Effect
let colors = [];
let paperColor;
let baseGraphic; // Offscreen buffer to hold the static Riso print
let triangles = []; // Array to track triangle data for mouse interaction

function setup() {
  createCanvas(800, 500);
  
  // Riso Ink Palette
  colors = [
    color(255, 72, 176),   // Fluorescent Pink
    color(0, 114, 206),    // Federal Blue
    color(255, 184, 28),   // Sunflower Yellow
    color(0, 131, 143)     // Teal
  ];
  paperColor = color(244, 241, 234); 

  // Generate the artwork data and build the background print
  generateArtworkData();
  renderStaticRisoBuffer();
}

function draw() {
  // 1. Draw the pre-rendered textured Riso print onto the screen
  image(baseGraphic, 0, 0);

  // 2. Check for hover interaction
  // We look through our triangles to see if the mouse is near one
  for (let t of triangles) {
    let d = dist(mouseX, mouseY, t.cx, t.cy);
    
    // If hovering near a triangle's center, trigger a "print shift" reaction
    if (d < t.r * 0.6) {
      push();
      blendMode(MULTIPLY);
      
      // Draw a subtle "wet ink" glow or shadow offset on hover
      let hoverColor = colors[(t.colorIndex + 1) % colors.length];
      hoverColor.setAlpha(80);
      fill(hoverColor);
      noStroke();
      
      // Draw a slightly shifted version of the triangle
      drawTriangleShape(mouseX + (t.cx - mouseX)*0.1, mouseY + (t.cy - mouseY)*0.1, t.r * 1.1, t.type);
      pop();
      
      // Draw an interactive crosshair/registration mark tracking the mouse
      drawRegistrationMark(mouseX, mouseY);
    }
  }
}

// Generates the mathematical properties of the layout
function generateArtworkData() {
  triangles = [];
  let layers = 4;
  
  for (let l = 0; l < layers; l++) {
    let offsetX = random(-3, 3);
    let offsetY = random(-3, 3);
    let triangleCount = int(random(15, 25) - (l * 2));
    
    for (let i = 0; i < triangleCount; i++) {
      triangles.push({
        cx: random(width * 0.1, width * 0.9) + offsetX,
        cy: random(height * 0.1, height * 0.9) + offsetY,
        r: random(50, 160),
        colorIndex: l % colors.length,
        type: random(['up', 'down', 'left', 'right']),
        alpha: random(180, 230)
      });
    }
  }
}

// Renders the background artwork into a buffer so it doesn't lag the live hover effects
function renderStaticRisoBuffer() {
  baseGraphic = createGraphics(width, height);
  baseGraphic.background(paperColor);
  
  // Draw paper fibers into buffer
  baseGraphic.push();
  baseGraphic.stroke(40, 30, 20, 12);
  for (let i = 0; i < 1500; i++) {
    let x = random(width);
    let y = random(height);
    let len = random(1, 4);
    let angle = random(TWO_PI);
    baseGraphic.line(x, y, x + cos(angle) * len, y + sin(angle) * len);
  }
  baseGraphic.pop();

  // Draw triangles into buffer using MULTIPLY
  baseGraphic.blendMode(MULTIPLY);
  for (let t of triangles) {
    baseGraphic.push();
    let ink = colors[t.colorIndex];
    ink.setAlpha(t.alpha);
    baseGraphic.fill(ink);
    baseGraphic.noStroke();
    
    // Call the shape helper targeting the buffer
    drawTriangleShapeToBuffer(baseGraphic, t.cx, t.cy, t.r, t.type);
    baseGraphic.pop();
  }
  
  // Apply the heavy grain overlay onto the buffer
  baseGraphic.blendMode(BLEND);
  applyGrainToBuffer(baseGraphic);
}

// Helper to draw triangle directions on main canvas
function drawTriangleShape(cx, cy, r, type) {
  if (type === 'up') triangle(cx, cy - r/2, cx - r/2, cy + r/2, cx + r/2, cy + r/2);
  else if (type === 'down') triangle(cx - r/2, cy - r/2, cx + r/2, cy - r/2, cx, cy + r/2);
  else if (type === 'left') triangle(cx - r/2, cy, cx + r/2, cy - r/2, cx + r/2, cy + r/2);
  else triangle(cx + r/2, cy, cx - r/2, cy - r/2, cx - r/2, cy + r/2);
}

// Helper to draw triangle directions on offscreen buffer
function drawTriangleShapeToBuffer(pg, cx, cy, r, type) {
  if (type === 'up') pg.triangle(cx, cy - r/2, cx - r/2, cy + r/2, cx + r/2, cy + r/2);
  else if (type === 'down') pg.triangle(cx - r/2, cy - r/2, pg.width + r/2, cy - r/2, cx, cy + r/2);
  else if (type === 'left') pg.triangle(cx - r/2, cy, cx + r/2, cy - r/2, cx + r/2, cy + r/2);
  else pg.triangle(cx + r/2, cy, cx - r/2, cy - r/2, cx - r/2, cy + r/2);
}

// Applies gritty texture to the buffer
function applyGrainToBuffer(pg) {
  pg.loadPixels();
  for (let x = 0; x < pg.width; x++) {
    for (let y = 0; y < pg.height; y++) {
      if (random(100) < 14) {
        let index = (x + y * pg.width) * 4;
        let grainAmount = random(-28, 28);
        pg.pixels[index]     = constrain(pg.pixels[index] + grainAmount, 0, 255);
        pg.pixels[index + 1] = constrain(pg.pixels[index + 1] + grainAmount, 0, 255);
        pg.pixels[index + 2] = constrain(pg.pixels[index + 2] + grainAmount, 0, 255);
      }
    }
  }
  pg.updatePixels();
}

// Draws a classic printer's registration mark at the cursor position
function drawRegistrationMark(mx, my) {
  push();
  stroke(80, 80, 80, 150);
  strokeWeight(1);
  noFill();
  ellipse(mx, my, 16, 16);
  line(mx - 12, my, mx + 12, my);
  line(mx, my - 12, mx, my + 12);
  pop();
}

// Press 'R' to completely regenerate a new layout
function keyPressed() {
  if (key === 'r' || key === 'R') {
    generateArtworkData();
    renderStaticRisoBuffer();
  }
}