import type { QuestionList, QuestionListItem } from '@/lib/types/quiz'
import { mockQuestions } from './questions'

export const mockQuestionLists: QuestionList[] = [
  {
    id: 'list-1',
    name: 'Expressão Numérica - Matemática',
    description: 'Lista de exercícios sobre expressões numéricas.',
    subject: 'matematica',
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'list-2',
    name: 'Interpretação de Texto - Português',
    description: 'Lista de exercícios sobre interpretação de texto.',
    subject: 'portugues',
    is_active: true,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'list-3',
    name: 'Brasil Colônia - História',
    description: 'Questões sobre o período colonial do Brasil.',
    subject: 'historia',
    is_active: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'list-4',
    name: 'Relevo e Hidrografia - Geografia',
    description: 'Questões de relevo e hidrografia.',
    subject: 'geografia',
    is_active: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'list-5',
    name: 'Sistema Solar - Ciências',
    description: 'Tudo sobre planetas e o sistema solar.',
    subject: 'ciencias',
    is_active: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'list-6',
    name: 'Verbos Irregulares - Inglês',
    description: 'Treino de verbos irregulares no passado.',
    subject: 'ingles',
    is_active: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export const mockQuestionListItems: QuestionListItem[] = []

mockQuestionLists.filter(s => s.is_active).forEach((list) => {
  const selectedQuestions = mockQuestions.filter(q => q.list_id === list.id)
  selectedQuestions.forEach((q, index) => {
    mockQuestionListItems.push({
      id: `sq-${list.id}-${q.id}`,
      list_id: list.id,
      question_id: q.id,
      ordem: index + 1
    })
  })
})
