'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Mail, Trash2, CheckCircle, Search, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { markAsRead, deleteMessage } from '@/app/actions/admin/messages'
import type { Database } from '@/lib/supabase/types'

type Message = Database['public']['Tables']['messages']['Row']

export function MensagensClient({ initialData }: { initialData: Message[] }) {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMarking, setIsMarking] = useState<string | null>(null)

  const filteredMessages = search 
    ? initialData.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase()) || 
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        (m.subject && m.subject.toLowerCase().includes(search.toLowerCase()))
      )
    : initialData

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteMessage(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
    if (expandedId === deleteId) setExpandedId(null)
  }

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMarking(id)
    await markAsRead(id)
    setIsMarking(null)
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
      <PageHeader 
        title="Mensagens (Leads)" 
        description="Acompanhe os contatos recebidos pelo site."
      />

      <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-200 flex items-center justify-between gap-4 bg-surface-50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome, email ou assunto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Inbox List */}
        <div className="divide-y divide-surface-100">
          {filteredMessages.length === 0 ? (
            <div className="px-6 py-12 text-center text-surface-500">
              Nenhuma mensagem encontrada.
            </div>
          ) : (
            filteredMessages.map((m) => {
              const isExpanded = expandedId === m.id
              const isRead = m.is_read

              return (
                <div key={m.id} className="flex flex-col">
                  {/* Row header */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : m.id)}
                    className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-surface-50 ${isRead ? 'bg-white text-surface-600' : 'bg-surface-50/50 font-medium text-surface-900'}`}
                  >
                    <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3 truncate">
                        <span className="truncate block">{m.name}</span>
                        <span className={`text-xs truncate block ${isRead ? 'text-surface-400' : 'text-surface-500'}`}>{m.email}</span>
                      </div>
                      <div className="col-span-6 truncate">
                        <span className="truncate block">{m.subject || '(Sem assunto)'}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className={`text-xs flex items-center justify-end gap-1 ${isRead ? 'text-surface-400' : 'text-surface-500'}`}>
                          <Clock className="w-3 h-3" />
                          {new Date(m.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-surface-400" /> : <ChevronDown className="w-5 h-5 text-surface-400" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 py-6 bg-surface-50/30 border-t border-surface-100 text-sm">
                      <div className="max-w-3xl">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-bold text-surface-900 mb-1">{m.subject || '(Sem assunto)'}</h3>
                            <p className="text-surface-500 text-xs">
                              De: <span className="font-medium text-surface-700">{m.name}</span> &lt;{m.email}&gt;
                            </p>
                          </div>
                          <Badge variant={m.is_read ? 'gray' : 'warning'}>
                            {m.is_read ? 'Lida' : 'Não lida'}
                          </Badge>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl border border-surface-200 text-surface-700 whitespace-pre-wrap mb-6 shadow-sm">
                          {m.message}
                        </div>

                        <div className="flex items-center gap-3">
                          {!m.is_read && (
                            <button 
                              onClick={(e) => handleMarkAsRead(m.id, e)}
                              disabled={isMarking === m.id}
                              className="px-4 py-2 text-sm font-medium text-surface-700 bg-white border border-surface-200 hover:bg-surface-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {isMarking === m.id ? 'Marcando...' : 'Marcar como Lida'}
                            </button>
                          )}
                          
                          <div className="flex-1" />
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); setDeleteId(m.id); }}
                            className="px-4 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Mensagem"
        description="Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        isLoading={isDeleting}
      />
    </div>
  )
}
