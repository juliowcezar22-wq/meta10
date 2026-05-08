import { mockQuestionLists, mockQuestionListItems } from '@/lib/mocks/question-lists'
import { mockAttempts } from '@/lib/mocks/attempts'
import type { QuestionList, QuestionListItem, Attempt } from '@/lib/types/quiz'

export async function getQuestionLists(): Promise<QuestionList[]> {
  return mockQuestionLists
}

export async function getQuestionListById(id: string): Promise<QuestionList | null> {
  return mockQuestionLists.find(s => s.id === id) ?? null
}

export async function getQuestionsByListId(listId: string): Promise<QuestionListItem[]> {
  return mockQuestionListItems.filter(sq => sq.list_id === listId)
}

export async function getAttemptsByListId(listId: string): Promise<(Attempt & { user_name: string })[]> {
  const attempts = mockAttempts.filter(a => a.list_id === listId)
  return attempts.map(a => ({
    ...a,
    user_name: `Aluno ${a.user_id}`
  }))
}
