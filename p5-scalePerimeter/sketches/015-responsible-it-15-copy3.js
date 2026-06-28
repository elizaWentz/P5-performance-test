let triSize = 40; // breedte van de driehoeken

function setup() {
  createCanvas(1128, 308); // kun je aanpassen
  noStroke();
  noLoop();
}

function draw() {
  background(color(0, 10, 60));
  colorMode(RGB);

  let h = triSize * Math.sqrt(3) / 2; // hoogte van een gelijkzijdige driehoek

  // kleuren (pas aan naar smaak)
  let centerCol = color(0, 10, 60);      // donker midden
  let edgeCol   = color(50, 100, 155);  // licht blauw aan de randen

  for (let y = -h; y < height + h; y += h) {
    let row = Math.round(y / h);
    // om-en-om een halve breedte opschuiven voor een nette tessellatie
    let offset = (row % 2 === 0) ? 0 : triSize / 2;

    for (let x = -triSize; x < width + triSize; x += triSize) {
      let cx = x + offset;
      let cy = y;

      // positie t.o.v. midden gebruiken voor kleurgradient
      let dx = (cx - width / 2) / (width / 2);
      let dy = (cy - height / 2) / (height / 2);
      let dist = Math.sqrt(dx * dx + dy * dy);
      dist = constrain(dist, 0, 1);

      let c = lerpColor(centerCol, edgeCol, dist);
      fill(c);

      // twee driehoeken per “tegel”: een omhoog en een omlaag
      drawTriangle(cx, cy, triSize, h, true);  // omhoog
      drawTriangle(cx, cy, triSize, h, false); // omlaag
    }
  }
}

function drawTriangle(cx, cy, w, h, up) {
  if (up) {
    // omhoog wijzende driehoek
    triangle(
      cx,        cy - h / 2,
      cx - w / 2, cy + h / 2,
      cx + w / 2, cy + h / 2
    );
  } else {
    // omlaag wijzende driehoek
    triangle(
      cx,        cy + h / 2,
      cx - w / 2, cy - h / 2,
      cx + w / 2, cy - h / 2
    );
  }
}