import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type StandaloneAnswer = Database['public']['Tables']['standalone_answers']['Row']
type Question = Database['public']['Tables']['questions']['Row']
type User = Database['public']['Tables']['users']['Row']

export type StandaloneAnswerWithDetails = StandaloneAnswer & {
  question: Pick<Question, 'id' | 'enunciado' | 'subject' | 'gabarito'> | null
  user: Pick<User, 'id' | 'nome' | 'email'> | null
}

export interface StudentStats {
  exerciciosFeitos: number
  acertos: number
  erros: number
  desempenhoMedio: number  // percentual 0-100
}

// ---- Estatísticas por questão (calculadas no Postgres, migration 0017) ----

export interface QuestionCollectiveStats {
  question_id: string
  total_attempts: number
  total_users: number
  correct_attempts: number
  correct_pct: number
  answer_distribution: Record<string, number> | null
}

export interface MyQuestionStats {
  question_id: string
  attempts: number
  correct: number
  wrong: number
  last_answer: string
  last_is_correct: boolean
}

// Estatística coletiva (todos os alunos) por questão
export async function getQuestionStats(questionIds?: string[]): Promise<Map<string, QuestionCollectiveStats>> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_question_stats', {
    p_question_ids: questionIds ?? null,
  })
  if (error) { console.error('[getQuestionStats]', error); return new Map() }
  return new Map((data ?? []).map(row => [row.question_id, row as QuestionCollectiveStats]))
}

// Estatística pessoal do usuário logado por questão
export async function getMyQuestionStats(questionIds?: string[]): Promise<Map<string, MyQuestionStats>> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_my_question_stats', {
    p_question_ids: questionIds ?? null,
  })
  if (error) { console.error('[getMyQuestionStats]', error); return new Map() }
  return new Map((data ?? []).map(row => [row.question_id, row as MyQuestionStats]))
}

// Quantas questões distintas o usuário já respondeu (limite do Gratuito)
export async function countMyAnsweredQuestions(): Promise<number> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('count_my_answered_questions')
  if (error) { console.error('[countMyAnsweredQuestions]', error); return 0 }
  return data ?? 0
}

// Estatísticas do aluno com base no Banco de Questões (standalone_answers)
export async function getStudentStats(userId: string): Promise<StudentStats> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('standalone_answers')
    .select('is_correct')
    .eq('user_id', userId)

  if (error || !data) {
    console.error('[getStudentStats]', error)
    return { exerciciosFeitos: 0, acertos: 0, erros: 0, desempenhoMedio: 0 }
  }

  const exerciciosFeitos = data.length
  const acertos = data.filter(a => a.is_correct).length
  const erros = exerciciosFeitos - acertos
  const desempenhoMedio = exerciciosFeitos > 0
    ? Math.round((acertos / exerciciosFeitos) * 100)
    : 0

  return { exerciciosFeitos, acertos, erros, desempenhoMedio }
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
