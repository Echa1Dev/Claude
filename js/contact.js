const contactLinks = [
  {
    label: 'GitHub',
    url:   'github.com/Echa1Dev',
    href:  'https://github.com/Echa1Dev'
  },
  {
    label: 'Email',
    url:   'jechaidlop07@gmail.com',
    href:  'mailto:jechaidlop07@gmail.com'
  }
];

function renderContact() {
  const container = document.getElementById('contact-links');
  if (!container) return;

  contactLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href   = link.href;
    a.classList.add('contact-link-item');

    if (link.href.startsWith('http')) {
      a.target = '_blank';
      a.rel    = 'noopener noreferrer';
    }

    a.innerHTML = `
      <span class="contact-link-label">&#8594; ${link.label}</span>
      <span class="contact-link-url">${link.url}</span>
    `;

    container.appendChild(a);
  });
}

document.addEventListener('DOMContentLoaded', renderContact);
