import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
  totalUsers: number
  totalProfessores: number
  activeStudents: number
  inactiveStudents: number
  totalQuestoesAvulsas: number
  totalSimulados: number
  totalMaterials: number
  totalProducts: number
  totalDepoimentos: number
  totalSugestoes: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()
  const now = new Date().toISOString()
  
  const [
    users, 
    professores, 
    alunos, 
    activeSubs, 
    questoes, 
    simulados, 
    materials, 
    products, 
    depoimentos, 
    sugestoes
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'professor'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'aluno'),
    // Usamos um count simplificado das assinaturas ativas para a métrica de dashboard
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active').gt('expires_at', now),
    supabase.from('questions').select('*', { count: 'exact', head: true }).eq('context', 'avulsa'),
    supabase.from('question_lists').select('*', { count: 'exact', head: true }),
    supabase.from('materials').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('suggestions').select('*', { count: 'exact', head: true })
  ])
  
  const activeStudentsCount = activeSubs.count ?? 0
  const totalAlunos = alunos.count ?? 0
  const inactiveStudentsCount = Math.max(0, totalAlunos - activeStudentsCount)

  return {
    totalUsers: users.count ?? 0,
    totalProfessores: professores.count ?? 0,
    activeStudents: activeStudentsCount,
    inactiveStudents: inactiveStudentsCount,
    totalQuestoesAvulsas: questoes.count ?? 0,
    totalSimulados: simulados.count ?? 0,
    totalMaterials: materials.count ?? 0,
    totalProducts: products.count ?? 0,
    totalDepoimentos: depoimentos.count ?? 0,
    totalSugestoes: sugestoes.count ?? 0,
  }
}
