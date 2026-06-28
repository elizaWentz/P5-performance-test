function setup() {
  // Requested canvas size
  createCanvas(1128, 308);
  noLoop(); 
  
  // High pixel density ensures the grain texture looks sharp and gritty
  pixelDensity(2); 
}

function draw() {
  // Cream/Off-white paper stock background
  background(247, 244, 232);
  
  // Define a classic Riso color palette (RGB)
  // Riso inks are translucent, so we use a lower alpha (around 200)
  let risoPink = color(255, 66, 140, 205);   // Fluorescent Pink
  let risoYellow = color(255, 195, 0, 215);  // Sunflower Yellow
  let risoBlue = color(0, 120, 190, 195);    // Medium Blue
  
  // Use MULTIPLY blend mode to simulate translucent ink overlap
  blendMode(MULTIPLY);
  noStroke();
  
  // --- LAYER 1: YELLOW TRIANGLES ---
  push();
  applyMisregistration();
  fill(risoYellow);
  drawTriangleGrid(40, 0.7); 
  pop();
  
  // --- LAYER 2: PINK TRIANGLES ---
  push();
  applyMisregistration();
  fill(risoPink);
  drawTriangleGrid(70, 0.5); 
  pop();
  
  // --- LAYER 3: BLUE TRIANGLES ---
  push();
  applyMisregistration();
  fill(risoBlue);
  drawTriangleGrid(110, 0.4); 
  pop();
  
  // --- LAYER 4: RISO GRAIN TEXTURE ---
  // Switch back to BLEND to apply the paper/ink texture overlay evenly
  blendMode(BLEND);
  addRisoGrain(0.18); // 18% intensity for a distinct tactile look
}

/**
 * Generates an abstract compositional grid of triangles
 */
function drawTriangleGrid(baseSize, density) {
  for (let x = -baseSize; x < width + baseSize; x += baseSize * 0.8) {
    for (let y = -baseSize; y < height + baseSize; y += baseSize * 1.5) {
      
      // Randomly decide to draw based on density to keep it abstract and spacious
      if (random() < density) {
        let type = floor(random(4));
        
        push();
        translate(x, y);
        // Add minor structural rotation for variety
        rotate(random([0, HALF_PI, PI, TWO_PI])); 
        
        // Dynamic triangle variations
        if (type === 0) {
          triangle(0, 0, baseSize, 0, 0, baseSize * 1.5);
        } else if (type === 1) {
          triangle(0, 0, baseSize, baseSize * 0.5, baseSize * 2, 0);
        } else if (type === 2) {
          triangle(0, baseSize, baseSize, 0, baseSize * 2, baseSize);
        } else {
          // Large overlapping accent triangle
          triangle(-baseSize * 0.5, 0, baseSize * 1.5, 0, baseSize * 0.5, baseSize * 2);
        }
        pop();
      }
    }
  }
}

/**
 * Simulates mechanical paper alignment errors by shifting the matrix slightly
 */
function applyMisregistration() {
  let shiftX = random(-2.5, 2.5);
  let shiftY = random(-2.5, 2.5);
  let rotateError = random(-0.005, 0.005);
  
  translate(shiftX, shiftY);
  rotate(rotateError);
}

/**
 * Creates a beautiful, heavy-ink grain overlay across the canvas
 */
function addRisoGrain(intensity) {
  loadPixels();
  
  // Loop through every single pixel on the canvas
  for (let i = 0; i < pixels.length; i += 4) {
    // Generate a noise value
    let grain = (random() - 0.5) * (intensity * 255);
    
    // Apply grain directly to RGB channels
    pixels[i]     = constrain(pixels[i] + grain, 0, 255);     // Red
    pixels[i + 1] = constrain(pixels[i + 1] + grain, 0, 255); // Green
    pixels[i + 2] = constrain(pixels[i + 2] + grain, 0, 255); // Blue
    // Leave pixels[i + 3] (Alpha) at 255
  }
  
  updatePixels();
}