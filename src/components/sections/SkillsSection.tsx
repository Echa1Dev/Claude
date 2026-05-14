'use client'

import { useEffect, useRef, useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { skillGroups } from '@/data/skills'
import { useServerStore } from '@/systems/store'

const CATEGORY_ICONS: Record<string, string> = {
  FRONTEND_SYSTEMS: '⬡',
  BACKEND_PROTOCOLS: '⬢',
  CREATIVE_ENGINES: '◈',
  INFRASTRUCTURE: '⬡',
}

const CATEGORY_COLORS: Record<string, string> = {
  FRONTEND_SYSTEMS: 'var(--color-primary)',
  BACKEND_PROTOCOLS: 'var(--color-secondary)',
  CREATIVE_ENGINES: '#c084fc',
  INFRASTRUCTURE: 'var(--color-danger)',
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { setActiveSection } = useServerStore()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          setActiveSection('skills')
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [setActiveSection])

  return (
    <section
      ref={sectionRef}
      id="skills"
      data-section="skills"
      className="relative py-24 md:py-32"
      style={{ zIndex: 1 }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 0% 50%, rgba(0,255,157,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel label="CAPABILITY_MATRIX" number="02" className="mb-4" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-bright)' }}
          >
            System{' '}
            <span style={{ color: 'var(--color-primary)' }}>Capabilities</span>
          </h2>
          <p
            className="font-mono text-xs"
            style={{ color: 'var(--color-text)' }}
          >
            PROFICIENCY_LEVELS: MEASURED IN OPERATIONAL CYCLES
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillGroups.map((group, groupIndex) => (
            <div
              key={group.id}
              className="border p-6 relative overflow-hidden transition-all duration-700 card-sci-fi"
              style={{
                backgroundColor: 'rgba(13, 15, 20, 0.7)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${groupIndex * 100}ms`,
              }}
            >
              {/* Corner accent */}
              <div
                className="absolute top-0 left-0 w-8 h-8"
                style={{
                  background: `linear-gradient(135deg, ${CATEGORY_COLORS[group.id]}20 0%, transparent 100%)`,
                }}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: CATEGORY_COLORS[group.id] }}>
                      {CATEGORY_ICONS[group.id]}
                    </span>
                    <h3
                      className="font-mono text-sm font-bold tracking-wider"
                      style={{ color: CATEGORY_COLORS[group.id] }}
                    >
                      {group.label}
                    </h3>
                  </div>
                  <p
                    className="font-mono text-xs"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {group.description}
                  </p>
                </div>
                <Badge variant={
                  group.id === 'FRONTEND_SYSTEMS' ? 'primary' :
                  group.id === 'BACKEND_PROTOCOLS' ? 'secondary' :
                  'dim'
                }>
                  {group.skills.length} MODULES
                </Badge>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                {group.skills.map((skill) => (
                  <ProgressBar
                    key={skill.name}
                    label={skill.name}
                    value={skill.level}
                    color={
                      group.id === 'FRONTEND_SYSTEMS' || group.id === 'INFRASTRUCTURE'
                        ? 'primary'
                        : 'secondary'
                    }
                    animated
                  />
                ))}
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, ${CATEGORY_COLORS[group.id]}40, transparent)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Additional tech badges */}
        <div
          className="mt-12 transition-all duration-700 delay-500"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <p
            className="font-mono text-xs mb-4 tracking-wider"
            style={{ color: 'var(--color-text)' }}
          >
            {'>'} ADDITIONAL_PROTOCOLS //
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Git', 'Linux', 'Nginx', 'Jest', 'Playwright',
              'Figma', 'Blender', 'MongoDB', 'Prisma', 'tRPC',
              'Vite', 'Webpack', 'Socket.io', 'OpenAI API', 'Stripe',
            ].map((tech) => (
              <Badge key={tech} variant="dim">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
