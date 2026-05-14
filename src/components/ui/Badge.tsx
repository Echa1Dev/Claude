'use client'

import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'dim'
  className?: string
}

export default function Badge({ children, variant = 'dim', className }: BadgeProps) {
  const variantStyles = {
    primary: 'text-primary border-primary/30 bg-primary/5',
    secondary: 'text-secondary border-secondary/30 bg-secondary/5',
    danger: 'text-danger border-danger/30 bg-danger/5',
    dim: 'text-text-dim border-border bg-surface/50',
  }

  return (
    <span
      className={clsx(
        'inline-block font-mono text-xs px-2 py-0.5 border tracking-wider',
        variantStyles[variant],
        className
      )}
      style={{
        color:
          variant === 'primary'
            ? 'var(--color-primary)'
            : variant === 'secondary'
            ? 'var(--color-secondary)'
            : variant === 'danger'
            ? 'var(--color-danger)'
            : 'var(--color-text)',
        borderColor:
          variant === 'primary'
            ? 'rgba(0,255,157,0.3)'
            : variant === 'secondary'
            ? 'rgba(74,158,255,0.3)'
            : variant === 'danger'
            ? 'rgba(255,60,0,0.3)'
            : 'var(--color-border)',
        backgroundColor:
          variant === 'primary'
            ? 'rgba(0,255,157,0.05)'
            : variant === 'secondary'
            ? 'rgba(74,158,255,0.05)'
            : variant === 'danger'
            ? 'rgba(255,60,0,0.05)'
            : 'var(--color-surface)',
      }}
    >
      {children}
    </span>
  )
}
