const skills = [
  {
    category: 'Craft',
    items: [
      { name: 'Blender — 3D Modeling',    level: 'Advanced' },
      { name: 'Blender — Animation',       level: 'Advanced' },
      { name: 'Blender — Texturing',       level: 'Advanced' },
      { name: 'Blender — Node Materials',  level: 'Advanced' },
      { name: 'Blender — Compositing',     level: 'Proficient' }
    ]
  },
  {
    category: 'Code',
    items: [
      { name: 'JavaScript',  level: 'Comfortable' },
      { name: 'HTML & CSS',  level: 'Comfortable' }
    ]
  },
  {
    category: 'Systems',
    items: [
      { name: 'Windows',  level: 'Proficient' },
      { name: 'Linux',    level: 'Proficient' }
    ]
  }
];

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  skills.forEach((group) => {
    const col = document.createElement('div');
    col.classList.add('skill-category');

    const itemsHTML = group.items
      .map(
        (item) =>
          `<li class="skill-item">
            <span>${item.name}</span>
            <span class="skill-level">${item.level}</span>
          </li>`
      )
      .join('');

    col.innerHTML = `
      <span class="skill-category-label">${group.category}</span>
      <ul class="skill-list">${itemsHTML}</ul>
    `;

    grid.appendChild(col);
  });

  if (typeof window.staggerChildren === 'function') {
    window.staggerChildren(grid, 100);
  }
}

document.addEventListener('DOMContentLoaded', renderSkills);
