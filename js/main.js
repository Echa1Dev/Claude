/* ═══ GRAIN ══════════════════════════════════ */
(function () {
  const c = document.createElement('canvas');
  c.width = c.height = 180;
  const x = c.getContext('2d'), d = x.createImageData(180, 180);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.floor(Math.random() * 256);
    d.data[i] = d.data[i+1] = d.data[i+2] = v; d.data[i+3] = 255;
  }
  x.putImageData(d, 0, 0);
  const g = document.getElementById('grain');
  if (g) g.style.backgroundImage = `url(${c.toDataURL()})`;
})();

/* ═══ CURSOR ══════════════════════════════════ */
const curDot  = document.getElementById('cur-dot');
const curRing = document.getElementById('cur-ring');
const curLbl  = document.getElementById('cur-lbl');

let mx = -300, my = -300, rx = -300, ry = -300;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  if (curDot) curDot.style.transform = `translate(${mx - 3.5}px,${my - 3.5}px)`;
});

(function animCur() {
  rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
  if (curRing) curRing.style.transform = `translate(${rx - 19}px,${ry - 19}px)`;
  requestAnimationFrame(animCur);
})();

function setCursorLabel(text) {
  if (curLbl) curLbl.textContent = text || '';
  document.body.classList.toggle('cur-expand', !!text);
}

document.addEventListener('mouseover', (e) => {
  const el = e.target.closest('[data-cursor]');
  if (el) return setCursorLabel(el.dataset.cursor);
  if (e.target.closest('a,button')) setCursorLabel('');
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest('[data-cursor],a,button')) setCursorLabel(null);
});

/* ═══ SMOOTH SCROLL ═══════════════════════════ */
const MOBILE  = window.innerWidth < 768;
const wrapper = document.getElementById('s');
const progress= document.getElementById('progress');
const nav     = document.getElementById('nav');

let targetY = 0, scrollY = 0, maxY = 0;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a, b, t)    { return a + (b - a) * t; }

/* Parallax refs */
const heroName = document.querySelector('.hero-name');
const heroEye  = document.querySelector('.hero-eyebrow');
const heroFoot = document.querySelector('.hero-foot');
const heroMq   = document.querySelector('.hero-marquee');

/* Reveal elements */
let revEls = [];
function collectRevEls() { revEls = Array.from(document.querySelectorAll('.reveal:not(.visible)')); }

function checkReveals() {
  const ih = window.innerHeight;
  revEls = revEls.filter(el => {
    if (el.classList.contains('visible')) return false;
    const r = el.getBoundingClientRect();
    if (r.top < ih - 55 && r.bottom > 0) {
      const d = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
      setTimeout(() => el.classList.add('visible'), d);
      return false;
    }
    return true;
  });
}

/* Mask reveals (contact heading etc — hero name handled separately with stagger) */
let maskEls = [];
function collectMaskEls() {
  maskEls = Array.from(document.querySelectorAll('.minner:not(.up)')).filter(el => !el.closest('.hero-name'));
}

function checkMasks() {
  const ih = window.innerHeight;
  maskEls = maskEls.filter(el => {
    const r = el.closest('.mline')?.getBoundingClientRect() || el.getBoundingClientRect();
    if (r.top < ih - 40) {
      el.classList.add('up');
      return false;
    }
    return true;
  });
}

/* Nav active */
const navAs = document.querySelectorAll('.nav-links a[href^="#"]');

function updateNav() {
  if (!nav) return;
  nav.classList.toggle('solid', scrollY > 40);
  let active = null;
  navAs.forEach(a => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec && sec.offsetTop - 140 <= scrollY) active = a.getAttribute('href');
  });
  navAs.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === active ? 'true' : 'false'));
}

/* Parallax */
function applyParallax() {
  const vh = window.innerHeight;
  if (scrollY > vh * 1.5) return;
  const y = scrollY;
  if (heroName) {
    heroName.style.transform = `translateY(${y * 0.2}px)`;
    heroName.style.opacity   = String(Math.max(0, 1 - y / (vh * 0.65)));
  }
  if (heroEye && y > 0) {
    heroEye.style.transform  = `translateY(${y * 0.08}px)`;
    heroEye.style.opacity    = String(Math.max(0, 1 - y / (vh * 0.38)));
  }
  if (heroFoot && y > 0) {
    heroFoot.style.opacity   = String(Math.max(0, 1 - y / (vh * 0.32)));
  }
  if (heroMq && y > 0) {
    heroMq.style.opacity     = String(Math.max(0, 1 - y / (vh * 0.28)));
  }
}

