// Riso-inspired Triangle Generator
// Click the canvas to generate a new composition

let risoColors = [];

function setup() {
  // Classic print proportions (4:5 aspect ratio)
  createCanvas(600, 750);
  pixelDensity(1); // Ensures predictable texture scaling
  noLoop();

  // Define a classic Riso spot-color palette (RGBA format)
  // Transparency (alpha) is key to replicating thin Riso ink layers
  risoColors = [
    color(255, 0, 127, 180),   // Fluorescent Pink
    color(0, 164, 228, 180),   // Aqua
    color(255, 220, 0, 200),   // Yellow
    color(13, 35, 100, 160)    // Federal Blue
  ];
}

function draw() {
  // 1. Paper Base Coat (Warm, off-white, slightly toothy paper stock)
  background(247, 244, 236);
  
  // 2. Render Riso Artwork
  push();
  // Using MULTIPLY blend mode forces colors to mix digitally 
  // exactly how translucent ink layers build up on paper
  blendMode(MULTIPLY); 
  
  let totalShapes = random(18, 28);
  
  for (let i = 0; i < totalShapes; i++) {
    let targetColor = random(risoColors);
    
    // Slight positional "misregistration" simulation
    // Riso drums rarely line up perfectly, giving it charm
    let xOffset = random(-3, 3);
    let yOffset = random(-3, 3);
    
    // Calculate triangle parameters
    let cx = random(width * 0.15, width * 0.85);
    let cy = random(height * 0.15, height * 0.85);
    let r = random(60, 180);
    let angleOffset = random(TWO_PI);

    fill(targetColor);
    noStroke();

    // Draw the triangle with a slight mechanical shift
    push();
    translate(cx + xOffset, cy + yOffset);
    rotate(angleOffset);
    triangle(
      0, -r, 
      r * cos(30 * PI / 180), r * sin(30 * PI / 180),
      -r * cos(30 * PI / 180), r * sin(30 * PI / 180)
    );
    pop();
  }
  pop(); // Exit MULTIPLY blend mode

  // 3. Post-Process Texture Overlay
  // Applies a gritty, fine-grained ink-and-paper texture across the canvas
  addRisoTexture();
}

function addRisoTexture() {
  loadPixels();
  
  // Looping through every pixel to inject micro-noise
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let index = (x + y * width) * 4;
      
      // Generate a fine screen grain using low-amplitude random noise
      let grain = random(-18, 18);
      
      // Apply texture to RGB channels while leaving Alpha intact
      pixels[index]     = constrain(pixels[index] + grain, 0, 255);
      pixels[index + 1] = constrain(pixels[index + 1] + grain, 0, 255);
      pixels[index + 2] = constrain(pixels[index + 2] + grain, 0, 255);
    }
  }
  
  updatePixels();
}

// Interactivity to explore different outputs
function mousePressed() {
  redraw();
}