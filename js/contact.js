const contactLinks = [
  {
    label: 'GitHub',
    url: 'https://github.com/Echa1Dev',
    display: 'github.com/Echa1Dev',
    external: true
  },
  {
    label: 'Email',
    url: 'mailto:jechaidlop07@gmail.com',
    display: 'jechaidlop07@gmail.com',
    external: false
  }
];

function renderContact() {
  const list = document.getElementById('contact-links');
  if (!list) return;

  contactLinks.forEach(({ label, url, display, external }) => {
    const li = document.createElement('li');
    li.className = 'contact-link-item';

    const extAttrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    li.innerHTML = `
      <a href="${url}"${extAttrs}>
        <span class="contact-link-arrow" aria-hidden="true">→</span>
        <span class="contact-link-label">${label}</span>
        <span class="contact-link-url">${display}</span>
      </a>
    `;

    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', renderContact);
