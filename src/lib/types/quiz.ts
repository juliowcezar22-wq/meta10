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

export type DifficultyLevel = 'facil' | 'medio' | 'dificil'

export interface QuestionList {
  id: string
  name: string
  description?: string
  subject: Subject
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  list_id: string
  enunciado: string
  alternativa_a: string
  alternativa_b: string
  alternativa_c: string
  alternativa_d: string
  alternativa_e: string
  gabarito: 'a' | 'b' | 'c' | 'd' | 'e'
  comentario: string | null
  subject: Subject
  difficulty: DifficultyLevel
  created_at: string
  updated_at: string
}

export interface QuestionListItem {
  id: string
  list_id: string
  question_id: string
  ordem: number
}

export interface Attempt {
  id: string
  user_id: string
  list_id: string
  started_at: string
  finished_at: string | null
  answers: Record<string, 'a' | 'b' | 'c' | 'd' | 'e'>
  score: number | null
  total_questions: number | null
  created_at: string
}
