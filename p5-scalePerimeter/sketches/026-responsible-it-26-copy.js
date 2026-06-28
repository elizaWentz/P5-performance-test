let colors = [];

function setup() {
  // Set the canvas size as requested
  createCanvas(1128, 308);
  pixelDensity(1); 
  
  // 1. Darker, moodier psychedelic color palette
  colors = [
    color(10, 10, 25),    // Midnight void
    color(70, 15, 95),    // Deep dark magenta / Purple
    color(10, 85, 60),    // Dark forest teal
    color(0, 100, 180),   // Electric deep blue
    color(230, 150, 20),  // Vivid amber/gold (for high-contrast peaks)
    color(15, 15, 30)     // Return to dark background
  ];
}

function draw() {
  background(10, 10, 25);

  // 2. Grid settings for the pixelated digital look
  let pxSize = 4; 
  let cols = width / pxSize;
  let rows = height / pxSize;

  // Map mouse positions to use as dynamic math modifiers
  // Defaults to center if mouse is off-screen initially
  let mx = mouseX > 0 ? mouseX / width : 0.5;
  let my = mouseY > 0 ? mouseY / height : 0.5;

  // Interactive frequency modifiers based on mouse position
  let waveFreqX = map(mx, 0, 1, 0.01, 0.03);
  let waveFreqY = map(my, 0, 1, 0.01, 0.04);
  let distortIntensity = map(mx, 0, 1, 2.0, 7.0);

  // 3. Render the pixelated liquid field
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      
      let nx = x * waveFreqX;
      let ny = y * waveFreqY;

      // --- Interactive Triangle Distance Field ---
      // Mouse Y heights dynamically distort the geometry of the triangle zones
      let triCenter1 = cols * 0.3 + sin(my * TWO_PI) * 20;
      let triCenter2 = cols * 0.7 - cos(my * TWO_PI) * 20;
      
      let tri1 = abs((x - triCenter1) + (y - rows * 0.5)) - rows * (0.3 + my * 0.2);
      let tri2 = abs((x - triCenter2) - (y - rows * 0.5)) - rows * (0.3 + mx * 0.2);
      let triWave = sin(min(tri1, tri2) * 0.35);

      // --- Dark Plasma Distortion Math ---
      // Distortions change shape shifting smoothly with mouse cursor
      let angle1 = sin(nx * 1.5 + ny * 2.0 + (my * 5)) * distortIntensity;
      let angle2 = cos(nx * 2.5 - ny * 1.2 + (mx * 5)) * distortIntensity;

      // Moiré ring patterns mimicking Images 1 & 3
      let wave1 = sin(nx * 4.0 + angle2) * cos(ny * 3.0 + angle1);
      let wave2 = sin(dist(x, y, cols * mx, rows * my) * 0.12 + triWave * 2.5);
      let wave3 = cos(dist(x, y, cols * 0.5, rows * 1.5) * 0.05);

      // Combine math steps into a singular value
      let finalNoise = (wave1 + wave2 + wave3 + triWave) / 4.0;
      
      // Normalize to 0.0 - 1.0 range
      let val = map(finalNoise, -1, 1, 0, 1);
      val = constrain(val, 0, 0.999);

      // 4. Banded Color Mapping
      let colorIdx = val * (colors.length - 1);
      let index = floor(colorIdx);
      let amt = fract(colorIdx);

      // Crisp color boundaries (smoothstep)
      amt = smoothstep(0.15, 0.85, amt); 

      let finalColor = lerpColor(colors[index], colors[index + 1], amt);

      // 5. Draw pixel block
      fill(finalColor);
      noStroke();
      rect(x * pxSize, y * pxSize, pxSize, pxSize);
    }
  }

  // 6. Interactive Geometric Triangle Line Overlay
  drawInteractiveOverlays(mx, my);
}

function smoothstep(edge0, edge1, x) {
  x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * (3 - 2 * x);
}

function drawInteractiveOverlays(mx, my) {
  noFill();
  
  // Draws faint, shifting neon vectors that react to the cursor
  for(let i = 0; i < 3; i++) {
    let offset = i * (10 * mx);
    
    // Low opacity amber triangle tracking mouse depth
    stroke(230, 150, 20, 25);
    strokeWeight(1.5);
    triangle(
      150 + offset, height - 30, 
      width * mx, 30 + (i * 5), 
      width - 150 - offset, height - 30
    );
    
    // Deep blue background triangle grid lines
    stroke(0, 100, 180, 20);
    strokeWeight(1);
    triangle(offset, 0, width * 0.25 + (my * 100), height, width * 0.5 + offset, 0);
    triangle(width - offset, height, width * 0.75 - (mx * 100), 0, width - (width * 0.5) - offset, height);
  }
}