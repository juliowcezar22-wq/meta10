export interface DashboardStats {
  totalUsers: number
  activeSubscriptions: number
  totalRevenue: number
  monthlyRevenue: number
  totalQuestions: number
  totalSimulados: number
}

export const mockDashboardStats: DashboardStats = {
  totalUsers: 1250,
  activeSubscriptions: 840,
  totalRevenue: 145000.50,
  monthlyRevenue: 12400.00,
  totalQuestions: 450,
  totalSimulados: 12
}

export interface StudentStats {
  simuladosRealizados: number
  questoesResolvidas: number
  taxaAcerto: number
  tempoMedioPorQuestao: number // em minutos
}

export const mockStudentStats: StudentStats = {
  simuladosRealizados: 14,
  questoesResolvidas: 342,
  taxaAcerto: 78.5,
  tempoMedioPorQuestao: 2.5
}
