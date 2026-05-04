import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

export type AuthenticatedUser = {
  authUser: User
  profile: {
    id: string
    email: string
    nome: string
    role: UserRole
  }
}

/**
 * Garante que há um usuário autenticado COM perfil em public.users.
 * Redireciona para /login se não houver sessão.
 * Se houver auth user mas sem perfil em public.users, faz signOut e 
 * redireciona com mensagem.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, email, nome, role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    await supabase.auth.signOut()
    redirect('/login?error=Perfil não encontrado')
  }

  return {
    authUser: user,
    profile: {
      id: profile.id,
      email: profile.email,
      nome: profile.nome,
      role: profile.role,
    }
  }
}

/**
 * Garante que o usuário autenticado tem role='admin'.
 * Redireciona para /login se sem sessão.
 * Redireciona para /aluno/dashboard se logado mas não é admin.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth()

  if (user.profile.role !== 'admin') {
    redirect('/aluno/dashboard')
  }

  return user
}
