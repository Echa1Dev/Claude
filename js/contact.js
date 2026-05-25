const LINKS = [
  { label: 'GitHub', href: 'https://github.com/Echa1Dev', val: 'github.com/Echa1Dev', cursor: 'VISIT' },
  { label: 'Email',  href: 'mailto:jechaidlop07@gmail.com', val: 'jechaidlop07@gmail.com', cursor: 'WRITE' },
];

const wrap = document.getElementById('contact-links');

if (wrap) {
  LINKS.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cl-row';

    const arrow = document.createElement('span');
    arrow.className = 'cl-arrow';
    arrow.textContent = '→';

    const info = document.createElement('div');
    info.className = 'cl-info';

    const lbl = document.createElement('span');
    lbl.className = 'cl-lbl';
    lbl.textContent = item.label;

    const val = document.createElement('a');
    val.className = 'cl-val';
    val.href = item.href;
    val.textContent = item.val;
    val.setAttribute('data-cursor', item.cursor);
    if (!item.href.startsWith('mailto')) {
      val.target = '_blank';
      val.rel = 'noopener noreferrer';
    }

    info.append(lbl, val);
    row.append(arrow, info);
    wrap.appendChild(row);
  });
}
