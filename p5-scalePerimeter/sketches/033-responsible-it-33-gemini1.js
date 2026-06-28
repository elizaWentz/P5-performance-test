/* Risoprint Simulator by Artie 
  Inspired by the specific colors, textures, and 
  overlapping effects of Riso printing. 
*/

let primary_colors = [];
let bg_color;
let noise_tex;

function setup() {
  // 1. Define Canvas Size (aspect ratio 4:5 for print feel)
  createCanvas(640, 800);
  
  // 2. Define Risograph Ink Colors (Specific spot colors)
  primary_colors = [
    color(255, 102, 102),   // Riso Fluorescent Pink
    color(100, 204, 204),   // Riso Teal/Cyan
    color(255, 230, 0),     // Riso Yellow
    color(60, 60, 150)       // Riso Blue (used rarely)
  ];
  
  // 3. Set Background Color (cream or off-white paper)
  bg_color = color(252, 250, 235);
  
  // 4. Set the drawing blend mode. 
  // IMPORTANT: MULTIPLY simulates transparent inks overlapping.
  blendMode(MULTIPLY); 
  
  // 5. Setup for grain texture (p5 noise, or an overlay)
  noiseDetail(5, 0.5); 
  
  // No loop for static composition
  noLoop(); 
  
  generateRisograph();
}

function draw() {
  // (Setup calls generateRisograph, which calls draw.)
}

function generateRisograph() {
  clear(); // Important to clear the MULTIPLY stack
  background(bg_color); // Draw paper background first
  
  // Set Blend mode again after clear/bg, or it won't work correctly.
  blendMode(MULTIPLY);

  push(); 
  translate(width/2, height/2); // Center the composition
  
  // Define structure. Here: overlapping 'layers' of patterns.
  // Layer 1: Fluorescent Pink
  drawTriangleLayer(primary_colors[0], 0.6, 'circle', 0); // Color, opacity, pattern type, rotation

  // Layer 2: Teal/Cyan
  drawTriangleLayer(primary_colors[1], 0.6, 'grid', PI/3);
  
  // Layer 3: Yellow
  drawTriangleLayer(primary_colors[2], 0.7, 'stripes', PI/2);
  
  // Add a dark, textured border/background noise
  blendMode(BLEND); // Switch to blend just for grain
  fill(0, 10); // Subtle grain fill
  addPaperTexture();
  
  pop();
}

/* Draws a complex layer of triangles in a specific pattern/color */
function drawTriangleLayer(clr, opacity, patternType, initialRotation) {
  let c = color(red(clr), green(clr), blue(clr));
  c.setAlpha(opacity * 255); // Adjust color opacity
  
  fill(c);
  noStroke(); 
  
  let cols = 12;
  let rows = 12;
  let spacing = 60;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = (i - cols / 2) * spacing;
      let y = (j - rows / 2) * spacing;

      push();
      translate(x, y);
      rotate(initialRotation + atan2(y,x)); // Pattern rotates around center

      let type = floor(random(3)); // Random variation
      let scaleOffset = noise(x*0.01, y*0.01);
      
      // Select triangle generation logic
      if (patternType === 'grid') {
          risoTriangle1(25 + scaleOffset * 15);
      } else if (patternType === 'stripes') {
          risoTriangle2(20 + scaleOffset * 15, j % 2);
      } else {
         risoTriangle3(18 + scaleOffset * 20);
      }
      
      pop();
    }
  }
}

/* Function: Draws one "Risograph" triangle with noise texture applied */
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
  vertex(-s/2, -s/2 * flip);
  vertex(s/2, -s/2 * flip);
  vertex(0, s/2 * flip);
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

/* Overlay a coarse noise texture to simulate Riso output */
function addPaperTexture() {
    let textureOpacity = 30; // Control texture intensity
    for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
            let n = noise(x * 0.03, y * 0.03); // Noise scale
            // If the noise value is high, paint a small dot
            if (n > 0.6) {
                fill(0, textureOpacity); // Tiny dark texture dots
                rect(x, y, 1, 1);
            }
        }
    }
}