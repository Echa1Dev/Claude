const skills = [
  {
    category: '3D & Craft',
    items: [
      'Blender · Modeling',
      'Blender · Shading & Materials',
      'Blender · Lighting & HDRI',
      'Blender · Compositor & Nodes',
      'Blender · Particle Systems',
      'Blender · Animation'
    ]
  },
  {
    category: 'Systems & Networks',
    items: [
      'Windows Administration',
      'Linux Administration',
      'Network Config & Support',
      'Shell Scripting',
      'Technical Support'
    ]
  },
  {
    category: 'Tools & Other',
    items: [
      'Figma',
      'Video Editing & Post-Production',
      'AI Tools',
      'Web Development',
      'Git / GitHub'
    ]
  }
];

function staggerSkillItems(categoryEl) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.skill-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 60);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );
  observer.observe(categoryEl);
}

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  skills.forEach((group, gi) => {
    const cat = document.createElement('div');
    cat.className = 'skill-category reveal';
    cat.dataset.delay = gi * 100;

    const label = document.createElement('p');
    label.className = 'skill-category-label';
    label.textContent = group.category;

    const list = document.createElement('ul');
    list.className = 'skill-list';

    group.items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'skill-item';
      li.textContent = item;
      list.appendChild(li);
    });

    cat.appendChild(label);
    cat.appendChild(list);
    grid.appendChild(cat);

    staggerSkillItems(cat);
  });

  if (window.observeReveal) window.observeReveal(grid);
}

document.addEventListener('DOMContentLoaded', renderSkills);
