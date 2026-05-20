import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

// TODO: type assertion temporário antes da regen dos tipos
type Suggestion = any // Database['public']['Tables']['suggestions']['Row']
type User = Database['public']['Tables']['users']['Row']

export type SuggestionWithUser = Suggestion & {
  user: Pick<User, 'id' | 'nome' | 'email'> | null
}

// Para o aluno: lista APENAS as suas próprias sugestões
export async function getMySuggestions(userId: string): Promise<Suggestion[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    // TODO: remover as any após regen dos tipos
    .from('suggestions' as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getMySuggestions]', error)
    return []
  }
  return data ?? []
}

// Para o admin: lista todas as sugestões com nome do aluno
export async function getAllSuggestions(): Promise<SuggestionWithUser[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    // TODO: remover as any após regen dos tipos
    .from('suggestions' as any)
    .select(`
      *,
      user:users(id, nome, email)
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getAllSuggestions]', error)
    return []
  }
  return (data ?? []) as SuggestionWithUser[]
}
