/* Interactive Risoprint Simulator (Portrait Edition) by Artie 
  Canvas: 640 x 800 (Classic Poster Layout)
  Move your mouse over the canvas to distort and bleed the ink layers!
*/

let primary_colors = [];
let bg_color;
let staticGrain; // Graphic buffer to store the grain texture for performance

function setup() {
  // 1. Canvas size restored to 640 x 800
  createCanvas(640, 800);
  
  // Define Riso Spot Colors
  primary_colors = [
    color(255, 102, 102),   // Riso Fluorescent Pink
    color(100, 204, 204),   // Riso Teal/Cyan
    color(255, 230, 0)      // Riso Yellow
  ];
  
  bg_color = color(252, 250, 235); // Cream paper
  
  // Pre-calculate the paper texture once so the loop runs smoothly at 60 FPS
  createStaticGrain();
}

function draw() {
  // Clear the canvas and draw the background paper color
  blendMode(BLEND);
  background(bg_color); 
  
  // Switch to MULTIPLY to simulate transparent ink overlays
  blendMode(MULTIPLY);

  push(); 
  translate(width / 2, height / 2); // Center composition
  
  // Layer 1: Fluorescent Pink (Reacts slightly to mouse)
  drawInteractiveLayer(primary_colors[0], 0.6, 'circle', 0, 0.03); 

  // Layer 2: Teal/Cyan (Reacts moderately to mouse)
  drawInteractiveLayer(primary_colors[1], 0.6, 'grid', PI / 3, -0.05);
  
  // Layer 3: Yellow (Reacts heavily to mouse)
  drawInteractiveLayer(primary_colors[2], 0.7, 'stripes', PI / 2, 0.08);
  
  pop();

  // Draw the static grain texture over everything using normal blend mode
  blendMode(BLEND);
  image(staticGrain, 0, 0);
}

/* Draws a grid of triangles that distort based on mouse proximity */
function drawInteractiveLayer(clr, opacity, patternType, initialRotation, mouseInfluence) {
  let c = color(red(clr), green(clr), blue(clr));
  c.setAlpha(opacity * 255); 
  
  fill(c);
  noStroke(); 
  
  // Re-balanced grid for portrait 640x800 dimensions
  let cols = 13; 
  let rows = 16;
  let spacing = 54;

  // Calculate mouse coordinates relative to the translated center screen
  let relMouseX = mouseX - width / 2;
  let relMouseY = mouseY - height / 2;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = (i - cols / 2) * spacing;
      let y = (j - rows / 2) * spacing;

      // Calculate distance from this specific triangle to the mouse cursor
      let d = dist(x, y, relMouseX, relMouseY);
      
      push();
      
      // If the mouse is close, distort the position slightly
      if (d < 220) {
        let hoverFactor = map(d, 0, 220, 1, 0); // 1 at mouse position, 0 far away
        
        // Push the ink layers away or toward the mouse dynamically
        translate(x + (relMouseX - x) * hoverFactor * mouseInfluence, 
                  y + (relMouseY - y) * hoverFactor * mouseInfluence);
                  
        // Spin the triangle extra based on proximity
        rotate(initialRotation + atan2(y, x) + (hoverFactor * TWO_PI * mouseInfluence));
        
        // Scale modification on hover (simulates ink expanding/bleeding)
        let scaleOffset = noise(x * 0.005, y * 0.005);
        let sizeBonus = hoverFactor * 12;
        renderShape(patternType, scaleOffset, sizeBonus, j);
        
      } else {
        // Default static state if mouse is far away
        translate(x, y);
        rotate(initialRotation + atan2(y, x));
        let scaleOffset = noise(x * 0.005, y * 0.005);
        renderShape(patternType, scaleOffset, 0, j);
      }
      
      pop();
    }
  }
}

/* Helper to choose which triangle type to draw */
function renderShape(type, scaleOffset, sizeBonus, rowIdx) {
  if (type === 'grid') {
    risoTriangle1(22 + scaleOffset * 12 + sizeBonus);
  } else if (type === 'stripes') {
    risoTriangle2(18 + scaleOffset * 12 + sizeBonus, rowIdx % 2);
  } else {
    risoTriangle3(16 + scaleOffset * 15 + sizeBonus);
  }
}

/* Triangle Primitives */
function risoTriangle1(s) {
  beginShape();
  vertex(0, -s);
  vertex(-s * sqrt(3) / 2, s / 2);
  vertex(s * sqrt(3) / 2, s / 2);
  endShape(CLOSE);
}

function risoTriangle2(s, isUpsideDown) {
  let flip = isUpsideDown ? -1 : 1;
  beginShape();
  vertex(-s / 2, -s / 2 * flip);
  vertex(s / 2, -s / 2 * flip);
  vertex(0, s / 2 * flip);
  endShape(CLOSE);
}

function risoTriangle3(s) {
  let side = s * 0.8;
  beginShape();
  vertex(0, 0);
  vertex(side, side);
  vertex(side, 0);
  endShape(CLOSE);
}

/* Creates a permanent off-screen image buffer for the print grain texture */
function createStaticGrain() {
  staticGrain = createGraphics(width, height);
  staticGrain.clear();
  staticGrain.noStroke();
  
  let textureOpacity = 32; // Enhanced texture slightly for portrait scale
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let n = noise(x * 0.05, y * 0.05); 
      if (n > 0.58) {
        staticGrain.fill(0, textureOpacity);
        staticGrain.rect(x, y, 1, 1);
      }
    }
  }
}