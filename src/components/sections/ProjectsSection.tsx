'use client'

import { useEffect, useRef, useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import Badge from '@/components/ui/Badge'
import { projects } from '@/data/projects'
import { useServerStore } from '@/systems/store'
import GlitchText from '@/components/effects/GlitchText'

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'var(--color-primary)',
  ACTIVE: 'var(--color-secondary)',
  ARCHIVED: 'var(--color-text)',
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const { setActiveSection, incrementInteractions } = useServerStore()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          setActiveSection('projects')
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [setActiveSection])

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-section="projects"
      className="relative py-24 md:py-32"
      style={{ zIndex: 1 }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 100% 50%, rgba(74,158,255,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel label="MISSION_ARCHIVES" number="03" className="mb-4" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-bright)' }}
          >
            Featured{' '}
            <span style={{ color: 'var(--color-secondary)' }}>Missions</span>
          </h2>
          <p className="font-mono text-xs" style={{ color: 'var(--color-text)' }}>
            {projects.length} RECORDS RETRIEVED // CLASSIFIED ARCHIVES
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="border relative overflow-hidden cursor-none group transition-all duration-700"
              style={{
                backgroundColor: 'rgba(13, 15, 20, 0.7)',
                borderColor:
                  activeProject === project.id
                    ? 'rgba(0,255,157,0.4)'
                    : 'var(--color-border)',
                boxShadow:
                  activeProject === project.id
                    ? '0 0 30px rgba(0,255,157,0.1), inset 0 0 30px rgba(0,255,157,0.02)'
                    : 'none',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${index * 100}ms`,
              }}
              onMouseEnter={() => {
                setActiveProject(project.id)
                incrementInteractions()
              }}
              onMouseLeave={() => setActiveProject(null)}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-all duration-300"
                style={{
                  background:
                    activeProject === project.id
                      ? 'linear-gradient(90deg, transparent, var(--color-primary), transparent)'
                      : 'transparent',
                }}
              />

              {/* Project number watermark */}
              <div
                className="absolute top-4 right-4 font-mono text-xs"
                style={{ color: 'var(--color-border)' }}
              >
                {project.codename}
              </div>

              <div className="p-6">
                {/* Status */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: STATUS_COLORS[project.status],
                      boxShadow: `0 0 6px ${STATUS_COLORS[project.status]}`,
                      animation: project.status === 'ACTIVE' ? 'pulseGlow 2s infinite' : 'none',
                    }}
                  />
                  <span
                    className="font-mono text-xs tracking-widest"
                    style={{ color: STATUS_COLORS[project.status] }}
                  >
                    {project.status}
                  </span>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-text)' }}>
                    {'// '}{project.year}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-xl md:text-2xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-bright)' }}
                >
                  <GlitchText glitchOnHover>
                    {project.title}
                  </GlitchText>
                </h3>

                {/* Description */}
                <p
                  className="font-mono text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--color-text)' }}
                >
                  {activeProject === project.id
                    ? project.longDescription
                    : project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="dim">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  {project.link && (
                    <a
                      href={project.link}
                      className="font-mono text-xs tracking-widest uppercase transition-colors duration-200 cursor-none"
                      style={{ color: 'var(--color-primary)' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      [VIEW_MISSION] →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      className="font-mono text-xs tracking-widest uppercase transition-colors duration-200 cursor-none"
                      style={{ color: 'var(--color-text)' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      [SOURCE_CODE]
                    </a>
                  )}
                </div>
              </div>

              {/* Corner decorations (show on hover) */}
              <div
                className="absolute bottom-3 left-3 w-3 h-3 border-b border-l transition-opacity duration-300"
                style={{
                  borderColor: 'var(--color-primary)',
                  opacity: activeProject === project.id ? 0.4 : 0,
                }}
              />
              <div
                className="absolute bottom-3 right-3 w-3 h-3 border-b border-r transition-opacity duration-300"
                style={{
                  borderColor: 'var(--color-primary)',
                  opacity: activeProject === project.id ? 0.4 : 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
