'use client'

import clsx from 'clsx'

interface TerminalCursorProps {
  className?: string
  color?: 'primary' | 'secondary'
}

export default function TerminalCursor({ className, color = 'primary' }: TerminalCursorProps) {
  return (
    <span
      className={clsx('inline-block w-2 h-4 animate-blink', className)}
      style={{
        backgroundColor: color === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)',
        verticalAlign: 'middle',
        marginLeft: '2px',
      }}
      aria-hidden="true"
    />
  )
}
