const SKILLS = [
  {
    num: '01',
    name: '3D & Visual',
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
    name: 'Systems',
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
    name: 'Design & Dev',
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

const cols = document.getElementById('skills-cols');
if (!cols) return;

SKILLS.forEach((group) => {
  const col = document.createElement('div');
  col.className = 'sk-col reveal';

  const head = document.createElement('div');
  head.className = 'sk-col-head';

  const num = document.createElement('span');
  num.className = 'sk-col-num';
  num.textContent = group.num;

  const name = document.createElement('span');
  name.className = 'sk-col-name';
  name.textContent = group.name;

  head.append(num, name);

  const list = document.createElement('ul');
  list.className = 'sk-list';
  group.items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'sk-item';
    li.textContent = item;
    list.appendChild(li);
  });

  col.append(head, list);
  cols.appendChild(col);

  const obs = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      col.classList.add('visible');
      list.querySelectorAll('.sk-item').forEach((li, i) => {
        setTimeout(() => li.classList.add('up'), i * 52);
      });
      obs.unobserve(col);
    },
    { threshold: 0.08, rootMargin: '-40px 0px 0px 0px' }
  );
  obs.observe(col);
});
