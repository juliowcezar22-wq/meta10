# CHECKLIST DE DEPLOY — branch refactor/enxugamento-meta10

Sequência completa e numerada. Não pule etapas nem inverta a ordem:
**o código novo quebra se for ao ar antes das migrations 0011→0016** (detalhes na
seção "Se a ordem inverter" no final). A **0017** é a exceção: entra logo **depois** do deploy.

## A. Preservação e backup

- [ ] 1. Confirmar que a branch `refactor/enxugamento-meta10` está com `git status` limpo e os 9 commits da sequência (`git log --oneline main..`).
- [ ] 2. Fazer push da branch para o remoto (`git push -u origin refactor/enxugamento-meta10`). **Nada vai para a `main` ainda.**
- [ ] 3. Backup do banco conforme o item 0 do `RUNBOOK_MIGRATIONS.md` (confirmar plano/retenção + export manual).

## B. Migrations (SQL Editor do Supabase)

- [ ] 4. Aplicar **0011** e rodar a verificação (4 planos, 0 alunos sem assinatura, trigger atualizado).
- [ ] 4b. Aplicar **0012** e rodar a verificação (0 assinaturas pagas ativas; 4 logs) — converte as contas de equipe para Gratuito, decisão da cliente.
- [ ] 5. Aplicar **0013** e rodar a verificação (2 colunas + 3 constraints).
- [ ] 6. Aplicar **0015** e rodar a verificação (2 buckets + 8 policies + coluna image_url).
- [ ] 7. Aplicar **0016** e rodar a verificação (2 colunas + 5 índices + pg_trgm).
- [ ] 8. **Só depois do deploy (item 13) concluir:** aplicar **0017** e rodar a verificação (trava removida + 3 funções + estatísticas retornando). Ela é incompatível com o código antigo, por isso entra após o deploy.
- [ ] 9. **NÃO** executar 0010 (aguarda aprovação do DROP) nem 0014 (obsoleta) — ver runbook.

## C. Variáveis de ambiente na Vercel (projeto de preview e produção)

O código exige exatamente estas (nenhuma variável NOVA foi introduzida pelos 8 blocos):

- [ ] 10. `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` — já existiam; conferir que apontam para o projeto certo (ref `aohzpfzz…`). O Storage usa as mesmas.
- [ ] 11. `NEXT_PUBLIC_HOTMART_MENSAL` e `NEXT_PUBLIC_HOTMART_ANUAL` — a cliente ainda não criou os produtos na Hotmart. **Sem essas variáveis, os botões "Assinar" e "Comprar" caem automaticamente no WhatsApp da META 10** com mensagem pré-preenchida (fallback implementado). Quando os links existirem, é só cadastrar as variáveis. As antigas `…_SEMESTRAL`, `…_META10` e `…_GRATUITO` não são mais usadas e podem ser removidas.
- [ ] 11b. `NEXT_PUBLIC_WHATSAPP_NUMBER` — conferir que é o número certo da META 10 (é o destino das vendas enquanto não há Hotmart).
- [ ] 12. `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_INSTAGRAM_LINK`, `NEXT_PUBLIC_YOUTUBE_LINK`, `NEXT_PUBLIC_EMAIL_LINK`, `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` — já existiam (o vídeo ainda usa ID de exemplo se ausente).

## D. Deploy em preview

- [ ] 13. Deploy de **preview** na Vercel a partir da branch (não promover a produção ainda).
- [ ] 14. Regenerar os types do Supabase quando conveniente (`supabase gen types typescript`) e commitar — o arquivo atual foi editado à mão e agora deve bater com o banco.

## E. Os 10 testes críticos (da Seção 6 da auditoria) — rodar no preview

- [ ] 15. **[Regressão]** Cadastro novo em aba anônima → confirmar e-mail → entrar → badge **"Gratuito"** no dashboard; no banco, assinatura Gratuito ativa sem data de fim. **Nunca "Mensal".**
- [ ] 16. **[Regressão]** Gerenciar Acesso abre **sem plano pré-selecionado**; salvar sem escolher não cria assinatura.
- [ ] 17. Atribuir Mensal (com data) e depois Gratuito (campos de data/status somem) → coluna reflete cada mudança → `subscription_logs` grava os 2 registros.
- [ ] 18. Conta Gratuito: responder 20 questões distintas → a 21ª mostra o bloqueio elegante com CTA para /planos; refazer as 20 continua liberado.
- [ ] 19. A mesma conta com Mensal atribuído → 21ª questão funciona, sem banner de limite.
- [ ] 20. **[Regressão]** Dashboard de aluno com respostas antigas mostra números > 0 sem responder nada de novo.
- [ ] 21. Refazer questão → "Você fez Nx" sobe → no banco há 2+ linhas do mesmo aluno na mesma questão (histórico preservado).
- [ ] 22. Conta Gratuito não aparece em "Alunos Ativos" e não ganha acesso de assinante.
- [ ] 23. Fluxo completo: cadastro → login → Questões → Matemática → responder → feedback + estatísticas → Refazer, com console (F12) sem erros.
- [ ] 24. Nenhum caminho entrega material de graça: seções do aluno levam à loja; URL antiga `/aluno/atividades-pdf/matematica` redireciona à loja filtrada.

## F. Promoção a produção

- [ ] 25. Rodar também o smoke test de 10 minutos (Seção 6 da auditoria).
- [ ] 26. Abrir PR da branch para a `main`, revisar e fazer merge.
- [ ] 27. Promover o deploy a produção e repetir o smoke test em produção.
- [ ] 28. **Migração gradual dos materiais (cliente):** em cada tela de Atividades/Resumos/Mapas/Jogos do admin, usar "Enviar para a Loja" item a item; na Loja, definir preço (e link Hotmart quando houver) e ativar.

---

## ⚠️ Se a ordem inverter (deploy do código ANTES das migrations)

| Tela | O que quebra |
|---|---|
| Gerenciar Acesso (admin) | Seletor de planos **vazio** (consulta coluna `is_active` inexistente) — impossível atribuir plano |
| Banco de Questões (aluno gratuito) | Aluno sem assinatura paga **não vê nenhuma questão** (RLS antigo ainda exige assinatura) |
| Resolução de questão | **Refazer quebra** ("Erro ao registrar resposta" — trava de unicidade ainda existe); estatísticas somem; **limite do Gratuito não é aplicado** (função inexistente → contagem 0 → gratuito ilimitado = risco de receita) |
| Admin de produtos | **Salvar produto falha** (colunas material_type/subject/promo_price inexistentes) |
| Upload de imagens | Falha com "bucket not found" (produto e questão) |
| Lojas (pública, aluno, home) | Lista **sempre vazia** (busca filtra por colunas inexistentes → erro engolido → 0 resultados) |
| Cadastro | Não quebra, mas o aluno novo nasce **sem** assinatura Gratuito (trigger antigo) — backfill da 0011 corrige depois |
