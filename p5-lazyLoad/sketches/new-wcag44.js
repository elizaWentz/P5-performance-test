function setup() {
    createCanvas(1920, 1080);
    noLoop(); // één statisch beeld
  }
  
  function draw() {
    // iets warmer, donkergroen-olijf achtergrond
    background('#27332D'); 
  
    // Hoeken voor mooie lijnen
    strokeJoin(BEVEL);
    strokeCap(ROUND);
  
    // Handige kleur-constants voor olijfgroen
    const OLIVE_DARK   = '#2F3C3A'; // bestaande donkergroen-grijs (blijft als basistoon)
    const OLIVE_DEEP   = '#3A4A34'; // diep olijfgroen
    const OLIVE_WARM   = '#4F5B35'; // warm olijfgroen
    const OLIVE_SOFT   = '#6D7A3A'; // iets lichtere, warme olijf
  
    // Helper: polygon met één gekozen kleur tussen color1 en color2
    function drawPolygon(vertices, color1, color2, alpha = 255) {
      let c1 = color(color1);
      let c2 = color(color2);
      let t = random(0.2, 0.8);
      let c = lerpColor(c1, c2, t);
      c.setAlpha(alpha);
      noStroke();
      fill(c);
      beginShape();
      for (let v of vertices) {
        vertex(v.x, v.y);
      }
      endShape(CLOSE);
    }
  
    // Helper: gloeiende naad tussen 2 punten
    function drawSeam(v1, v2, seamColor) {
      let c = color(seamColor);
  
      // zachte buiten-gloed
      strokeWeight(4);
      c.setAlpha(60);
      stroke(c);
      line(v1.x, v1.y, v2.x, v2.y);
  
      // heldere kern
      strokeWeight(1.5);
      c.setAlpha(220);
      stroke(c);
      line(v1.x, v1.y, v2.x, v2.y);
    }
  
    // ---------------------------
    // FACETTEN: vul bijna heel canvas
    // ---------------------------
    let polygons = [
      // TOP-RIGHT
      { 
        vertices: [{x: 1100, y: 0}, {x: 1920, y: 0}, {x: 1920, y: 540}], 
        color1: '#E8D4A7', 
        color2: '#D9B679' 
      },
      { 
        vertices: [{x: 1100, y: 0}, {x: 1500, y: 600}, {x: 1920, y: 540}], 
        color1: '#C28A34', 
        color2: '#B85B25' 
      },
  
      // TOP-LEFT (hier meer olijfgroen ipv koel grijs)
      { 
        vertices: [{x: 0, y: 0}, {x: 960, y: 0}, {x: 480, y: 540}], 
        color1: OLIVE_DEEP, 
        color2: OLIVE_WARM 
      },
      { 
        vertices: [{x: 0, y: 0}, {x: 480, y: 540}, {x: 0, y: 1080}], 
        color1: '#D9B679', 
        color2: '#C28A34' 
      },
  
      // CENTER (warme oranje/bruin + een vleugje olijf in de mix)
      { 
        vertices: [{x: 480, y: 540}, {x: 960, y: 540}, {x: 720, y: 810}], 
        color1: '#B85B25', 
        color2: OLIVE_WARM 
      },
      { 
        vertices: [{x: 720, y: 810}, {x: 960, y: 540}, {x: 1200, y: 810}], 
        color1: '#E8D4A7', 
        color2: '#D9B679' 
      },
  
      // BOTTOM-RIGHT
      { 
        vertices: [{x: 960, y: 1080}, {x: 1200, y: 810}, {x: 1920, y: 1080}], 
        color1: '#C28A34', 
        color2: '#B85B25' 
      },
  
      // BOTTOM-LEFT (ook hier olijf ipv grijs)
      { 
        vertices: [{x: 0, y: 1080}, {x: 720, y: 810}, {x: 960, y: 1080}], 
        color1: OLIVE_SOFT, 
        color2: OLIVE_DARK 
      },
  
      // ADDITIONAL SHAPES
      { 
        vertices: [{x: 960, y: 540}, {x: 1200, y: 810}, {x: 1440, y: 540}], 
        color1: '#B85B25', 
        color2: '#C28A34' 
      },
      { 
        vertices: [{x: 480, y: 540}, {x: 720, y: 810}, {x: 240, y: 810}], 
        color1: OLIVE_WARM, 
        color2: '#D9B679' 
      }
    ];
  
    // teken alle facetten
    for (let poly of polygons) {
      drawPolygon(poly.vertices, poly.color1, poly.color2);
    }
  
    // ---------------------------
    // LICHT: witte “stralen” / glans
    // ---------------------------
    let lightPolys = [
      { vertices: [{x: 960, y: 0}, {x: 1920, y: 0}, {x: 960, y: 540}] },
      { vertices: [{x: 480, y: 540}, {x: 960, y: 540}, {x: 0, y: 1080}] },
      { vertices: [{x: 960, y: 540}, {x: 1920, y: 1080}, {x: 960, y: 1080}] },
      { vertices: [{x: 720, y: 810}, {x: 960, y: 1080}, {x: 480, y: 1080}] }
    ];
  
    for (let lp of lightPolys) {
      drawPolygon(lp.vertices, '#FFFFFF', '#FFFFFF', 70); // lage alpha = zachte glans
    }
  
    // extra lichte naden (één naad met olijfgroen highlight)
    let seams = [
      [{x: 1100, y: 0}, {x: 1500, y: 600}, '#E8D4A7'],
      [{x: 480, y: 540}, {x: 960, y: 540}, '#D9B679'],
      [{x: 720, y: 810}, {x: 960, y: 1080}, '#C28A34'],
      [{x: 960, y: 540}, {x: 1200, y: 810}, OLIVE_SOFT]
    ];
  
    for (let s of seams) {
      drawSeam(s[0], s[1], s[2]);
    }
  }