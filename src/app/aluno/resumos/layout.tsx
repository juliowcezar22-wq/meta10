import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resumos',
  description: 'Resumos objetivos das matérias mais cobradas em provas e vestibulares.',
}

export default function ResumosLayout({ children }: { children: React.ReactNode }) {
  return children
}
