let walker;

function setup() {
  // Set the precise dimensions requested
  createCanvas(1128, 308);
  background(10, 10, 15); // Deep, dark midnight blue/black
  
  // Initialize our walker in the center of the canvas
  walker = new TriangleWalker(width / 2, height / 2);
}

function draw() {
  // A semi-transparent background creates a cool, glowing motion blur effect
  background(10, 10, 15, 20); 
  
  // Update and display the walker
  walker.update();
  walker.display();
}

class TriangleWalker {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.prevPos = this.pos.copy();
    this.size = 20;
    this.angle = 0;
    this.hue = random(180, 280); // Dark blues, purples, and magentas
    this.particles = [];
  }

  update() {
    // Save previous position for trail effects
    this.prevPos = this.pos.copy();

    // Random walk behavior: pick a random direction
    let step = p5.Vector.random2D();
    
    // Low probability of a large "dash" for a cool dynamic effect
    if (random(1) < 0.05) {
      step.mult(random(40, 80));
      // Trigger explosion particles on big jumps
      this.spawnParticles();
    } else {
      step.mult(random(5, 15));
    }

    this.pos.add(step);

    // Constrain the walker to stay within the 1128x308 bounds
    this.pos.x = constrain(this.pos.x, 20, width - 20);
    this.pos.y = constrain(this.pos.y, 20, height - 20);

    // Slowly rotate the triangle for extra flair
    this.angle += 0.05;
    
    // Shift the dark color palette subtly over time
    this.hue = (this.hue + 0.2) % 360;

    // Update any active explosion particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  display() {
    // Draw the active particles
    for (let p of this.particles) {
      p.display();
    }

    // Draw the main triangle walker
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    
    // Dark, neon-rimmed aesthetic
    colorMode(HSB, 360, 100, 100, 100);
    stroke(this.hue, 80, 70, 80); // Dark but vibrant stroke
    strokeWeight(2);
    fill(this.hue, 90, 20, 40);   // Very deep, translucent dark body
    
    // Draw the triangle
    triangle(
      0, -this.size, 
      -this.size * 0.8, this.size * 0.8, 
      this.size * 0.8, this.size * 0.8
    );
    pop();
    colorMode(RGB); // Reset color mode
  }

  spawnParticles() {
    for (let i = 0; i < 6; i++) {
      this.particles.push(new Particle(this.pos.x, this.pos.y, this.hue));
    }
  }
}

// Particle class for the burst effect
class Particle {
  constructor(x, y, hue) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.alpha = 100;
    this.hue = hue;
    this.size = random(5, 12);
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 3; // Fade out
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.pos.x * 0.02); // Spin the particles
    colorMode(HSB, 360, 100, 100, 100);
    noFill();
    stroke(this.hue, 80, 50, this.alpha);
    strokeWeight(1);
    
    // Particles are also tiny triangles
    triangle(0, -this.size, -this.size, this.size, this.size, this.size);
    pop();
    colorMode(RGB);
  }

  isDead() {
    return this.alpha <= 0;
  }
}