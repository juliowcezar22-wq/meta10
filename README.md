# META 10 — Plataforma de Reforço Escolar

Next.js 14 (App Router) + Supabase (Auth, Postgres com RLS, Storage) + Tailwind. Deploy na Vercel.

## Áreas

- **Site público** (`src/app/(public)`): landing, sobre, materiais, loja com busca/filtros, planos.
- **Admin** (`src/app/admin`): usuários e planos (Gerenciar Acesso), Banco de Questões (com imagens e estatísticas), loja/produtos, materiais (em migração gradual para a loja), disciplinas/assuntos, depoimentos, sugestões.
- **Aluno** (`src/app/aluno`): dashboard com métricas, Banco de Questões (responder, refazer, estatísticas estilo QConcursos, limite do plano Gratuito), loja, sugestões.

## Rodar localmente

```bash
npm install
cp .env.local.example .env.local   # preencha com as chaves do Supabase
npm run dev                        # http://localhost:3000
```

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`

> Atenção: `.env.local` apontando para o projeto real = dev local escreve no banco de produção. Use e-mails descartáveis em testes de cadastro.

## Banco de dados

Migrations versionadas em `supabase/migrations/` (0001–0017 aplicadas em produção). Para aplicar novas: SQL Editor do Supabase seguindo `RUNBOOK_MIGRATIONS.md`. **Não rodar**: `0010` (DROP de simulados, aguarda aprovação) e `0014` (obsoleta).

Regras de negócio centrais no código:

- `src/lib/plans.ts` — planos (Gratuito/Mensal/Anual) e `FREE_PLAN_QUESTION_LIMIT`.
- `src/lib/constants.ts` — tipos de material da loja, rótulos.
- Disciplinas e assuntos são dinâmicos (tabelas `disciplines`/`subjects`) — nunca hardcodar nomes.

## Autenticação e autorização

- Middleware (`src/middleware.ts`) roda só em `/admin` e `/aluno` (refresh de sessão com timeout).
- Guards de servidor em `src/lib/auth/guards.ts` (`requireAuth`/`requireAdmin`/`requireAdminOrProfessor`).
- Autorização de dados no Postgres via RLS (ver policies nas migrations).

## Deploy

`git push` na `main` → Vercel. Checklist completo (migrations → deploy → smoke test) em `CHECKLIST_DEPLOY.md`. Auditoria da última grande entrega em `AUDITORIA_META10.md`.
