let walkers = [];
let numWalkers = 18; // Slightly more walkers for a richer, continuous web

function setup() {
  createCanvas(1128, 308);
  background(4, 4, 6); // Deep, dark void
  
  // Pre-populate the canvas instantly at startup
  for (let i = 0; i < numWalkers; i++) {
    walkers.push(new CosmicWalker(random(width), random(height), i * 200));
  }
}

function draw() {
  // Ultra-low opacity background creates the long-lasting silk trail effect
  background(4, 4, 6, 3); 
  
  // Calculate mouse speed to create motion-based interaction without clicking
  let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY);
  
  // Update and draw all the interactive walkers
  for (let walker of walkers) {
    walker.update(mouseSpeed);
    walker.display();
  }
}

class CosmicWalker {
  constructor(x, y, noiseOffset) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(1); 
    this.noiseX = noiseOffset;
    this.noiseY = noiseOffset + 5000;
    this.size = random(12, 26);
    this.maxSpeed = random(1.0, 2.5);
    
    colorMode(HSB, 360, 100, 100);
    // Dark cyber palette: deep cyans, cosmic blues, electric purples
    this.baseHue = random([195, 220, 265, 315]); 
    colorMode(RGB);
    
    this.angle = random(TWO_PI);
    this.rotSpeed = random(-0.015, 0.015);
    this.kineticSurge = 0;
  }

  update(mouseSpeed) {
    // 1. Base Movement: Organic Perlin Noise
    let noiseForce = createVector(
      map(noise(this.noiseX), 0, 1, -0.25, 0.25),
      map(noise(this.noiseY), 0, 1, -0.25, 0.25)
    );
    this.vel.add(noiseForce);
    this.noiseX += 0.0025;
    this.noiseY += 0.0025;

    // 2. Continuous Hands-Free Mouse Interaction
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      let mousePos = createVector(mouseX, mouseY);
      let toMouse = p5.Vector.sub(mousePos, this.pos);
      let distance = toMouse.mag();
      
      if (distance < 350) {
        // If the mouse moves fast, push the triangles away dynamically (replaces clicking)
        if (mouseSpeed > 15 && distance < 200) {
          let pushForce = toMouse.copy().mult(-0.15 * (mouseSpeed / 10));
          this.vel.add(pushForce);
          this.kineticSurge = map(mouseSpeed, 15, 100, 10, 50); // Flash color based on speed
        } else {
          // Gentle, magnetic attraction when mouse is moving slowly or still
          toMouse.normalize();
          let pull = map(distance, 0, 350, 0.12, 0.01);
          toMouse.mult(pull);
          this.vel.add(toMouse);
        }
      }
    }

    // Apply physics limits
    this.vel.limit(this.maxSpeed + (this.kineticSurge * 0.05));
    this.pos.add(this.vel);

    // Decay the dynamic movement surge over time
    if (this.kineticSurge > 0) this.kineticSurge -= 0.8;
    
    // Spin the geometry based on speed
    this.angle += this.rotSpeed * (1 + this.kineticSurge * 0.1);

    // Seamless screen wrapping bounds
    if (this.pos.x < -40) this.pos.x = width + 40;
    if (this.pos.x > width + 40) this.pos.x = -40;
    if (this.pos.y < -40) this.pos.y = height + 40;
    if (this.pos.y > height + 40) this.pos.y = -40;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    
    colorMode(HSB, 360, 100, 100, 100);
    
    // Proximity logic: get brighter and more solid near the mouse
    let dToMouse = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    let proximityAlpha = map(constrain(dToMouse, 0, 300), 0, 300, 45, 12);
    let brightness = constrain(35 + this.kineticSurge, 0, 95);

    // Breathing effect
    let pulse = map(sin(frameCount * 0.02 + this.noiseX), -1, 1, 0.85, 1.15);
    scale(pulse);

    // Render configuration (Dark, glowing wireframes)
    stroke(this.baseHue, 90, brightness, proximityAlpha); 
    strokeWeight(1);
    fill(this.baseHue, 95, 8, 1.5); // Sheer dark translucent body

    // Main Outer Triangle Geometry
    triangle(0, -this.size, -this.size * 0.82, this.size * 0.5, this.size * 0.82, this.size * 0.5);
    
    // Layered Inner Core Triangle
    stroke(this.baseHue, 75, max(15, brightness - 20), proximityAlpha * 0.4);
    triangle(0, this.size * 0.35, -this.size * 0.4, -this.size * 0.25, this.size * 0.4, -this.size * 0.25);
    
    pop();
    colorMode(RGB);
  }
}