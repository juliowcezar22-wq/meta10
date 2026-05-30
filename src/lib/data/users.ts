import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type User = Database['public']['Tables']['users']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']
type Plan = Database['public']['Tables']['plans']['Row']

export type UserWithSubscription = User & {
  subscription?: (Subscription & { plan?: Plan }) | null
}

export async function getUsers(): Promise<UserWithSubscription[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      subscription:subscriptions(
        *,
        plan:plans(*)
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getUsers]', error)
    return []
  }
  
  // Cada user pode ter múltiplas subscriptions; pegar a ativa mais recente
  return (data ?? []).map(u => {
    const subs = (u.subscription as unknown as (Subscription & { plan: Plan })[]) ?? []
    const active = subs.find(s => s.status === 'active') ?? subs[0] ?? null
    return { ...u, subscription: active }
  })
}

export async function getUserById(id: string): Promise<UserWithSubscription | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      subscription:subscriptions(
        *,
        plan:plans(*)
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getUserById]', error)
    return null
  }
  
  const subs = (data.subscription as unknown as (Subscription & { plan: Plan })[]) ?? []
  const active = subs.find(s => s.status === 'active') ?? subs[0] ?? null
  return { ...data, subscription: active }
}

export type InactiveStudent = {
  id: string
  nome: string
  email: string
  subscription_status: string | null  // 'cancelled', 'expired', ou null
  expires_at: string | null
  last_subscription_date: string | null
  role: string
}

export async function getInactiveStudents(): Promise<InactiveStudent[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select(`
      id, nome, email, role, created_at,
      subscriptions(status, expires_at, created_at)
    `)
    .eq('role', 'aluno')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getInactiveStudents]', error)
    return []
  }
  
  const now = new Date().toISOString()
  
  const inactive = (data ?? []).filter(u => {
    const subs = u.subscriptions as unknown as Array<{
      status: string; expires_at: string; created_at: string
    }>
    if (!subs || subs.length === 0) return true
    const hasActive = subs.some(s => 
      s.status === 'active' && s.expires_at > now
    )
    return !hasActive
  })
  
  return inactive.map(u => {
    const subs = (u.subscriptions as unknown as Array<{
      status: string; expires_at: string; created_at: string
    }>) ?? []
    const latest = [...subs].sort((a, b) => 
      b.created_at.localeCompare(a.created_at)
    )[0]
    return {
      id: u.id,
      nome: u.nome,
      email: u.email,
      role: u.role,
      subscription_status: latest?.status ?? null,
      expires_at: latest?.expires_at ?? null,
      last_subscription_date: latest?.created_at ?? null,
    }
  })
}

export type ActiveStudent = {
  id: string
  nome: string
  email: string
  subscription_status: string | null
  expires_at: string | null
  last_subscription_date: string | null
  role: string
  plan_name: string | null
}

export async function getActiveStudents(): Promise<ActiveStudent[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select(`
      id, nome, email, role, created_at,
      subscriptions(status, expires_at, created_at, plan:plans(name))
    `)
    .eq('role', 'aluno')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getActiveStudents]', error)
    return []
  }
  
  const now = new Date().toISOString()
  
  const active = (data ?? []).filter(u => {
    const subs = u.subscriptions as unknown as Array<{
      status: string; expires_at: string; created_at: string; plan: { name: string } | null
    }>
    if (!subs || subs.length === 0) return false
    return subs.some(s => s.status === 'active' && s.expires_at > now)
  })
  
  return active.map(u => {
    const subs = (u.subscriptions as unknown as Array<{
      status: string; expires_at: string; created_at: string; plan: { name: string } | null
    }>) ?? []
    // Get the currently active sub
    const current = subs.find(s => s.status === 'active' && s.expires_at > now)
    return {
      id: u.id,
      nome: u.nome,
      email: u.email,
      role: u.role,
      subscription_status: current?.status ?? null,
      expires_at: current?.expires_at ?? null,
      last_subscription_date: current?.created_at ?? null,
      plan_name: current?.plan?.name ?? null,
    }
  })
}

export type Professor = {
  id: string
  nome: string
  email: string
  role: string
  created_at: string
}

export async function getProfessores(): Promise<Professor[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('id, nome, email, role, created_at')
    .eq('role', 'professor')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getProfessores]', error)
    return []
  }
  
  return data ?? []
}

export type ProfessorMetrics = Professor & {
  metricas: {
    questoes: number
    simulados: number
    atividades: number
    jogos: number
    mapas: number
    resumos: number
    mediaDia: number
  }
}

export async function getProfessoresWithMetrics(period: '7d' | '30d' | 'total'): Promise<ProfessorMetrics[]> {
  const supabase = createClient()
  
  const { data: professores, error } = await supabase
    .from('users')
    .select('id, nome, email, role, created_at')
    .eq('role', 'professor')
    .order('created_at', { ascending: false })
  
  if (error || !professores) {
    console.error('[getProfessoresWithMetrics]', error)
    return []
  }

  let dateFilter = new Date(0).toISOString()
  if (period === '7d') {
    dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  } else if (period === '30d') {
    dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }

  const result = await Promise.all(professores.map(async (prof) => {
    const profDateFilter = period === 'total' ? prof.created_at : dateFilter
    const actualFilter = profDateFilter > prof.created_at ? profDateFilter : prof.created_at

    const [{ count: qCount }, { count: sCount }, { count: aCount }, { count: jCount }, { count: mCount }, { count: rCount }] = await Promise.all([
      supabase.from('questions').select('*', { count: 'exact', head: true }).eq('created_by', prof.id).gte('created_at', actualFilter),
      supabase.from('question_lists').select('*', { count: 'exact', head: true }).eq('created_by', prof.id).gte('created_at', actualFilter),
      supabase.from('materials').select('*', { count: 'exact', head: true }).eq('created_by', prof.id).eq('type', 'atividade_pdf').gte('created_at', actualFilter),
      supabase.from('materials').select('*', { count: 'exact', head: true }).eq('created_by', prof.id).eq('type', 'jogo').gte('created_at', actualFilter),
      supabase.from('materials').select('*', { count: 'exact', head: true }).eq('created_by', prof.id).eq('type', 'mapa_mental').gte('created_at', actualFilter),
      supabase.from('materials').select('*', { count: 'exact', head: true }).eq('created_by', prof.id).eq('type', 'resumo').gte('created_at', actualFilter),
    ])

    const dias = Math.max(1, Math.ceil((Date.now() - new Date(actualFilter).getTime()) / (1000 * 60 * 60 * 24)))
    const totalItens = (qCount || 0) + (sCount || 0) + (aCount || 0) + (jCount || 0) + (mCount || 0) + (rCount || 0)
    
    return {
      ...prof,
      metricas: {
        questoes: qCount || 0,
        simulados: sCount || 0,
        atividades: aCount || 0,
        jogos: jCount || 0,
        mapas: mCount || 0,
        resumos: rCount || 0,
        mediaDia: parseFloat((totalItens / dias).toFixed(1))
      }
    }
  }))

  return result
}
