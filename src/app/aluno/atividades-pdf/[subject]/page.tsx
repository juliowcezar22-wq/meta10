import { requireAuth } from '@/lib/auth/guards'
import { getMaterialsByTypeAndSubject } from '@/lib/data/materials'
import { hasActiveSubscription } from '@/lib/data/subscriptions'
import Link from 'next/link'
import { ArrowLeft, FileText, Lock, Download } from 'lucide-react'
import { SUBJECT_LABELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AtividadesPdfSubjectPage({ params }: { params: { subject: string } }) {
  await requireAuth()
  
  const subjectName = SUBJECT_LABELS[params.subject] || params.subject
  const materials = await getMaterialsByTypeAndSubject('atividade_pdf', params.subject)
  const hasSub = await hasActiveSubscription()

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/aluno/atividades-pdf" className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Atividades de <span className="capitalize">{subjectName}</span></h1>
          <p className="text-surface-500">Baixe atividades em PDF para praticar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <div key={material.id} className="bg-white rounded-2xl p-6 border border-surface-200 shadow-sm relative overflow-hidden group">
            {!material.is_free && !hasSub && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-surface-500" />
                  </div>
                  <p className="text-sm font-medium text-surface-900 mb-2">Exclusivo Premium</p>
                  <Link href="/aluno/planos" className="btn-primary text-sm py-2 px-4 w-full block">Assinar Agora</Link>
                </div>
              </div>
            )}
            
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 text-red-600">
              <FileText className="w-6 h-6" />
            </div>
            
            <h3 className="font-bold text-surface-900 mb-2 line-clamp-2">{material.title}</h3>
            {material.description && (
              <p className="text-sm text-surface-500 mb-6 line-clamp-2">{material.description}</p>
            )}
            
            {(material.is_free || hasSub) && (
              <a 
                href={material.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-surface-50 hover:bg-surface-100 text-surface-900 rounded-xl transition-colors font-medium text-sm border border-surface-200"
              >
                <Download className="w-4 h-4" />
                Baixar PDF
              </a>
            )}
          </div>
        ))}
      </div>

      {materials.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200 mt-6">
          <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-4 text-surface-400">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-surface-900 mb-1">Nenhuma atividade</h3>
          <p className="text-surface-500">Ainda não há atividades em PDF para esta disciplina.</p>
        </div>
      )}
    </div>
  )
}
