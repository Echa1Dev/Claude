const projects = [
  {
    id: 'lighting-cila',
    title: 'Lighting & Color Psychology',
    description: 'Final exercise for CILA 2024/25. Two opposing scenes — same composition, same character, opposite emotion. One warm and joyful (analogue warm palette), one dark and disturbing (cool complementaries). Built in Blender with a particle hair system, animated candle light via procedural noise drivers, and deliberate color theory at every lighting decision.',
    tags: ['Blender', 'Lighting', 'Color Theory', 'Render', 'CILA'],
    year: '2025',
    status: 'finished',
    link: null,
    image: null,
    featured: true
  },
  {
    id: 'toon-clock',
    title: 'Alarm Clock',
    description: 'Vintage double-bell alarm clock modeled and rendered in Blender with a bold toon aesthetic. Freestyle outlines, pop-art palette — pink body, cobalt bells, cream face — over a teal checkerboard ground. An exercise in stylised shading and material design.',
    tags: ['Blender', '3D Modeling', 'Toon Render', 'Shading'],
    year: '2025',
    status: 'finished',
    link: null,
    image: '/assets/img/clock.jpg',
    featured: true
  },
  {
    id: 'toon-car',
    title: 'Toon Car',
    description: 'Compact car modeled in Blender and rendered with a cel-shading approach. Clean geometry with a hand-drawn feel achieved through Freestyle line rendering, flat toon shader nodes, and a parking-lot scene to ground the model in context.',
    tags: ['Blender', '3D Modeling', 'Toon Shader', 'Freestyle'],
    year: '2025',
    status: 'finished',
    link: null,
    image: '/assets/img/car.jpg',
    featured: false
  }
];

const STATUS_LABELS = {
  'finished':    'Finished',
  'in-progress': 'In Progress',
  'paused':      'Paused',
  'concept':     'Concept'
};

function buildCard(project, index) {
  const card = document.createElement('article');
  card.className = ['card', 'reveal', project.featured ? 'featured' : ''].filter(Boolean).join(' ');
  card.dataset.delay = index * 80;

  const bgHTML = project.image
    ? `<div class="card-bg" style="background-image:url('${project.image}')" aria-hidden="true"></div>
       <div class="card-overlay" aria-hidden="true"></div>`
    : `<div class="card-ghost" aria-hidden="true">${project.title}</div>`;

  const tagsHTML = project.tags
    .map((t) => `<span class="tag">${t}</span>`)
    .join('');

  const linkHTML = project.link
    ? `<a class="card-link" href="${project.link}" target="_blank" rel="noopener noreferrer">↗ View project</a>`
    : '';

  card.innerHTML = `
    ${bgHTML}
    <div class="card-status"><span class="tag">${STATUS_LABELS[project.status] || project.status}</span></div>
    <div class="card-content">
      <div class="card-meta"><span class="card-year">${project.year}</span></div>
      <h3 class="card-title">${project.title}</h3>
      <p class="card-description">${project.description}</p>
      <div class="card-tags">${tagsHTML}</div>
      ${linkHTML}
    </div>
  `;

  return card;
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  sorted.forEach((p, i) => grid.appendChild(buildCard(p, i)));

  if (window.observeReveal) window.observeReveal(grid);
}

document.addEventListener('DOMContentLoaded', renderProjects);
