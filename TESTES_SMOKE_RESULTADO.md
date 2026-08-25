# Smoke test (somente leitura) — META 10

| Campo | Valor |
|---|---|
| Data | 2026-08-25 |
| Branch | `feat/decisoes-cliente` |
| Commit | `df3601a docs: corrigir descrição das contas na migration 0012 (Emília é admin/dona)` |
| Ambiente | `next dev -p 3100` (Next.js 14.2.35), `.env.local` apontando para o Supabase de PRODUÇÃO |
| Método | Apenas `curl` GET/HEAD contra o servidor local e GET REST no Supabase. Nenhuma escrita, login, formulário, server action ou migration foi executada. |

Resumo: **7 PASS, 2 FAIL, 1 BLOQUEADO**.

## Tabela de resultados

| # | Teste | Status | Evidência |
|---|---|---|---|
| T1 | Páginas públicas retornam 200 | **PASS** | `/` 200 (129.713 B), `/sobre` 200, `/materiais` 200, `/loja` 200, `/planos` 200, `/login` 200, `/cadastro` 200. |
| T2 | Conteúdo da home | **FAIL (parcial — causa no ambiente, não no código)** | OK: "Banco de Questões" (12x); planos `Plano Gratuito`, `Plano Mensal`, `Plano Anual` (`<h3>Plano <!-- -->Gratuito</h3>` etc.); "Semestral" 0x; "Meta10" como plano 0x (só aparece em nomes de arquivo `logomarca-meta10.png`); "Mais Vantajoso" 2x; `wa.me` 5x (`href="https://wa.me/5575983341771"`); "simulado" 0x; "PDFs" 0x; menu `<nav>` com `Início`, `Sobre`, `Materiais`, `Loja`; subtítulo do hero: `Questões, atividades em PDF, mapas mentais e resumos organizados para você estudar...`. **FALHOU**: "Assinar pelo WhatsApp" 0x — os CTAs dos planos são `Assinar Agora` apontando para `https://pay.hotmart.com/placeholder-mensal` e `.../placeholder-anual`. Motivo: o `.env.local` desta máquina define `NEXT_PUBLIC_HOTMART_MENSAL` e `NEXT_PUBLIC_HOTMART_ANUAL` com URLs placeholder, então `plan.link` fica preenchido e o fallback WhatsApp (`src/lib/plans.ts:58,72`; `src/components/meta10/pricing-section.tsx:71`) não é acionado. O fallback existe no código, mas não foi exercitado. Atenção: se essas URLs placeholder forem para produção, o botão "Assinar Agora" ficará quebrado. |
| T3 | `/materiais` com 5 cards e hrefs corretos | **PASS** | 5 `<h3>` de card: Banco de Questões, Atividades em PDF, Mapas Mentais, Resumos, Jogos Pedagógicos. hrefs presentes (1x cada): `/aluno/dashboard`, `/loja?tipo=atividade_pdf`, `/loja?tipo=mapa_mental`, `/loja?tipo=resumo`, `/loja?tipo=jogo`. |
| T4 | `/loja` e filtro por tipo/disciplina | **PASS** (estado vazio) | `/loja` contém "Buscar por nome", "Navegar por categoria", "Todos os materiais" (1x cada). `/loja?tipo=mapa_mental&disciplina=matematica` → 200, `<h1>Loja de Produtos</h1>` + `<h2>Nenhum produto encontrado</h2><p>Nenhum resultado com os filtros atuais...`. O estado vazio decorre do banco inacessível (ver T9/T10), não de erro de renderização. |
| T5 | Redirects 308 (next.config.js) | **PASS** | `/aluno/questoes` → 308 `location: /aluno/questoes-avulsas`; `/admin/questoes` → 308 `/admin/questoes-avulsas`; `/aluno/atividades-pdf/matematica` → 308 `/aluno/loja?tipo=atividade_pdf&disciplina=matematica`; `/aluno/mapas-mentais/historia` → 308 `/aluno/loja?tipo=mapa_mental&disciplina=historia`. |
| T6 | Rotas protegidas → 307 para `/login` | **FAIL** | `/aluno/dashboard`, `/aluno/loja`, `/aluno/questoes-avulsas`, `/admin`, `/admin/produtos` responderam **`HTTP/1.1 200 OK` sem header `Location`** (tanto HEAD quanto GET). Causa raiz: `middleware.ts` está na **raiz do repositório**, mas o projeto usa a pasta `src/` — o Next 14 procura o middleware em `path.join(appDir, "..")` = `src/middleware.ts` (`node_modules/next/dist/esm/server/lib/router-utils/setup-dev-bundler.js:127-129`); o log do dev server nunca registrou compilação de middleware. Consequência: nem o redirect de rota protegida nem o refresh de sessão do middleware estão rodando. Mitigação existente: os layouts `src/app/aluno/layout.tsx` e `src/app/admin/layout.tsx` chamam `requireAuth`/`requireAdminOrProfessor` (`src/lib/auth/guards.ts`), que emitem redirect via streaming — o HTML devolvido contém `<template data-dgst="NEXT_REDIRECT;replace;/login;307;">`, então um navegador acaba em `/login`, mas o status HTTP é 200 e a proteção em nível de middleware (esperada pelo teste) não existe. Correção sugerida: mover `middleware.ts` para `src/middleware.ts`. |
| T7 | CSP da home | **PASS** | `Content-Security-Policy: ... img-src 'self' data: blob: https:; ... connect-src 'self' https://wa.me https://*.supabase.co;`. Também presentes: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. |
| T8 | Sem "simulado"/"Nenhum" como plano; `/planos` com 3 planos | **PASS** | "simulado" (ci) = 0 em `/`, `/sobre`, `/materiais`, `/loja`, `/planos`. "Nenhum" só aparece em `/loja` como "Nenhum produto encontrado" (estado vazio, não é plano). `/planos`: `<h1>Planos de Assinatura</h1>` e exatamente 3 `<h3>`: `Gratuito`, `Mensal`, `Anual`; "Semestral" 0x. |
| T9 | Banco (GET REST somente leitura) | **BLOQUEADO** | `GET $NEXT_PUBLIC_SUPABASE_URL/rest/v1/plans?select=name` → **HTTP 000**, `curl: (6) Could not resolve host: aohzpfzzmbqtqziugpsj.supabase.co`. `host` retorna `NXDOMAIN` tanto dentro quanto fora do sandbox, enquanto `supabase.com` e `github.com` resolvem normalmente — o host do projeto não existe no DNS (projeto Supabase removido/pausado ou URL desatualizada no `.env.local`). Lista de planos: não obtida. Coluna `is_active`: **não determinável** (mesmo erro de DNS). Chaves não foram impressas. |
| T10 | Log do servidor (`/tmp/meta10-dev.log`) | **PASS (com observação)** | Nenhuma ocorrência de `⨯` ou `Unhandled`. Todos os erros são `TypeError: fetch failed / getaddrinfo ENOTFOUND aohzpfzzmbqtqziugpsj.supabase.co`, logados por `[getActiveTestimonials]` (3x), `[getAllSubjects]` (5x), `[getDisciplines]` (5x), `[searchProducts]` (5x). As páginas degradaram graciosamente (200 com listas vazias). Todas as rotas compilaram sem aviso. |

