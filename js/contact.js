const links = [
  { label: 'GitHub',  href: 'https://github.com/Echa1Dev', display: 'github.com/Echa1Dev' },
  { label: 'Email',   href: 'mailto:jechaidlop07@gmail.com', display: 'jechaidlop07@gmail.com' },
];

const container = document.getElementById('contact-links');
if (!container) return;

links.forEach((item) => {
  const row = document.createElement('div');
  row.className = 'contact-link-row';

  const arrow = document.createElement('span');
  arrow.className = 'contact-arrow';
  arrow.textContent = '→';

  const info = document.createElement('div');
  info.className = 'contact-link-info';

  const label = document.createElement('span');
  label.className = 'contact-link-label';
  label.textContent = item.label;

  const val = document.createElement('a');
  val.className = 'contact-link-val';
  val.href = item.href;
  val.textContent = item.display;
  if (!item.href.startsWith('mailto')) {
    val.target = '_blank';
    val.rel = 'noopener noreferrer';
  }

  info.append(label, val);
  row.append(arrow, info);
  container.appendChild(row);
});
