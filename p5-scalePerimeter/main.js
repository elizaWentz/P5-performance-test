// const sketches = [
//   "sketches/sketch41.js",
//   "sketches/favoriet-50.js",
//   "sketches/sketch7.js",
//   "sketches/favoriet-HvA1.js",
//   "sketches/sketch39.js",
//   "sketches/favoriet-44.js",
//   "sketches/responsible-it-15 copy 2.js",
//   "sketches/favoriet-52.js",
//   "sketches/sketch3.js",
//   "sketches/favoriet-38.js",
//   "sketches/sketch46.js",
//   "sketches/favoriet-49.js",
//   "sketches/responsible-it-53.js",
//   "sketches/sketch-53.js",
//   "sketches/favoriet-45.js",
//   "sketches/responsible-it-3-fav.js",
//   "sketches/responsible-it-31-HvA2-interactive.js",
//   "sketches/sketch40.js",
//   "sketches/favoriet-54.js",
//   "sketches/sketch9.js",
//   "sketches/favoriet-43.js",
//   "sketches/sketch50.js",
//   "sketches/favoriet-51.js",
//   "sketches/sketch38.js",
//   "sketches/favoriet-39.js",
//   "sketches/sketch43.js",
// ];

const sketches = [
  "sketches/01-sketch41.js",
  "sketches/02-favoriet-50.js",
  "sketches/02-favoriet-50-kleur2.js",
  "sketches/02-favoriet-50-kleur3.js",
  "sketches/03-favoriet-50-variatie2.js",
  "sketches/03-favoriet-50-variatie2-kleur2.js",
  "sketches/03-favoriet-50-variatie3.js",
  "sketches/04-sketch7.js",
  "sketches/05-favoriet-HvA1.js",
  "sketches/05-favoriet-HvA1-kleur2.js",
  "sketches/05-favoriet-HvA1-kleur3.js",
  "sketches/05-favoriet-HvA1-kleur4.js",
  "sketches/06-sketch39.js",
  "sketches/07-favoriet-44.js",
  "sketches/08-responsible-it-15.js",
  "sketches/08-responsible-it-15-variatie2.js",
  "sketches/09-favoriet-52.js",
  "sketches/10-sketch3.js",
  "sketches/11-favoriet-38.js",
  "sketches/12-sketch46.js",
  "sketches/13-favoriet-49.js",
  "sketches/14-responsible-it-53.js",
  "sketches/15-sketch-53.js",
  "sketches/16-favoriet-45.js",
  "sketches/17-responsible-it-3-fav.js",
  "sketches/18-responsible-it-31-HvA2-interactive.js",
  "sketches/19-sketch40.js",
  "sketches/20-favoriet-54.js",
  "sketches/21-sketch9.js",
  "sketches/22-favoriet-43.js",
  "sketches/23-favoriet-43-kleur2.js",
  "sketches/24-favoriet-43-kleur3.js",
  "sketches/24-favoriet-43-kleur4.js",
  "sketches/24-favoriet-43-kleur5.js",
  "sketches/24-favoriet-43-kleur6.js",
  "sketches/25-sketch50.js",
  "sketches/26-favoriet-51.js",
  "sketches/26-favoriet-51-kleur2.js",
  "sketches/26-favoriet-51-kleur3.js",
  "sketches/26-favoriet-51-kleur4.js",
  "sketches/27-sketch38.js",
  "sketches/28-favoriet-39.js",
  "sketches/29-sketch43.js",
  "sketches/30-responsible-it-47.js",
  "sketches/31-responsible-it-48.js",
  "sketches/new-wcag1.js",
  "sketches/new-wcag2.js",
  "sketches/new-wcag3.js",
  "sketches/new-wcag4.js",
  "sketches/new-wcag5.js",
  "sketches/new-wcag6.js",
  "sketches/new-wcag7.js",
  "sketches/new-wcag8.js",
  "sketches/new-wcag9.js",
  "sketches/new-wcag10.js",
  "sketches/new-wcag12.js",
  "sketches/new-wcag11.js",
  "sketches/new-wcag13.js",
  "sketches/new-wcag14.js",
  "sketches/new2.js",
  "sketches/new3.js",
   "sketches/new6.js",
  "sketches/32-responsible-it-42.js"
];


let currentIndex = 0;

const frame = document.getElementById("sketch-frame");
const counter = document.getElementById("counter");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const gridContainer = document.getElementById("grid-container");

function showSketch() {
  const sketchPath = sketches[currentIndex];

  frame.src = `viewer.html?sketch=${encodeURIComponent(sketchPath)}`;
  counter.textContent = `${currentIndex + 1} / ${sketches.length}`;
}

function createGrid() {
  sketches.forEach(function (sketchPath, index) {
    const item = document.createElement("button");
    item.className = "grid-item";
    item.type = "button";
    item.setAttribute("aria-label", `Open sketch ${index + 1}`);

    const iframe = document.createElement("iframe");
    iframe.title = `Sketch ${index + 1}`;
    iframe.src = `viewer.html?sketch=${encodeURIComponent(sketchPath)}&scale=0.25`;
    iframe.loading = "lazy";

    item.appendChild(iframe);

    item.addEventListener("click", function () {
      currentIndex = index;
      showSketch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    gridContainer.appendChild(item);
  });
}

nextButton.addEventListener("click", function () {
  currentIndex = currentIndex + 1;

  if (currentIndex >= sketches.length) {
    currentIndex = 0;
  }

  showSketch();
});

prevButton.addEventListener("click", function () {
  currentIndex = currentIndex - 1;

  if (currentIndex < 0) {
    currentIndex = sketches.length - 1;
  }

  showSketch();
});

createGrid();
showSketch();
