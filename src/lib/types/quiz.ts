import type { Database } from '@/lib/supabase/types'

export type Subject =
  | 'matematica'
  | 'portugues'
  | 'historia'
  | 'geografia'
  | 'ciencias'
  | 'ingles'
  | 'fisica'
  | 'quimica'
  | 'biologia'
  | 'outros'

export type DifficultyLevel = Database['public']['Enums']['difficulty_level']

export type QuestionType = 'multipla_escolha' | 'verdadeiro_falso'

export interface Alternative {
  letra: string  // 'a', 'b', 'c', 'd', 'e'
  texto: string
}

export type Question = Database['public']['Tables']['questions']['Row']
