document.querySelectorAll('.hero-name-inner').forEach((el, i) => {
  requestAnimationFrame(() => {
    setTimeout(() => el.classList.add('revealed'), 80 + i * 130);
  });
});
