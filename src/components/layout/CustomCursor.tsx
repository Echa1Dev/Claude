'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    setIsVisible(true)

    let rafId: number
    let cursorX = 0
    let cursorY = 0
    let dotX = 0
    let dotY = 0
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dotX = e.clientX
      dotY = e.clientY
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.matches('a, button, input, textarea, [role="button"], label') ||
        target.closest('a, button, [role="button"]') !== null
      setIsPointer(isInteractive)
    }

    const animate = () => {
      // Smooth follow for outer ring
      cursorX += (mouseX - cursorX) * 0.12
      cursorY += (mouseY - cursorY) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 2}px, ${dotY - 2}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] transition-[width,height,opacity] duration-200"
        style={{
          width: isPointer ? '40px' : '32px',
          height: isPointer ? '40px' : '32px',
          border: '1px solid var(--color-primary)',
          borderRadius: '50%',
          opacity: 0.7,
          mixBlendMode: 'normal',
          willChange: 'transform',
        }}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          width: '4px',
          height: '4px',
          backgroundColor: 'var(--color-primary)',
          borderRadius: '50%',
          boxShadow: '0 0 6px var(--color-primary)',
          willChange: 'transform',
        }}
      />
    </>
  )
}