## Testes NÃO executáveis neste ambiente

Os itens abaixo exigem escrita no banco de PRODUÇÃO (com usuários reais) e/ou dependem das migrations `0011`–`0017`, ainda não aplicadas; além disso, nesta execução o host do Supabase nem sequer resolveu (T9). Por regra deste smoke test (somente GET/HEAD), nenhum deles foi tentado:

- **Cadastro novo** — cria usuário em `auth.users`/`public.users` (escrita em produção).
- **Atribuição de plano** — altera `users.plan_id`/assinaturas (escrita; depende de colunas das migrations 0011–0017).
- **Limite do Gratuito** — precisa de conta logada e contagem de uso gravada (escrita + migrations).
- **Refazer questão** — grava tentativas/respostas (escrita + migrations).
- **Estatísticas** — leitura autenticada que depende de tabelas/views das migrations 0011–0017 e de dados de tentativas.
- **Upload de imagem** — escrita no Supabase Storage (escrita em produção).
- **"Enviar para a Loja"** — server action que grava/publica produto (escrita + migrations).

## Conclusão

A camada pública (páginas, conteúdo dos planos, menu, redirects 308, CSP, ausência de "simulado"/"Semestral") está consistente com as decisões do cliente e passou em todos os pontos verificáveis sem banco.
Dois problemas reais: o `middleware.ts` na raiz é ignorado porque o projeto usa `src/` (rotas `/aluno` e `/admin` só ficam protegidas pelos guards dos layouts, sem 307 nem refresh de sessão) e o CTA dos planos aponta para URLs placeholder da Hotmart em vez do fallback WhatsApp, por causa das variáveis preenchidas no `.env.local`.
O banco não pôde ser validado: o host `aohzpfzzmbqtqziugpsj.supabase.co` não resolve (NXDOMAIN) — confirmar se o projeto Supabase está ativo e se a URL do `.env.local` é a atual antes de qualquer teste autenticado ou de aplicar as migrations 0011–0017.

---

## Correções aplicadas após o teste (mesma sessão)

| Achado | Correção | Reverificação |
|---|---|---|
| **T6 FAIL** — `middleware.ts` na raiz nunca era carregado (projeto usa `src/`; Next 14 só lê `src/middleware.ts`). Pré-existente: em produção o middleware também nunca rodou (proteção vinha só dos guards das páginas; refresh de sessão não acontecia). | Arquivo movido para `src/middleware.ts`. O build passou a listar `ƒ Middleware`. | `/aluno/dashboard` → **307** `/login?redirect=%2Faluno%2Fdashboard`; `/admin` → **307** `/login?redirect=%2Fadmin` ✅ |
| **T2 FAIL parcial** — `.env.local` (e o `.env.local.example`) trazem `pay.hotmart.com/placeholder-…`, então o fallback do WhatsApp não disparava. | `src/lib/plans.ts`: link de checkout só é aceito se for URL real; vazio ou contendo "placeholder" vira "sem checkout" → WhatsApp. Protege a produção caso a Vercel tenha os mesmos valores de exemplo. | Home com **4** CTAs "Assinar pelo WhatsApp" e **0** ocorrências de "placeholder-" ✅ |
| **T9 BLOQUEADO** — DNS do projeto Supabase instável (resolveu 200 no início da sessão, NXDOMAIN durante o teste). | Nenhuma (infra). Reaplicar T9 e os testes autenticados após aplicar as migrations, com o banco acessível. | — |
