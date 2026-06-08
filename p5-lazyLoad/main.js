const sketches = [
  "sketches/sketch41.js",
  "sketches/favoriet-50.js",
  "sketches/sketch7.js",
  "sketches/favoriet-HvA1.js",
  "sketches/sketch39.js",
  "sketches/favoriet-44.js",
  "sketches/responsible-it-15 copy 2.js",
  "sketches/favoriet-52.js",
  "sketches/sketch3.js",
  "sketches/favoriet-38.js",
  "sketches/sketch46.js",
  "sketches/favoriet-49.js",
  "sketches/sketch-53.js",
  "sketches/favoriet-45.js",
  "sketches/responsible-it-3-fav.js",
  "sketches/sketch40.js",
  "sketches/favoriet-54.js",
  "sketches/sketch9.js",
  "sketches/favoriet-43.js",
  "sketches/sketch50.js",
  "sketches/favoriet-51.js",
  "sketches/sketch38.js",
  "sketches/favoriet-39.js",
  "sketches/sketch43.js"
];

let currentIndex = 0;

const frame = document.getElementById("sketch-frame");
const counter = document.getElementById("counter");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const gridContainer = document.getElementById("grid-container");

const gridPreviewObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }

    const iframe = entry.target.querySelector("iframe");

    if (iframe && !iframe.src) {
      iframe.src = iframe.dataset.src;
    }

    observer.unobserve(entry.target);
  });
}, {
  rootMargin: "0px 0px",
  threshold: 0.01
});

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
    iframe.dataset.src = `viewer.html?sketch=${encodeURIComponent(sketchPath)}&preview=true`;
    iframe.loading = "lazy";
 
    item.appendChild(iframe);

    item.addEventListener("click", function () {
      currentIndex = index;
      showSketch();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    gridContainer.appendChild(item);
    gridPreviewObserver.observe(item);
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
