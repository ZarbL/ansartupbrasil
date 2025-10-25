-- ============================================
-- ANSTARTUP Brasil - Seed Data (Dados de Teste)
-- ============================================
-- ATENÇÃO: Este arquivo é apenas para ambiente de desenvolvimento/teste
-- NÃO executar em produção!
-- ============================================

-- Limpar dados existentes (cuidado!)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE logs_auditoria;
-- TRUNCATE TABLE sessoes;
-- TRUNCATE TABLE usuarios;
-- TRUNCATE TABLE startups;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. Startups de Exemplo
-- ============================================

-- Startup 1: TechPay (Fintech)
INSERT INTO startups (
  id, razao_social, nome_fantasia, cnpj, email_corporativo, telefone,
  site_url, cep, endereco, numero, bairro, cidade, estado,
  area_atuacao, descricao_negocio, data_fundacao, numero_funcionarios,
  estagio_startup, faturamento_anual, status_associacao, tipo_plano
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'TechPay Soluções Financeiras LTDA',
  'TechPay',
  '12.345.678/0001-90',
  'contato@techpay.com.br',
  '(11) 98765-4321',
  'https://techpay.com.br',
  '01310-100',
  'Avenida Paulista',
  '1000',
  'Bela Vista',
  'São Paulo',
  'SP',
  'Fintech',
  'Plataforma de pagamentos instantâneos para e-commerce com foco em pequenos empreendedores.',
  '2021-03-15',
  25,
  'Tração',
  '1M-5M',
  'ativa',
  'premium'
);

-- Startup 2: HealthConnect (Healthtech)
INSERT INTO startups (
  id, razao_social, nome_fantasia, cnpj, email_corporativo, telefone,
  site_url, cep, endereco, numero, bairro, cidade, estado,
  area_atuacao, descricao_negocio, data_fundacao, numero_funcionarios,
  estagio_startup, faturamento_anual, status_associacao, tipo_plano
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'HealthConnect Tecnologia em Saúde S.A.',
  'HealthConnect',
  '23.456.789/0001-01',
  'contato@healthconnect.com.br',
  '(21) 97654-3210',
  'https://healthconnect.com.br',
  '20040-020',
  'Rua da Quitanda',
  '86',
  'Centro',
  'Rio de Janeiro',
  'RJ',
  'Healthtech',
  'Telemedicina e gestão integrada de prontuários eletrônicos para clínicas e hospitais.',
  '2020-08-20',
  45,
  'Escala',
  '5M-10M',
  'ativa',
  'enterprise'
);

-- Startup 3: EduTech Brasil (Edtech)
INSERT INTO startups (
  id, razao_social, nome_fantasia, cnpj, email_corporativo, telefone,
  site_url, cep, endereco, numero, bairro, cidade, estado,
  area_atuacao, descricao_negocio, data_fundacao, numero_funcionarios,
  estagio_startup, faturamento_anual, status_associacao, tipo_plano
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'EduTech Brasil Educação Digital LTDA',
  'EduTech Brasil',
  '34.567.890/0001-12',
  'contato@edutechbrasil.com.br',
  '(31) 96543-2109',
  'https://edutechbrasil.com.br',
  '30130-100',
  'Avenida Afonso Pena',
  '1500',
  'Centro',
  'Belo Horizonte',
  'MG',
  'Edtech',
  'Plataforma de ensino adaptativo com inteligência artificial para educação básica.',
  '2022-01-10',
  15,
  'MVP',
  '500K-1M',
  'ativa',
  'profissional'
);

-- Startup 4: AgroSmart (Agritech) - Pendente
INSERT INTO startups (
  id, razao_social, nome_fantasia, cnpj, email_corporativo, telefone,
  site_url, cep, endereco, numero, bairro, cidade, estado,
  area_atuacao, descricao_negocio, data_fundacao, numero_funcionarios,
  estagio_startup, faturamento_anual, status_associacao, tipo_plano
) VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  'AgroSmart Tecnologia Agrícola LTDA',
  'AgroSmart',
  '45.678.901/0001-23',
  'contato@agrosmart.com.br',
  '(47) 95432-1098',
  'https://agrosmart.com.br',
  '89010-000',
  'Rua XV de Novembro',
  '750',
  'Centro',
  'Blumenau',
  'SC',
  'Agritech',
  'Sensores IoT e análise de dados para agricultura de precisão.',
  '2023-06-01',
  8,
  'Ideia',
  'Até 100K',
  'pendente',
  'basico'
);

