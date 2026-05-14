import { SkillGroup } from '@/types'

export const skillGroups: SkillGroup[] = [
  {
    id: 'FRONTEND_SYSTEMS',
    label: 'FRONTEND SYSTEMS',
    description: 'Client-side rendering protocols and interface construction',
    skills: [
      { name: 'TypeScript', level: 96, category: 'FRONTEND_SYSTEMS' },
      { name: 'React / Next.js', level: 94, category: 'FRONTEND_SYSTEMS' },
      { name: 'Three.js / WebGL', level: 88, category: 'FRONTEND_SYSTEMS' },
      { name: 'CSS / Tailwind', level: 92, category: 'FRONTEND_SYSTEMS' },
      { name: 'GSAP / Framer Motion', level: 85, category: 'FRONTEND_SYSTEMS' },
    ],
  },
  {
    id: 'BACKEND_PROTOCOLS',
    label: 'BACKEND PROTOCOLS',
    description: 'Server-side logic, APIs, and data persistence layers',
    skills: [
      { name: 'Node.js', level: 91, category: 'BACKEND_PROTOCOLS' },
      { name: 'Python', level: 84, category: 'BACKEND_PROTOCOLS' },
      { name: 'PostgreSQL', level: 88, category: 'BACKEND_PROTOCOLS' },
      { name: 'REST / GraphQL', level: 90, category: 'BACKEND_PROTOCOLS' },
      { name: 'WebSockets / gRPC', level: 82, category: 'BACKEND_PROTOCOLS' },
    ],
  },
  {
    id: 'CREATIVE_ENGINES',
    label: 'CREATIVE ENGINES',
    description: 'Generative systems, game development, and interactive media',
    skills: [
      { name: 'WebGL / GLSL', level: 80, category: 'CREATIVE_ENGINES' },
      { name: 'Canvas API', level: 87, category: 'CREATIVE_ENGINES' },
      { name: 'Web Audio API', level: 78, category: 'CREATIVE_ENGINES' },
      { name: 'Game Physics', level: 75, category: 'CREATIVE_ENGINES' },
      { name: 'Procedural Generation', level: 83, category: 'CREATIVE_ENGINES' },
    ],
  },
  {
    id: 'INFRASTRUCTURE',
    label: 'INFRASTRUCTURE',
    description: 'Deployment systems, containers, and low-level protocols',
    skills: [
      { name: 'Rust', level: 72, category: 'INFRASTRUCTURE' },
      { name: 'Docker / K8s', level: 80, category: 'INFRASTRUCTURE' },
      { name: 'CI/CD Pipelines', level: 85, category: 'INFRASTRUCTURE' },
      { name: 'Redis / Caching', level: 82, category: 'INFRASTRUCTURE' },
      { name: 'AWS / Vercel', level: 86, category: 'INFRASTRUCTURE' },
    ],
  },
]
