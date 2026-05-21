'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle, Info } from 'lucide-react'
import { answerStandaloneQuestion } from '@/app/actions/aluno/standalone-answers'
import { Badge } from '@/components/admin/badge'
import type { Question } from '@/lib/types/quiz'

interface SolveClientProps {
  question: Question
  subject: string
  previousAnswer: {
    answer: string
    is_correct: boolean
  } | null
}

export function SolveClient({ question, subject, previousAnswer }: SolveClientProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(previousAnswer?.answer || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    is_correct: boolean
    gabarito: string
    comentario: string | null
  } | null>(previousAnswer ? { is_correct: previousAnswer.is_correct, gabarito: '', comentario: null } : null) // Default minimal state if previously answered until they submit again or we fetch gabarito. But wait, previous answer doesn't give us gabarito. It's fine.

  // Parse alternatives
  let alternatives: { letra: string, texto: string }[] = []
  if (question.question_type === 'multipla_escolha') {
    try {
      const alts = question.alternatives as any[]
      if (Array.isArray(alts)) {
        alternatives = alts
      } else if (alts && typeof alts === 'object') {
        alternatives = Object.entries(alts).map(([letra, texto]) => ({ letra, texto: texto as string }))
      }
    } catch (e) {
      // ignore
    }
  }

  const handleSubmit = async () => {
    if (!selectedAnswer) return
    setIsSubmitting(true)
    
    const result = await answerStandaloneQuestion(question.id, selectedAnswer)
    setIsSubmitting(false)
    
    if (result.success) {
      setFeedback({
        is_correct: result.is_correct as boolean,
        gabarito: result.gabarito as string,
        comentario: result.comentario as string | null
      })
    } else {
      alert(result.error)
    }
  }

  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1)

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/aluno/questoes-avulsas/${subject}`} className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-surface-900">Treino de {subjectName}</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
        {/* Question Header */}
        <div className="p-6 border-b border-surface-100 bg-surface-50">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={question.difficulty === 'facil' ? 'success' : question.difficulty === 'medio' ? 'warning' : 'danger'}>
              {question.difficulty}
            </Badge>
            <Badge variant={question.question_type === 'multipla_escolha' ? 'primary' : 'purple'}>
              {question.question_type === 'multipla_escolha' ? 'Múltipla Escolha' : 'V ou F'}
            </Badge>
          </div>
          <p className="text-lg text-surface-900 whitespace-pre-wrap leading-relaxed">
            {question.enunciado}
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          {question.question_type === 'multipla_escolha' && alternatives.map((alt) => {
            const isSelected = selectedAnswer === alt.letra
            let optionStateClass = isSelected ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
            
            // If answered, show correct/incorrect colors
            if (feedback) {
              const isCorrectOption = feedback.gabarito === alt.letra
              if (isCorrectOption) {
                optionStateClass = 'border-success-500 bg-success-50 ring-2 ring-success-500/20'
              } else if (isSelected && !feedback.is_correct) {
                optionStateClass = 'border-danger-500 bg-danger-50 text-danger-700'
              } else {
                optionStateClass = 'border-surface-200 opacity-50'
              }
            }

            return (
              <button
                key={alt.letra}
                disabled={!!feedback}
                onClick={() => setSelectedAnswer(alt.letra)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex gap-4 items-start ${optionStateClass}`}
              >
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${isSelected && !feedback ? 'bg-primary-500 text-white' : feedback && feedback.gabarito === alt.letra ? 'bg-success-500 text-white' : isSelected && feedback && !feedback.is_correct ? 'bg-danger-500 text-white' : 'bg-surface-100 text-surface-500'}`}>
                  {alt.letra.toUpperCase()}
                </div>
                <span className="mt-1 text-surface-700">{alt.texto}</span>
              </button>
            )
          })}

          {question.question_type === 'verdadeiro_falso' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['verdadeiro', 'falso'].map((vf) => {
                const isSelected = selectedAnswer === vf
                let optionStateClass = isSelected ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                
                if (feedback) {
                  const isCorrectOption = feedback.gabarito === vf
                  if (isCorrectOption) {
                    optionStateClass = 'border-success-500 bg-success-50 ring-2 ring-success-500/20'
                  } else if (isSelected && !feedback.is_correct) {
                    optionStateClass = 'border-danger-500 bg-danger-50 text-danger-700'
                  } else {
                    optionStateClass = 'border-surface-200 opacity-50'
                  }
                }

                return (
                  <button
                    key={vf}
                    disabled={!!feedback}
                    onClick={() => setSelectedAnswer(vf)}
                    className={`w-full text-center p-6 rounded-xl border-2 transition-all font-bold text-lg ${optionStateClass}`}
                  >
                    {vf.charAt(0).toUpperCase() + vf.slice(1)}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Action / Feedback Area */}
        <div className="p-6 border-t border-surface-100 bg-surface-50">
          {!feedback ? (
            <div className="flex justify-end">
              <button 
                onClick={handleSubmit} 
                disabled={!selectedAnswer || isSubmitting}
                className="btn-primary px-8"
              >
                {isSubmitting ? 'Verificando...' : 'Responder'}
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`p-6 rounded-xl border-2 ${feedback.is_correct ? 'bg-success-50 border-success-200' : 'bg-danger-50 border-danger-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 p-2 rounded-full ${feedback.is_correct ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'}`}>
                    {feedback.is_correct ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-1 ${feedback.is_correct ? 'text-success-800' : 'text-danger-800'}`}>
                      {feedback.is_correct ? 'Você acertou!' : 'Você errou!'}
                    </h3>
                    <p className={`text-sm ${feedback.is_correct ? 'text-success-700' : 'text-danger-700'}`}>
                      {feedback.is_correct 
                        ? 'Excelente trabalho. Continue praticando para masterizar o assunto.' 
                        : 'Não desanime! Revise o material e tente novamente em breve.'}
                    </p>
                  </div>
                </div>

                {feedback.comentario && (
                  <div className="mt-6 pt-6 border-t border-black/5">
                    <div className="flex items-center gap-2 text-surface-900 font-bold mb-2">
                      <Info className="w-5 h-5 text-primary-500" />
                      Comentário do Professor
                    </div>
                    <p className="text-surface-700 leading-relaxed whitespace-pre-wrap">
                      {feedback.comentario}
                    </p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end gap-3">
                  <Link href={`/aluno/questoes-avulsas/${subject}`} className="btn-primary">
                    Próxima Questão
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
