'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Network, Lock, Eye } from 'lucide-react'
import { MOCK_MINDMAPS } from '@/lib/constants'

export default function MapasMentaisPage() {
  const [selectedDiscipline, setSelectedDiscipline] = useState('Todas')
  const disciplines = ['Todas', ...Array.from(new Set(MOCK_MINDMAPS.map((m) => m.discipline)))]

  const filtered = MOCK_MINDMAPS.filter((m) => selectedDiscipline === 'Todas' || m.discipline === selectedDiscipline)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/aluno/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mapas Mentais</h1>
            <p className="text-gray-600">Visualize e organize o conteúdo de forma gráfica.</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((map) => (
            <div key={map.id} className="card card-hover p-6 relative overflow-hidden">
              {map.premium && (
                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Disponível no plano pago</p>
                    <Link href="/planos" className="btn-primary text-sm mt-2">Assinar Plano</Link>
                  </div>
                </div>
              )}
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <Network className="w-6 h-6 text-green" />
              </div>
              <span className="text-xs font-medium text-cyan bg-cyan-50 px-2 py-0.5 rounded-full">{map.discipline}</span>
              <h3 className="font-semibold text-gray-900 mt-2 mb-4">{map.title}</h3>
              {!map.premium && (
                <button className="btn-primary w-full text-sm">
                  <Eye className="w-4 h-4" />
                  Visualizar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
