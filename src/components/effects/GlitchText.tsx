'use client'

import { useState, useCallback, useEffect } from 'react'
import clsx from 'clsx'

interface GlitchTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  autoGlitch?: boolean
  glitchOnHover?: boolean
  intensity?: number
}

const GLITCH_CHARS =
  '!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()'

function scramble(text: string, progress: number): string {
  return text
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' '
      if (i < text.length * progress) return char
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
    })
    .join('')
}

export default function GlitchText({
  children,
  className,
  as: Tag = 'span',
  autoGlitch = false,
  glitchOnHover = true,
  intensity = 1,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)

  const triggerGlitch = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)

    let frame = 0
    const totalFrames = Math.floor(15 * intensity)

    const animate = () => {
      if (frame < totalFrames) {
        const progress = frame / totalFrames
        setDisplayText(scramble(children, progress))
        frame++
        requestAnimationFrame(animate)
      } else {
        setDisplayText(children)
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [children, isAnimating, intensity])

  useEffect(() => {
    setDisplayText(children)
  }, [children])

  useEffect(() => {
    if (!autoGlitch) return

    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        triggerGlitch()
      }
    }, 4000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [autoGlitch, triggerGlitch])

  return (
    <Tag
      className={clsx('relative inline-block', className)}
      onMouseEnter={glitchOnHover ? triggerGlitch : undefined}
      style={{
        textShadow: isAnimating
          ? `0 0 10px var(--color-primary), 2px 0 var(--color-secondary), -2px 0 var(--color-danger)`
          : undefined,
      }}
    >
      {displayText}
    </Tag>
  )
}
