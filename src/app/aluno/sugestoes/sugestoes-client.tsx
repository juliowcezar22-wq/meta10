'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSuggestion } from '@/app/actions/aluno/suggestions'
import { useToast } from '@/components/admin/toast'

interface SugestoesClientProps {
  suggestions: any[] // Database['public']['Tables']['suggestions']['Row'][]
}

export function SugestoesClient({ suggestions }: SugestoesClientProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (content.length < 10) {
      toast('A sugestão deve ter no mínimo 10 caracteres', 'error')
      return
    }

    if (content.length > 2000) {
      toast('A sugestão não pode ultrapassar 2000 caracteres', 'error')
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('content', content)

    try {
      const result = await createSuggestion(formData)
      if (result.success) {
        toast('Sugestão enviada com sucesso!', 'success')
        setContent('')
        router.refresh()
      } else {
        const errorMsg = (result.errors as any)?._form?.[0] || 'Erro ao enviar sugestão'
        toast(errorMsg, 'error')
      }
    } catch (error) {
      toast('Erro inesperado', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Sugestões</h1>
        <p className="text-surface-400">Compartilhe ideias para melhorar a plataforma</p>
      </div>

      <div className="bg-surface-800 rounded-xl p-6 border border-white/5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sua sugestão aqui..."
              className="w-full bg-surface-900 border border-white/10 rounded-lg p-4 text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
            />
            <div className="flex justify-end mt-1 text-xs text-surface-400">
              {content.length}/2000
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || content.length < 10 || content.length > 2000}
            className="btn-primary w-full sm:w-auto"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Sugestão'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Minhas sugestões enviadas</h3>
        
        {suggestions.length === 0 ? (
          <p className="text-surface-400">Você ainda não enviou nenhuma sugestão.</p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-surface-800 rounded-xl p-4 border border-white/5">
                <div className="text-sm text-surface-400 mb-2">
                  {new Date(suggestion.created_at).toLocaleDateString('pt-BR')}
                </div>
                <p className="text-white whitespace-pre-wrap">{suggestion.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
