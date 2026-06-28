let seed;

function setup() {
  // Creating canvas with your exact required dimensions
  createCanvas(960, 540);
  seed = random(1000); // Initialize a random seed
}

function draw() {
  // Dark background (Deep charcoal/navy mix)
  background(12, 15, 22);
  
  // Fix the random layout until the user clicks
  randomSeed(seed); 
  
  // Calculate a subtle mouse offset for a parallax depth effect
  let moveX = map(mouseX, 0, width, -20, 20);
  let moveY = map(mouseY, 0, height, -10, 10);

  // 1. Background Grid: Large, Dark Triangles (Move subtly with mouse)
  for (let i = -150; i < width + 150; i += 150) {
    for (let j = -50; j < height + 50; j += 100) {
      fill(22, 27, 40, 140);
      noStroke();
      
      // Upward pointing background triangles + mouse movement
      triangle(
        i + moveX, j + 150 + moveY, 
        i + 75 + moveX, j + moveY, 
        i + 150 + moveX, j + 150 + moveY
      );
      
      // Downward pointing background triangles
      fill(16, 20, 30, 120);
      triangle(
        i + 75 + moveX, j + moveY, 
        i + 150 + moveX, j + 150 + moveY, 
        i + 225 + moveX, j + moveY
      );
    }
  }

  // 2. Midground Layer: Overlapping abstract triangles
  for (let i = 0; i < 35; i++) {
    let x1 = random(-50, width);
    let y1 = random(-50, height);
    let x2 = x1 + random(100, 400);
    let y2 = y1 + random(-100, 200);
    let x3 = (x1 + x2) / 2 + random(-100, 100);
    let y3 = y1 + random(100, 300);

    // Dark color palette: deep blues, dark purples, muted teals
    let r = random([15, 30, 40]);
    let g = random([20, 35, 50]);
    let b = random([40, 60, 80]);
    
    // The closer the mouse is to a triangle, the more it subtly lights up
    let distToMouse = dist(mouseX, mouseY, (x1+x2+x3)/3, (y1+y2+y3)/3);
    let alphaBoost = map(distToMouse, 0, 400, 160, 70, true);
    
    fill(r, g, b, alphaBoost); 
    stroke(r + 20, g + 20, b + 30, alphaBoost + 20); 
    strokeWeight(1.5);
    
    triangle(x1, y1, x2, y2, x3, y3);
  }

  // 3. Foreground Layer: Sharp accent triangles that point toward the mouse
  for (let i = 0; i < 15; i++) {
    let cx = random(width);
    let cy = random(height);
    let size = random(12, 30);

    // Deep crimson/magenta dark accents
    fill(random(60, 85), random(25, 40), random(65, 80), 160);
    noStroke();

    // Math to make the top point of the triangle lean toward the user's mouse
    let angle = atan2(mouseY - cy, mouseX - cx);
    
    push();
    translate(cx, cy);
    rotate(angle + HALF_PI); // Align the triangle tip to the angle
    triangle(0, -size, -size/2, size/2, size/2, size/2);
    pop();
  }
}

// 4. Interaction: Click to regenerate a completely new abstract composition
function mousePressed() {
  seed = random(1000);
}