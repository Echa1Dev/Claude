const skills = [
  {
    num: '01',
    category: '3D & Visual',
    items: [
      'Blender — Modeling',
      'Blender — Animation',
      'Blender — Shading / Nodes',
      'Blender — Lighting',
      'Blender — Compositor',
      'Blender — Particle Systems',
      'Toon / Cel Shading',
      'Color Theory',
    ],
  },
  {
    num: '02',
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
    num: '03',
    category: 'Design & Dev',
    items: [
      'Figma',
      'HTML / CSS',
      'Web Development',
      'Video Editing',
      'Post-production',
      'AI Tools',
    ],
  },
];

const grid = document.getElementById('skills-grid');
if (!grid) return;

skills.forEach((group) => {
  const cat = document.createElement('div');
  cat.className = 'skills-category reveal';

  const header = document.createElement('div');
  header.className = 'skills-cat-header';

  const num = document.createElement('span');
  num.className = 'skills-cat-num';
  num.textContent = group.num;

  const name = document.createElement('span');
  name.className = 'skills-cat-name';
  name.textContent = group.category;

  header.append(num, name);

  const list = document.createElement('ul');
  list.className = 'skills-list';

  group.items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'skills-item';
    li.textContent = item;
    list.appendChild(li);
  });

  cat.append(header, list);
  grid.appendChild(cat);

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        cat.classList.add('visible');
        list.querySelectorAll('.skills-item').forEach((li, i) => {
          setTimeout(() => li.classList.add('visible'), i * 55);
        });
        obs.unobserve(cat);
      });
    },
    { threshold: 0.1, rootMargin: '-40px 0px 0px 0px' }
  );
  obs.observe(cat);
});
