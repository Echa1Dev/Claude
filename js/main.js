/* ═══════════════════════════════════════════════
   GRAIN TEXTURE
═══════════════════════════════════════════════ */
(function () {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 180;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(180, 180);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(Math.random() * 256);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const g = document.getElementById('grain');
  if (g) g.style.backgroundImage = `url(${canvas.toDataURL()})`;
})();

/* ═══════════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════════ */
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
const lbl  = document.getElementById('cur-lbl');
const cur  = document.getElementById('cur');

let mx = -200, my = -200, rx = -200, ry = -200;
let rafCur;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  if (dot)  dot.style.transform  = `translate(${mx - 3.5}px, ${my - 3.5}px)`;
});

(function animCur() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  if (ring) ring.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
  rafCur = requestAnimationFrame(animCur);
})();

function setCursorExpand(text) {
  if (lbl) lbl.textContent = text || '';
  document.body.classList.toggle('cur-expand', !!text);
}

document.addEventListener('mouseover', (e) => {
  const el = e.target.closest('[data-cursor]');
  if (el) return setCursorExpand(el.dataset.cursor);
  if (e.target.closest('a, button')) setCursorExpand('');
});

document.addEventListener('mouseout', (e) => {
  const el = e.target.closest('[data-cursor], a, button');
  if (el) setCursorExpand(null);
});

/* ═══════════════════════════════════════════════
   PAGE-WIPE TRANSITION
═══════════════════════════════════════════════ */
const wipe = document.getElementById('wipe');

function wipeNav(targetId) {
  if (!wipe) { document.getElementById(targetId)?.scrollIntoView(); return; }

  wipe.style.transition = 'transform 0.52s cubic-bezier(0.7,0,0.3,1)';
  wipe.style.transformOrigin = 'bottom';
  wipe.style.transform = 'translateY(0)';
  wipe.style.pointerEvents = 'all';

  setTimeout(() => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'instant' });
    wipe.style.transition = 'transform 0.52s cubic-bezier(0.7,0,0.3,1)';
    wipe.style.transformOrigin = 'top';
    wipe.style.transform = 'translateY(-100%)';

    setTimeout(() => {
      wipe.style.transition = 'none';
      wipe.style.transform = 'translateY(100%)';
      wipe.style.transformOrigin = 'bottom';
      wipe.style.pointerEvents = 'none';
    }, 560);
  }, 560);
}

window.wipeNav = wipeNav;

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revObs.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '-55px 0px 0px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revObs.observe(el));

/* ═══════════════════════════════════════════════
   ACTIVE NAV + NAV SOLID
═══════════════════════════════════════════════ */
const nav    = document.getElementById('nav');
const navAs  = document.querySelectorAll('.nav-links a[href^="#"]');
const sects  = Array.from(navAs)
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const secObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAs.forEach((a) => {
        a.setAttribute('aria-current',
          a.getAttribute('href') === `#${entry.target.id}` ? 'true' : 'false');
      });
    });
  },
  { threshold: 0.35 }
);

sects.forEach((s) => secObs.observe(s));

window.addEventListener('scroll', () => {
  nav?.classList.toggle('solid', window.scrollY > 50);
}, { passive: true });

/* ═══════════════════════════════════════════════
   DRAG SCROLL
═══════════════════════════════════════════════ */
function makeDraggable(el) {
  if (!el) return;
  let down = false, startX, sl;
  el.addEventListener('mousedown', (e) => {
    down = true;
    el.classList.add('grabbing');
    startX = e.pageX - el.offsetLeft;
    sl = el.scrollLeft;
  });
  el.addEventListener('mouseleave', () => { down = false; el.classList.remove('grabbing'); });
  el.addEventListener('mouseup',    () => { down = false; el.classList.remove('grabbing'); });
  el.addEventListener('mousemove',  (e) => {
    if (!down) return;
    e.preventDefault();
    el.scrollLeft = sl - (e.pageX - el.offsetLeft - startX) * 1.5;
  });
}

window.makeDraggable = makeDraggable;
