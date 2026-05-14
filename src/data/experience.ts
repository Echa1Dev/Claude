import { ExperienceItem } from '@/types'

export const experience: ExperienceItem[] = [
  {
    id: 'axiom-labs',
    period: '2024 — PRESENT',
    startYear: 2024,
    endYear: null,
    title: 'Lead Interactive Developer',
    company: 'AXIOM LABS',
    description:
      'Architecting immersive web experiences for Fortune 500 clients. Leading a team of 6 engineers building next-generation interactive platforms.',
    highlights: [
      'Reduced load time by 60% through advanced code-splitting and edge caching strategies',
      'Built proprietary animation engine used across 12 client deployments',
      'Established WebGL rendering pipeline serving 2M+ monthly users',
    ],
    tech: ['Next.js', 'Three.js', 'GSAP', 'TypeScript', 'AWS', 'WebGL'],
  },
  {
    id: 'quantum-media',
    period: '2022 — 2024',
    startYear: 2022,
    endYear: 2024,
    title: 'Senior Frontend Engineer',
    company: 'QUANTUM MEDIA',
    description:
      'Built real-time collaborative creative tools used by digital artists and content creators worldwide.',
    highlights: [
      'Developed real-time canvas collaboration engine with CRDT conflict resolution',
      'Shipped AI-assisted design tool with 50k+ active users at launch',
      'Optimized WebSocket infrastructure for 10k+ concurrent sessions',
    ],
    tech: ['React', 'WebSockets', 'Canvas API', 'Node.js', 'Redis', 'TypeScript'],
  },
  {
    id: 'pixel-forge',
    period: '2020 — 2022',
    startYear: 2020,
    endYear: 2022,
    title: 'Game Developer',
    company: 'PIXEL FORGE STUDIO',
    description:
      'Shipped 3 indie titles with 200k+ combined downloads. Specialized in browser-based game development and procedural content generation.',
    highlights: [
      'Built custom 2D physics engine achieving 60fps on low-end mobile devices',
      'Designed procedural dungeon generation system with 10^18 possible configurations',
      'Integrated Web Audio API for dynamic adaptive music system',
    ],
    tech: ['TypeScript', 'Canvas API', 'WebGL', 'Web Audio API', 'Phaser.js'],
  },
  {
    id: 'nexus-dynamics',
    period: '2018 — 2020',
    startYear: 2018,
    endYear: 2020,
    title: 'Full Stack Developer',
    company: 'NEXUS DYNAMICS',
    description:
      'Developed API systems and distributed microservices serving 1M+ requests per day across global infrastructure.',
    highlights: [
      'Architected RESTful API platform handling 1M+ daily requests with 99.9% uptime',
      'Migrated monolithic codebase to microservices, reducing deployment time by 80%',
      'Implemented automated testing suite achieving 94% code coverage',
    ],
    tech: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis'],
  },
]
