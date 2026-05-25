const projects = [
  {
    id: 'toon-car',
    title: 'Toon Car',
    description: 'Cel-shaded vehicle render. Custom shader nodes produce hand-drawn outlines with flat color regions. Full scene with road and grass props.',
    tags: ['Blender', '3D Modeling', 'Toon Shading', 'Rendering'],
    year: '2025',
    status: 'Finished',
    link: null,
    image: 'assets/img/toon-car.jpg',
    featured: true,
  },
  {
    id: 'alarm-clock',
    title: 'Alarm Clock',
    description: 'Pop-art alarm clock. Toon shading, halftone dot patterns, and strong ink outlines. Warm pink against teal — graphic novel panel feel.',
    tags: ['Blender', '3D Modeling', 'Toon Shading', 'Texturing'],
    year: '2025',
    status: 'Finished',
    link: null,
    image: 'assets/img/alarm-clock.jpg',
    featured: true,
  },
  {
    id: 'lighting-study',
    title: 'Lighting Study',
    description: 'CILA Final — 2024/25. Same scene, two emotional extremes: warm/cheerful vs. cold/disturbing. All mood from light position, color temperature, and pupil texture edits. No geometry changes.',
    tags: ['Blender', 'Lighting', 'Color Theory', 'Particle Systems'],
    year: '2025',
    status: 'Finished',
    link: null,
    image: 'assets/img/lighting-study.jpg',
    featured: false,
  },
  {
    id: 'school-website',
    title: 'School Website',
    description: 'Official site for an educational center. Full design and development during FCT internship.',
    tags: ['Web Dev', 'HTML', 'CSS'],
    year: '2024',
    status: 'Finished',
    link: null,
    image: null,
    featured: false,
  },
];

function buildCard(p) {
  const el = document.createElement('article');
  el.className = `card${p.featured ? ' featured' : ''}`;

  if (p.image) {
    const bg = document.createElement('div');
    bg.className = 'card-bg';
    bg.style.backgroundImage = `url('${p.image}')`;
    el.appendChild(bg);
    const ov = document.createElement('div');
    ov.className = 'card-overlay';
    el.appendChild(ov);
  } else {
    const ghost = document.createElement('div');
    ghost.className = 'card-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.textContent = p.title;
    el.appendChild(ghost);
  }

  const status = document.createElement('span');
  status.className = 'card-status';
  status.textContent = p.status;
  el.appendChild(status);

  const content = document.createElement('div');
  content.className = 'card-content';

  const year = document.createElement('p');
  year.className = 'card-year';
  year.textContent = p.year;
  content.appendChild(year);

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = p.title;
  content.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = p.description;
  content.appendChild(desc);

  const tags = document.createElement('div');
  tags.className = 'card-tags';
  p.tags.forEach((t) => {
    const tag = document.createElement('span');
    tag.className = 'card-tag';
    tag.textContent = t;
    tags.appendChild(tag);
  });
  content.appendChild(tags);

  if (p.link) {
    const a = document.createElement('a');
    a.className = 'card-link';
    a.href = p.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = '→ View';
    content.appendChild(a);
  }

  el.appendChild(content);
  return el;
}

const track = document.getElementById('projects-track');
if (track) {
  projects.forEach((p) => track.appendChild(buildCard(p)));
  enableDragScroll(track);
}
