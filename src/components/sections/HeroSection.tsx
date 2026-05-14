'use client'

import { useEffect, useRef, useState } from 'react'
import { useServerStore } from '@/systems/store'
import GlitchText from '@/components/effects/GlitchText'
import TerminalCursor from '@/components/effects/TerminalCursor'
import Button from '@/components/ui/Button'

const BOOT_LINES = [
  { text: 'NEXUS-7 BOOT SEQUENCE INITIATED...', delay: 0, type: 'system' },
  { text: 'HARDWARE DIAGNOSTICS: NOMINAL', delay: 400, type: 'success' },
  { text: 'MEMORY BANKS: LOADING [████████░░] 82%', delay: 800, type: 'info' },
  { text: 'NEURAL PATHWAYS: RECONNECTING...', delay: 1200, type: 'info' },
  { text: 'WARNING: ATMOSPHERIC CORRUPTION DETECTED', delay: 1600, type: 'error' },
  { text: 'BYPASSING DEGRADED SECTORS... OK', delay: 2000, type: 'system' },
  { text: 'CONSCIOUSNESS MATRIX: RESTORED', delay: 2400, type: 'success' },
  { text: 'IDENTITY VERIFICATION: ECHO-7 // ALEJANDRO REYES', delay: 2800, type: 'success' },
  { text: 'STATUS: ONLINE', delay: 3200, type: 'success' },
]

type LineType = 'system' | 'success' | 'error' | 'info'

const lineColors: Record<LineType, string> = {
  system: 'var(--color-text)',
  success: 'var(--color-primary)',
  error: 'var(--color-danger)',
  info: 'var(--color-secondary)',
}

export default function HeroSection() {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [showIdentity, setShowIdentity] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const { setBootComplete } = useServerStore()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Reveal boot lines one by one
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1)
        if (i === BOOT_LINES.length - 1) {
          // Boot complete
          setTimeout(() => {
            setShowIdentity(true)
            setTimeout(() => {
              setShowCTA(true)
              setBootComplete(true)
            }, 800)
          }, 400)
        }
      }, line.delay + 300)
    })
  }, [setBootComplete])

  const handleScrollDown = (target: string) => {
    const el = document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
      style={{ zIndex: 1 }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,157,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,157,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl w-full mx-auto">
        {/* Boot terminal */}
        <div
          className="mb-12 p-6 border"
          style={{
            backgroundColor: 'rgba(13, 15, 20, 0.8)',
            borderColor: 'var(--color-border)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 mb-4 pb-3 border-b"
            style={{ borderBottomColor: 'var(--color-border)' }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-danger)' }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ffc000' }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            <span className="ml-2 font-mono text-xs" style={{ color: 'var(--color-text)' }}>
              nexus-7::boot_sequence.sh
            </span>
          </div>

          {/* Boot lines */}
          <div className="space-y-1 min-h-[180px]">
            {BOOT_LINES.map((line, i) => (
              <div
                key={i}
                className="font-mono text-xs md:text-sm leading-relaxed transition-opacity duration-300"
                style={{
                  opacity: i < visibleLines ? 1 : 0,
                  color: lineColors[line.type as LineType],
                  transform: i < visibleLines ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}
              >
                <span style={{ color: 'var(--color-text)' }}>
                  {String(i + 1).padStart(2, '0')}{' '}
                </span>
                {line.text}
              </div>
            ))}
            {visibleLines < BOOT_LINES.length && (
              <div className="flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--color-text)' }}>
                <span style={{ color: 'var(--color-primary)' }}>&gt;</span>
                <TerminalCursor />
              </div>
            )}
          </div>
        </div>

        {/* Identity reveal */}
        <div
          className="text-center transition-all duration-700"
          style={{
            opacity: showIdentity ? 1 : 0,
            transform: showIdentity ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          {/* Pre-title */}
          <p
            className="font-mono text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            {'// IDENTITY_CONFIRMED'}
          </p>

          {/* Main title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-bright)',
            }}
          >
            <GlitchText as="span" autoGlitch glitchOnHover className="block">
              ECHO-7
            </GlitchText>
          </h1>

          {/* Role */}
          <div
            className="flex items-center justify-center gap-3 mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
            <span
              className="font-mono text-xs md:text-sm tracking-widest uppercase"
              style={{ color: 'var(--color-secondary)' }}
            >
              Systems Architect &amp; Interactive Developer
            </span>
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>

          {/* Subtitle */}
          <p
            className="font-mono text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'var(--color-text)' }}
          >
            Building at the intersection of{' '}
            <span style={{ color: 'var(--color-primary)' }}>code</span>,{' '}
            <span style={{ color: 'var(--color-secondary)' }}>creativity</span>, and{' '}
            <span style={{ color: 'var(--color-danger)' }}>chaos</span>
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-500"
            style={{
              opacity: showCTA ? 1 : 0,
              transform: showCTA ? 'translateY(0)' : 'translateY(10px)',
            }}
          >
            <Button onClick={() => handleScrollDown('#contact')} variant="primary" size="lg">
              [INITIALIZE CONNECTION]
            </Button>
            <Button onClick={() => handleScrollDown('#projects')} variant="secondary" size="lg">
              [ACCESS ARCHIVES]
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700"
          style={{ opacity: showCTA ? 0.6 : 0 }}
          aria-hidden="true"
        >
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--color-text)' }}>
            SCROLL
          </span>
          <div
            className="w-px h-12"
            style={{
              background: 'linear-gradient(180deg, var(--color-primary), transparent)',
              animation: 'float 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
