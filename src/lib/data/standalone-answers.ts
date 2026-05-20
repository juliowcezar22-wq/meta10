import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

// TODO: regenerar tipos (standalone_answers não existe ainda em Database)
type StandaloneAnswer = {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  is_correct: boolean;
  answered_at: string;
}
// type StandaloneAnswer = Database['public']['Tables']['standalone_answers']['Row']

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
    .from('standalone_answers' as any)
    .select('*')
    .eq('user_id', userId)
  if (error) { console.error('[getMyStandaloneAnswers]', error); return [] }
  return (data ?? []) as unknown as StandaloneAnswer[]
}

// Admin: todas as respostas avulsas com detalhes (aluno + questão)
export async function getAllStandaloneAnswers(): Promise<StandaloneAnswerWithDetails[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('standalone_answers' as any)
    .select(`
      *,
      question:questions(id, enunciado, subject, gabarito),
      user:users(id, nome, email)
    `)
    .order('answered_at', { ascending: false })
  if (error) { console.error('[getAllStandaloneAnswers]', error); return [] }
  return (data ?? []) as unknown as StandaloneAnswerWithDetails[]
}
