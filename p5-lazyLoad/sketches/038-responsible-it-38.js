let risoColors;

function setup() {
  createCanvas(1128, 308);
  noLoop(); // We only need it to draw once
  pixelDensity(1); // Standardizes the grain rendering across different screens

  // Classic Riso palette with slight transparency 
  // Fluorescent Pink, Aqua Blue, and Sunflower Yellow
  risoColors = [
    color(255, 72, 176, 210), // Pink
    color(0, 120, 191, 210),  // Blue
    color(255, 232, 0, 210)   // Yellow
  ];
}

function draw() {
  // 1. Paper Background (Slightly warm off-white)
  background(245, 244, 238);

  // 2. Set ink blending mode
  blendMode(MULTIPLY);
  noStroke();

  let numTriangles = 45; // Adjust this for more or less density

  // 3. Draw the shapes
  for (let i = 0; i < numTriangles; i++) {
    // Generate random base coordinates for the triangle
    // Keeping them relatively wide to fill the landscape canvas
    let x1 = random(-50, width + 50);
    let y1 = random(-50, height + 50);
    let x2 = x1 + random(-200, 200);
    let y2 = y1 + random(-150, 150);
    let x3 = x1 + random(-200, 200);
    let y3 = y1 + random(-150, 150);

    // Pick two random, different colors to simulate two ink layers
    let color1 = random(risoColors);
    let color2 = random(risoColors);
    while (color1 === color2) { 
      color2 = random(risoColors); 
    }

    // Draw first ink layer
    fill(color1);
    triangle(x1, y1, x2, y2, x3, y3);

    // Draw second ink layer with "misregistration" (slight physical offset)
    let offsetX = random(3, 8); 
    let offsetY = random(-8, -3); 
    
    fill(color2);
    triangle(
      x1 + offsetX, y1 + offsetY, 
      x2 + offsetX, y2 + offsetY, 
      x3 + offsetX, y3 + offsetY
    );
  }

  // 4. Reset blend mode and apply the Riso grain texture
  blendMode(BLEND);
  addRisoGrain(25);
}

// Function to simulate the speckled Riso ink/paper texture
function addRisoGrain(amount) {
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    // Generate random noise for each pixel
    let noiseVal = random(-amount, amount);
    
    // Add the noise to the RGB channels, keeping the values between 0-255
    pixels[i] = constrain(pixels[i] + noiseVal, 0, 255);       // Red
    pixels[i + 1] = constrain(pixels[i + 1] + noiseVal, 0, 255); // Green
    pixels[i + 2] = constrain(pixels[i + 2] + noiseVal, 0, 255); // Blue
    // pixels[i + 3] is Alpha, which we leave alone
  }
  updatePixels();
}

// Optional: Click the canvas to generate a new risograph layout
function mousePressed() {
  redraw();
}