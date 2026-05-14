'use client'

import { useState, useEffect } from 'react'
import { useServerStore } from '@/systems/store'
import GlitchText from '@/components/effects/GlitchText'
import clsx from 'clsx'

const NAV_ITEMS = [
  { label: 'ABOUT', href: '#about', command: 'about' },
  { label: 'SKILLS', href: '#skills', command: 'skills' },
  { label: 'PROJECTS', href: '#projects', command: 'projects' },
  { label: 'LOG', href: '#experience', command: 'log' },
  { label: 'CONNECT', href: '#contact', command: 'connect' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { activeSection } = useServerStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'py-3 border-b'
            : 'py-5'
        )}
        style={{
          backgroundColor: scrolled ? 'rgba(8, 9, 12, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottomColor: scrolled ? 'var(--color-border)' : 'transparent',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-sm tracking-widest cursor-none"
            style={{ color: 'var(--color-primary)' }}
          >
            <GlitchText glitchOnHover autoGlitch>
              [ECHO-7]
            </GlitchText>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={clsx(
                  'font-mono text-xs tracking-widest uppercase transition-colors duration-200 cursor-none',
                  activeSection === item.command
                    ? 'text-primary'
                    : 'hover:text-primary'
                )}
                style={{
                  color:
                    activeSection === item.command
                      ? 'var(--color-primary)'
                      : 'var(--color-text)',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 cursor-none p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={clsx(
                'block w-6 h-px transition-all duration-300',
                menuOpen ? 'rotate-45 translate-y-2' : ''
              )}
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <span
              className={clsx(
                'block w-6 h-px transition-all duration-300',
                menuOpen ? 'opacity-0' : ''
              )}
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <span
              className={clsx(
                'block w-6 h-px transition-all duration-300',
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              )}
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={clsx(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ backgroundColor: 'rgba(8, 9, 12, 0.98)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={clsx(
                'font-mono text-xl tracking-widest uppercase transition-all duration-200',
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              )}
              style={{
                color: 'var(--color-text-bright)',
                transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
              }}
            >
              <span style={{ color: 'var(--color-primary)' }}>{'// '}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
