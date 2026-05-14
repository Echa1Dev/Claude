'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

interface ProgressBarProps {
  value: number // 0-100
  label?: string
  className?: string
  animated?: boolean
  color?: 'primary' | 'secondary'
}

export default function ProgressBar({
  value,
  label,
  className,
  animated = true,
  color = 'primary',
}: ProgressBarProps) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!animated) {
      setWidth(value)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1200
          const start = performance.now()

          const animateWidth = (timestamp: number) => {
            const elapsed = timestamp - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // cubic ease out
            setWidth(eased * value)

            if (progress < 1) {
              requestAnimationFrame(animateWidth)
            }
          }

          requestAnimationFrame(animateWidth)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, animated])

  const barColor = color === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)'

  return (
    <div ref={ref} className={clsx('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span
            className="font-mono text-xs tracking-wider"
            style={{ color: 'var(--color-text-bright)' }}
          >
            {label}
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: barColor }}
          >
            {Math.round(width)}%
          </span>
        </div>
      )}
      <div
        className="relative h-1 w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-border)' }}
      >
        <div
          className="absolute left-0 top-0 h-full transition-none"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
        />
        {/* Glow dot at end */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
          style={{
            left: `calc(${width}% - 2px)`,
            backgroundColor: barColor,
            boxShadow: `0 0 6px ${barColor}`,
          }}
        />
      </div>
    </div>
  )
}
