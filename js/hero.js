const heroName = document.querySelector('.hero-name');
if (heroName) {
  heroName.querySelectorAll('span').forEach((span, i) => {
    span.style.opacity = '0';
    span.style.transform = 'translateY(30px)';
    span.style.display = 'block';
    span.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      });
    });
  });

  const title = document.querySelector('.hero-title');
  const bio = document.querySelector('.hero-bio');
  [title, bio].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${300 + i * 100}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${300 + i * 100}ms`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}
