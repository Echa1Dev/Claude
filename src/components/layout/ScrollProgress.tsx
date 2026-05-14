'use client'

import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <div
      className="fixed right-0 top-0 w-px z-50"
      style={{
        height: '100vh',
        backgroundColor: 'var(--color-border)',
      }}
      aria-hidden="true"
    >
      {/* Progress fill */}
      <div
        className="absolute top-0 left-0 w-full transition-none"
        style={{
          height: `${progress * 100}%`,
          background: 'linear-gradient(180deg, var(--color-primary), var(--color-secondary))',
          boxShadow: '0 0 8px var(--color-primary)',
        }}
      />

      {/* Marker dot */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
        style={{
          top: `calc(${progress * 100}% - 4px)`,
          backgroundColor: 'var(--color-primary)',
          boxShadow: '0 0 8px var(--color-primary)',
        }}
      />

      {/* Percentage label */}
      <div
        className="absolute right-4 font-mono text-xs"
        style={{
          top: `calc(${progress * 100}% - 8px)`,
          color: 'var(--color-primary)',
          opacity: progress > 0.05 ? 1 : 0,
          transition: 'opacity 0.3s',
          whiteSpace: 'nowrap',
        }}
      >
        {Math.round(progress * 100)}%
      </div>
    </div>
  )
}
