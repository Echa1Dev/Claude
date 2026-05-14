'use client'

import clsx from 'clsx'

interface SectionLabelProps {
  label: string
  className?: string
  number?: string
}

export default function SectionLabel({ label, className, number }: SectionLabelProps) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      {number && (
        <span
          className="font-mono text-xs"
          style={{ color: 'var(--color-text)' }}
        >
          {number}
        </span>
      )}
      <span
        className="font-mono text-xs tracking-[0.3em] uppercase"
        style={{ color: 'var(--color-primary)' }}
      >
        {'// '}{label}
      </span>
      <div
        className="flex-1 h-px"
        style={{
          background: 'linear-gradient(90deg, rgba(0,255,157,0.3), transparent)',
        }}
      />
    </div>
  )
}