/* Wipe navigation (exported to global) */
const wipe = document.getElementById('wipe');

function wipeNav(targetId) {
  const section = document.getElementById(targetId);
  if (!section || !wipe) return;

  /* Phase 1: ink slides up from below */
  wipe.style.transition    = 'none';
  wipe.style.transform     = 'translateY(100%)';
  wipe.style.pointerEvents = 'all';
  void wipe.offsetWidth; /* force reflow so transition sees the starting position */
  wipe.style.transition = 'transform 0.52s cubic-bezier(0.7,0,0.3,1)';
  wipe.style.transform  = 'translateY(0)';

  setTimeout(() => {
    const dest = clamp(section.offsetTop, 0, maxY);
    if (!MOBILE && wrapper) {
      targetY = scrollY = dest;
      wrapper.style.transform = `translateY(${-scrollY}px)`;
    } else {
      section.scrollIntoView({ behavior: 'instant' });
    }

    /* Phase 2: ink continues up and exits */
    void wipe.offsetWidth;
    wipe.style.transition = 'transform 0.52s cubic-bezier(0.7,0,0.3,1)';
    wipe.style.transform  = 'translateY(-100%)';

    setTimeout(() => {
      wipe.style.transition    = 'none';
      wipe.style.transform     = 'translateY(100%)';
      wipe.style.pointerEvents = 'none';
    }, 560);
  }, 560);
}

window.wipeNav = wipeNav;

/* ─── Desktop smooth scroll ─── */
if (!MOBILE && wrapper) {
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.height   = '100%';
  document.body.style.overflow            = 'hidden';
  document.body.style.height              = '100%';

  function measure() { maxY = wrapper.offsetHeight - window.innerHeight; }
  window.addEventListener('resize', measure);

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetY = clamp(targetY + e.deltaY, 0, maxY);
  }, { passive: false });

  /* keyboard */
  window.addEventListener('keydown', (e) => {
    const map = { ArrowDown: 80, ArrowUp: -80, PageDown: window.innerHeight * 0.85, PageUp: -window.innerHeight * 0.85, End: maxY, Home: -maxY };
    if (map[e.key] != null) { e.preventDefault(); targetY = clamp(targetY + map[e.key], 0, maxY); }
  });

  collectRevEls();
  collectMaskEls();

  function tick() {
    scrollY = lerp(scrollY, targetY, 0.085);
    wrapper.style.transform = `translateY(${-scrollY}px)`;
    if (progress) progress.style.transform = `scaleX(${maxY > 0 ? scrollY / maxY : 0})`;
    applyParallax();
    checkReveals();
    checkMasks();
    updateNav();
    requestAnimationFrame(tick);
  }

  measure();
  tick();
  /* Hero name stagger on desktop (mask reveal) */
  document.querySelectorAll('.hero-name .minner').forEach((el, i) => {
    setTimeout(() => el.classList.add('up'), 300 + i * 140);
  });
  setTimeout(() => { checkReveals(); checkMasks(); }, 120);

/* ─── Mobile: native scroll ─── */
} else {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const d = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
      setTimeout(() => el.classList.add('visible'), d);
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '-40px 0px 0px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  document.querySelectorAll('.hero-name .minner').forEach((el, i) => {
    setTimeout(() => el.classList.add('up'), 200 + i * 130);
  });

  window.addEventListener('scroll', updateNav, { passive: true });

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const obs2 = new IntersectionObserver((ee) => {
        ee.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('.minner').forEach(m => m.classList.add('up'));
          obs2.unobserve(entry.target);
        });
      }, { threshold: 0.2 });
      obs2.observe(e.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.mline').forEach(el => secObs.observe(el));

  window.addEventListener('scroll', () => {
    if (progress) progress.style.transform = `scaleX(${window.scrollY / (document.body.scrollHeight - window.innerHeight)})`;
  }, { passive: true });
}

/* drag scroll helper */
function makeDraggable(el) {
  if (!el) return;
  let down = false, startX, sl;
  el.addEventListener('mousedown', (e) => { down = true; el.classList.add('grabbing'); startX = e.pageX - el.offsetLeft; sl = el.scrollLeft; });
  el.addEventListener('mouseleave', () => { down = false; el.classList.remove('grabbing'); });
  el.addEventListener('mouseup',    () => { down = false; el.classList.remove('grabbing'); });
  el.addEventListener('mousemove',  (e) => { if (!down) return; e.preventDefault(); el.scrollLeft = sl - (e.pageX - el.offsetLeft - startX) * 1.5; });
}
window.makeDraggable = makeDraggable;
