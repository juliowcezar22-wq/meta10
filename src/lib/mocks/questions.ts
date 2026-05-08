import type { Question } from '@/lib/types/quiz'

const listIds = ['list-1', 'list-2', 'list-3', 'list-4', 'list-5', 'list-6']
const subjects = ['matematica', 'portugues', 'historia', 'geografia', 'ciencias', 'ingles'] as const

export const mockQuestions: Question[] = [
  ...Array.from({ length: 30 }).map((_, i) => {
    const listIndex = Math.floor(i / 5) // 6 lists, 5 questions each
    return {
      id: `q-${i+1}`,
      list_id: listIds[listIndex],
      enunciado: `Qual é a resposta correta para a questão de teste número ${i+1}? Considere os dados apresentados.`,
      alternativa_a: `Alternativa A da questão ${i+1}`,
      alternativa_b: `Alternativa B da questão ${i+1}`,
      alternativa_c: `Alternativa C da questão ${i+1}`,
      alternativa_d: `Alternativa D da questão ${i+1}`,
      alternativa_e: `Alternativa E da questão ${i+1}`,
      gabarito: ['a', 'b', 'c', 'd', 'e'][i % 5] as 'a'|'b'|'c'|'d'|'e',
      comentario: i % 2 === 0 ? `Comentário explicativo da questão ${i+1}. Aqui mostramos o passo a passo.` : null,
      subject: subjects[listIndex],
      difficulty: ['facil', 'medio', 'dificil'][i % 3] as 'facil'|'medio'|'dificil',
      created_at: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
  })
]
