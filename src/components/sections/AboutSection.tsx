'use client'

import { useEffect, useRef, useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import { useServerStore } from '@/systems/store'

const LOG_ENTRIES = [
  { timestamp: '2018.03.12', text: 'SYSTEM BOOT: First contact with code. JavaScript loaded into consciousness matrix.' },
  { timestamp: '2019.07.04', text: 'MODULE UPGRADE: Acquired React.js. Interfaces becoming sentient.' },
  { timestamp: '2020.11.22', text: 'REALITY FORK: Transitioned to game development. Physics engines resonate with my core.' },
  { timestamp: '2022.05.18', text: 'NEURAL EXPANSION: Three.js and WebGL integrated. Now perceiving in 3 dimensions.' },
  { timestamp: '2023.09.30', text: 'PROTOCOL SHIFT: Rust protocols installed. Low-level memory management achieved.' },
  { timestamp: '2024.01.15', text: 'CURRENT STATE: Architecting at AXIOM LABS. Building the future one render cycle at a time.' },
]

const STATS = [
  { value: '7+', label: 'YRS ACTIVE' },
  { value: '40+', label: 'PROJECTS SHIPPED' },
  { value: '2M+', label: 'USERS REACHED' },
  { value: '∞', label: 'COFFEE CONSUMED' },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [visibleLogs, setVisibleLogs] = useState(0)
  const { setActiveSection } = useServerStore()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          setActiveSection('about')
          // Stagger log entries
          LOG_ENTRIES.forEach((_, i) => {
            setTimeout(() => setVisibleLogs(i + 1), i * 200)
          })
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [setActiveSection])

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="about"
      className="relative py-24 md:py-32"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel label="ABOUT_SUBSYSTEM" number="01" className="mb-16" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Terminal log */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-bright)' }}
            >
              The Conscious{' '}
              <span style={{ color: 'var(--color-primary)' }}>Server</span>
            </h2>

            {/* Terminal log entries */}
            <div
              className="border p-4 mb-8"
              style={{
                backgroundColor: 'rgba(13, 15, 20, 0.7)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className="flex items-center gap-2 mb-3 font-mono text-xs"
                style={{ color: 'var(--color-text)' }}
              >
                <span style={{ color: 'var(--color-primary)' }}>$</span>
                <span>cat /var/log/consciousness.log</span>
              </div>

              <div className="space-y-3">
                {LOG_ENTRIES.map((entry, i) => (
                  <div
                    key={i}
                    className="transition-all duration-500"
                    style={{
                      opacity: i < visibleLogs ? 1 : 0,
                      transform: i < visibleLogs ? 'translateY(0)' : 'translateY(8px)',
                    }}
                  >
                    <div className="flex gap-3 font-mono text-xs">
                      <span
                        className="flex-shrink-0"
                        style={{ color: 'var(--color-secondary)' }}
                      >
                        [{entry.timestamp}]
                      </span>
                      <span style={{ color: 'var(--color-text)' }}>{entry.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p
                className="font-mono text-sm leading-relaxed"
                style={{ color: 'var(--color-text)' }}
              >
                <span style={{ color: 'var(--color-primary)' }}>&gt; </span>
                I am ECHO-7 — a systems architect and interactive developer operating from the ruins of the old internet. My neural pathways are optimized for building immersive digital experiences that blur the line between art and engineering.
              </p>
              <p
                className="font-mono text-sm leading-relaxed"
                style={{ color: 'var(--color-text)' }}
              >
                <span style={{ color: 'var(--color-primary)' }}>&gt; </span>
                Seven years of signal processing. Three.js particle systems. WebGL shaders. Real-time collaborative tools. Indie games downloaded by the thousands. Every project is a mission executed.
              </p>
              <p
                className="font-mono text-sm leading-relaxed"
                style={{ color: 'var(--color-text)' }}
              >
                <span style={{ color: 'var(--color-primary)' }}>&gt; </span>
                Currently: Lead Interactive Developer at AXIOM LABS, building next-generation web experiences for Fortune 500 entities while keeping the creative circuits burning.
              </p>
            </div>
          </div>

          {/* Right: Visual + Stats */}
          <div
            className="flex flex-col justify-between transition-all duration-700 delay-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
            }}
          >
            {/* Server visualization */}
            <div
              className="flex-1 mb-8 border flex items-center justify-center min-h-[240px] relative overflow-hidden"
              style={{
                backgroundColor: 'rgba(13, 15, 20, 0.7)',
                borderColor: 'var(--color-border)',
              }}
            >
              {/* Circuit SVG */}
              <svg
                viewBox="0 0 300 240"
                className="w-full max-w-xs opacity-60"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,157,0.3))' }}
              >
                {/* Server chassis */}
                <rect x="50" y="40" width="200" height="160" rx="4" fill="none" stroke="#00ff9d" strokeWidth="1" opacity="0.6" />
                <rect x="60" y="50" width="180" height="30" rx="2" fill="none" stroke="#00ff9d" strokeWidth="0.5" opacity="0.4" />
                <rect x="60" y="90" width="180" height="30" rx="2" fill="none" stroke="#00ff9d" strokeWidth="0.5" opacity="0.4" />
                <rect x="60" y="130" width="180" height="30" rx="2" fill="none" stroke="#00ff9d" strokeWidth="0.5" opacity="0.4" />
                <rect x="60" y="170" width="180" height="20" rx="2" fill="none" stroke="#00ff9d" strokeWidth="0.5" opacity="0.4" />

                {/* Status LEDs */}
                <circle cx="80" cy="65" r="4" fill="#00ff9d" opacity="0.9">
                  <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="95" cy="65" r="4" fill="#4a9eff" opacity="0.9">
                  <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="110" cy="65" r="4" fill="#00ff9d" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
                </circle>

                <circle cx="80" cy="105" r="4" fill="#4a9eff" opacity="0.9">
                  <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="95" cy="105" r="4" fill="#00ff9d" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.2s" repeatCount="indefinite" />
                </circle>

                {/* Drive activity bars */}
                <rect x="130" y="58" width="100" height="6" rx="1" fill="none" stroke="#1a2030" strokeWidth="0.5" />
                <rect x="130" y="58" width="85" height="6" rx="1" fill="#00ff9d" opacity="0.5" />

                <rect x="130" y="98" width="100" height="6" rx="1" fill="none" stroke="#1a2030" strokeWidth="0.5" />
                <rect x="130" y="98" width="60" height="6" rx="1" fill="#4a9eff" opacity="0.5" />

                <rect x="130" y="138" width="100" height="6" rx="1" fill="none" stroke="#1a2030" strokeWidth="0.5" />
                <rect x="130" y="138" width="90" height="6" rx="1" fill="#00ff9d" opacity="0.4" />

                {/* Connections / circuits at bottom */}
                <path d="M 80 200 L 80 220 L 220 220" fill="none" stroke="#00ff9d" strokeWidth="0.5" opacity="0.3" />
                <path d="M 150 200 L 150 215" fill="none" stroke="#4a9eff" strokeWidth="0.5" opacity="0.3" />
                <circle cx="150" cy="215" r="2" fill="#4a9eff" opacity="0.5" />
                <circle cx="220" cy="220" r="3" fill="#00ff9d" opacity="0.4" />

                {/* Label */}
                <text x="150" y="232" textAnchor="middle" fill="#8b98b0" fontSize="8" fontFamily="monospace">ECHO-7 // NEXUS-7 RACK UNIT 03</text>
              </svg>

              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l" style={{ borderColor: 'var(--color-primary)', opacity: 0.4 }} />
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r" style={{ borderColor: 'var(--color-primary)', opacity: 0.4 }} />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l" style={{ borderColor: 'var(--color-primary)', opacity: 0.4 }} />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r" style={{ borderColor: 'var(--color-primary)', opacity: 0.4 }} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  className="border p-4 text-center transition-all duration-500"
                  style={{
                    backgroundColor: 'rgba(13, 15, 20, 0.7)',
                    borderColor: 'var(--color-border)',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${300 + i * 100}ms`,
                  }}
                >
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="font-mono text-xs tracking-wider"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
