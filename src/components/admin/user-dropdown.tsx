'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'

interface UserDropdownProps {
  nome: string
  email: string
}

export function UserDropdown({ nome, email }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const initial = nome ? nome.charAt(0).toUpperCase() : 'U'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#089FA8] text-white font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu do usuário"
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#0B0F19] border border-white/10 shadow-2xl rounded-xl overflow-hidden z-50">
          <div className="p-4 border-b border-white/10">
            <p className="font-semibold text-white truncate">{nome}</p>
            <p className="text-sm text-surface-400 truncate mt-0.5">{email}</p>
          </div>
          <div className="p-2">
            <button
              onClick={() => logoutAction()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-white/5 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
