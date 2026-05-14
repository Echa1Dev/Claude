import { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'nexus-protocol',
    codename: 'MISSION_001',
    title: 'NEXUS PROTOCOL',
    description: 'Real-time multiplayer strategy game with persistent world state and faction warfare.',
    longDescription:
      'A browser-based multiplayer strategy game featuring real-time faction warfare, persistent territory control, and emergent player economies. Built with a custom WebSocket event system for sub-50ms latency across 500+ concurrent players.',
    tech: ['Three.js', 'WebSockets', 'Node.js', 'Redis', 'PostgreSQL', 'TypeScript'],
    status: 'COMPLETED',
    year: '2024',
    link: '#',
    github: '#',
  },
  {
    id: 'echo-chamber',
    codename: 'MISSION_002',
    title: 'ECHO CHAMBER',
    description: 'Generative music visualization tool that transforms audio into living visual landscapes.',
    longDescription:
      'An interactive audio visualization engine that analyzes frequency data in real-time to generate procedural visual art. Features 12 visualization modes, MIDI input support, and export capabilities for artists and performers.',
    tech: ['Web Audio API', 'WebGL', 'React', 'GSAP', 'TypeScript', 'Tone.js'],
    status: 'ACTIVE',
    year: '2024',
    link: '#',
    github: '#',
  },
  {
    id: 'ghost-net',
    codename: 'MISSION_003',
    title: 'GHOST NET',
    description: 'Distributed task management system with zero-trust architecture and encrypted channels.',
    longDescription:
      'A high-performance distributed task orchestration platform built for resilience. Features end-to-end encrypted communication via gRPC, automatic failover, and a Rust-powered scheduling engine capable of handling 10k+ tasks per second.',
    tech: ['Rust', 'gRPC', 'PostgreSQL', 'Docker', 'Kubernetes', 'Protocol Buffers'],
    status: 'COMPLETED',
    year: '2023',
    link: '#',
    github: '#',
  },
  {
    id: 'void-runner',
    codename: 'MISSION_004',
    title: 'VOID RUNNER',
    description: 'Procedurally generated infinite runner with custom physics engine and adaptive difficulty.',
    longDescription:
      'A high-speed browser game featuring a custom 2D physics engine, procedural level generation algorithms, and an adaptive difficulty system that learns player behavior. Achieved 60fps on mobile devices through aggressive canvas optimization.',
    tech: ['Canvas API', 'TypeScript', 'Web Workers', 'IndexedDB', 'Physics Engine'],
    status: 'ARCHIVED',
    year: '2022',
    link: '#',
    github: '#',
  },
]
