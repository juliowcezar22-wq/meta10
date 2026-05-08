import type { Attempt } from '@/lib/types/quiz'

const userIds = ['user-1', 'user-2', 'user-3', 'user-4']
const listIds = ['list-1', 'list-2', 'list-3', 'list-4', 'list-5', 'list-6']

export const mockAttempts: Attempt[] = [
  ...Array.from({ length: 20 }).map((_, i) => {
    const listId = listIds[i % 6]
    const userId = userIds[i % 4]
    return {
      id: `attempt-${i+1}`,
      user_id: userId,
      list_id: listId,
      started_at: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      finished_at: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
      answers: {
        'q-1': 'a',
        'q-2': 'b',
      } as Record<string, 'a' | 'b' | 'c' | 'd' | 'e'>,
      score: Math.floor(Math.random() * 6), // 0 to 5
      total_questions: 5,
      created_at: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
    }
  })
]
