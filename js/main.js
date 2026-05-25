/* ================================================
   SCROLL REVEAL — IntersectionObserver
   ================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.delay) {
        el.style.transitionDelay = el.dataset.delay + 'ms';
      }
      el.classList.add('visible');
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.15, rootMargin: '-80px' }
);

// Observe static .reveal elements already in the DOM (about section)
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ================================================
   SMOOTH SCROLL
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ================================================
   ACTIVE NAV LINK ON SCROLL
   ================================================ */
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.setAttribute(
          'aria-current',
          link.getAttribute('href') === '#' + id ? 'true' : 'false'
        );
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

document.querySelectorAll('section[id]').forEach((s) => sectionObserver.observe(s));

/* ================================================
   STAGGER CHILDREN HELPER
   Used by projects.js and skills.js
   ================================================ */
function staggerChildren(parentEl, delayMs) {
  Array.from(parentEl.children).forEach((child, i) => {
    child.dataset.delay = i * delayMs;
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
}

window.staggerChildren = staggerChildren;
