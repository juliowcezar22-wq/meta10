import { mockDashboardStats, mockStudentStats, type DashboardStats, type StudentStats } from '@/lib/mocks/dashboard-stats'

export async function getDashboardStats(): Promise<DashboardStats> {
  // REAL: 
  // Serão necessárias múltiplas queries (count de users, assinaturas ativas, etc) ou uso de functions (RPC) do Supabase.
  return mockDashboardStats
}

export async function getStudentStats(userId: string): Promise<StudentStats> {
  // REAL:
  // const supabase = createClient()
  // // Contar tentativas de simulados (quiz_attempts), etc.
  return mockStudentStats
}
