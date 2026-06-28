// Dynamic Triangular Eclipse Mesh
// Inspired by an explosive colorful eclipse, adapted to a wide 1128x308 canvas.

let points = [];
const CENTER_X = 1128 / 2;
const CENTER_Y = 308 / 2;
const ECLIPSE_RADIUS = 75;

function setup() {
  createCanvas(1128, 308);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop(); // Static generative artwork, remove to animate later if desired
  
  generateMeshPoints();
}

function draw() {
  background(220, 15, 10); // Very dark, desaturated background

  // Draw the triangular mesh
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      for (let k = j + 1; k < points.length; k++) {
        let p1 = points[i];
        let p2 = points[j];
        let p3 = points[k];

        // Only draw triangles where vertices are relatively close to each other
        let maxDist = 70; 
        if (dist(p1.x, p1.y, p2.x, p2.y) < maxDist &&
            dist(p2.x, p2.y, p3.x, p3.y) < maxDist &&
            dist(p3.x, p3.y, p1.x, p1.y) < maxDist) {
          
          // Calculate the center of the triangle to determine color mapping
          let avgX = (p1.x + p2.x + p3.x) / 3;
          let avgY = (p1.y + p2.y + p3.y) / 3;
          
          // Calculate angle around the central void to map the spectrum wheel
          let angle = atan2(avgY - CENTER_Y, avgX - CENTER_X);
          if (angle < 0) angle += TWO_PI;
          let hueVal = map(angle, 0, TWO_PI, 0, 360);
          
          // Falloff brightness based on distance from the eclipse rim
          let d = dist(avgX, avgY, CENTER_X, CENTER_Y);
          let brightnessVal = map(d, ECLIPSE_RADIUS, width / 2, 85, 5);
          brightnessVal = constrain(brightnessVal, 0, 90);

          // Dark low-opacity fill for depth, bright stroke for the ray structure
          fill(hueVal, 85, brightnessVal * 0.2, 0.4);
          stroke(hueVal, 80, brightnessVal, 0.7);
          strokeWeight(0.8);
          
          triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        }
      }
    }
  }

  // Draw the crisp, dark central Eclipse sphere overlay
  noStroke();
  fill(220, 15, 8); // Matching the deep dark theme background
  ellipse(CENTER_X, CENTER_Y, ECLIPSE_RADIUS * 2);
}

function generateMeshPoints() {
  // 1. Generate concentrated rings around the eclipse core to form dense triangles
  let ringCount = 10;
  for (let r = 0; r < ringCount; r++) {
    let radius = ECLIPSE_RADIUS + r * 22;
    // Outer rings need more points to keep mesh density stable
    let pointsInRing = map(r, 0, ringCount - 1, 40, 90); 
    
    for (let i = 0; i < pointsInRing; i++) {
      let angle = map(i, 0, pointsInRing, 0, TWO_PI);
      // Introduce slight randomness to give an organic, shattered look
      let noiseX = random(-5, 5);
      let noiseY = random(-5, 5);
      
      let x = CENTER_X + cos(angle) * radius + noiseX;
      let y = CENTER_Y + sin(angle) * radius + noiseY;
      
      // Keep points bounded to canvas
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        points.push(createVector(x, y));
      }
    }
  }

  // 2. Distribute background points to fade the geometric patterns towards the wide edges
  for (let i = 0; i < 250; i++) {
    let x = random(width);
    let y = random(height);
    
    // Skip points falling inside the core eclipse void
    if (dist(x, y, CENTER_X, CENTER_Y) > ECLIPSE_RADIUS) {
      points.push(createVector(x, y));
    }
  }
}