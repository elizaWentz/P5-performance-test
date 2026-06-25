// File: new10.js

// Set up canvas
const canvas = document.createElement('canvas');
canvas.width = 1920;
canvas.height = 1080;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Seeded PRNG
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate random points for triangulation
function generatePoints(seed, count) {
  const points = [];
  const rng = (i) => seededRandom(seed + i);
  for (let i = 0; i < count; i++) {
    points.push({
      x: rng(i) * canvas.width,
      y: rng(i + count) * canvas.height,
    });
  }
  // Add structural anchors
  points.push({ x: 0, y: 0 }, { x: canvas.width, y: 0 }, { x: 0, y: canvas.height }, { x: canvas.width, y: canvas.height }, { x: canvas.width / 2, y: canvas.height / 2 });
  return points;
}

// Delaunay triangulation
function delaunayTriangulation(points) {
  // Use a simple library-free triangulation algorithm
  // (For simplicity, this example uses a placeholder function)
  // Replace with a proper triangulation implementation if needed
  return []; // Placeholder: Replace with actual triangulation logic
}

// Draw triangles with gradient shading
function drawTriangles(triangles, points, lightSource) {
  const colors = ['#4a6a68', '#6b5d6e', '#7a5a5e', '#5a6b7a']; // Muted palette
  triangles.forEach((triangle) => {
    const [p1, p2, p3] = triangle.map((i) => points[i]);
    const center = { x: (p1.x + p2.x + p3.x) / 3, y: (p1.y + p2.y + p3.y) / 3 };
    const dist = Math.hypot(center.x - lightSource.x, center.y - lightSource.y);
    const brightness = Math.max(0.2, 1 - dist / 800);
    const color = colors[Math.floor(seededRandom(center.x + center.y) * colors.length)];
    ctx.fillStyle = adjustBrightness(color, brightness);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
  });
}

// Adjust brightness of a hex color
function adjustBrightness(hex, factor) {
  const rgb = hex.match(/\w\w/g).map((c) => parseInt(c, 16));
  const adjusted = rgb.map((c) => Math.min(255, Math.max(0, c * factor)));
  return `rgb(${adjusted.join(',')})`;
}

// Draw light beams
function drawLightBeams(lightSource) {
  const beamColors = ['rgba(255, 200, 200, 0.2)', 'rgba(200, 255, 255, 0.2)'];
  const beamCount = 14;
  for (let i = 0; i < beamCount; i++) {
    const angle = (i - beamCount / 2) * 0.1;
    const gradient = ctx.createLinearGradient(lightSource.x, lightSource.y, lightSource.x + Math.cos(angle) * canvas.width, lightSource.y + Math.sin(angle) * canvas.height);
    gradient.addColorStop(0, beamColors[i % 2]);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(lightSource.x, lightSource.y);
    ctx.lineTo(lightSource.x + Math.cos(angle - 0.05) * canvas.width, lightSource.y + Math.sin(angle - 0.05) * canvas.height);
    ctx.lineTo(lightSource.x + Math.cos(angle + 0.05) * canvas.width, lightSource.y + Math.sin(angle + 0.05) * canvas.height);
    ctx.closePath();
    ctx.fill();
  }
}

// Apply vignette
function applyVignette() {
  const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Main render function
function render() {
  const seed = 42; // Deterministic seed
  const points = generatePoints(seed, 70);
  const triangles = delaunayTriangulation(points);
  const lightSource = { x: canvas.width / 2, y: canvas.height / 4 };

  // Draw background
  ctx.fillStyle = '#0d1a18';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw triangles
  drawTriangles(triangles, points, lightSource);

  // Draw light beams
  drawLightBeams(lightSource);

  // Apply vignette
  applyVignette();
}

render();