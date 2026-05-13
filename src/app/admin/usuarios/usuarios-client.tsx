'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { PageHeader } from '@/components/admin/page-header'
import { Settings, X } from 'lucide-react'
import { updateRole, assignPlan } from '@/app/actions/admin/users'
import type { Database } from '@/lib/supabase/types'

// We need to type initialData based on what getUsers() returns, but since we don't have the exact complex type here, we'll use any or a simplified type.
type Plan = Database['public']['Tables']['plans']['Row']
type User = any // since users data has nested subscription and plan 

export function UsuariosClient({ initialData, initialPlans, currentUserId }: { initialData: User[], initialPlans: Plan[], currentUserId: string }) {
  const router = useRouter()
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Role Form
  const [roleForm, setRoleForm] = useState({ role: 'aluno' })
  const [isSavingRole, setIsSavingRole] = useState(false)

  // Plan Form
  const [planForm, setPlanForm] = useState({
    planId: '',
    status: 'active',
    expiresAt: ''
  })
  const [isSavingPlan, setIsSavingPlan] = useState(false)

  const openModal = (user: User) => {
    setEditingUser(user)
    
    // Role form initial state
    setRoleForm({ role: user.role })
    
    // Plan form initial state
    const sub = user.subscription
    let defaultExpiresAt = ''
    if (sub?.expires_at) {
      // Input date requires YYYY-MM-DD
      const d = new Date(sub.expires_at)
      if (!isNaN(d.getTime())) {
        defaultExpiresAt = d.toISOString().split('T')[0]
      }
    } else {
      // Default to 1 year from now if no plan
      const d = new Date()
      d.setFullYear(d.getFullYear() + 1)
      defaultExpiresAt = d.toISOString().split('T')[0]
    }

    setPlanForm({
      planId: sub?.plan_id || (initialPlans.length > 0 ? initialPlans[0].id : ''),
      status: sub?.status || 'active',
      expiresAt: defaultExpiresAt
    })
    
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setIsSavingRole(true)
    const data = new FormData()
    data.append('role', roleForm.role)

    const result = await updateRole(editingUser.id, data)
    setIsSavingRole(false)

    if (result.success) {
      alert('Role atualizada com sucesso!')
      router.refresh()
    } else {
      alert('Erro ao atualizar role')
    }
  }

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setIsSavingPlan(true)
    const data = new FormData()
    data.append('planId', planForm.planId)
    data.append('status', planForm.status)
    data.append('expiresAt', planForm.expiresAt)

    const result = await assignPlan(editingUser.id, data)
    setIsSavingPlan(false)

    if (result.success) {
      alert('Plano atualizado com sucesso!')
      router.refresh()
    } else {
      alert('Erro ao atualizar plano')
    }
  }

  const formattedUsers = initialData.map(user => ({
    ...user,
    roleNode: (
      <Badge variant={user.role === 'admin' ? 'purple' : user.role === 'professor' ? 'cyan' : 'gray'}>
        {user.role}
      </Badge>
    ),
    planNode: user.subscription?.plan?.name || 'Nenhum',
    statusNode: user.subscription?.status ? (
      <Badge variant={user.subscription.status === 'active' ? 'success' : 'danger'}>
        {user.subscription.status === 'active' ? 'Ativo' : 'Expirado'}
      </Badge>
    ) : '-',
    actionsNode: (
      <button 
        onClick={() => openModal(user)}
        className="px-3 py-1.5 text-xs font-medium text-surface-600 hover:text-primary bg-surface-50 hover:bg-primary/5 border border-surface-200 rounded-lg transition-colors flex items-center gap-1.5"
      >
        <Settings className="w-3.5 h-3.5" />
        Gerenciar acesso
      </button>
    )
  }))

  const isCurrentUser = editingUser?.id === currentUserId

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Usuários" 
        description="Gerencie os usuários e assinaturas da plataforma."
      />
      
      <DataTable 
        data={formattedUsers}
        searchKey="nome"
        searchPlaceholder="Buscar por nome..."
        columns={[
          { header: 'Nome', accessor: 'nome' },
          { header: 'Email', accessor: 'email' },
          { header: 'Tipo', accessor: 'roleNode' },
          { header: 'Plano Atual', accessor: 'planNode' },
          { header: 'Status', accessor: 'statusNode' },
          { header: 'Ações', accessor: 'actionsNode' }
        ]}
      />

      {/* Modal de Gerenciamento */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="bg-white rounded-2xl w-full max-w-xl relative z-10 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-surface-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-surface-900">
                  Gerenciar Acesso
                </h2>
                <p className="text-sm text-surface-500 mt-1">
                  Editando: <span className="font-medium text-surface-900">{editingUser.nome}</span> ({editingUser.email})
                </p>
              </div>
              <button type="button" onClick={closeModal} className="text-surface-400 hover:text-surface-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
              
              {/* Seção 1: Permissão de Acesso */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-surface-800 border-b border-surface-100 pb-2">Permissão de Acesso</h3>
                <form onSubmit={handleSaveRole} className="flex flex-col gap-4">
                  <div className="relative group">
                    <label className="block text-sm font-medium text-surface-700 mb-1">Nível de Acesso (Role)</label>
                    <select 
                      value={roleForm.role}
                      onChange={(e) => setRoleForm({ role: e.target.value })}
                      disabled={isCurrentUser}
                      className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="aluno">Aluno</option>
                      <option value="professor">Professor</option>
                      <option value="admin">Admin</option>
                    </select>
                    {isCurrentUser && (
                      <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-max max-w-xs bg-surface-800 text-white text-xs px-3 py-1.5 rounded shadow-lg z-10">
                        Você não pode alterar seu próprio nível de acesso.
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isSavingRole || isCurrentUser} className="btn-primary py-1.5 px-4 text-sm disabled:opacity-50">
                      {isSavingRole ? 'Salvando...' : 'Salvar role'}
                    </button>
                  </div>
                </form>
              </section>

              {/* Seção 2: Plano e Assinatura */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-surface-800 border-b border-surface-100 pb-2">Plano e Assinatura</h3>
                <form onSubmit={handleSavePlan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Plano</label>
                    <select 
                      value={planForm.planId}
                      onChange={(e) => setPlanForm({ ...planForm, planId: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    >
                      <option value="" disabled>Selecione um plano...</option>
                      {initialPlans.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.duration_months} meses)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">Status da Assinatura</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="status" 
                          value="active"
                          checked={planForm.status === 'active'}
                          onChange={(e) => setPlanForm({ ...planForm, status: e.target.value })}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-surface-700">Ativo</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="status" 
                          value="cancelled"
                          checked={planForm.status === 'cancelled'}
                          onChange={(e) => setPlanForm({ ...planForm, status: e.target.value })}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-surface-700">Cancelado</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="status" 
                          value="expired"
                          checked={planForm.status === 'expired'}
                          onChange={(e) => setPlanForm({ ...planForm, status: e.target.value })}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-surface-700">Expirado</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Data de Expiração</label>
                    <input 
                      type="date" 
                      value={planForm.expiresAt}
                      onChange={(e) => setPlanForm({ ...planForm, expiresAt: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={isSavingPlan} className="btn-primary py-1.5 px-4 text-sm disabled:opacity-50">
                      {isSavingPlan ? 'Salvando...' : 'Salvar plano'}
                    </button>
                  </div>
                </form>
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
