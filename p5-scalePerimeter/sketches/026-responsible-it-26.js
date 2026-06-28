function setup() {
  // Set the canvas size as requested
  createCanvas(1128, 308);
  noLoop(); 
  pixelDensity(1); 
}

function draw() {
  background(255);

  // 1. Define the vibrant color palette inspired by the images
  let colors = [
    color(255, 110, 150), // Hot pink / Salmon
    color(255, 190, 10),  // Bright yellow / Orange-gold
    color(0, 180, 120),   // Emerald green / Teal
    color(0, 150, 255),   // Electric cyan / Blue
    color(15, 15, 35)     // Deep velvet blue / Black
  ];

  // 2. Grid settings to get that distinct digital/pixelated look
  let pxSize = 4; 
  let cols = width / pxSize;
  let rows = height / pxSize;

  // 3. Nested loops to generate the mathematical interference field
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      // Scale coordinates for the math functions
      let nx = x * 0.015;
      let ny = y * 0.015;

      // --- Triangle Influence Mapping ---
      // To bring in structural triangles, we calculate distance fields 
      // from invisible geometric bounds across the wide canvas.
      let tri1 = abs((x - cols * 0.25) + (y - rows * 0.5)) - rows * 0.4;
      let tri2 = abs((x - cols * 0.75) - (y - rows * 0.5)) - rows * 0.4;
      let triWave = sin(min(tri1, tri2) * 0.4);

      // --- Psychedelic Distortion Math ---
      // Replicating the liquid, melting rings from the second image
      let angle1 = sin(nx * 2.0 + ny * 1.5) * 4.0;
      let angle2 = cos(nx * 1.2 - ny * 2.5) * 4.0;

      // Replicating the heavy Moire/Chop concentric waves from the third image
      let wave1 = sin(nx * 5.0 + angle2) * cos(ny * 4.0 + angle1);
      let wave2 = sin(dist(x, y, cols * 0.5, rows * -0.2) * 0.15 + triWave * 3.0);
      let wave3 = cos(dist(x, y, cols * 0.8, rows * 1.2) * 0.08);

      // Combine waves into a complex, glitchy mathematical pattern
      let finalNoise = (wave1 + wave2 + wave3 + triWave) / 4.0;
      
      // Normalize to a 0.0 - 1.0 range
      let val = map(finalNoise, -1, 1, 0, 1);
      val = constrain(val, 0, 0.999);

      // 4. Color Mapping & Quantization (creating smooth but hard-edged steps)
      let colorIdx = val * (colors.length - 1);
      let index = floor(colorIdx);
      let amt = fract(colorIdx);

      // Add a tiny bit of sine-based color stepping to mimic the grid lines
      amt = smoothstep(0.1, 0.9, amt); 

      let finalColor = lerpColor(colors[index], colors[index + 1], amt);

      // 5. Draw the pixel
      fill(finalColor);
      noStroke();
      rect(x * pxSize, y * pxSize, pxSize, pxSize);
    }
  }

  // 6. Optional structural overlay to enhance the triangle requirement explicitly
  drawSubtleTriangleOverlays();
}

// Custom smoothstep function for crisp color banding edges
function smoothstep(edge0, edge1, x) {
  x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * (3 - 2 * x);
}

// Generates blocky, digital geometric triangle highlights over the canvas
function drawSubtleTriangleOverlays() {
  noFill();
  strokeWeight(2);
  
  // Large abstract triangle guides that interlock across the 1128x308 space
  for(let i = 0; i < 4; i++) {
    // Semi-transparent glowing lines mimicking the neon boundaries in image 1
    stroke(255, 190, 10, 40); 
    triangle(100 + i*4, height - 20, width/2, 20 + i*2, width - 100 - i*4, height - 20);
    
    stroke(0, 150, 255, 30);
    triangle(i * 30, 0, 200 + i * 10, height, 400 + i * 20, 0);
    triangle(width - (i * 30), height, width - (200 + i * 10), 0, width - (400 + i * 20), height);
  }
}