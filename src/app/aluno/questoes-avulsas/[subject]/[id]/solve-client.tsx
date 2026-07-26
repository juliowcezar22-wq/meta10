'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, XCircle, Info, RotateCcw, Lock, Crown, Users } from 'lucide-react'
import { answerStandaloneQuestion } from '@/app/actions/aluno/standalone-answers'
import { Badge } from '@/components/admin/badge'
import type { Question } from '@/lib/types/quiz'
import type { MyQuestionStats, QuestionCollectiveStats } from '@/lib/data/standalone-answers'
import { DIFFICULTY_LABELS } from '@/lib/constants'

interface SolveClientProps {
  question: Question
  subject: string
  disciplineName: string
  myStats: MyQuestionStats | null
  collectiveStats: QuestionCollectiveStats | null
  limitInfo: {
    isPaid: boolean
    limit: number
    answeredCount: number
    blocked: boolean
  }
}

export function SolveClient({ question, subject, disciplineName, myStats, collectiveStats, limitInfo }: SolveClientProps) {
  const router = useRouter()
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBlocked, setIsBlocked] = useState(limitInfo.blocked)
  const [feedback, setFeedback] = useState<{
    is_correct: boolean
    gabarito: string
    comentario: string | null
  } | null>(null)

  // Parse alternatives
  let alternatives: { letra: string, texto: string }[] = []
  if (question.question_type === 'multipla_escolha') {
    const alts = question.alternatives as any[]
    if (Array.isArray(alts)) {
      alternatives = alts
    } else if (alts && typeof alts === 'object') {
      alternatives = Object.entries(alts).map(([letra, texto]) => ({ letra, texto: texto as string }))
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
      // Atualiza estatísticas (pessoais e coletivas) vindas do servidor
      router.refresh()
    } else if ((result as any).limitReached) {
      setIsBlocked(true)
    } else {
      setFeedback(null)
      alert(result.error)
    }
  }

  const handleRetry = () => {
    setSelectedAnswer('')
    setFeedback(null)
  }

  // Distribuição coletiva de escolhas (modelo QConcursos) — exibida após responder
  const distributionPct = (key: string): number | null => {
    if (!collectiveStats?.answer_distribution || !collectiveStats.total_attempts) return null
    const count = collectiveStats.answer_distribution[key] ?? 0
    return Math.round((count / collectiveStats.total_attempts) * 100)
  }

  const showStats = Boolean(feedback || myStats)

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/aluno/questoes-avulsas/${subject}`} className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-surface-900">Questões de {disciplineName}</h1>
        </div>
      </div>

      {/* Estatísticas da questão */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        {myStats && (
          <span className="flex items-center gap-1.5 bg-white border border-surface-200 rounded-full px-3 py-1.5 text-surface-600">
            Você: <strong className="text-surface-900">{myStats.attempts}x</strong>
            <span className="text-success-600 font-semibold">{myStats.correct} acerto{myStats.correct === 1 ? '' : 's'}</span>
            ·
            <span className="text-danger-600 font-semibold">{myStats.wrong} erro{myStats.wrong === 1 ? '' : 's'}</span>
          </span>
        )}
        {collectiveStats && collectiveStats.total_attempts > 0 && (
          <span className="flex items-center gap-1.5 bg-white border border-surface-200 rounded-full px-3 py-1.5 text-surface-600">
            <Users className="w-3.5 h-3.5" />
            <strong className="text-surface-900">{Math.round(Number(collectiveStats.correct_pct))}%</strong>
            de acerto entre os alunos ({collectiveStats.total_attempts} respostas)
          </span>
        )}
        {!limitInfo.isPaid && (
          <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 text-amber-700">
            Plano Gratuito: {Math.min(limitInfo.answeredCount, limitInfo.limit)}/{limitInfo.limit} questões
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
        {/* Question Header */}
        <div className="p-6 border-b border-surface-100 bg-surface-50">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={question.difficulty === 'facil' ? 'success' : question.difficulty === 'medio' ? 'warning' : 'danger'}>
              {DIFFICULTY_LABELS[question.difficulty] || question.difficulty}
            </Badge>
            <Badge variant={question.question_type === 'multipla_escolha' ? 'primary' : 'purple'}>
              {question.question_type === 'multipla_escolha' ? 'Múltipla Escolha' : 'V ou F'}
            </Badge>
          </div>
          <p className="text-lg text-surface-900 whitespace-pre-wrap leading-relaxed">
            {question.enunciado}
          </p>
          {question.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={question.image_url}
              alt="Imagem do enunciado"
              loading="lazy"
              className="mt-4 max-w-full h-auto max-h-[420px] object-contain rounded-xl border border-surface-200 bg-white"
            />
          )}
        </div>

        {/* Bloqueio do plano Gratuito */}
        {isBlocked ? (
          <div className="p-8">
            <div className="max-w-md mx-auto text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 mb-2">
                Você usou suas {limitInfo.limit} questões gratuitas
              </h3>
              <p className="text-surface-500 mb-6 leading-relaxed">
                Continue evoluindo sem limites: os planos Mensal e Anual dão acesso
                ilimitado ao Banco de Questões, com estatísticas completas de desempenho.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/planos" className="btn-primary w-full sm:w-auto">
                  <Crown className="w-4 h-4" />
                  Conhecer os Planos
                </Link>
                <Link href={`/aluno/questoes-avulsas/${subject}`} className="text-sm font-medium text-surface-500 hover:text-surface-900 transition-colors">
                  Voltar às questões
                </Link>
              </div>
            </div>
          </div>
        ) : (
        <>
        {/* Options */}
        <div className="p-6 space-y-4">
          {question.question_type === 'multipla_escolha' && alternatives.map((alt) => {
            const isSelected = selectedAnswer === alt.letra
            let optionStateClass = isSelected ? 'border-primary-500 bg-primary-50' : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'

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

            const pct = feedback ? distributionPct(alt.letra) : null

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
                <span className="mt-1 text-surface-700 flex-1">{alt.texto}</span>
                {pct !== null && (
                  <span className="mt-1 shrink-0 text-xs font-semibold text-surface-400" title="Percentual de alunos que escolheram esta alternativa">
                    {pct}%
                  </span>
                )}
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

                const pct = feedback ? distributionPct(vf) : null

                return (
                  <button
                    key={vf}
                    disabled={!!feedback}
                    onClick={() => setSelectedAnswer(vf)}
                    className={`w-full text-center p-6 rounded-xl border-2 transition-all font-bold text-lg ${optionStateClass}`}
                  >
                    {vf.charAt(0).toUpperCase() + vf.slice(1)}
                    {pct !== null && (
                      <span className="block text-xs font-semibold text-surface-400 mt-1">{pct}% dos alunos</span>
                    )}
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
                        ? 'Excelente trabalho. Continue praticando para dominar o assunto.'
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

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button onClick={handleRetry} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-surface-700 bg-white border border-surface-200 rounded-xl hover:border-primary/50 hover:text-primary transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    Refazer
                  </button>
                  <Link href={`/aluno/questoes-avulsas/${subject}`} className="btn-primary">
                    Próxima Questão
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  )
}
