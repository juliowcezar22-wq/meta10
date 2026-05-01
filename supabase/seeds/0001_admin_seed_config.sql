-- ============================================================
-- CONFIGURAÇÃO DO ADMIN SEED EMAIL
-- ============================================================
-- IMPORTANTE: substitua 'COLOQUE_O_EMAIL_DA_EMILIA_AQUI@exemplo.com'
-- pelo email REAL que será usado no cadastro do admin.
-- 
-- O email deve ser EXATAMENTE igual ao que será cadastrado depois
-- (mesmo case, sem espaços extras). Recomendado: tudo minúsculo.
-- 
-- Execute APENAS UMA VEZ, antes do primeiro signup do admin.
-- ============================================================

ALTER DATABASE postgres SET app.admin_seed_email = 'COLOQUE_O_EMAIL_DA_EMILIA_AQUI@exemplo.com';

-- Validação: o comando abaixo deve retornar o email configurado.
-- Se retornar NULL, a config não foi aplicada (provavelmente precisa 
-- abrir nova conexão).
SELECT current_setting('app.admin_seed_email', true) AS admin_seed_email_configurado;
