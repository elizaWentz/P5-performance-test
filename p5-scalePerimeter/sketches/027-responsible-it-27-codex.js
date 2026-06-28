let colors = [];
let blobs = [];
let numBlobs = 6;

function setup() {
  createCanvas(1128, 308);
  pixelDensity(1); 
  
  // Dark psychedelic lava lamp palette
  colors = [
    color(12, 10, 24),    // Dark void background
    color(75, 12, 90),    // Deep molten magenta/plum
    color(10, 95, 70),    // Rich forest teal
    color(0, 120, 210),   // Electric liquid blue
    color(240, 160, 15),  // Glowing amber core
    color(15, 12, 28)     // Outer field falloff
  ];

  // Initialize independent floating lava blobs
  for (let i = 0; i < numBlobs; i++) {
    blobs.push({
      x: random(width),
      y: random(height),
      size: random(90, 190),
      seedX: random(1000),
      seedY: random(1000),
      speedX: random(0.003, 0.008),
      speedY: random(0.002, 0.006)
    });
  }
}

function draw() {
  background(12, 10, 24);

  let pxSize = 4; 
  let cols = width / pxSize;
  let rows = height / pxSize;

  // Track mouse to dynamically shift liquid density (no click required)
  let mx = mouseX > 0 ? mouseX / width : 0.5;
  let my = mouseY > 0 ? mouseY / height : 0.5;

  // Update blob positions behind the scenes using time-based noise (liquid float)
  for (let b of blobs) {
    b.x = noise(b.seedX) * width;
    b.y = noise(b.seedY) * height;
    
    // Mouse proximity gently "pulls" or pushes the liquid wax
    let dToMouse = dist(b.x, b.y, mouseX, mouseY);
    let interactiveFactor = map(constrain(dToMouse, 0, 400), 0, 400, 0.015, 0.005);

    b.seedX += b.speedX + (mx * interactiveFactor);
    b.seedY += b.speedY + (my * interactiveFactor);
  }

  // Render the pixelated fluid grid
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let screenX = x * pxSize;
      let screenY = y * pxSize;

      // --- Metaball Energy Calculation ---
      // This mathematically forces nearby circles to blend organically like wax
      let totalEnergy = 0;
      for (let b of blobs) {
        let d = dist(screenX, screenY, b.x, b.y);
        if (d > 0) {
          totalEnergy += (b.size) / d; 
        }
      }

      // --- The Triangle Filter ---
      // Modulation math that forces the fluid blobs into triangular distortions
      let triWidth = cols * 0.25;
      let triX = abs((x % triWidth) - triWidth * 0.5);
      let triFactor = sin((triX + y * 0.5) * 0.15) * 0.4;
      
      // Inject triangle steps into the fluid field
      totalEnergy += triFactor * map(my, 0, 1, 0.5, 2.0);

      // --- Micro-Texture Distortion (Moiré Banding) ---
      // Recreates the signature pixel steps from your reference images
      let noisePattern = sin(screenX * 0.05 + totalEnergy) * cos(screenY * 0.05 - totalEnergy);
      let finalFluidValue = totalEnergy * 0.22 + noisePattern * 0.15;

      // Scale value for color palette selection
      let val = map(finalFluidValue, 0.3, 1.8, 0, 1);
      val = constrain(val, 0, 0.999);

      // Quantize and map colors to build the retro stepped gradients
      let colorIdx = val * (colors.length - 1);
      let index = floor(colorIdx);
      let amt = fract(colorIdx);

      // Crisp color boundaries for the distinct ring steps
      amt = smoothstep(0.1, 0.9, amt); 

      let finalColor = lerpColor(colors[index], colors[index + 1], amt);

      // Render the pixel block
      fill(finalColor);
      noStroke();
      rect(screenX, screenY, pxSize, pxSize);
    }
  }

  // Draw structural, sharp wireframe triangles over the top that react to the wax flow
  drawLavaTriangleOverlays(mx, my);
}

function smoothstep(edge0, edge1, x) {
  x = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * (3 - 2 * x);
}

function drawLavaTriangleOverlays(mx, my) {
  noFill();
  
  // Structural geometric overlay lines matching the composition of images 1 and 2
  for (let i = 0; i < 3; i++) {
    let pulse = sin(frameCount * 0.02 + i) * 15;
    
    // Golden amber sharp focal triangle
    stroke(240, 160, 15, 30);
    strokeWeight(1.5);
    triangle(
      width * 0.5 + pulse, 40, 
      width * 0.3 - pulse, height - 40, 
      width * 0.7 + pulse, height - 40
    );

    // Deep cyan dynamic side triangle
    stroke(0, 120, 210, 20);
    strokeWeight(1);
    let leftX = width * 0.1 + (mx * 50);
    let rightX = width * 0.9 - (my * 50);
    triangle(leftX, height - 20, width * 0.2, 20, width * 0.4, height - 20);
    triangle(rightX, 20, width * 0.8, height - 20, width * 0.6, 20);
  }
}