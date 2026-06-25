const COLORS = {
  burntOrange: '#D65113',   // Het levendige, warme oranje uit de foto
  lightBlue: '#E2BFA1',     // Vervangen door het lichte oudroze/beige accent
  darkBrown: '#5A2F2B',     // Het diepe, donkere roestbruin/chocoladebruin
  mediumBrown: '#6B3A36',   // Een iets lichtere variant van het donkere bruin
  cream: '#E9D6BE',         // De zachte, warme crème/zandkleur
  nearBlack: '#2F1715',      // Een zeer donkere, bijna zwarte bruintint voor schaduwen
  background: '#F5F5F5'     // De gekozen achtergrondkleur
};

function setup() {
  createCanvas(1920, 1080);
  noLoop();
  noStroke();
  background(COLORS.background); // Zet de achtergrondkleur
  drawPattern();
  
  // Optioneel: Downloadknop toevoegen als je die hier ook wilde
  const btn = createButton('Download PNG');
  btn.position(10, 10);
  btn.mousePressed(() => {
    saveCanvas('cube-pattern.png', 'png');
  });
}

function drawPattern() {
  const blockWidth = 240; // Grotere blokgrootte voor een weidser ontwerp
  const blockHeight = 120; // Grotere blokgrootte voor een weidser ontwerp
  const cols = ceil(width / blockWidth);
  const rows = ceil(height / blockHeight);

  for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
          const x = col * blockWidth;
          const y = row * blockHeight;
          drawBlock(x, y, blockWidth, blockHeight, (col + row) % 2 === 0);
      }
  }
}

function drawBlock(x, y, w, h, isEven) {
  const halfW = w / 2;
  const halfH = h / 2;

  // Bovenkant (Top face)
  fill(isEven ? COLORS.burntOrange : COLORS.lightBlue);
  quad(x, y, x + halfW, y - halfH, x + w, y, x + halfW, y + halfH);

  // Linkerkant (Left face)
  fill(isEven ? COLORS.darkBrown : COLORS.mediumBrown);
  quad(x, y, x + halfW, y + halfH, x + halfW, y + h + halfH, x, y + h);

  // Rechterkant (Right face)
  fill(isEven ? COLORS.cream : COLORS.nearBlack);
  quad(x + w, y, x + halfW, y + halfH, x + halfW, y + h + halfH, x + w, y + h);
}