-- Startup 5: LogiTech (Logtech)
INSERT INTO startups (
  id, razao_social, nome_fantasia, cnpj, email_corporativo, telefone,
  site_url, cep, endereco, numero, bairro, cidade, estado,
  area_atuacao, descricao_negocio, data_fundacao, numero_funcionarios,
  estagio_startup, faturamento_anual, status_associacao, tipo_plano
) VALUES (
  '550e8400-e29b-41d4-a716-446655440005',
  'LogiTech Soluções Logísticas S.A.',
  'LogiTech',
  '56.789.012/0001-34',
  'contato@logitech.com.br',
  '(85) 94321-0987',
  'https://logitech.com.br',
  '60160-230',
  'Avenida Desembargador Moreira',
  '2000',
  'Aldeota',
  'Fortaleza',
  'CE',
  'Logtech',
  'Sistema de gestão e otimização de rotas para transportadoras.',
  '2021-11-05',
  30,
  'Tração',
  '1M-5M',
  'ativa',
  'profissional'
);

-- ============================================
-- 2. Usuários de Exemplo
-- ============================================
-- Nota: As senhas abaixo são "SenhaSegura123!" hasheadas com bcrypt (10 rounds)
-- Hash gerado: $2b$10$YourBcryptHashHere (este é um exemplo, precisa gerar real)

-- Usuário 1: Admin da TechPay
INSERT INTO usuarios (
  id, startup_id, nome_completo, cpf, email, telefone_celular,
  cargo, tipo_usuario, senha_hash, salt,
  email_verificado, ativo
) VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'João Silva',
  '123.456.789-00',
  'joao.silva@techpay.com.br',
  '(11) 98765-4321',
  'CEO & Fundador',
  'admin',
  '$2b$10$YourBcryptHashHere123456789012345678901234567890123456', -- Senha: SenhaSegura123!
  'randomsalt123',
  TRUE,
  TRUE
);

-- Usuário 2: Representante da TechPay
INSERT INTO usuarios (
  id, startup_id, nome_completo, cpf, email, telefone_celular,
  cargo, tipo_usuario, senha_hash, salt,
  email_verificado, ativo
) VALUES (
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'Maria Santos',
  '234.567.890-11',
  'maria.santos@techpay.com.br',
  '(11) 97654-3210',
  'CFO',
  'representante',
  '$2b$10$YourBcryptHashHere123456789012345678901234567890123456',
  'randomsalt456',
  TRUE,
  TRUE
);

-- Usuário 3: Admin da HealthConnect
INSERT INTO usuarios (
  id, startup_id, nome_completo, cpf, email, telefone_celular,
  cargo, tipo_usuario, senha_hash, salt,
  email_verificado, ativo
) VALUES (
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  'Pedro Oliveira',
  '345.678.901-22',
  'pedro.oliveira@healthconnect.com.br',
  '(21) 96543-2109',
  'CEO',
  'admin',
  '$2b$10$YourBcryptHashHere123456789012345678901234567890123456',
  'randomsalt789',
  TRUE,
  TRUE
);

-- Usuário 4: Admin da EduTech
INSERT INTO usuarios (
  id, startup_id, nome_completo, cpf, email, telefone_celular,
  cargo, tipo_usuario, senha_hash, salt,
  email_verificado, ativo
) VALUES (
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440003',
  'Ana Costa',
  '456.789.012-33',
  'ana.costa@edutechbrasil.com.br',
  '(31) 95432-1098',
  'Fundadora & CTO',
  'admin',
  '$2b$10$YourBcryptHashHere123456789012345678901234567890123456',
  'randomsalt012',
  TRUE,
  TRUE
);

