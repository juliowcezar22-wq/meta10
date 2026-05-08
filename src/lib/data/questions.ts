import { mockQuestions } from '@/lib/mocks/questions'
import type { Question } from '@/lib/types/quiz'

export async function getQuestionsByListId(listId: string): Promise<Question[]> {
  return mockQuestions.filter(q => q.list_id === listId)
}

export async function getQuestionById(id: string): Promise<Question | null> {
  return mockQuestions.find(q => q.id === id) ?? null
}
