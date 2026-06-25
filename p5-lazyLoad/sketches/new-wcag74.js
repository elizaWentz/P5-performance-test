const COLORS = {
  burntOrange: "#C34900",   // Het felle, levendige oranje
  lightBlue: "#A3523F",     // Het iets lichtere, warm oranje/terracotta accent
  darkBrown: "#A20000",     // Het kenmerkende diepe olijf-/legergroen uit de foto
  mediumBrown: "#6B3A36",   // Het warme roestbruin/chocoladebruin
  cream: "#444A64",         // De zachte, warme crème/zandkleur
  nearBlack: "#9D5700"      // De medium oker/bruintint voor de overige vlakken
};

function setup() {
  createCanvas(1920, 1080);
  noLoop();
  noStroke();
  drawPattern();
  const btn = createButton('Download PNG');
  btn.position(10, 10);
  btn.mousePressed(() => {
    saveCanvas('15-sketch-53.js', 'png');
  });
}

function drawPattern() {
  const blockWidth = 240; // Verhoogde breedte van elk blok
  const blockHeight = 120; // Verhoogde hoogte van elk blok
  const cols = ceil(height / blockWidth); // Aangepast voor 90 graden rotatie
  const rows = ceil(width / blockHeight); // Aangepast voor 90 graden rotatie

  push();
  translate(width / 2, height / 2); // Verplaats oorsprong naar het midden
  rotate(HALF_PI); // Roteer canvas 90 graden
  translate(-height / 2, -width / 2); // Corrigeer voor rotatie

  for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
          const x = col * blockWidth;
          const y = row * blockHeight;
          drawBlock(x, y, blockWidth, blockHeight, (col + row) % 2 === 0);
      }
  }

  pop();
}

function drawBlock(x, y, w, h, isEven) {
  const colors = isEven
      ? [COLORS.burntOrange, COLORS.darkBrown, COLORS.cream]
      : [COLORS.lightBlue, COLORS.mediumBrown, COLORS.nearBlack];

  // Teken linker parallellogram
  fill(colors[0]);
  quad(x, y, x + w * 0.5, y - h * 0.5, x + w * 0.5, y + h * 0.5, x, y + h);

  // Teken bovenste parallellogram
  fill(colors[1]);
  quad(x + w * 0.5, y - h * 0.5, x + w, y, x + w, y + h, x + w * 0.5, y + h * 0.5);

  // Teken rechter parallellogram
  fill(colors[2]);
  quad(x, y + h, x + w * 0.5, y + h * 0.5, x + w, y + h, x + w * 0.5, y + h * 1.5);
}