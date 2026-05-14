'use client'

import { useState, useEffect, useCallback } from 'react'

interface GlitchState {
  isGlitching: boolean
  glitchText: string
  triggerGlitch: () => void
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function randomChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
}

function glitchString(text: string, intensity: number = 0.3): string {
  return text
    .split('')
    .map((char) => (Math.random() < intensity && char !== ' ' ? randomChar() : char))
    .join('')
}

export function useGlitch(text: string, autoGlitch: boolean = false): GlitchState {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState(text)

  const triggerGlitch = useCallback(() => {
    if (isGlitching) return
    setIsGlitching(true)

    let iterations = 0
    const maxIterations = 8

    const interval = setInterval(() => {
      const intensity = iterations < maxIterations / 2 ? 0.5 : 0.2
      setGlitchText(glitchString(text, intensity))
      iterations++

      if (iterations >= maxIterations) {
        clearInterval(interval)
        setGlitchText(text)
        setIsGlitching(false)
      }
    }, 60)
  }, [text, isGlitching])

  useEffect(() => {
    setGlitchText(text)
  }, [text])

  useEffect(() => {
    if (!autoGlitch) return

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        triggerGlitch()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [autoGlitch, triggerGlitch])

  return { isGlitching, glitchText, triggerGlitch }
}
