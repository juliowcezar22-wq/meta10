import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
  totalUsers: number
  activeStudents: number
  unreadMessages: number
  totalQuestionLists: number
  totalProducts: number
  totalAttempts: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()
  
  const [users, activeSubs, unreadMsgs, lists, products, attempts] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString()),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('question_lists').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('attempts').select('*', { count: 'exact', head: true }).not('finished_at', 'is', null),
  ])
  
  return {
    totalUsers: users.count ?? 0,
    activeStudents: activeSubs.count ?? 0,
    unreadMessages: unreadMsgs.count ?? 0,
    totalQuestionLists: lists.count ?? 0,
    totalProducts: products.count ?? 0,
    totalAttempts: attempts.count ?? 0,
  }
}
