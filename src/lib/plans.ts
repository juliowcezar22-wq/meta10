/**
 * Fonte única da verdade dos planos no código.
 * O catálogo persistido vive na tabela `plans` do Supabase (linhas
 * Gratuito/Mensal/Anual, com `is_active`); este módulo concentra a
 * apresentação (preços, benefícios, destaque) e as regras do plano
 * Gratuito usadas pelo site, pelo admin e pelo painel do aluno.
 */

// Limite de questões do plano Gratuito (valor provisório — ajustar aqui).
export const FREE_PLAN_QUESTION_LIMIT = 20

export type PlanSlug = 'gratuito' | 'mensal' | 'anual'

// Link de checkout só vale se for real: vazio ou placeholder = sem checkout
// (a UI cai no WhatsApp). Evita botão quebrado em produção por env de exemplo.
function checkoutLink(value: string | undefined): string | null {
  if (!value) return null
  const v = value.trim()
  if (!v.startsWith('http') || v.includes('placeholder')) return null
  return v
}

// Nome do plano Gratuito exatamente como está na tabela `plans`
export const FREE_PLAN_NAME = 'Gratuito'

export interface PlanDefinition {
  slug: PlanSlug
  /** Igual à coluna `plans.name` no banco */
  name: string
  price: string
  period: string
  total?: string
  features: string[]
  highlighted: boolean
  cta: string
  /** Link de checkout (Hotmart) ou rota interna. null = sem checkout ainda:
   *  a UI cai no WhatsApp com mensagem pré-preenchida. */
  link: string | null
}

export const PLANS: PlanDefinition[] = [
  {
    slug: 'gratuito',
    name: 'Gratuito',
    price: 'R$ 0,00',
    period: '',
    features: [
      `Banco de Questões: até ${FREE_PLAN_QUESTION_LIMIT} questões`,
      'Estatísticas de desempenho',
    ],
    highlighted: false,
    cta: 'Criar Conta Grátis',
    link: '/cadastro',
  },
  {
    slug: 'mensal',
    name: 'Mensal',
    price: 'R$ 22,90',
    period: '/mês',
    total: 'Cobrança a cada 30 dias',
    features: [
      'Banco de Questões ilimitado',
      'Estatísticas de desempenho',
    ],
    highlighted: false,
    cta: 'Assinar Agora',
    link: checkoutLink(process.env.NEXT_PUBLIC_HOTMART_MENSAL),
  },
  {
    slug: 'anual',
    name: 'Anual',
    price: 'R$ 14,16',
    period: '/mês',
    total: 'R$ 169,90 a cada 365 dias',
    features: [
      'Banco de Questões ilimitado',
      'Estatísticas de desempenho',
    ],
    highlighted: true,
    cta: 'Assinar Agora',
    link: checkoutLink(process.env.NEXT_PUBLIC_HOTMART_ANUAL),
  },
]
