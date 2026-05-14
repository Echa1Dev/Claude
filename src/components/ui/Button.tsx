'use client'

import { useState } from 'react'
import clsx from 'clsx'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  target?: string
  rel?: string
}

export default function Button({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  type = 'button',
  target,
  rel,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const baseStyles =
    'relative inline-flex items-center justify-center font-mono tracking-widest uppercase transition-all duration-200 cursor-none select-none'

  const sizeStyles = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
  }

  const variantStyles = {
    primary: clsx(
      'border text-primary',
      isHovered
        ? 'bg-primary text-bg border-primary shadow-[0_0_20px_rgba(0,255,157,0.4)]'
        : 'bg-transparent border-primary/50 hover:border-primary'
    ),
    secondary: clsx(
      'border text-secondary',
      isHovered
        ? 'bg-secondary text-bg border-secondary shadow-[0_0_20px_rgba(74,158,255,0.4)]'
        : 'bg-transparent border-secondary/50 hover:border-secondary'
    ),
    ghost: clsx(
      'border text-text-bright',
      isHovered
        ? 'border-border text-primary bg-surface'
        : 'bg-transparent border-transparent'
    ),
  }

  const style: React.CSSProperties = {
    color: variant === 'primary' && isHovered ? 'var(--color-bg)' : undefined,
    backgroundColor: variant === 'primary' && isHovered ? 'var(--color-primary)' : undefined,
  }

  const commonProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    className: clsx(baseStyles, sizeStyles[size], variantStyles[variant], className),
    style,
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...commonProps}>
        <span className="relative z-10">{children}</span>
        {variant === 'primary' && (
          <span
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(0,255,157,0.05) 50%)' }}
          />
        )}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} {...commonProps}>
      <span className="relative z-10">{children}</span>
    </button>
  )
}
