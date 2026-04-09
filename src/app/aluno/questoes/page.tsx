'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, BookOpen } from 'lucide-react'
import { MOCK_QUESTIONS } from '@/lib/mock-data'

export default function QuestoesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const question = MOCK_QUESTIONS[currentIndex]

  const handleAnswer = () => {
    if (selectedOption !== null) setAnswered(true)
  }

  const handleNext = () => {
    if (currentIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setAnswered(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedOption(null)
      setAnswered(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/aluno/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-medium text-gray-900">Modo Treino - {question.discipline}</span>
          </div>
          <span className="text-sm text-gray-500">Questão {currentIndex + 1} de {MOCK_QUESTIONS.length}</span>
        </div>

        {/* Question Card */}
        <div className="card p-8 mb-6">
          <p className="text-lg text-gray-900 mb-6">{question.question}</p>
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct
              const isSelected = index === selectedOption
              let optionClass = 'border-gray-200 hover:border-primary hover:bg-primary-50'

              if (answered) {
                if (isCorrect) optionClass = 'border-green bg-green-50'
                else if (isSelected && !isCorrect) optionClass = 'border-red bg-red-50'
                else optionClass = 'border-gray-200 opacity-50'
              } else if (isSelected) {
                optionClass = 'border-primary bg-primary-50'
              }

              return (
                <button
                  key={index}
                  onClick={() => !answered && setSelectedOption(index)}
                  disabled={answered}
                  className={`w-full text-left p-4 border-2 rounded-xl transition-all ${optionClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      answered && isCorrect ? 'bg-green text-white' :
                      answered && isSelected && !isCorrect ? 'bg-red text-white' :
                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {answered && isCorrect ? <CheckCircle className="w-5 h-5" /> :
                       answered && isSelected && !isCorrect ? <XCircle className="w-5 h-5" /> :
                       String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {!answered ? (
            <button
              onClick={handleAnswer}
              disabled={selectedOption === null}
              className={`btn-primary w-full mt-6 ${selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Responder
            </button>
          ) : (
            <div className="mt-6">
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                <p className="font-semibold text-cyan-700 mb-1">Comentário do Professor:</p>
                <p className="text-cyan-600">{question.comment}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handlePrev} disabled={currentIndex === 0} className="btn-outline flex-1 disabled:opacity-50">
                  <ArrowLeft className="w-4 h-4" /> Anterior
                </button>
                <button onClick={handleNext} disabled={currentIndex === MOCK_QUESTIONS.length - 1} className="btn-primary flex-1 disabled:opacity-50">
                  Próxima <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
