const projects = [
  {
    id: 'awakening-protocol',
    title: 'Awakening Protocol',
    description: 'A post-apocalyptic sci-fi interactive narrative experience built entirely with vanilla JavaScript and HTML Canvas. The player explores the ruins of an advanced civilization through parallax environments, terminal interfaces, and ambient storytelling — no engine, no framework, pure code.',
    tags: ['JavaScript', 'HTML', 'CSS', 'Interactive', 'Narrative'],
    year: '2025',
    status: 'finished',
    link: null,
    image: null,
    featured: true
  }
];

const statusLabel = {
  'finished':    'Finished',
  'in-progress': 'In Progress',
  'paused':      'Paused',
  'concept':     'Concept'
};

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  projects.forEach((project) => {
    const card = document.createElement(project.link ? 'a' : 'div');

    if (project.link) {
      card.href   = project.link;
      card.target = '_blank';
      card.rel    = 'noopener noreferrer';
    }

    card.classList.add('card');
    if (project.featured) card.classList.add('featured');

    const label    = statusLabel[project.status] || project.status;
    const tagsHTML = project.tags.map((t) => `<span class="tag">${t}</span>`).join('');

    const imageHTML = project.image
      ? `<div class="card-bg" style="background-image:url('${project.image}')"></div>
         <div class="card-overlay"></div>`
      : `<div class="card-ghost" aria-hidden="true">${project.title}</div>`;

    const linkHint = project.link
      ? `<p class="card-link-hint">&#8594; View Project</p>`
      : '';

    card.innerHTML = `
      ${imageHTML}
      <div class="card-status">
        <span class="tag">${label}</span>
      </div>
      <div class="card-body">
        <p class="card-year">${project.year}</p>
        <h3 class="card-title">${project.title}</h3>
        <p class="card-desc">${project.description}</p>
        <div class="card-tags">${tagsHTML}</div>
        ${linkHint}
      </div>
    `;

    grid.appendChild(card);
  });

  if (typeof window.staggerChildren === 'function') {
    window.staggerChildren(grid, 80);
  }
}

document.addEventListener('DOMContentLoaded', renderProjects);
