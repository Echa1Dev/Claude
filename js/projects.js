const PROJECTS = [
  {
    id: 'toon-car',
    title: 'Toon Car',
    desc: 'Cel-shaded vehicle render. Custom shader nodes produce hand-drawn outlines with flat color regions. Full scene with road plane and grass props.',
    tags: ['Blender', '3D Modeling', 'Toon Shading', 'Rendering'],
    year: '2025',
    status: 'Finished',
    link: null,
    image: 'assets/img/toon-car.jpg',
    feat: true,
  },
  {
    id: 'alarm-clock',
    title: 'Alarm Clock',
    desc: 'Pop-art alarm clock. Toon shading, halftone dot patterns and strong ink outlines. Warm pink against teal — graphic novel panel feel.',
    tags: ['Blender', '3D Modeling', 'Toon Shading', 'Texturing'],
    year: '2025',
    status: 'Finished',
    link: null,
    image: 'assets/img/alarm-clock.jpg',
    feat: true,
  },
  {
    id: 'lighting-study',
    title: 'Lighting Study',
    desc: 'CILA Final — 2024/25. Same scene, two emotional extremes. All mood from light placement, color temperature, and pupil texture edits — zero geometry changes.',
    tags: ['Blender', 'Lighting', 'Color Theory', 'Particle Systems'],
    year: '2025',
    status: 'Finished',
    link: null,
    image: 'assets/img/lighting-study.jpg',
    feat: false,
  },
  {
    id: 'school-web',
    title: 'School Website',
    desc: 'Official site for an educational center. Full design and development during FCT internship.',
    tags: ['Web Dev', 'HTML', 'CSS'],
    year: '2024',
    status: 'Finished',
    link: null,
    image: null,
    feat: false,
  },
];

function buildCard(p) {
  const card = document.createElement('article');
  card.className = `pcard${p.feat ? ' feat' : ''}`;
  card.setAttribute('data-cursor', 'VIEW');

  if (p.image) {
    const img = document.createElement('div');
    img.className = 'pcard-img';
    img.style.backgroundImage = `url('${p.image}')`;
    card.appendChild(img);

    const grad = document.createElement('div');
    grad.className = 'pcard-grad';
    card.appendChild(grad);
  } else {
    const ghost = document.createElement('div');
    ghost.className = 'pcard-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.textContent = p.title;
    card.appendChild(ghost);
  }

  const badge = document.createElement('span');
  badge.className = 'pcard-status';
  badge.textContent = p.status;
  card.appendChild(badge);

  const content = document.createElement('div');
  content.className = 'pcard-content';

  const yr = document.createElement('p');
  yr.className = 'pcard-yr';
  yr.textContent = p.year;
  content.appendChild(yr);

  const title = document.createElement('h3');
  title.className = 'pcard-title';
  title.textContent = p.title;
  content.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'pcard-desc';
  desc.textContent = p.desc;
  content.appendChild(desc);

  const tags = document.createElement('div');
  tags.className = 'pcard-tags';
  p.tags.forEach((t) => {
    const s = document.createElement('span');
    s.className = 'pcard-tag';
    s.textContent = t;
    tags.appendChild(s);
  });
  content.appendChild(tags);

  if (p.link) {
    const a = document.createElement('a');
    a.className = 'pcard-link';
    a.href = p.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = '→ View';
    content.appendChild(a);
  }

  card.appendChild(content);
  return card;
}

const rail = document.getElementById('proj-rail');
if (rail) {
  PROJECTS.forEach((p) => rail.appendChild(buildCard(p)));
  makeDraggable(rail);
}
