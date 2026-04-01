'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Lock, Download, Search } from 'lucide-react'
import { MOCK_PDFS } from '@/lib/constants'

export default function PdfsPage() {
  const [filter, setFilter] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState('Todas')

  const disciplines = ['Todas', ...Array.from(new Set(MOCK_PDFS.map((p) => p.discipline)))]

  const filtered = MOCK_PDFS.filter((pdf) => {
    const matchesSearch = pdf.title.toLowerCase().includes(filter.toLowerCase())
    const matchesDiscipline = selectedDiscipline === 'Todas' || pdf.discipline === selectedDiscipline
    return matchesSearch && matchesDiscipline
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/aluno/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Materiais de Estudo - PDFs</h1>
            <p className="text-gray-600">Baixe apostilas, listas e materiais complementares.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Buscar material..."
            />
          </div>
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
          >
            {disciplines.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Materials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pdf) => (
            <div key={pdf.id} className="card card-hover p-6 relative overflow-hidden">
              {pdf.premium && (
                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Disponível no plano pago</p>
                    <Link href="/planos" className="btn-primary text-sm mt-2">Assinar Plano</Link>
                  </div>
                </div>
              )}
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple" />
              </div>
              <span className="text-xs font-medium text-cyan bg-cyan-50 px-2 py-0.5 rounded-full">{pdf.discipline}</span>
              <h3 className="font-semibold text-gray-900 mt-2 mb-1">{pdf.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{pdf.pages} páginas</p>
              {!pdf.premium && (
                <button className="btn-primary w-full text-sm">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum material encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
