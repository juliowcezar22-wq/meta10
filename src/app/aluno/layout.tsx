import type { Metadata } from 'next'
import { requireAuth } from '@/lib/auth/guards'
import { AlunoShell } from '@/components/aluno/aluno-shell'

export const metadata: Metadata = {
  title: 'Área do Aluno',
  description: 'Acesse seus materiais de estudo, questões, simulados, PDFs, mapas mentais e resumos.',
}

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireAuth()

  return (
    <AlunoShell nome={profile.nome} email={profile.email}>
      {children}
    </AlunoShell>
  )
}
