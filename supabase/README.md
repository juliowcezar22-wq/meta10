# Supabase — Setup Inicial Meta10

## Pré-requisitos
- Acesso ao Dashboard do projeto Supabase da Emília
- Variáveis preenchidas em `.env.local`
- Supabase CLI disponível via `npx supabase`

## Passo 1: Executar schema inicial
1. Abra o Dashboard Supabase → SQL Editor → New query
2. Abra o arquivo `supabase/migrations/0001_initial_schema.sql`
3. Copie e cole APENAS A PARTE 1 (até o próximo cabeçalho `-- ====`)
4. Clique em RUN
5. Resultado esperado: "Success. No rows returned"
6. Repita o processo para PARTE 2, depois 3, ... até PARTE 10
7. Se qualquer parte falhar, PARE e reporte o erro antes de continuar

## Passo 2: Configurar admin seed
1. Abra `supabase/seeds/0001_admin_seed_config.sql`
2. SUBSTITUA o placeholder pelo email real da Emília (minúsculo)
3. Execute no SQL Editor
4. Verifique que o SELECT no final retorna o email configurado

## Passo 3: Rodar testes de RLS
1. Abra `supabase/tests/0001_rls_tests.sql`
2. Execute teste por teste, validando o resultado conforme comentários
3. Se algum teste falhar, PARE e reporte

## Passo 4: Gerar tipos TypeScript
```bash
npx supabase login
npx supabase gen types typescript --project-id <PROJECT_ID> --schema public > src/lib/supabase/types.ts
```
- O `<PROJECT_ID>` está na URL do dashboard: 
  `https://supabase.com/dashboard/project/<PROJECT_ID>`
- Após executar, verifique que `src/lib/supabase/types.ts` foi 
  substituído (não mais o placeholder)

## Passo 5: Validar build
```bash
npm run build
```
Esperado: build passa sem erros TypeScript.

## Troubleshooting
- "infinite recursion detected": uma policy ainda usa subquery em users. 
  Não deveria ocorrer, mas se ocorrer, reportar.
- "current_setting returns null": a config foi aplicada mas a sessão 
  é antiga. Reconectar ao SQL Editor (refresh da página).
- "permission denied for table": RLS está ativa mas a policy correta 
  não está permitindo. Validar role do usuário logado.
