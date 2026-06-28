const sketches = [
  "sketches/001-favoriet-HvA1.js",
  "sketches/32-responsible-it-42.js",
  "sketches/14-responsible-it-53-v2-kleur2.js",
  "sketches/13-favoriet-49.js",
  "sketches/14-responsible-it-53-v2-kleur2.js",
  "sketches/14-responsible-it-53-kleur3.js",
  "sketches/053-responsible-it-53-variant2.js",
  "sketches/052-favoriet-52.js",
  "sketches/051-favoriet-51-kleur4.js",
  "sketches/051-favoriet-51-kleur3.js",
  "sketches/051-favoriet-51-kleur2.js",
  "sketches/03-favoriet-50-variatie2-kleur3.js",
  "sketches/050-responsible-it-50-copy.js",
  "sketches/050-favoriet-50-variatie4-variant2.js",
  "sketches/050-favoriet-50-variatie3.js",
  "sketches/050-favoriet-50-variatie2.js",
  "sketches/050-favoriet-50-variatie2-kleur2.js",
  "sketches/050-favoriet-50-variant2.js",
  "sketches/050-favoriet-50-kleur3.js",
  "sketches/049-favoriet-49.js",
  "sketches/048-responsible-it-48.js",
  "sketches/047-responsible-it-47.js",
  "sketches/045-favoriet-45.js",
  "sketches/044-favoriet-44-versie2.js",
  "sketches/044-favoriet-44-optie2.js",
  "sketches/043-favoriet-43.js",
  "sketches/043-favoriet-43-kleur6.js",
  "sketches/043-favoriet-43-kleur5.js",
  "sketches/043-favoriet-43-kleur4-variant2.js",
  "sketches/043-favoriet-43-kleur3.js",
  "sketches/043-favoriet-43-kleur2.js",
  "sketches/043-favoriet-43-copy.js",
  "sketches/042-responsible-it-42.js",
  "sketches/042-favoriet-42-2.js",
  "sketches/041-responsible-it-41.js",
  "sketches/040-responsible-it-40-variant2.js",
  "sketches/039-responsible-it-39.js",
  "sketches/038-responsible-it-38-variant2.js",
  "sketches/037-responsible-it-37-interactive-copy-variant2.js",
  "sketches/036-responsible-it-36-variant2.js",
  "sketches/035-responsible-it-35-codex3-interactive.js",
  "sketches/035-responsible-it-35-codex2-interactive.js",
  "sketches/035-responsible-it-35-codex1-interactive-variant2.js",
  "sketches/033-responsible-it-33-gemini3-interactive.js",
  "sketches/033-responsible-it-33-gemini2.js",
  "sketches/033-responsible-it-33-gemini1-interactive.js",
  "sketches/032-responsible-it-32-chatgpt3-interactive.js",
  "sketches/032-responsible-it-32-chatgpt2.js",
  "sketches/032-responsible-it-32-chatgpt1.js",
  "sketches/032-responsible-it-32-chatgpt1-interactive-copy.js",
  "sketches/031-responsible-it-31-HvA3-interactive.js",
  "sketches/031-responsible-it-31-HvA2-interactive.js",
  "sketches/031-responsible-it-31-HvA2-interactive-variant2.js",
  "sketches/030-responsible-it-30.js",
  "sketches/029-responsible-it-29-copy-codex.js",
  "sketches/028-responsible-it-28-copy-codex-variant2.js",
  "sketches/028-responsible-it-28-codex.js",
  "sketches/027-responsible-it-27-copy-codex.js",
  "sketches/026-responsible-it-26-copy-variant2.js",
  "sketches/024-responsible-it-24-gemini-copy2.js",
  "sketches/022-responsible-it-22-copy-variant2.js",
  "sketches/021-responsible-it-21-variant2.js",
  "sketches/020-responsible-it-20-variant2.js",
  "sketches/019-responsible-it-19.js",
  "sketches/017-responsible-it-17-wave-variant2.js",
  "sketches/016-responsible-it-16-variant2.js",
  "sketches/015-responsible-it-15.js",
  "sketches/015-responsible-it-15-variatie2.js",
  "sketches/015-responsible-it-15-copy2.js",
  "sketches/014-responsible-it-14.js",
  "sketches/013-responsible-it-13-variant2.js",
  "sketches/012-responsible-it-12.js",
  "sketches/011-responsible-it-11.js",
  "sketches/010-responsible-it-10-hover.js",
  "sketches/009-responsible-it-9-variant2.js",
  "sketches/007-responsible-it-7-variant2.js",
  "sketches/006-responsible-it-6.js",
  "sketches/003-responsible-it-3.js",
  "sketches/003-responsible-it-3-fav-variant2.js",
  "sketches/002-responsible-it-2-variant2.js"
];


let currentIndex = 0;

const frame = document.getElementById("sketch-frame");
const counter = document.getElementById("counter");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const gridContainer = document.getElementById("grid-container");
const INITIAL_GRID_PREVIEWS = 3;

function loadGridPreview(item) {
  if (item.querySelector("iframe")) {
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.title = item.dataset.title;
  iframe.src = item.dataset.src;
  iframe.loading = "lazy";

  item.appendChild(iframe);
}

const gridPreviewObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }

    loadGridPreview(entry.target);
    observer.unobserve(entry.target);
  });
}, {
  rootMargin: "600px 0px",
  threshold: 0.01
});

function showSketch() {
  const sketchPath = sketches[currentIndex];

  frame.src = `viewer.html?sketch=${encodeURIComponent(sketchPath)}`;
  counter.textContent = `${currentIndex + 1} / ${sketches.length}`;
}

function loadInitialGridPreviews() {
  document.querySelectorAll(".grid-item").forEach(function (item, index) {
    if (index < INITIAL_GRID_PREVIEWS) {
      loadGridPreview(item);
    }
  });
}

function startGridPreviewObserver() {
  document.querySelectorAll(".grid-item").forEach(function (item, index) {
    if (index >= INITIAL_GRID_PREVIEWS) {
      gridPreviewObserver.observe(item);
    }
  });
}

function createGrid() {
  sketches.forEach(function (sketchPath, index) {
    const item = document.createElement("button");
    item.className = "grid-item";
    item.type = "button";
    item.setAttribute("aria-label", `Open sketch ${index + 1}`);

    item.dataset.title = `Sketch ${index + 1}`;
    item.dataset.src = `viewer.html?sketch=${encodeURIComponent(sketchPath)}&preview=true`;

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
loadInitialGridPreviews();

let gridPreviewObserverStarted = false;

function startGridPreviewObserverOnce() {
  if (gridPreviewObserverStarted) {
    return;
  }

  gridPreviewObserverStarted = true;
  startGridPreviewObserver();
}

window.addEventListener("scroll", startGridPreviewObserverOnce, { once: true, passive: true });
window.addEventListener("wheel", startGridPreviewObserverOnce, { once: true, passive: true });
window.addEventListener("touchstart", startGridPreviewObserverOnce, { once: true, passive: true });
