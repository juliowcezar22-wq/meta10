import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'primary' | 'cyan' | 'purple' | 'success' | 'danger' | 'blue'
}

const variants = {
  primary: 'bg-primary-50 text-primary-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  purple: 'bg-purple-50 text-purple-600',
  success: 'bg-success-50 text-success-600',
  danger: 'bg-danger-50 text-danger-600',
  blue: 'bg-blue-50 text-blue-600'
}

export function StatsCard({ label, value, icon: Icon, trend, variant = 'primary' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-surface-500 font-medium text-sm mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-surface-900">{value}</h3>
          
          {trend && (
            <div className={`mt-2 flex items-center text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-danger-600'}`}>
              <span className="mr-1">{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-surface-400 font-normal ml-1">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${variants[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
