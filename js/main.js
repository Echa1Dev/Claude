// ---- Reveal observer ----
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.15, rootMargin: '-80px 0px' }
);

function observeReveal(container) {
  const root = container || document;
  root.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

window.observeReveal = observeReveal;
observeReveal();

// ---- Smooth scroll ----
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.querySelector(anchor.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ---- Active nav on scroll ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('#nav .nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((link) => {
        const matches = link.getAttribute('href') === '#' + entry.target.id;
        link.setAttribute('aria-current', matches ? 'true' : 'false');
      });
    });
  },
  { threshold: 0.35 }
);

sections.forEach((s) => sectionObserver.observe(s));

// ---- staggerChildren helper ----
function staggerChildren(parentEl, delayMs) {
  Array.from(parentEl.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * delayMs}ms`;
  });
}

window.staggerChildren = staggerChildren;
