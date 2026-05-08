interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'gray' | 'cyan' | 'purple'
  className?: string
}

const variants = {
  primary: 'bg-primary-50 text-primary-700 ring-1 ring-primary-600/20',
  success: 'bg-success-50 text-success-700 ring-1 ring-success-600/20',
  danger: 'bg-danger-50 text-danger-700 ring-1 ring-danger-600/20',
  warning: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20',
  gray: 'bg-surface-50 text-surface-700 ring-1 ring-surface-600/20',
  cyan: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/20',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
}

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
