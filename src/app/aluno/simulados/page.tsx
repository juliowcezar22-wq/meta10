'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Clock, Award, BookOpen } from 'lucide-react'
import { MOCK_QUESTIONS } from '@/lib/constants'

export default function SimuladosPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [finished, setFinished] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const question = MOCK_QUESTIONS[currentQuestion]

  const handleSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex })
  }

  const handleFinish = () => {
    setFinished(true)
    setShowResults(true)
  }

  const score = MOCK_QUESTIONS.reduce((acc, q, i) => {
    return acc + (answers[i] === q.correct ? 1 : 0)
  }, 0)

  const percentage = Math.round((score / MOCK_QUESTIONS.length) * 100)

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card p-8 text-center">
            <Award className={`w-16 h-16 mx-auto mb-4 ${percentage >= 70 ? 'text-green' : 'text-primary'}`} />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Simulado Finalizado!</h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{score}/{MOCK_QUESTIONS.length}</p>
                <p className="text-sm text-gray-500">Acertos</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{percentage}%</p>
                <p className="text-sm text-gray-500">Aproveitamento</p>
              </div>
            </div>

            <div className="space-y-4 text-left mb-6">
              {MOCK_QUESTIONS.map((q, i) => {
                const isCorrect = answers[i] === q.correct
                return (
                  <div key={i} className={`p-4 rounded-xl border ${isCorrect ? 'border-green bg-green-50' : 'border-red bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {isCorrect ? <CheckCircle className="w-5 h-5 text-green" /> : <XCircle className="w-5 h-5 text-red" />}
                      <span className="font-medium text-gray-900">Questão {i + 1}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{q.question}</p>
                    <p className="text-xs text-gray-500">
                      Sua resposta: {answers[i] !== undefined ? q.options[answers[i]] : 'Não respondida'}
                      {!isCorrect && <span className="text-green ml-2">Correta: {q.options[q.correct]}</span>}
                    </p>
                    <p className="text-xs text-cyan-600 mt-1">{q.comment}</p>
                  </div>
                )
              })}
            </div>

            <Link href="/aluno/dashboard" className="btn-primary">
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/aluno/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary">
            <ArrowLeft className="w-5 h-5" /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan" />
            <span className="font-medium text-gray-900">Simulado - {question.discipline}</span>
          </div>
          <span className="text-sm text-gray-500">{currentQuestion + 1}/{MOCK_QUESTIONS.length}</span>
        </div>

        <div className="card p-8 mb-6">
          <p className="text-lg text-gray-900 mb-6">{question.question}</p>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`w-full text-left p-4 border-2 rounded-xl transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-primary bg-primary-50'
                    : 'border-gray-200 hover:border-primary hover:bg-primary-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    answers[currentQuestion] === index ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="btn-outline flex-1 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" /> Anterior
            </button>
            {currentQuestion < MOCK_QUESTIONS.length - 1 ? (
              <button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="btn-primary flex-1">
                Próxima <BookOpen className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleFinish} className="btn-primary flex-1 bg-green hover:bg-green-600">
                <CheckCircle className="w-4 h-4" /> Encerrar Simulado
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {MOCK_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i === currentQuestion ? 'bg-primary' : answers[i] !== undefined ? 'bg-cyan' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          {Object.keys(answers).length}/{MOCK_QUESTIONS.length} respondidas
        </p>
      </div>
    </div>
  )
}
