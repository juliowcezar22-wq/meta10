import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Attempt = Database['public']['Tables']['attempts']['Row']
type User = Database['public']['Tables']['users']['Row']

export type AttemptWithUser = Attempt & {
  user: Pick<User, 'id' | 'nome' | 'email'> | null
}

export async function getAttemptsByListId(listId: string): Promise<AttemptWithUser[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('attempts')
    .select(`
      *,
      user:users(id, nome, email)
    `)
    .eq('list_id', listId)
    .not('finished_at', 'is', null)
    .order('finished_at', { ascending: false })
  
  if (error) {
    console.error('[getAttemptsByListId]', error)
    return []
  }
  return (data ?? []) as AttemptWithUser[]
}

export async function getAttemptsByUserId(userId: string): Promise<Attempt[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getAttemptsByUserId]', error)
    return []
  }
  return data ?? []
}

export async function getAttemptById(id: string): Promise<Attempt | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getAttemptById]', error)
    return null
  }
  return data
}

export interface StudentStats {
  exerciciosFeitos: number
  acertos: number
  erros: number
  horasEstudo: number
  desempenhoMedio: number  // percentual 0-100
}

export async function getStudentStats(userId: string): Promise<StudentStats> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('attempts')
    .select('score, total_questions, started_at, finished_at')
    .eq('user_id', userId)
    .not('finished_at', 'is', null)
  
  if (error || !data) {
    console.error('[getStudentStats]', error)
    return {
      exerciciosFeitos: 0,
      acertos: 0,
      erros: 0,
      horasEstudo: 0,
      desempenhoMedio: 0,
    }
  }
  
  const exerciciosFeitos = data.length
  const acertos = data.reduce((sum, a) => sum + (a.score ?? 0), 0)
  const totalQuestoes = data.reduce((sum, a) => sum + (a.total_questions ?? 0), 0)
  const erros = totalQuestoes - acertos
  
  // Horas de estudo: soma de (finished_at - started_at) em horas
  const milissegundosTotais = data.reduce((sum, a) => {
    if (!a.started_at || !a.finished_at) return sum
    const start = new Date(a.started_at).getTime()
    const end = new Date(a.finished_at).getTime()
    return sum + Math.max(0, end - start)
  }, 0)
  const horasEstudo = Math.round((milissegundosTotais / 1000 / 60 / 60) * 10) / 10  // 1 casa decimal
  
  const desempenhoMedio = totalQuestoes > 0 
    ? Math.round((acertos / totalQuestoes) * 100) 
    : 0
  
  return {
    exerciciosFeitos,
    acertos,
    erros,
    horasEstudo,
    desempenhoMedio,
  }
}
