'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ShoppingBag, 
  MessageSquareQuote, 
  Mail,
  HelpCircle,
  GraduationCap,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, enabled: true },
  { name: 'Usuários', href: '/admin/usuarios', icon: Users, enabled: true },
  { name: 'Conteúdo', href: '/admin/conteudo', icon: BookOpen, enabled: true },
  { name: 'Produtos', href: '/admin/produtos', icon: ShoppingBag, enabled: true },
  { name: 'Depoimentos', href: '/admin/depoimentos', icon: MessageSquareQuote, enabled: true },
  { name: 'Mensagens', href: '/admin/mensagens', icon: Mail, enabled: true },
  { name: 'Questões', href: '/admin/questoes', icon: HelpCircle, enabled: true },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0B0F19] border-r border-white/10 
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2 group">
            <Image src="/logomarca-meta10.png" alt="Meta 10" width={160} height={32} className="h-8 w-auto object-contain" priority />
          </Link>
          <button 
            className="md:hidden text-surface-400 hover:text-white"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (!item.enabled) {
              return (
                <div 
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 opacity-50 cursor-not-allowed hover:bg-white/5 transition-colors relative group"
                  title="Em breve"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </div>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors overflow-hidden
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-surface-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />}
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
