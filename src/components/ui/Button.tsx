import React from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'outline' | 'ghost' | 'accent'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  external?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  /**
   * Solid caramel — primary CTA.
   * Use once per screen (e.g. "Order your piece").
   */
  primary:
    'bg-caramel-500 text-brown-900 hover:bg-caramel-400 border border-caramel-500 hover:border-caramel-400',

  /**
   * Outlined cream — secondary action on dark backgrounds.
   * Matches the "Book an Appointment" style in the reference image.
   */
  outline:
    'bg-transparent text-cream-200 border border-cream-400 hover:border-caramel-500 hover:text-caramel-500',

  /**
   * Ghost — minimal, used in nav or on light backgrounds.
   */
  ghost:
    'bg-transparent text-foreground-muted hover:text-foreground border border-transparent',

  /**
   * Accent outline — caramel border, used on dark cards.
   */
  accent:
    'bg-transparent text-caramel-500 border border-caramel-500 hover:bg-caramel-500 hover:text-brown-900',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-6 py-3.5 text-[10px] tracking-[0.15em] font-semibold',
  md: 'px-9 py-4.5 text-xs tracking-[0.18em] font-semibold',
  lg: 'px-14 py-7.5 text-sm tracking-[0.2em] font-semibold',
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-body font-medium uppercase transition-colors duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500 disabled:opacity-40 disabled:cursor-not-allowed'

export function Button({
  variant = 'outline',
  size = 'md',
  href,
  external = false,
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...(props as any)}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...(props as any)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(props as any)}>
      {children}
    </button>
  )
}