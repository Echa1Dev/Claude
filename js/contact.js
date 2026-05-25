const contactData = [
  {
    label: 'GitHub',
    url: 'https://github.com/Echa1Dev',
    display: 'github.com/Echa1Dev',
  },
  {
    label: 'Email',
    url: 'mailto:jechaidlop07@gmail.com',
    display: 'jechaidlop07@gmail.com',
  },
];

const container = document.getElementById('contact-links');

if (container) {
  contactData.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'contact-link-item';

    const arrow = document.createElement('span');
    arrow.className = 'contact-link-arrow';
    arrow.textContent = '→';
    row.appendChild(arrow);

    const body = document.createElement('div');
    body.className = 'contact-link-body';

    const label = document.createElement('span');
    label.className = 'contact-link-label';
    label.textContent = item.label;
    body.appendChild(label);

    const url = document.createElement('a');
    url.className = 'contact-link-url';
    url.href = item.url;
    if (!item.url.startsWith('mailto')) {
      url.target = '_blank';
      url.rel = 'noopener noreferrer';
    }
    url.textContent = item.display;
    body.appendChild(url);

    row.appendChild(body);
    container.appendChild(row);
  });
}
