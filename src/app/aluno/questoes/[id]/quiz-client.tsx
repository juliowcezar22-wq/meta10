'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, BookOpen } from 'lucide-react'
import type { QuestionList, Question } from '@/lib/types/quiz'

export function QuizClient({ list, questions }: { list: QuestionList, questions: Question[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [mode, setMode] = useState<'quiz' | 'result'>('quiz')

  const question = questions[currentIndex]

  const handleNext = () => {
    if (!selectedOption) return

    // Save answer
    setAnswers(prev => ({ ...prev, [question.id]: selectedOption }))

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
    } else {
      setMode('result')
    }
  }

  if (mode === 'result') {
    let score = 0
    questions.forEach(q => {
      if (answers[q.id] === q.gabarito) score++
    })
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-screen bg-surface-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-surface-900 mb-2">Lista Concluída!</h2>
            <p className="text-surface-500 mb-6">{list.name}</p>
            
            <div className="bg-surface-50 rounded-xl p-6 mb-8 border border-surface-200 inline-block px-12">
              <p className="text-4xl font-extrabold text-primary mb-2">{percentage}%</p>
              <p className="text-surface-600 font-medium">Você acertou {score} de {questions.length} questões</p>
            </div>

            <div className="flex justify-center">
              <Link href="/aluno/questoes" className="btn-primary">
                Voltar para Questões
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-surface-900 mb-4">Gabarito e Comentários</h3>
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id]
              const isCorrect = userAnswer === q.gabarito

              const opts = [
                { val: 'a', text: q.alternativa_a },
                { val: 'b', text: q.alternativa_b },
                { val: 'c', text: q.alternativa_c },
                { val: 'd', text: q.alternativa_d },
                { val: 'e', text: q.alternativa_e },
              ]

              return (
                <div key={q.id} className="card p-6 border-l-4 overflow-hidden" style={{ borderLeftColor: isCorrect ? '#22c55e' : '#ef4444' }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="mt-1">
                      {isCorrect ? <CheckCircle className="text-success-500 w-6 h-6" /> : <XCircle className="text-danger-500 w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-surface-500 mb-1">Questão {idx + 1}</p>
                      <p className="text-surface-900 font-medium leading-relaxed">{q.enunciado}</p>
                    </div>
                  </div>

                  <div className="pl-10 space-y-2 mb-4">
                    {opts.map(o => {
                      const isSelected = o.val === userAnswer
                      const isRealCorrect = o.val === q.gabarito
                      let bg = 'bg-surface-50 border-surface-200'
                      if (isRealCorrect) bg = 'bg-success-50 border-success-200 text-success-800 font-medium'
                      else if (isSelected && !isCorrect) bg = 'bg-danger-50 border-danger-200 text-danger-800'

                      return (
                        <div key={o.val} className={`p-3 rounded border text-sm flex gap-3 ${bg}`}>
                          <span className="font-bold uppercase opacity-50">{o.val})</span>
                          <span>{o.text}</span>
                        </div>
                      )
                    })}
                  </div>

                  {q.comentario && (
                    <div className="pl-10">
                      <div className="bg-primary/5 rounded border border-primary/10 p-4 text-sm text-surface-700">
                        <strong className="text-primary block mb-1">Comentário:</strong>
                        {q.comentario}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const options = [
    { value: 'a', text: question.alternativa_a },
    { value: 'b', text: question.alternativa_b },
    { value: 'c', text: question.alternativa_c },
    { value: 'd', text: question.alternativa_d },
    { value: 'e', text: question.alternativa_e },
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/aluno/questoes" className="flex items-center gap-2 text-surface-500 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
            Sair
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-medium text-surface-900">{list.name}</span>
          </div>
          <span className="text-sm text-surface-500 font-medium">Questão {currentIndex + 1} de {questions.length}</span>
        </div>

        <div className="card p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-surface-400">
              {question.subject} • {question.difficulty}
            </span>
          </div>
          <p className="text-lg text-surface-900 mb-8 leading-relaxed">{question.enunciado}</p>
          
          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = opt.value === selectedOption
              const optionClass = isSelected 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-surface-200 hover:border-primary/50 text-surface-700 hover:bg-surface-50'

              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedOption(opt.value)}
                  className={`w-full text-left p-4 border-2 rounded-xl transition-all ${optionClass}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface-100 text-surface-500'
                    }`}>
                      {opt.value.toUpperCase()}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className={`btn-primary w-full mt-8 justify-center py-3 text-base ${!selectedOption ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {currentIndex < questions.length - 1 ? (
              <>Próxima Questão <ArrowRight className="w-4 h-4 ml-2" /></>
            ) : (
              <>Finalizar Lista <CheckCircle className="w-4 h-4 ml-2" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