-- Usuário 5: Admin da AgroSmart (Email não verificado - Pendente)
INSERT INTO usuarios (
  id, startup_id, nome_completo, cpf, email, telefone_celular,
  cargo, tipo_usuario, senha_hash, salt,
  email_verificado, ativo
) VALUES (
  '660e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440004',
  'Carlos Mendes',
  '567.890.123-44',
  'carlos.mendes@agrosmart.com.br',
  '(47) 94321-0987',
  'CEO',
  'admin',
  '$2b$10$YourBcryptHashHere123456789012345678901234567890123456',
  'randomsalt345',
  FALSE, -- Email não verificado
  TRUE
);

-- Usuário 6: Admin da LogiTech
INSERT INTO usuarios (
  id, startup_id, nome_completo, cpf, email, telefone_celular,
  cargo, tipo_usuario, senha_hash, salt,
  email_verificado, ativo
) VALUES (
  '660e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440005',
  'Beatriz Lima',
  '678.901.234-55',
  'beatriz.lima@logitech.com.br',
  '(85) 93210-9876',
  'Co-fundadora',
  'admin',
  '$2b$10$YourBcryptHashHere123456789012345678901234567890123456',
  'randomsalt678',
  TRUE,
  TRUE
);

-- ============================================
-- 3. Logs de Auditoria de Exemplo
-- ============================================

-- Log de cadastro bem-sucedido
INSERT INTO logs_auditoria (
  usuario_id, startup_id, acao, descricao,
  ip_address, user_agent, sucesso
) VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'CADASTRO',
  'Cadastro de startup e usuário admin realizado com sucesso',
  '192.168.1.100',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  TRUE
);

-- Log de login bem-sucedido
INSERT INTO logs_auditoria (
  usuario_id, startup_id, acao, descricao,
  ip_address, user_agent, sucesso
) VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'LOGIN',
  'Login realizado com sucesso',
  '192.168.1.100',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  TRUE
);

-- Log de tentativa de login falha
INSERT INTO logs_auditoria (
  usuario_id, startup_id, acao, descricao,
  ip_address, user_agent, sucesso, codigo_erro, mensagem_erro
) VALUES (
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'LOGIN',
  'Tentativa de login com senha incorreta',
  '192.168.1.101',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  FALSE,
  'AUTH_001',
  'Senha incorreta'
);

-- Log de verificação de email
INSERT INTO logs_auditoria (
  usuario_id, startup_id, acao, descricao,
  ip_address, user_agent, sucesso
) VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'VERIFICACAO_EMAIL',
  'Email verificado com sucesso',
  '192.168.1.100',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  TRUE
);

-- Log de alteração de senha
INSERT INTO logs_auditoria (
  usuario_id, startup_id, acao, descricao,
  ip_address, user_agent, sucesso
) VALUES (
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  'ALTERACAO_SENHA',
  'Senha alterada com sucesso pelo usuário',
  '192.168.1.102',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
  TRUE
);

-- ============================================
-- 4. Queries úteis para verificação
-- ============================================

-- Verificar startups cadastradas
-- SELECT * FROM startups;

-- Verificar usuários cadastrados
-- SELECT u.nome_completo, u.email, u.cargo, s.nome_fantasia
-- FROM usuarios u
-- INNER JOIN startups s ON u.startup_id = s.id;

-- Verificar logs de auditoria
-- SELECT * FROM logs_auditoria ORDER BY created_at DESC LIMIT 10;

-- Verificar startups ativas com seus representantes
-- SELECT * FROM v_startups_ativas;

-- Estatísticas de login
-- SELECT * FROM v_estatisticas_login LIMIT 7;

-- ============================================
-- 5. Comandos para limpar dados de teste
-- ============================================

/*
-- Para limpar todos os dados de teste:
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE logs_auditoria;
TRUNCATE TABLE sessoes;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE startups;
SET FOREIGN_KEY_CHECKS = 1;
*/

-- ============================================
-- FIM DO SEED
-- ============================================
