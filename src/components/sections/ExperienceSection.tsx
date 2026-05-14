'use client'

import { useEffect, useRef, useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import Badge from '@/components/ui/Badge'
import { experience } from '@/data/experience'
import { useServerStore } from '@/systems/store'

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const { setActiveSection } = useServerStore()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          setActiveSection('log')
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
      id="experience"
      data-section="log"
      className="relative py-24 md:py-32"
      style={{ zIndex: 1 }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,157,0.03) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel label="OPERATION_LOG" number="04" className="mb-4" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-bright)' }}
          >
            Mission{' '}
            <span style={{ color: 'var(--color-primary)' }}>History</span>
          </h2>
          <p className="font-mono text-xs" style={{ color: 'var(--color-text)' }}>
            {experience.length} OPERATIONS LOGGED // 2018 — PRESENT
          </p>
        </div>

        <div className="relative">
          {/* Timeline vertical line */}
          <div
            className="absolute left-0 md:left-8 top-0 bottom-0 w-px"
            style={{
              background: `linear-gradient(180deg, var(--color-primary), var(--color-secondary), transparent)`,
              opacity: isVisible ? 0.4 : 0,
              transition: 'opacity 1s ease 0.3s',
            }}
          />

          <div className="space-y-8 md:space-y-12">
            {experience.map((item, index) => (
              <div
                key={item.id}
                className="relative pl-8 md:pl-24 transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* Timeline node */}
                <div
                  className="absolute left-[-5px] md:left-[27px] top-6 w-3 h-3 rounded-full border-2 transition-all duration-300 cursor-none"
                  style={{
                    borderColor:
                      activeItem === item.id
                        ? 'var(--color-primary)'
                        : item.endYear === null
                        ? 'var(--color-primary)'
                        : 'var(--color-secondary)',
                    backgroundColor:
                      activeItem === item.id
                        ? 'var(--color-primary)'
                        : 'var(--color-bg)',
                    boxShadow:
                      item.endYear === null
                        ? '0 0 10px var(--color-primary)'
                        : activeItem === item.id
                        ? '0 0 8px var(--color-primary)'
                        : 'none',
                  }}
                  onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
                />

                {/* Content card */}
                <div
                  className="border p-5 md:p-6 transition-all duration-300 cursor-none"
                  style={{
                    backgroundColor: 'rgba(13, 15, 20, 0.7)',
                    borderColor:
                      activeItem === item.id
                        ? 'rgba(0,255,157,0.3)'
                        : 'var(--color-border)',
                    boxShadow:
                      activeItem === item.id
                        ? '0 0 20px rgba(0,255,157,0.06)'
                        : 'none',
                  }}
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                    <div>
                      {/* Period */}
                      <span
                        className="inline-block font-mono text-xs tracking-widest mb-2"
                        style={{
                          color:
                            item.endYear === null
                              ? 'var(--color-primary)'
                              : 'var(--color-secondary)',
                        }}
                      >
                        [{item.period}]
                      </span>

                      {/* Title */}
                      <h3
                        className="text-lg md:text-xl font-bold mb-1"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-text-bright)',
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* Company */}
                      <p
                        className="font-mono text-sm"
                        style={{ color: 'var(--color-text)' }}
                      >
                        @ {item.company}
                      </p>
                    </div>

                    {item.endYear === null && (
                      <div
                        className="flex items-center gap-2 px-3 py-1 border font-mono text-xs tracking-wider flex-shrink-0"
                        style={{
                          borderColor: 'rgba(0,255,157,0.3)',
                          backgroundColor: 'rgba(0,255,157,0.05)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-primary)',
                            animation: 'blink 1s step-end infinite',
                          }}
                        />
                        ACTIVE
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p
                    className="font-mono text-sm leading-relaxed mb-4"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {item.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-4">
                    {item.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex gap-2 font-mono text-xs leading-relaxed"
                        style={{ color: 'var(--color-text)' }}
                      >
                        <span style={{ color: 'var(--color-primary)', flexShrink: 0 }}>▸</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    {item.tech.map((tech) => (
                      <Badge key={tech} variant="dim">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
