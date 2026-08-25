-- ============================================================
-- Migration 0012: Assinaturas Mensal indevidas -> Gratuito
-- ============================================================
-- Aplicar DEPOIS da 0011 (precisa do plano Gratuito) e ANTES do deploy.
--
-- Decisão da cliente (27/07/2026): nenhuma das contas hoje marcadas como
-- Mensal é pagante. São: a conta-aluno de teste da Emília (dona da
-- plataforma; a conta principal dela é admin), os professores Bruna e
-- Ruan, e a conta-aluno de teste do Ruan.
-- Todas passam para o plano Gratuito, preservando o histórico
-- (nada é apagado: a linha da assinatura é convertida e o log registra).
--
-- Não há tabela de pagamentos; subscription_logs estava vazia por bug
-- corrigido no código (action inválida). Por isso a conversão é
-- nominal e explícita, não por heurística.
-- ============================================================

-- Conferência ANTES (esperado: 4 assinaturas ativas no plano Mensal)
-- SELECT u.email, p.name, s.status, s.expires_at
-- FROM public.subscriptions s
-- JOIN public.users u ON u.id = s.user_id
-- JOIN public.plans p ON p.id = s.plan_id
-- WHERE s.status = 'active' AND p.duration_months > 0;

WITH convertidas AS (
  UPDATE public.subscriptions s
  SET plan_id = (SELECT id FROM public.plans WHERE name = 'Gratuito' LIMIT 1),
      expires_at = NULL,
      status = 'active'
  FROM public.plans p
  WHERE p.id = s.plan_id
    AND s.status = 'active'
    AND p.duration_months > 0           -- somente assinaturas de plano pago
  RETURNING s.user_id, s.expires_at AS old_expires_at
)
INSERT INTO public.subscription_logs (admin_id, user_id, action, plan_id, previous_expires_at, new_expires_at, notes)
SELECT (SELECT id FROM public.users WHERE role = 'admin' ORDER BY created_at LIMIT 1),
       c.user_id,
       'updated',
       (SELECT id FROM public.plans WHERE name = 'Gratuito' LIMIT 1),
       NULL, NULL,
       'Migration 0012: conta interna (dona/professor/teste) sem pagamento convertida para Gratuito (decisão da cliente)'
FROM convertidas c;

-- ============================================================
-- Verificação pós-aplicação:
--   SELECT count(*) FROM public.subscriptions s JOIN public.plans p ON p.id = s.plan_id
--   WHERE s.status = 'active' AND p.duration_months > 0;
--   -- esperado: 0 (ninguém mais no Mensal/Anual)
--   SELECT count(*) FROM public.subscription_logs WHERE notes LIKE 'Migration 0012%';
--   -- esperado: 4
-- ============================================================
