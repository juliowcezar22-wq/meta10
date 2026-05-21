'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { AdminHeader } from './admin-header'

interface AdminShellProps {
  children: React.ReactNode
  nome: string
  email: string
  role: string
}

export function AdminShell({ children, nome, email, role }: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-surface-900 flex flex-col md:flex-row">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role={role} />
      
      <div className="flex-1 flex flex-col md:ml-[260px] min-h-screen min-w-0">
        <AdminHeader 
          nome={nome} 
          email={email} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        {children}
      </div>
    </div>
  )
}
