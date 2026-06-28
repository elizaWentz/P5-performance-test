let colors = [];
let blobs = [];
let numBlobs = 5;

function setup() {
  createCanvas(1128, 308);
  pixelDensity(1); 
  
  // High-contrast dark psychedelic palette
  colors = [
    color(10, 8, 22),     // Dark space background
    color(90, 10, 85),    // Sharp deep magenta
    color(0, 110, 185),   // Electric blue
    color(5, 135, 95),    // Emerald teal
    color(245, 175, 20),  // Vivid gold / Amber
    color(12, 10, 24)     // Outer field bound
  ];

  // Initialize independent floating lava centers
  for (let i = 0; i < numBlobs; i++) {
    blobs.push({
      x: random(width),
      y: random(height),
      size: random(130, 220),
      seedX: random(5000),
      seedY: random(5000),
      speedX: random(0.002, 0.005),
      speedY: random(0.003, 0.006)
    });
  }
}

function draw() {
  background(10, 8, 22);

  let pxSize = 4; 
  let cols = width / pxSize;
  let rows = height / pxSize;

  let mx = mouseX > 0 ? mouseX / width : 0.5;
  let my = mouseY > 0 ? mouseY / height : 0.5;

  // Float the lava nodes through time
  for (let b of blobs) {
    b.x = noise(b.seedX) * width;
    b.y = noise(b.seedY) * height;
    
    b.seedX += b.speedX + (mx * 0.005);
    b.seedY += b.speedY + (my * 0.005);
  }

  // Render the highly geometric pixelated field
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let screenX = x * pxSize;
      let screenY = y * pxSize;

      // --- 1. TRIANGULAR METABALL ENERGY FIELD ---
      // Instead of measuring pure circular distance, we distort the distance metrics 
      // using absolute vectors to force the liquid blobs into three-sided triangles.
      let fluidEnergy = 0;
      for (let b of blobs) {
        let dx = screenX - b.x;
        let dy = screenY - b.y;
        
        // Equilateral triangle distance field math applied to the liquid coordinates
        let rX = abs(dx) * 0.866025 - dy * 0.5; 
        let triDist = max(rX, dy); 
        
        if (triDist > 0) {
          fluidEnergy += (b.size) / (triDist + 15);
        }
      }

      // --- 2. BOLD BACKGROUND TRIANGLE GRID ---
      // Creates huge, bold repeating zig-zag triangular structures across the landscape
      let triPeriod = cols * 0.18; 
      let gridPattern = abs((x % triPeriod) - triPeriod * 0.5) / (triPeriod * 0.5);
      
      // Look for inverted interlocking triangles based on Y axis rows
      let rowShift = (y / rows) * 1.5;
      let sharpTriangleWave = abs((gridPattern + rowShift) % 1.0 - 0.5) * 4.0;

      // --- 3. MERGING THE GEOMETRY AND FLUID ---
      // Combine the organic lava flow with the hard-edged triangle grids
      let interactionInfluence = map(my, 0, 1, 0.2, 0.8);
      let combinedField = (fluidEnergy * 0.75) + (sharpTriangleWave * interactionInfluence);

      // Infuse the digital moiré step texture lines from the reference images
      let microBanding = sin(screenX * 0.08 + combinedField) * cos(screenY * 0.08);
      let finalValue = combinedField * 0.28 + microBanding * 0.12;

      // Map color profile steps
      let val = map(finalValue, 0.3, 1.9, 0, 1);
      val = constrain(val, 0, 0.999);

      // Quantize steps to achieve the sharp color steps of Image 1 and 3
      let colorIdx = val * (colors.length - 1);
      let index = floor(colorIdx);
      let amt = fract(colorIdx);

      // Extra crisp transitions for bold geometric definition
      amt = smoothstep(0.2, 0.8, amt); 

      let finalColor = lerpColor(colors[index], colors[index + 1], amt);

      fill(finalColor);
      noStroke();
      rect(screenX, screenY, pxSize, pxSize);
    }
  }

  // --- 4. HIGHLY VISIBLE GEOMETRIC WIREFRAMES ---
  // Solid, brightly glowing geometric paths overlaying the canvas
  drawProminentTriangleOverlays(mx, my);
}

function smoothstep(edge0, edge1, x) {
  x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * (3 - 2 * x);
}

function drawProminentTriangleOverlays(mx, my) {
  noFill();
  
  // Heavy structural frames cutting right across the center field
  let centerPulse = sin(frameCount * 0.01) * 40;
  
  // Neon Gold Primary Triangle
  stroke(245, 175, 20, 90); 
  strokeWeight(3);
  triangle(
    width * 0.5 + centerPulse, 20, 
    width * 0.25 - centerPulse, height - 20, 
    width * 0.75 - centerPulse, height - 20
  );

  // Deep Cyan Interlocking Secondary Triangle
  stroke(0, 110, 185, 80);
  strokeWeight(2);
  triangle(
    width * 0.5 - centerPulse, height - 20, 
    width * 0.35 + centerPulse, 40, 
    width * 0.65 + centerPulse, 40
  );

  // Repeating structural shard lines towards the edges
  stroke(5, 135, 95, 45);
  strokeWeight(1.5);
  for(let i = 0; i < 4; i++) {
    let xOffset = i * 60;
    // Left edge shard grouping
    triangle(xOffset, height, xOffset + 80, 0, xOffset + 160, height);
    // Right edge shard grouping
    triangle(width - xOffset, 0, width - xOffset - 80, height, width - xOffset - 160, 0);
  }
}