const projects = [
  {
    id: 'toon-car',
    title: 'Toon Car',
    description: 'Cel-shaded vehicle render built in Blender. Custom shader nodes produce a hand-drawn outline effect with flat color regions. Full scene with road plane and scattered grass props.',
    tags: ['Blender', '3D Modeling', 'Toon Shading', 'Rendering'],
    year: '2025',
    status: 'finished',
    link: null,
    image: '/assets/img/toon-car.jpg',
    featured: true,
  },
  {
    id: 'alarm-clock',
    title: 'Alarm Clock',
    description: 'Classic alarm clock rendered with a pop-art aesthetic. Toon shading, halftone dot patterns, and strong ink outlines. Warm pink body against a teal ground — graphic novel panel feel.',
    tags: ['Blender', '3D Modeling', 'Toon Shading', 'Texturing'],
    year: '2025',
    status: 'finished',
    link: null,
    image: '/assets/img/alarm-clock.jpg',
    featured: true,
  },
  {
    id: 'lighting-study',
    title: 'Lighting & Color Psychology',
    description: 'Final exercise for CILA 2024/25. Two opposite emotional scenes — same character, same composition. One warm and cheerful, one cold and disturbing. All mood carried by light position, color temperature, and pupil texture modifications. No geometry changes.',
    tags: ['Blender', 'Lighting', 'Color Theory', 'Rendering', 'Particle Systems'],
    year: '2025',
    status: 'finished',
    link: null,
    image: '/assets/img/lighting-study.jpg',
    featured: false,
  },
  {
    id: 'school-website',
    title: 'School Website',
    description: 'Official website for a school educational center, developed during FCT internship. Full design and development of the web presence from scratch.',
    tags: ['Web Development', 'HTML', 'CSS'],
    year: '2024',
    status: 'finished',
    link: null,
    image: null,
    featured: false,
  },
];

function statusLabel(status) {
  const map = { finished: 'Finished', 'in-progress': 'In Progress', paused: 'Paused', concept: 'Concept' };
  return map[status] || status;
}

function renderCard(p) {
  const card = document.createElement('article');
  card.className = `card reveal${p.featured ? ' featured' : ''}`;

  if (p.image) {
    const bg = document.createElement('div');
    bg.className = 'card-bg';
    bg.style.backgroundImage = `url('${p.image}')`;
    card.appendChild(bg);
  } else {
    const ghost = document.createElement('div');
    ghost.className = 'card-ghost';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.textContent = p.title;
    card.appendChild(ghost);
  }

  const status = document.createElement('span');
  status.className = 'card-status tag';
  status.textContent = statusLabel(p.status);
  card.appendChild(status);

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
    tag.className = 'tag';
    tag.textContent = t;
    tags.appendChild(tag);
  });
  content.appendChild(tags);

  if (p.link) {
    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = p.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '→ View project';
    content.appendChild(link);
  }

  card.appendChild(content);
  return card;
}

const grid = document.getElementById('projects-grid');
if (grid) {
  projects.forEach((p, i) => {
    const card = renderCard(p);
    card.dataset.delay = String(i * 80);
    grid.appendChild(card);
  });

  grid.querySelectorAll('.card.reveal').forEach((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
            setTimeout(() => el.classList.add('visible'), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-60px 0px 0px 0px' }
    );
    observer.observe(el);
  });
}
