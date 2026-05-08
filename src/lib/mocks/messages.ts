import type { Database } from '@/lib/supabase/types'

type Message = Database['public']['Tables']['messages']['Row']

export const mockMessages: Message[] = [
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `msg-${i+1}`,
    name: `Visitante ${i+1}`,
    email: `contato${i+1}@example.com`,
    subject: `Dúvida sobre os planos ${i+1}`,
    message: `Gostaria de saber mais sobre como funciona a plataforma e se os materiais são atualizados. (Mensagem ${i+1})`,
    is_read: i > 4, // Primeiras 5 não lidas
    created_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
  }))
]
