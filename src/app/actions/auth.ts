'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema, resetPasswordSchema, updatePasswordSchema } from '@/lib/validations/auth.schemas'
import { translateAuthError } from '@/lib/auth/messages'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type AuthState = {
  success: boolean
  error?: string
  errors?: Record<string, string>
  message?: string
}

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string

  const validation = loginSchema.safeParse({ email, password })
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {}
    const flattened = validation.error.flatten().fieldErrors
    Object.entries(flattened).forEach(([key, value]) => {
      if (value && value.length > 0) fieldErrors[key] = value[0]
    })
    return { success: false, errors: fieldErrors }
  }

  const supabase = createClient()
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !authData.user) {
    return { success: false, error: translateAuthError(error?.message || 'Erro ao fazer login') }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (!profile) {
    await supabase.auth.signOut()
    return { success: false, error: 'Perfil não encontrado. Contate o suporte.' }
  }

  if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//') && !redirectTo.includes(':') && !redirectTo.includes('\\')) {
    redirect(redirectTo)
  } else if (profile.role === 'admin') {
    redirect('/admin')
  } else if (profile.role === 'professor') {
    redirect('/admin/questoes-avulsas')
  } else {
    redirect('/aluno/dashboard')
  }
}

export async function signUpAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const nome = formData.get('nome') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const validation = signupSchema.safeParse({ nome, email, password, confirmPassword })
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {}
    const flattened = validation.error.flatten().fieldErrors
    Object.entries(flattened).forEach(([key, value]) => {
      if (value && value.length > 0) fieldErrors[key] = value[0]
    })
    return { success: false, errors: fieldErrors }
  }

  const supabase = createClient()
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const origin = `${protocol}://${host}`
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome },
      emailRedirectTo: `${origin}/api/auth/callback`,
    }
  })

  if (error) {
    return { success: false, error: translateAuthError(error.message) }
  }

  redirect('/verificar-email')
}

export async function resetPasswordAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  
  const validation = resetPasswordSchema.safeParse({ email })
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {}
    const flattened = validation.error.flatten().fieldErrors
    Object.entries(flattened).forEach(([key, value]) => {
      if (value && value.length > 0) fieldErrors[key] = value[0]
    })
    return { success: false, errors: fieldErrors }
  }

  const supabase = createClient()
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const origin = `${protocol}://${host}`

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/redefinir-senha`,
  })

  if (error) {
    return { success: false, error: translateAuthError(error.message) }
  }

  return { success: true, message: 'Email enviado com sucesso!' }
}

export async function logoutAction() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function updatePasswordAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const validation = updatePasswordSchema.safeParse({ password, confirmPassword })
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {}
    const flattened = validation.error.flatten().fieldErrors
    Object.entries(flattened).forEach(([key, value]) => {
      if (value && value.length > 0) fieldErrors[key] = value[0]
    })
    return { success: false, errors: fieldErrors }
  }

  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Sessão expirada. Solicite uma nova recuperação de senha.' }
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { success: false, error: translateAuthError(error.message) }
  }

  return { success: true, message: 'Senha alterada com sucesso!' }
}

export async function getRedirectTargetIfLoggedIn(): Promise<{ path: string | null }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { path: null }
  
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile) return { path: null }
  
  if (profile.role === 'admin') return { path: '/admin' }
  if (profile.role === 'professor') return { path: '/admin/questoes-avulsas' }
  return { path: '/aluno/dashboard' }
}
