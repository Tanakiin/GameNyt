import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost'
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'default' && 'bg-white !text-black hover:bg-neutral-200',
        variant === 'outline' && 'border border-neutral-800 bg-transparent text-white hover:border-neutral-600',
        variant === 'ghost' && 'bg-transparent text-neutral-300 hover:bg-neutral-900 hover:text-white',
        className
      )}
      {...props}
    />
  )
}