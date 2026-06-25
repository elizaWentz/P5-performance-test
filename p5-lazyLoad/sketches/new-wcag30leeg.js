// --- BASIS INSTELLINGEN ---
let mainText = "G.S.D";    // jouw initialen
let smallText = "GLORIA";  // optioneel, zie onder
let showSmallText = true;  // zet op false als je geen GLORIA wilt

let customFont; // optioneel: eigen vintage font

function preload() {
    // customFont = loadFont("YourVintageFont.ttf");
}

function setup() {
    createCanvas(800, 800);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    noLoop();
}

function draw() {
    // Donkere achtergrond achter de postzegel
    background(10, 8, 12);

    // Groot vierkant voor de postzegel zelf
    let stampSize = width * 0.85;
    let cx = width / 2;
    let cy = height / 2;

    // Schaduw zodat het “op papier” ligt
    noStroke();
    fill(0, 0, 0, 120);
    rect(cx + 10, cy + 12, stampSize, stampSize, 12);

    // Papierkleur van de zegel met textuur
    fill(222, 195, 140); // warm beige, minder “pill”
    rect(cx, cy, stampSize, stampSize, 8); // bijna recht, heel kleine radius
    addPaperTexture();

    // Perforatie-rand
    drawPerforation(cx, cy, stampSize, 26);

    // Binnenkader zoals op de postzegel
    drawInnerFrame(cx, cy, stampSize);

    // Ikonisch “zon / bloem”-achtig symbool in het midden, maar met diepte
    drawSunIcon(cx, cy - 40, stampSize * 0.35);

    // Tekst
    drawTexts(cx, cy + stampSize * 0.20);

    // Grain / vlekjes zodat het echt als oud papier voelt
    addPaperGrain(9000, color(0, 0, 0, 25));
}

// ---------- HULPFUNCTIES ----------

// Perforaties aan de buitenrand
function drawPerforation(cx, cy, size, holeSize) {
    let half = size / 2;
    let step = holeSize * 0.9;
    let r = holeSize * 0.45;

    noStroke();
    fill(10, 8, 12); // zelfde als achtergrond, lijkt “gat”

    // Boven / onder
    for (let x = -half + step / 2; x <= half - step / 2; x += step) {
        circle(cx + x, cy - half - 1, r * 2);
        circle(cx + x, cy + half + 1, r * 2);
    }
    // Links / rechts
    for (let y = -half + step / 2; y <= half - step / 2; y += step) {
        circle(cx - half - 1, cy + y, r * 2);
        circle(cx + half + 1, cy + y, r * 2);
    }
}

// Binnenkader-lijn zoals op postzegels
function drawInnerFrame(cx, cy, size) {
    let inner = size * 0.84;
    let half = inner / 2;
    let margin = size * 0.06;

    let frameColor = color(72, 86, 60); // groen/bruin inktkleur

    stroke(frameColor);
    strokeWeight(3);
    noFill();
    rect(cx, cy, inner, inner, 4);

    // Kleine horizontale lijntjes boven en onder als detail
    let lineW = inner * 0.28;
    strokeWeight(2);

    // boven
    line(cx - lineW, cy - half + margin, cx + lineW, cy - half + margin);
    // onder
    line(cx - lineW, cy + half - margin, cx + lineW, cy + half - margin);
}

// Simpel zon/bloem-icoontje middenin met diepte
function drawSunIcon(cx, cy, diameter) {
    push();
    translate(cx, cy);

    // Donkere cirkel in het midden
    let centerCol = color(115, 80, 40);
    let petalCol = color(210, 150, 60);
    let shadowCol = color(0, 0, 0, 50);

    // Schaduw voor diepte
    noStroke();
    fill(shadowCol);
    circle(5, 5, diameter * 0.45);

    // Bloembladen / stralen (heel gestileerd)
    fill(petalCol);
    let petals = 20;
    let outerR = diameter * 0.55;
    let innerR = diameter * 0.30;

    beginShape();
    for (let i = 0; i < petals; i++) {
        let a1 = TWO_PI * (i / petals);
        let a2 = TWO_PI * ((i + 0.5) / petals);

        // punt aan de buitenkant
        vertex(cos(a1) * outerR, sin(a1) * outerR);
        // punt dichter bij het midden
        vertex(cos(a2) * innerR, sin(a2) * innerR);
    }
    endShape(CLOSE);

    // Klein “inkt”‑randje om de bloem
    noFill();
    stroke(95, 70, 35);
    strokeWeight(1.6);
    circle(0, 0, diameter * 0.75);

    // Donkere cirkel in het midden
    fill(centerCol);
    noStroke();
    circle(0, 0, diameter * 0.45);

    pop();
}

// Teksten onderaan (G.S.D centraal, eventueel GLORIA klein)
function drawTexts(cx, baseY) {
    if (customFont) textFont(customFont);
    else textFont("Georgia");

    let ink = color(72, 86, 60); // zelfde inktkleur als frame

    // Hoofdtekst: G.S.D
    textSize(72);
    fill(ink);
    noStroke();
    text(mainText, cx, baseY - 10);

    // dun lijntje onder G.S.D
    stroke(ink);
    strokeWeight(2);
    let w = 180;
    line(cx - w / 2, baseY + 36, cx + w / 2, baseY + 36);

    if (showSmallText) {
        // Kleine subtitel: GLORIA
        noStroke();
        textSize(22);
        text(smallText.toUpperCase(), cx, baseY + 70);
    }
}

// Vlekjes / ruis voor oud papier
function addPaperGrain(count, grainColor) {
    stroke(grainColor);
    for (let i = 0; i < count; i++) {
        let x = random(width);
        let y = random(height);
        point(x, y);
    }
}

// Toevoegen van papiertextuur
function addPaperTexture() {
    let textureColor = color(255, 255, 255, 10);
    for (let i = 0; i < 5000; i++) {
        let x = random(width);
        let y = random(height);
        let w = random(1, 3);
        let h = random(1, 3);
        noStroke();
        fill(textureColor);
        ellipse(x, y, w, h);
    }
}