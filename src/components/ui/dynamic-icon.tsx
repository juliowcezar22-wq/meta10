import * as Icons from 'lucide-react'

interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  className?: string
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = (Icons as any)[name] || Icons.BookOpen

  return <IconComponent {...props} />
}
