'use client'

import { useState } from 'react'
import { AlunoSidebar } from './aluno-sidebar'
import { AlunoHeader } from './aluno-header'

interface AlunoShellProps {
  children: React.ReactNode
  nome: string
  email: string
}

export function AlunoShell({ children, nome, email }: AlunoShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-surface-900 flex flex-col md:flex-row">
      <AlunoSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:ml-[260px] min-h-screen min-w-0">
        <AlunoHeader 
          nome={nome} 
          email={email} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        {children}
      </div>
    </div>
  )
}
