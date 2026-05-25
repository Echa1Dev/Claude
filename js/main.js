/* ── CURSOR ──────────────────────────────────── */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

let mx = -100, my = -100, rx = -100, ry = -100;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform  = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 15}px, ${ry - 15}px)`;
  requestAnimationFrame(animRing);
})();

const hoverable = 'a, button, .card, .btn-cv, .contact-link-row, .skills-item';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(hoverable)) {
    dot.classList.add('hov');
    ring.classList.add('hov');
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(hoverable)) {
    dot.classList.remove('hov');
    ring.classList.remove('hov');
  }
});

/* ── SCROLL REVEAL ───────────────────────────── */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObs.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '-60px 0px 0px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

/* ── SMOOTH SCROLL ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── ACTIVE NAV ──────────────────────────────── */
const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
const navSections = Array.from(navAs)
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const activeObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAs.forEach((a) => {
        a.setAttribute('aria-current', a.getAttribute('href') === `#${entry.target.id}` ? 'true' : 'false');
      });
    });
  },
  { threshold: 0.35 }
);
navSections.forEach((s) => activeObs.observe(s));

/* ── NAV SCROLL BLUR ─────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── DRAG SCROLL (projects) ──────────────────── */
function enableDragScroll(el) {
  if (!el) return;
  let isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', (e) => {
    isDown = true;
    el.classList.add('grabbing');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  el.addEventListener('mouseleave', () => { isDown = false; el.classList.remove('grabbing'); });
  el.addEventListener('mouseup',    () => { isDown = false; el.classList.remove('grabbing'); });
  el.addEventListener('mousemove',  (e) => {
    if (!isDown) return;
    e.preventDefault();
    el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.4;
  });
}

window.enableDragScroll = enableDragScroll;
