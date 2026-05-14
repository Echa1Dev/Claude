'use client'

import { useState, useEffect, useRef } from 'react'

interface ParallaxState {
  offsetY: number
  ref: React.RefObject<HTMLDivElement>
}

export function useParallax(speed: number = 0.5): ParallaxState {
  const [offsetY, setOffsetY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.scrollY
      const elementTop = scrolled + rect.top
      const relativeScroll = scrolled - elementTop
      setOffsetY(relativeScroll * speed)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return { offsetY, ref }
}
