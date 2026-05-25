/* ── WIPE INTERCEPT ─────────────────── */
document.querySelectorAll('[data-wipe]').forEach((el) => {
  el.addEventListener('click', (e) => {
    const target = el.dataset.wipe;
    const section = document.getElementById(target);
    if (!section) return;
    e.preventDefault();

    // close mobile menu if open
    burger?.setAttribute('aria-expanded', 'false');
    links?.classList.remove('open');

    wipeNav(target);
  });
});

/* ── HAMBURGER ──────────────────────── */
const burger = document.querySelector('.nav-burger');
const links  = document.querySelector('.nav-links');

burger?.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  links?.classList.toggle('open', !open);
});

/* ── TEXT SCRAMBLE ON NAV HOVER ──────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function scramble(el) {
  const orig = el.dataset.orig ?? el.textContent;
  el.dataset.orig = orig;
  let frame = 0;
  const total = orig.length * 2;
  if (el._scram) clearInterval(el._scram);
  el._scram = setInterval(() => {
    el.textContent = orig
      .split('')
      .map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < frame / 2) return orig[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
    frame++;
    if (frame > total) { el.textContent = orig; clearInterval(el._scram); }
  }, 28);
}

document.querySelectorAll('.nav-links a').forEach((a) => {
  a.addEventListener('mouseenter', () => scramble(a));
});
