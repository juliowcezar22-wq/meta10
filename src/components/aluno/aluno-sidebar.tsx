'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  FileText, 
  Map, 
  BookOpen,
  MessageSquarePlus,
  X,
  ListChecks,
  Gamepad2,
  FileEdit
} from 'lucide-react'

interface AlunoSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { name: 'Dashboard', href: '/aluno/dashboard', icon: LayoutDashboard },
  { name: 'Questões', href: '/aluno/questoes-avulsas', icon: ListChecks },
  { name: 'Atividades em PDF', href: '/aluno/atividades-pdf', icon: FileEdit },
  { name: 'Mapas Mentais', href: '/aluno/mapas-mentais', icon: Map },
  { name: 'Resumos', href: '/aluno/resumos', icon: BookOpen },
  { name: 'Jogos Pedagógicos', href: '/aluno/jogos-pedagogicos', icon: Gamepad2 },
  { name: 'Loja', href: '/aluno/loja', icon: ShoppingBag },
  { name: 'Sugestões', href: '/aluno/sugestoes', icon: MessageSquarePlus },
]

export function AlunoSidebar({ isOpen, onClose }: AlunoSidebarProps) {
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
          <Link href="/aluno/dashboard" className="flex items-center gap-2 group">
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
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

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
