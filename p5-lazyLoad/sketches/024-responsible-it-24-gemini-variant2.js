let walkers = [];
let numWalkers = 8;

function setup() {
  createCanvas(1128, 308);
  // Deep, dark obsidian background
  background(5, 5, 8); 
  
  // Initialize a team of walkers, each with unique noise offsets
  for (let i = 0; i < numWalkers; i++) {
    walkers.push(new CosmicWalker(random(width), random(height), i * 100));
  }
}

function draw() {
  // A very heavy opacity (2 out of 255) creates an incredibly long, 
  // ghostly trail that feels like glowing smoke or silk.
  background(5, 5, 8, 2); 
  
  // Update and draw all the walkers
  for (let walker of walkers) {
    walker.update();
    walker.display();
  }
}

class CosmicWalker {
  constructor(x, y, noiseOffset) {
    this.pos = createVector(x, y);
    this.noiseX = noiseOffset;
    this.noiseY = noiseOffset + 5000;
    this.size = random(15, 35);
    this.speed = random(0.5, 1.5); // Much slower, graceful speed
    
    // Dark, muted neon color palette (Deep violets, cyans, and emeralds)
    colorMode(HSB, 360, 100, 100);
    this.hue = random([190, 230, 280, 310]); 
    colorMode(RGB);
    
    this.angle = random(TWO_PI);
    this.rotSpeed = random(-0.01, 0.01);
  }

  update() {
    // Perlin noise creates fluid, organic, lifelike movement (no jerky teleporting)
    let moveX = map(noise(this.noiseX), 0, 1, -this.speed, this.speed);
    let moveY = map(noise(this.noiseY), 0, 1, -this.speed, this.speed);
    
    this.pos.add(createVector(moveX, moveY));
    
    // Progress through noise space slowly for smooth curves
    this.noiseX += 0.003;
    this.noiseY += 0.003;

    // Slowly rotate the triangle as it glides
    this.angle += this.rotSpeed;

    // Screen wrapping with a smooth padding border
    if (this.pos.x < -50) this.pos.x = width + 50;
    if (this.pos.x > width + 50) this.pos.x = -50;
    if (this.pos.y < -50) this.pos.y = height + 50;
    if (this.pos.y > height + 50) this.pos.y = -50;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    
    // Setup HSB for complex dark glows
    colorMode(HSB, 360, 100, 100, 100);
    
    // Add a pulsing effect to the scale using a slow sine wave
    let pulse = map(sin(frameCount * 0.01 + this.noiseX), -1, 1, 0.6, 1.3);
    scale(pulse);

    // Style: Ultra thin, dark ghostly outlines with almost zero fill
    stroke(this.hue, 90, 40, 15); // Low brightness, low opacity neon glow
    strokeWeight(1);
    fill(this.hue, 100, 10, 2);   // Extremely dark, sheer body fill

    // Complex geometry: Layering two triangles to form a wireframe star/node
    triangle(0, -this.size, -this.size * 0.8, this.size * 0.5, this.size * 0.8, this.size * 0.5);
    
    // Subtle inner accent triangle
    stroke(this.hue, 80, 60, 8); 
    triangle(0, this.size * 0.5, -this.size * 0.4, -this.size * 0.25, this.size * 0.4, -this.size * 0.25);
    
    pop();
    colorMode(RGB); // Reset
  }
}