'use client'

import { useEffect, useRef, useState } from 'react'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import TerminalCursor from '@/components/effects/TerminalCursor'
import { useServerStore } from '@/systems/store'
import { narrativeEvents, EVENTS } from '@/systems/events'

const SOCIAL_LINKS = [
  { label: 'GITHUB_LINK', href: 'https://github.com', icon: '⌥' },
  { label: 'NETWORK_NODE', href: 'https://linkedin.com', icon: '⬡' },
  { label: 'SIGNAL_FEED', href: 'https://twitter.com', icon: '◈' },
]

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [formState, setFormState] = useState({
    sender: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitLines, setSubmitLines] = useState<string[]>([])
  const { setActiveSection, establishConnection, connectionEstablished } = useServerStore()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          setActiveSection('connect')
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [setActiveSection])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || isSubmitted) return

    narrativeEvents.emit(EVENTS.CONNECTION_ATTEMPT)
    setIsSubmitting(true)

    const lines = [
      'INITIATING SECURE CHANNEL...',
      `SENDER_ID: ${formState.sender}`,
      'ENCRYPTING PAYLOAD...',
      'ROUTING THROUGH NEXUS-7 RELAY...',
      'HANDSHAKE ESTABLISHED',
      'MESSAGE TRANSMITTED SUCCESSFULLY',
      'CONNECTION: ACKNOWLEDGED',
    ]

    for (let i = 0; i < lines.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300 + i * 200))
      setSubmitLines((prev) => [...prev, lines[i]])
    }

    setIsSubmitting(false)
    setIsSubmitted(true)
    establishConnection()
    narrativeEvents.emit(EVENTS.CONNECTION_SUCCESS)
    setFormState({ sender: '', subject: '', message: '' })
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-section="connect"
      className="relative py-24 md:py-32"
      style={{ zIndex: 1 }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(0,255,157,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel label="ESTABLISH_CONNECTION" number="05" className="mb-4" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-bright)' }}
          >
            Open{' '}
            <span style={{ color: 'var(--color-primary)' }}>Channel</span>
          </h2>
          <div
            className="flex items-center gap-2 font-mono text-xs"
            style={{ color: 'var(--color-text)' }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: connectionEstablished
                  ? 'var(--color-primary)'
                  : 'var(--color-primary)',
                boxShadow: '0 0 6px var(--color-primary)',
                animation: 'blink 2s ease-in-out infinite',
              }}
            />
            <span style={{ color: 'var(--color-primary)' }}>SERVER STATUS: ONLINE</span>
            <span>|</span>
            <span>RESPONSE TIME: &lt; 24H</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
            }}
          >
            {isSubmitted ? (
              /* Success state */
              <div
                className="border p-6 h-full"
                style={{
                  backgroundColor: 'rgba(13, 15, 20, 0.7)',
                  borderColor: 'rgba(0,255,157,0.3)',
                }}
              >
                <div
                  className="font-mono text-xs mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  nexus-7::transmission.log
                </div>
                <div className="space-y-1">
                  {submitLines.map((line, i) => (
                    <div
                      key={i}
                      className="font-mono text-xs"
                      style={{
                        color:
                          i === submitLines.length - 1
                            ? 'var(--color-primary)'
                            : 'var(--color-text)',
                      }}
                    >
                      <span style={{ color: 'var(--color-primary)' }}>&gt; </span>
                      {line}
                    </div>
                  ))}
                  <div className="flex items-center gap-1 font-mono text-xs mt-4" style={{ color: 'var(--color-primary)' }}>
                    <span>&gt;</span>
                    <span>AWAITING RESPONSE</span>
                    <TerminalCursor />
                  </div>
                </div>
              </div>
            ) : (
              /* Form */
              <form
                onSubmit={handleSubmit}
                className="border p-6"
                style={{
                  backgroundColor: 'rgba(13, 15, 20, 0.7)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {/* Terminal header */}
                <div
                  className="flex items-center gap-2 mb-6 pb-4 border-b font-mono text-xs"
                  style={{
                    borderBottomColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  <span style={{ color: 'var(--color-primary)' }}>$</span>
                  <span>establish_connection --secure --encrypt</span>
                  <TerminalCursor />
                </div>

                <div className="space-y-6">
                  {/* Sender ID */}
                  <div>
                    <label
                      className="block font-mono text-xs mb-2"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      &gt; SENDER_ID:
                    </label>
                    <input
                      type="text"
                      value={formState.sender}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, sender: e.target.value }))
                      }
                      placeholder="your.name@domain.com"
                      required
                      className="terminal-input"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      className="block font-mono text-xs mb-2"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      &gt; TRANSMISSION_SUBJECT:
                    </label>
                    <input
                      type="text"
                      value={formState.subject}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, subject: e.target.value }))
                      }
                      placeholder="Mission briefing..."
                      required
                      className="terminal-input"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      className="block font-mono text-xs mb-2"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      &gt; MESSAGE_PAYLOAD:
                    </label>
                    <textarea
                      value={formState.message}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="Transmit your message to ECHO-7..."
                      required
                      rows={4}
                      className="terminal-textarea"
                    />
                  </div>

                  {isSubmitting && (
                    <div className="space-y-1">
                      {submitLines.map((line, i) => (
                        <div
                          key={i}
                          className="font-mono text-xs"
                          style={{ color: 'var(--color-text)' }}
                        >
                          <span style={{ color: 'var(--color-primary)' }}>&gt; </span>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full">
                    {isSubmitting ? '[TRANSMITTING...]' : '[TRANSMIT]'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right side info */}
          <div
            className="flex flex-col justify-between transition-all duration-700 delay-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
            }}
          >
            {/* Intro text */}
            <div className="mb-8">
              <p
                className="font-mono text-sm leading-relaxed mb-4"
                style={{ color: 'var(--color-text)' }}
              >
                <span style={{ color: 'var(--color-primary)' }}>&gt; </span>
                ECHO-7 is currently accepting new mission briefings. Whether you have a project that needs an interactive developer, a creative tool that needs engineering, or just want to talk about the intersection of code and art — transmit your signal.
              </p>
              <p
                className="font-mono text-sm leading-relaxed"
                style={{ color: 'var(--color-text)' }}
              >
                <span style={{ color: 'var(--color-primary)' }}>&gt; </span>
                Based on planet Earth. Operating across all time zones. Fluent in TypeScript, Three.js, and the language of interesting problems.
              </p>
            </div>

            {/* Social links */}
            <div>
              <p
                className="font-mono text-xs mb-4 tracking-widest"
                style={{ color: 'var(--color-text)' }}
              >
                {'// EXTERNAL_NODES'}
              </p>
              <div className="space-y-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group cursor-none"
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center border transition-all duration-200"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    >
                      {link.icon}
                    </div>
                    <span
                      className="font-mono text-sm tracking-wider transition-colors duration-200"
                      style={{ color: 'var(--color-text)' }}
                    >
                      [{link.label}]
                    </span>
                    <span
                      className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      →
                    </span>
                  </a>
                ))}
              </div>

              {/* System info */}
              <div
                className="mt-8 pt-6 border-t font-mono text-xs space-y-1"
                style={{ borderTopColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <div>
                  <span style={{ color: 'var(--color-secondary)' }}>SYSTEM: </span>
                  ECHO-7 v7.0.2
                </div>
                <div>
                  <span style={{ color: 'var(--color-secondary)' }}>UPTIME: </span>
                  7 YEARS, 3 MONTHS
                </div>
                <div>
                  <span style={{ color: 'var(--color-secondary)' }}>LOCATION: </span>
                  EARTH // SECTOR 7G
                </div>
                <div>
                  <span style={{ color: 'var(--color-secondary)' }}>STATUS: </span>
                  <span style={{ color: 'var(--color-primary)' }}>OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-24 border-t pt-8"
        style={{ borderTopColor: 'var(--color-border)' }}
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="font-mono text-xs"
            style={{ color: 'var(--color-text)' }}
          >
            © 2024 ECHO-7 // ALEJANDRO REYES. ALL RIGHTS RESERVED.
          </p>
          <p
            className="font-mono text-xs"
            style={{ color: 'var(--color-text)' }}
          >
            BUILT WITH{' '}
            <span style={{ color: 'var(--color-primary)' }}>NEXT.JS</span> +{' '}
            <span style={{ color: 'var(--color-secondary)' }}>THREE.JS</span> +{' '}
            <span style={{ color: 'var(--color-primary)' }}>LOVE</span>
          </p>
        </div>
      </div>
    </section>
  )
}
