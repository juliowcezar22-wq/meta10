import type { Database } from '@/lib/supabase/types'

type User = Database['public']['Tables']['users']['Row']

export const mockUsers: User[] = [
  {
    id: 'user-1-admin',
    nome: 'Admin Supremo',
    email: 'admin@meta10.com',
    role: 'admin',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-2-aluno',
    nome: 'João Estudante',
    email: 'joao@example.com',
    role: 'aluno',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-3-aluno',
    nome: 'Maria Silva',
    email: 'maria@example.com',
    role: 'aluno',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-4-aluno',
    nome: 'Pedro Henrique',
    email: 'pedro@example.com',
    role: 'aluno',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-5-professor',
    nome: 'Prof. Carlos',
    email: 'carlos.prof@meta10.com',
    role: 'professor',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `user-mock-${i+6}`,
    nome: `Usuário Genérico ${i+6}`,
    email: `aluno${i+6}@teste.com`,
    role: 'aluno' as const,
    created_at: new Date(Date.now() - (i+1) * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }))
]
