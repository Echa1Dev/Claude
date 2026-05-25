document.querySelectorAll('.hero-name .minner').forEach((el, i) => {
  setTimeout(() => el.classList.add('up'), 220 + i * 140);
});
