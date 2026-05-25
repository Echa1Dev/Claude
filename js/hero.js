document.addEventListener('DOMContentLoaded', () => {
  const inner = document.querySelector('.hero-inner');
  if (!inner) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      inner.classList.add('loaded');
    });
  });
});
