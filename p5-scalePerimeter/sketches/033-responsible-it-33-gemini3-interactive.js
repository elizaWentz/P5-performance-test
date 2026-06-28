// Interactive Riso-inspired Triangle Generator
// Move your mouse over the canvas to shift the print layers

let risoColors = [];
let shapes = [];
let totalShapes = 25;

function setup() {
  // Classic print proportions (4:5 aspect ratio)
  createCanvas(600, 750);
  pixelDensity(1); // Crucial for pixel-by-pixel grain performance

  // Define a classic Riso spot-color palette (RGBA format)
  risoColors = [
    color(255, 0, 127, 170),   // Fluorescent Pink
    color(0, 164, 228, 170),   // Aqua
    color(255, 220, 0, 190),   // Yellow
    color(13, 35, 100, 150)    // Federal Blue
  ];

  // Pre-generate shape properties so they stay constant until hovered
  for (let i = 0; i < totalShapes; i++) {
    shapes.push({
      baseX: random(width * 0.15, width * 0.85),
      baseY: random(height * 0.15, height * 0.85),
      currentX: 0,
      currentY: 0,
      r: random(60, 180),
      baseAngle: random(TWO_PI),
      currentAngle: 0,
      color: random(risoColors),
      // Individual mechanical registration error per shape
      regX: random(-3, 3),
      regY: random(-3, 3)
    });
  }
}

function draw() {
  // 1. Paper Base Coat (Warm, off-white paper stock)
  background(247, 244, 236);
  
  // 2. Render Riso Artwork
  push();
  blendMode(MULTIPLY); // Digital overprint simulation
  
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Calculate distance from mouse to the shape's center
    let d = dist(mouseX, mouseY, s.baseX, s.baseY);
    
    // Hover effect: If mouse is close (within 180px), distort the shape
    if (d < 180) {
      // Map closeness to an intensity factor
      let proximity = map(d, 0, 180, 1, 0); 
      
      // Introduce "ink bleeding" position shift and rotational slippage
      s.currentX = s.baseX + s.regX + sin(frameCount * 0.05 + i) * (20 * proximity);
      s.currentY = s.baseY + s.regY + cos(frameCount * 0.05 + i) * (20 * proximity);
      s.currentAngle = s.baseAngle + (0.3 * proximity * sin(frameCount * 0.02));
    } else {
      // Return to resting print state smoothly
      s.currentX = lerp(s.currentX, s.baseX + s.regX, 0.1);
      s.currentY = lerp(s.currentY, s.baseY + s.regY, 0.1);
      s.currentAngle = lerp(s.currentAngle, s.baseAngle, 0.1);
    }
    
    // Draw the triangle
    fill(s.color);
    noStroke();
    push();
    translate(s.currentX, s.currentY);
    rotate(s.currentAngle);
    triangle(
      0, -s.r, 
      s.r * cos(30 * PI / 180), s.r * sin(30 * PI / 180),
      -s.r * cos(30 * PI / 180), s.r * sin(30 * PI / 180)
    );
    pop();
  }
  pop(); // Exit MULTIPLY mode

  // 3. Post-Process Texture Overlay
  addRisoTexture();
}

function addRisoTexture() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let index = (x + y * width) * 4;
      
      // Fast pseudo-random grain generation
      let grain = random(-22, 22);
      
      pixels[index]     = constrain(pixels[index] + grain, 0, 255);
      pixels[index + 1] = constrain(pixels[index + 1] + grain, 0, 255);
      pixels[index + 2] = constrain(pixels[index + 2] + grain, 0, 255);
    }
  }
  updatePixels();
}

// Click to re-shuffle the entire layout composition
function mousePressed() {
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].baseX = random(width * 0.15, width * 0.85);
    shapes[i].baseY = random(height * 0.15, height * 0.85);
    shapes[i].baseAngle = random(TWO_PI);
    shapes[i].color = random(risoColors);
  }
}