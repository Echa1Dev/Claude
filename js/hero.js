// Hero name reveal happens via checkMasks() in main.js on desktop
// On mobile it's triggered directly, also via main.js
// This file intentionally left minimal:
if (window.innerWidth < 768) {
  document.querySelectorAll('.hero-name .minner').forEach((el, i) => {
    setTimeout(() => el.classList.add('up'), 220 + i * 140);
  });
}
