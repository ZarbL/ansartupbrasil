-- ============================================
-- ANSTARTUP Brasil - Database Schema
-- Compatible with Google Cloud SQL (MySQL 8.0+)
-- ============================================

-- Definir charset e collation padrão
SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;

-- ============================================
-- 1. Tabela: startups
-- ============================================
CREATE TABLE IF NOT EXISTS startups (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID da startup',
  
  -- Dados Cadastrais
  razao_social VARCHAR(255) NOT NULL COMMENT 'Razão social da empresa',
  nome_fantasia VARCHAR(255) NOT NULL COMMENT 'Nome fantasia',
  cnpj VARCHAR(18) UNIQUE NOT NULL COMMENT 'CNPJ no formato 00.000.000/0000-00',
  email_corporativo VARCHAR(255) UNIQUE NOT NULL COMMENT 'Email principal da empresa',
  telefone VARCHAR(20) COMMENT 'Telefone principal',
  site_url VARCHAR(255) COMMENT 'Website da startup',
  
  -- Endereço
  cep VARCHAR(10) COMMENT 'CEP no formato 00000-000',
  endereco VARCHAR(255) COMMENT 'Logradouro',
  numero VARCHAR(20) COMMENT 'Número do endereço',
  complemento VARCHAR(100) COMMENT 'Complemento',
  bairro VARCHAR(100) COMMENT 'Bairro',
  cidade VARCHAR(100) NOT NULL COMMENT 'Cidade',
  estado VARCHAR(2) NOT NULL COMMENT 'UF (sigla do estado)',
  pais VARCHAR(50) DEFAULT 'Brasil' COMMENT 'País',
  
  -- Informações da Startup
  area_atuacao VARCHAR(100) COMMENT 'Fintech, Healthtech, Edtech, Agritech, etc.',
  descricao_negocio TEXT COMMENT 'Descrição detalhada do negócio',
  data_fundacao DATE COMMENT 'Data de fundação da startup',
  numero_funcionarios INT COMMENT 'Quantidade de funcionários',
  estagio_startup VARCHAR(50) COMMENT 'Ideia, MVP, Tração, Escala',
  faturamento_anual VARCHAR(50) COMMENT 'Faixa de faturamento',
  
  -- Status de Associação
  status_associacao ENUM('pendente', 'ativa', 'suspensa', 'cancelada') 
    DEFAULT 'pendente' 
    COMMENT 'Status atual da associação',
  tipo_plano ENUM('basico', 'profissional', 'premium', 'enterprise') 
    DEFAULT 'basico' 
    COMMENT 'Tipo de plano contratado',
  data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de filiação',
  data_renovacao DATE COMMENT 'Data de renovação da associação',
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de atualização',
  
  -- Índices para performance
  INDEX idx_cnpj (cnpj),
  INDEX idx_email (email_corporativo),
  INDEX idx_status (status_associacao),
  INDEX idx_cidade_estado (cidade, estado),
  INDEX idx_area_atuacao (area_atuacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Startups associadas';

-- ============================================
-- 2. Tabela: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID do usuário',
  startup_id VARCHAR(36) NOT NULL COMMENT 'FK para a startup',
  
  -- Dados Pessoais
  nome_completo VARCHAR(255) NOT NULL COMMENT 'Nome completo do usuário',
  cpf VARCHAR(14) UNIQUE NOT NULL COMMENT 'CPF no formato 000.000.000-00',
  email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Email pessoal',
  telefone_celular VARCHAR(20) COMMENT 'Celular com DDD',
  
  -- Cargo/Função
  cargo VARCHAR(100) COMMENT 'CEO, CTO, CFO, Fundador, etc.',
  tipo_usuario ENUM('admin', 'representante', 'membro') 
    DEFAULT 'representante' 
    COMMENT 'Nível de acesso do usuário',
  
  -- Autenticação
  senha_hash VARCHAR(255) NOT NULL COMMENT 'Senha hasheada com bcrypt',
  salt VARCHAR(255) NOT NULL COMMENT 'Salt usado no hash',
  ultimo_login TIMESTAMP NULL COMMENT 'Data/hora do último login',
  tentativas_login INT DEFAULT 0 COMMENT 'Contador de tentativas falhas',
  bloqueado_ate TIMESTAMP NULL COMMENT 'Data/hora até quando está bloqueado',
  
  -- Verificação de Email
  email_verificado BOOLEAN DEFAULT FALSE COMMENT 'Se o email foi verificado',
  token_verificacao VARCHAR(255) COMMENT 'Token de verificação de email',
  token_verificacao_expira TIMESTAMP NULL COMMENT 'Expiração do token de verificação',
  
  -- Recuperação de Senha
  token_recuperacao VARCHAR(255) COMMENT 'Token de recuperação de senha',
  token_recuperacao_expira TIMESTAMP NULL COMMENT 'Expiração do token de recuperação',
  
  -- Status
  ativo BOOLEAN DEFAULT TRUE COMMENT 'Se o usuário está ativo',
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de atualização',
  
  -- Chave estrangeira
  FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE,
  
  -- Índices para performance
  INDEX idx_email (email),
  INDEX idx_cpf (cpf),
  INDEX idx_startup (startup_id),
  INDEX idx_tipo_usuario (tipo_usuario),
  INDEX idx_email_verificado (email_verificado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Usuários do sistema';

-- ============================================
-- 3. Tabela: sessoes
-- ============================================
CREATE TABLE IF NOT EXISTS sessoes (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID da sessão',
  usuario_id VARCHAR(36) NOT NULL COMMENT 'FK para o usuário',
  
  -- Tokens
  refresh_token VARCHAR(512) UNIQUE NOT NULL COMMENT 'Refresh token JWT',
  access_token_jti VARCHAR(255) UNIQUE NOT NULL COMMENT 'JWT ID para invalidação',
  
  -- Informações da Sessão
  ip_address VARCHAR(45) COMMENT 'IP do cliente (IPv4 ou IPv6)',
  user_agent TEXT COMMENT 'User agent do navegador',
  dispositivo VARCHAR(100) COMMENT 'Tipo de dispositivo',
  navegador VARCHAR(100) COMMENT 'Nome do navegador',
  
  -- Controle de Expiração
  expires_at TIMESTAMP NOT NULL COMMENT 'Data/hora de expiração',
  ultimo_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Último uso da sessão',
  
  -- Status
  ativa BOOLEAN DEFAULT TRUE COMMENT 'Se a sessão está ativa',
  revogada_em TIMESTAMP NULL COMMENT 'Data/hora de revogação',
  motivo_revogacao VARCHAR(255) COMMENT 'Motivo da revogação',
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  
  -- Chave estrangeira
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  
  -- Índices para performance
  INDEX idx_usuario (usuario_id),
  INDEX idx_refresh_token (refresh_token),
  INDEX idx_expires (expires_at),
  INDEX idx_ativa (ativa),
  INDEX idx_access_token_jti (access_token_jti)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sessões ativas de usuários';

-- ============================================
-- 4. Tabela: logs_auditoria
-- ============================================
CREATE TABLE IF NOT EXISTS logs_auditoria (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID sequencial do log',
  usuario_id VARCHAR(36) COMMENT 'FK para o usuário (pode ser NULL)',
  startup_id VARCHAR(36) COMMENT 'FK para a startup (pode ser NULL)',
  
  -- Ação
  acao VARCHAR(100) NOT NULL COMMENT 'LOGIN, LOGOUT, ALTERACAO_SENHA, etc.',
  descricao TEXT COMMENT 'Descrição detalhada da ação',
  
  -- Contexto
  ip_address VARCHAR(45) COMMENT 'IP do cliente',
  user_agent TEXT COMMENT 'User agent do navegador',
  
  -- Status
  sucesso BOOLEAN DEFAULT TRUE COMMENT 'Se a ação foi bem-sucedida',
  codigo_erro VARCHAR(50) COMMENT 'Código do erro (se houver)',
  mensagem_erro TEXT COMMENT 'Mensagem de erro detalhada',
  
  -- Metadados
  metadados JSON COMMENT 'Dados adicionais em formato JSON',
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data/hora da ação',
  
  -- Chaves estrangeiras (SET NULL para não perder logs se usuário/startup for deletado)
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE SET NULL,
  
  -- Índices para performance
  INDEX idx_usuario (usuario_id),
  INDEX idx_startup (startup_id),
  INDEX idx_acao (acao),
  INDEX idx_created (created_at),
  INDEX idx_sucesso (sucesso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logs de auditoria do sistema';

-- ============================================
-- 5. Tabela: configuracoes_sistema (Opcional)
-- ============================================
CREATE TABLE IF NOT EXISTS configuracoes_sistema (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(100) UNIQUE NOT NULL COMMENT 'Chave da configuração',
  valor TEXT COMMENT 'Valor da configuração',
  tipo VARCHAR(50) COMMENT 'string, number, boolean, json',
  descricao TEXT COMMENT 'Descrição da configuração',
  editavel BOOLEAN DEFAULT TRUE COMMENT 'Se pode ser editada via interface',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_chave (chave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Configurações gerais do sistema';

-- ============================================
-- 6. Inserir configurações padrão
-- ============================================
INSERT INTO configuracoes_sistema (chave, valor, tipo, descricao, editavel) VALUES
  ('max_tentativas_login', '5', 'number', 'Máximo de tentativas de login antes de bloquear', TRUE),
  ('tempo_bloqueio_minutos', '30', 'number', 'Tempo de bloqueio após exceder tentativas (minutos)', TRUE),
  ('expiracao_token_verificacao_horas', '24', 'number', 'Validade do token de verificação de email (horas)', TRUE),
  ('expiracao_token_recuperacao_horas', '1', 'number', 'Validade do token de recuperação de senha (horas)', TRUE),
  ('manutencao_ativa', 'false', 'boolean', 'Sistema em manutenção', TRUE),
  ('mensagem_manutencao', 'Sistema em manutenção. Voltamos em breve.', 'string', 'Mensagem exibida durante manutenção', TRUE)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 7. Views úteis
-- ============================================

-- View: Startups ativas com seus representantes
CREATE OR REPLACE VIEW v_startups_ativas AS
SELECT 
  s.id AS startup_id,
  s.nome_fantasia,
  s.razao_social,
  s.cnpj,
  s.email_corporativo,
  s.cidade,
  s.estado,
  s.area_atuacao,
  s.status_associacao,
  s.tipo_plano,
  u.id AS usuario_id,
  u.nome_completo AS representante_nome,
  u.email AS representante_email,
  u.cargo AS representante_cargo,
  u.tipo_usuario
FROM startups s
INNER JOIN usuarios u ON s.id = u.startup_id
WHERE s.status_associacao = 'ativa' 
  AND u.ativo = TRUE
  AND u.email_verificado = TRUE;

-- View: Estatísticas de login
CREATE OR REPLACE VIEW v_estatisticas_login AS
SELECT 
  DATE(created_at) AS data,
  COUNT(*) AS total_logins,
  SUM(CASE WHEN sucesso = TRUE THEN 1 ELSE 0 END) AS logins_sucesso,
  SUM(CASE WHEN sucesso = FALSE THEN 1 ELSE 0 END) AS logins_falha
FROM logs_auditoria
WHERE acao = 'LOGIN'
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- ============================================
-- 8. Stored Procedures úteis
-- ============================================

-- Procedure: Limpar tokens expirados
DELIMITER //
CREATE PROCEDURE sp_limpar_tokens_expirados()
BEGIN
  -- Limpar tokens de verificação expirados
  UPDATE usuarios 
  SET 
    token_verificacao = NULL,
    token_verificacao_expira = NULL
  WHERE token_verificacao_expira < NOW() 
    AND token_verificacao IS NOT NULL;
  
  -- Limpar tokens de recuperação expirados
  UPDATE usuarios 
  SET 
    token_recuperacao = NULL,
    token_recuperacao_expira = NULL
  WHERE token_recuperacao_expira < NOW() 
    AND token_recuperacao IS NOT NULL;
  
  -- Desbloquear usuários cujo tempo de bloqueio expirou
  UPDATE usuarios 
  SET 
    bloqueado_ate = NULL,
    tentativas_login = 0
  WHERE bloqueado_ate < NOW() 
    AND bloqueado_ate IS NOT NULL;
  
  -- Marcar sessões expiradas como inativas
  UPDATE sessoes 
  SET ativa = FALSE
  WHERE expires_at < NOW() 
    AND ativa = TRUE;
END //
DELIMITER ;

-- Procedure: Registrar log de auditoria
DELIMITER //
CREATE PROCEDURE sp_registrar_log(
  IN p_usuario_id VARCHAR(36),
  IN p_startup_id VARCHAR(36),
  IN p_acao VARCHAR(100),
  IN p_descricao TEXT,
  IN p_ip_address VARCHAR(45),
  IN p_user_agent TEXT,
  IN p_sucesso BOOLEAN,
  IN p_codigo_erro VARCHAR(50),
  IN p_mensagem_erro TEXT,
  IN p_metadados JSON
)
BEGIN
  INSERT INTO logs_auditoria (
    usuario_id, startup_id, acao, descricao,
    ip_address, user_agent, sucesso,
    codigo_erro, mensagem_erro, metadados
  ) VALUES (
    p_usuario_id, p_startup_id, p_acao, p_descricao,
    p_ip_address, p_user_agent, p_sucesso,
    p_codigo_erro, p_mensagem_erro, p_metadados
  );
END //
DELIMITER ;

-- ============================================
-- 9. Event Scheduler (Limpeza automática)
-- ============================================

-- Habilitar event scheduler
SET GLOBAL event_scheduler = ON;

-- Evento: Limpar tokens expirados a cada hora
CREATE EVENT IF NOT EXISTS evt_limpar_tokens
  ON SCHEDULE EVERY 1 HOUR
  STARTS CURRENT_TIMESTAMP
  DO CALL sp_limpar_tokens_expirados();

-- Evento: Limpar logs antigos (manter últimos 90 dias)
CREATE EVENT IF NOT EXISTS evt_limpar_logs_antigos
  ON SCHEDULE EVERY 1 DAY
  STARTS CURRENT_TIMESTAMP + INTERVAL 1 DAY
  DO DELETE FROM logs_auditoria WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- ============================================
-- FIM DO SCHEMA
-- ============================================
