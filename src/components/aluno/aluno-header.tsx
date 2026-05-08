'use client'

import { Menu } from 'lucide-react'
import { UserDropdown } from '../admin/user-dropdown'

interface AlunoHeaderProps {
  nome: string
  email: string
  title?: string
  onMenuClick: () => void
}

export function AlunoHeader({ nome, email, title, onMenuClick }: AlunoHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-surface-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-surface-700 hover:text-surface-900 focus:outline-none"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-surface-900 hidden md:block">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center">
        <UserDropdown nome={nome} email={email} />
      </div>
    </header>
  )
}
