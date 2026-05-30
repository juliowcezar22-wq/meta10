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
  MessageSquarePlus,
  X,
  UserX,
  ListChecks,
  FileText,
  Gamepad2,
  Network,
  BookmarkPlus
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  role?: string
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, enabled: true },
  { name: 'Usuários', href: '/admin/usuarios', icon: Users, enabled: true },
  { name: 'Professores', href: '/admin/professores', icon: GraduationCap, enabled: true },
  { name: 'Alunos Ativos', href: '/admin/alunos-ativos', icon: Users, enabled: true },
  { name: 'Alunos Inativos', href: '/admin/alunos-inativos', icon: UserX, enabled: true },
  { name: 'Mapas Mentais', href: '/admin/mapas-mentais', icon: Network, enabled: true },
  { name: 'Atividades em PDF', href: '/admin/atividades-pdf', icon: FileText, enabled: true },
  { name: 'Jogos Pedagógicos', href: '/admin/jogos-pedagogicos', icon: Gamepad2, enabled: true },
  { name: 'Questões', href: '/admin/questoes-avulsas', icon: ListChecks, enabled: true },
  { name: 'Simulados', href: '/admin/questoes', icon: HelpCircle, enabled: true },
  { name: 'Assuntos', href: '/admin/assuntos', icon: BookmarkPlus, enabled: true },
  { name: 'Resumos', href: '/admin/resumos', icon: BookOpen, enabled: true },
  { name: 'Loja', href: '/admin/produtos', icon: ShoppingBag, enabled: true },
  { name: 'Depoimentos', href: '/admin/depoimentos', icon: MessageSquareQuote, enabled: true },
  { name: 'Sugestões', href: '/admin/sugestoes', icon: MessageSquarePlus, enabled: true },
]

export function Sidebar({ isOpen, onClose, role }: SidebarProps) {
  const pathname = usePathname()

  const visibleNavItems = navItems.filter((item) => {
    if (role === 'professor') {
      return item.name === 'Simulados' || item.name === 'Questões' || item.name === 'Atividades em PDF' || item.name === 'Jogos Pedagógicos' || item.name === 'Mapas Mentais' || item.name === 'Resumos' || item.name === 'Assuntos'
    }
    return true
  })

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
          {visibleNavItems.map((item) => {
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
