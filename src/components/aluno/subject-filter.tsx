'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

type Subject = {
  id: string
  name: string
}

export function SubjectFilter({ subjects, discipline }: { subjects: Subject[], discipline: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentAssunto = searchParams.get('assunto') || ''

  if (subjects.length === 0) return null

  return (
    <div className="flex items-center gap-2 mb-6 bg-white p-2 md:p-3 rounded-2xl border border-surface-200 shadow-sm w-full md:w-auto overflow-hidden">
      <Filter className="w-4 h-4 text-surface-400 shrink-0 ml-2" />
      <select
        value={currentAssunto}
        onChange={(e) => {
          const val = e.target.value
          if (val) {
            router.push(`?assunto=${val}`)
          } else {
            router.push('?')
          }
        }}
        className="bg-transparent text-sm font-medium text-surface-700 outline-none w-full cursor-pointer pr-2"
      >
        <option value="">Todos os assuntos</option>
        {subjects.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  )
}
