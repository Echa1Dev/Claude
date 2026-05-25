const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.15, rootMargin: '-80px 0px 0px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = Array.from(navLinks).map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((a) => {
          a.setAttribute('aria-current', a.getAttribute('href') === `#${id}` ? 'true' : 'false');
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => sectionObserver.observe(s));

function staggerChildren(parentEl, delayMs) {
  Array.from(parentEl.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * delayMs}ms`;
  });
}

window.staggerChildren = staggerChildren;
