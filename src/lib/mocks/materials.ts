import type { Database } from '@/lib/supabase/types'

type Material = Database['public']['Tables']['materials']['Row']

export const mockMaterials: Material[] = [
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `mat-${i+1}`,
    title: `Material de Estudo ${i+1}`,
    description: `Descrição do material ${i+1} focado em preparação.`,
    type: i % 3 === 0 ? 'pdf' : (i % 3 === 1 ? 'mapa-mental' : 'resumo'),
    subject: ['matematica', 'portugues', 'historia', 'geografia'][i % 4],
    file_url: `https://example.com/file${i+1}.pdf`,
    is_free: i % 4 === 0,
    created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  }))
]
