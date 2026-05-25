const hamburger = document.querySelector('.nav-hamburger');
const dropdown  = document.querySelector('.nav-dropdown');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  dropdown.classList.toggle('open', isOpen);
  dropdown.setAttribute('aria-hidden', String(!isOpen));
});

dropdown.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('open');
    dropdown.setAttribute('aria-hidden', 'true');
  });
});
