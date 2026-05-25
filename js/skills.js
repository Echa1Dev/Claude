const skills = [
  {
    category: '3D & Visual',
    items: [
      'Blender — Modeling',
      'Blender — Animation',
      'Blender — Shading / Nodes',
      'Blender — Lighting',
      'Blender — Compositor',
      'Blender — Particle Systems',
      'Toon / Cel Shading',
      'Color Theory & Psicología del Color',
    ],
  },
  {
    category: 'Systems',
    items: [
      'Windows',
      'Linux',
      'Network Configuration',
      'Technical Support',
      'Shell Script',
    ],
  },
  {
    category: 'Design & Dev',
    items: [
      'Figma',
      'HTML / CSS',
      'Web Development',
      'Video Editing & Post-production',
      'AI Tools',
    ],
  },
];

const grid = document.getElementById('skills-grid');

if (grid) {
  skills.forEach((group, gi) => {
    const cat = document.createElement('div');
    cat.className = 'skills-category reveal';
    cat.dataset.delay = String(gi * 100);

    const label = document.createElement('p');
    label.className = 'skills-category-label';
    label.textContent = group.category;
    cat.appendChild(label);

    const list = document.createElement('ul');
    list.className = 'skills-list';

    group.items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'skills-item';
      li.textContent = item;
      list.appendChild(li);
    });

    cat.appendChild(list);
    grid.appendChild(cat);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = cat.dataset.delay ? parseInt(cat.dataset.delay) : 0;
            setTimeout(() => {
              cat.classList.add('visible');
              list.querySelectorAll('.skills-item').forEach((li, i) => {
                setTimeout(() => li.classList.add('visible'), i * 60);
              });
            }, delay);
            observer.unobserve(cat);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-60px 0px 0px 0px' }
    );
    observer.observe(cat);
  });
}
