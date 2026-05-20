'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteSuggestion } from '@/app/actions/admin/suggestions'
import { useToast } from '@/components/admin/toast'
import { PageHeader } from '@/components/admin/page-header'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import type { SuggestionWithUser } from '@/lib/data/suggestions'
import { Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface SugestoesAdminClientProps {
  suggestions: SuggestionWithUser[]
}

export function SugestoesAdminClient({ suggestions }: SugestoesAdminClientProps) {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [suggestionToDelete, setSuggestionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()

  const filteredSuggestions = suggestions.filter((suggestion) => {
    const searchLower = search.toLowerCase()
    return (
      suggestion.content.toLowerCase().includes(searchLower) ||
      suggestion.user?.nome?.toLowerCase().includes(searchLower) ||
      suggestion.user?.email?.toLowerCase().includes(searchLower)
    )
  })

  const handleDelete = async () => {
    if (!suggestionToDelete) return
    
    setIsDeleting(true)
    try {
      const result = await deleteSuggestion(suggestionToDelete)
      if (result.success) {
        toast('Sugestão excluída', 'success')
        router.refresh()
      } else {
        const errorMsg = (result.errors as any)?._form?.[0] || 'Erro ao excluir sugestão'
        toast(errorMsg, 'error')
      }
    } catch (error) {
      toast('Erro inesperado ao excluir', 'error')
    } finally {
      setIsDeleting(false)
      setSuggestionToDelete(null)
      setExpandedId(null)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
      <PageHeader 
        title="Sugestões dos Alunos" 
        description="Veja todas as sugestões enviadas pelos alunos" 
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
        <input
          type="text"
          placeholder="Buscar por nome, email ou conteúdo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {filteredSuggestions.length === 0 ? (
        <div className="bg-surface-800 rounded-xl p-8 text-center border border-white/5">
          <p className="text-surface-400">Nenhuma sugestão encontrada.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => {
            const isExpanded = expandedId === suggestion.id
            
            return (
              <div 
                key={suggestion.id} 
                className="bg-surface-800 rounded-xl overflow-hidden border border-white/5 transition-colors hover:border-white/10"
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : suggestion.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-medium">
                        {suggestion.user?.nome || 'Usuário Desconhecido'}
                      </h4>
                      <p className="text-sm text-surface-400">
                        {suggestion.user?.email || 'Sem email'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-surface-400">
                      {new Date(suggestion.created_at).toLocaleString('pt-BR')}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                  
                  <div className={`text-surface-300 ${isExpanded ? 'whitespace-pre-wrap mt-4' : 'line-clamp-2'}`}>
                    {suggestion.content}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 py-3 bg-surface-900/50 border-t border-white/5 flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setSuggestionToDelete(suggestion.id)}
                      className="px-4 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50 hover:text-danger-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!suggestionToDelete}
        onClose={() => setSuggestionToDelete(null)}
        onConfirm={handleDelete}
        title="Excluir Sugestão"
        description="Tem certeza que deseja excluir esta sugestão? Esta ação não pode ser desfeita."
        isLoading={isDeleting}
      />
    </div>
  )
}
