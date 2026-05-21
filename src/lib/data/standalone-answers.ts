import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type StandaloneAnswer = Database['public']['Tables']['standalone_answers']['Row']
type Question = Database['public']['Tables']['questions']['Row']
type User = Database['public']['Tables']['users']['Row']

export type StandaloneAnswerWithDetails = StandaloneAnswer & {
  question: Pick<Question, 'id' | 'enunciado' | 'subject' | 'gabarito'> | null
  user: Pick<User, 'id' | 'nome' | 'email'> | null
}

// Respostas avulsas de um aluno
export async function getMyStandaloneAnswers(userId: string): Promise<StandaloneAnswer[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('standalone_answers')
    .select('*')
    .eq('user_id', userId)
  if (error) { console.error('[getMyStandaloneAnswers]', error); return [] }
  return data ?? []
}

// Admin: todas as respostas avulsas com detalhes (aluno + questão)
export async function getAllStandaloneAnswers(): Promise<StandaloneAnswerWithDetails[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('standalone_answers')
    .select(`
      *,
      question:questions(id, enunciado, subject, gabarito),
      user:users(id, nome, email)
    `)
    .order('answered_at', { ascending: false })
  if (error) { console.error('[getAllStandaloneAnswers]', error); return [] }
  return (data ?? []) as StandaloneAnswerWithDetails[]
}

export async function getStandaloneAnswersByQuestion(questionId: string): Promise<StandaloneAnswerWithDetails[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('standalone_answers')
    .select(`
      *,
      question:questions(id, enunciado, subject, gabarito),
      user:users(id, nome, email)
    `)
    .eq('question_id', questionId)
    .order('answered_at', { ascending: false })
  if (error) { console.error('[getStandaloneAnswersByQuestion]', error); return [] }
  return (data ?? []) as StandaloneAnswerWithDetails[]
}
