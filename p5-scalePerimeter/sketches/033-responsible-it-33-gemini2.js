// Risograph Inspired Triangle Composition
// Features: Ink overlap simulation, paper texture, and misregistration

let colors = [];
let paperColor;

function setup() {
  // Create a canvas with a classic print aspect ratio
  createCanvas(800, 500);
  noLoop(); 
  
  // Riso Ink Palette (Hex codes matching real Riso ink masters)
  colors = [
    color(255, 72, 176),   // Fluorescent Pink
    color(0, 114, 206),    // Federal Blue
    color(255, 184, 28),   // Sunflower Yellow
    color(0, 131, 143)     // Teal
  ];
  
  // Warm, fibrous cream paper background
  paperColor = color(244, 241, 234); 
}

function draw() {
  background(paperColor);
  
  // 1. Draw base paper speckle texture
  drawPaperTexture();

  // 2. Set blend mode to MULTIPLY to mimic translucent ink overlays
  blendMode(MULTIPLY);
  
  // Create layers of triangles mimicking multiple drum passes
  let layers = 4; 
  
  for (let l = 0; l < layers; l++) {
    // Pick an ink color for this layer pass
    let inkColor = colors[l % colors.length];
    
    // Simulate mechanical Riso "Misregistration" (slight alignment error per layer)
    let offsetX = random(-3, 3);
    let offsetY = random(-3, 3);
    
    // Density of triangles decreases in upper layers
    let triangleCount = int(random(15, 30) - (l * 3));
    
    for (let i = 0; i < triangleCount; i++) {
      push();
      
      // Calculate random positions, clustering slightly toward the center
      let cx = random(width * 0.1, width * 0.9) + offsetX;
      let cy = random(height * 0.1, height * 0.9) + offsetY;
      let r = random(40, 180); // Size of triangles
      
      // Give a slight transparency to ink to let texture peek through
      inkColor.setAlpha(random(200, 240)); 
      fill(inkColor);
      noStroke();
      
      // Generate standard or inverted triangle shapes
      let type = random(['up', 'down', 'left', 'right']);
      
      if (type === 'up') {
        triangle(cx, cy - r/2, cx - r/2, cy + r/2, cx + r/2, cy + r/2);
      } else if (type === 'down') {
        triangle(cx - r/2, cy - r/2, cx + r/2, cy - r/2, cx, cy + r/2);
      } else if (type === 'left') {
        triangle(cx - r/2, cy, cx + r/2, cy - r/2, cx + r/2, cy + r/2);
      } else {
        triangle(cx + r/2, cy, cx - r/2, cy - r/2, cx - r/2, cy + r/2);
      }
      
      pop();
    }
  }
  
  // 3. Reset blend mode to add heavy ink grain on top
  blendMode(BLEND);
  drawInkGrain();
}

// Generates fine fiber noise onto the empty paper
function drawPaperTexture() {
  push();
  stroke(40, 30, 20, 12); // subtle brownish fibers
  for (let i = 0; i < 1500; i++) {
    let x = random(width);
    let y = random(height);
    let len = random(1, 4);
    let angle = random(TWO_PI);
    line(x, y, x + cos(angle) * len, y + sin(angle) * len);
  }
  pop();
}

// Generates high-density grain overlay to simulate soy-ink roughness
function drawInkGrain() {
  loadPixels();
  // Loop through every pixel on the canvas
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Use Perlin noise mixed with pure random to get structured grain
      let n = noise(x * 0.05, y * 0.05) * 255;
      if (random(100) < 14) { // controls grain density
        let index = (x + y * width) * 4;
        
        // Darken or lighten slightly based on noise to create ink texture
        let grainAmount = random(-25, 25);
        pixels[index]     = constrain(pixels[index] + grainAmount, 0, 255);     // R
        pixels[index + 1] = constrain(pixels[index + 1] + grainAmount, 0, 255); // G
        pixels[index + 2] = constrain(pixels[index + 2] + grainAmount, 0, 255); // B
      }
    }
  }
  updatePixels();
}

// Press 'R' to generate a brand new composition variant
function keyPressed() {
  if (key === 'r' || key === 'R') {
    noiseSeed(random(1000));
    randomSeed(random(1000));
    redraw();
  }
}