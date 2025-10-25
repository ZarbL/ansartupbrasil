# 🗄️ Database - ANSTARTUP Brasil

Este diretório contém todos os scripts SQL necessários para configurar o banco de dados do sistema de login e gestão de associados da ANSTARTUP Brasil.

---

## 📁 Estrutura de Arquivos

```
database/
├── README.md          # Este arquivo
├── schema.sql         # Estrutura completa do banco (tabelas, views, procedures)
└── seed.sql           # Dados de teste para desenvolvimento
```

---

## 🚀 Quick Start

### 1. Criar o Banco de Dados

```sql
-- No Google Cloud SQL Console ou cliente MySQL
CREATE DATABASE anstartup_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE anstartup_db;
```

### 2. Executar o Schema

```bash
# Via MySQL CLI
mysql -h <host> -u <user> -p anstartup_db < database/schema.sql

# Via Google Cloud SQL Proxy
mysql -u root -p --host=127.0.0.1 --port=3306 anstartup_db < database/schema.sql
```

### 3. (Opcional) Carregar Dados de Teste

```bash
# Apenas para ambiente de desenvolvimento
mysql -h <host> -u <user> -p anstartup_db < database/seed.sql
```

---

## 📋 Descrição dos Scripts

### `schema.sql`

Script principal que cria toda a estrutura do banco de dados:

**Tabelas:**
- ✅ `startups` - Dados das startups associadas
- ✅ `usuarios` - Usuários do sistema (representantes)
- ✅ `sessoes` - Sessões ativas (JWT tokens)
- ✅ `logs_auditoria` - Logs de todas as ações importantes
- ✅ `configuracoes_sistema` - Configurações gerais

**Views:**
- ✅ `v_startups_ativas` - Startups ativas com seus representantes
- ✅ `v_estatisticas_login` - Estatísticas de login por dia

**Stored Procedures:**
- ✅ `sp_limpar_tokens_expirados()` - Limpa tokens expirados
- ✅ `sp_registrar_log()` - Registra logs de auditoria

**Events:**
- ✅ `evt_limpar_tokens` - Executa a cada hora
- ✅ `evt_limpar_logs_antigos` - Executa diariamente

### `seed.sql`

Dados de exemplo para testes:

- 5 startups de diferentes áreas (Fintech, Healthtech, Edtech, Agritech, Logtech)
- 6 usuários representantes
- Logs de auditoria simulados
- Queries úteis para verificação

**⚠️ ATENÇÃO:** Não executar em produção!

---

## 🗂️ Estrutura de Tabelas

### 1. `startups`

Armazena informações das startups associadas.

**Campos principais:**
- `id` (UUID) - Identificador único
- `cnpj` (UNIQUE) - CNPJ da empresa
- `razao_social`, `nome_fantasia` - Identificação
- `email_corporativo` (UNIQUE) - Email principal
- `area_atuacao` - Fintech, Healthtech, etc.
- `status_associacao` - pendente, ativa, suspensa, cancelada
- `tipo_plano` - basico, profissional, premium, enterprise

**Índices:**
- `idx_cnpj`, `idx_email`, `idx_status`, `idx_cidade_estado`, `idx_area_atuacao`

### 2. `usuarios`

Gerencia usuários e autenticação.

**Campos principais:**
- `id` (UUID) - Identificador único
- `startup_id` (FK) - Startup à qual pertence
- `cpf` (UNIQUE), `email` (UNIQUE) - Identificadores
- `senha_hash`, `salt` - Autenticação
- `tipo_usuario` - admin, representante, membro
- `email_verificado` - Boolean
- `token_verificacao`, `token_recuperacao` - Para emails
- `tentativas_login`, `bloqueado_ate` - Segurança

**Índices:**
- `idx_email`, `idx_cpf`, `idx_startup`, `idx_tipo_usuario`, `idx_email_verificado`

### 3. `sessoes`

Controla sessões ativas e tokens JWT.

**Campos principais:**
- `id` (UUID) - Identificador único
- `usuario_id` (FK) - Usuário da sessão
- `refresh_token` (UNIQUE) - Refresh token JWT
- `access_token_jti` (UNIQUE) - JWT ID para invalidação
- `ip_address`, `user_agent` - Informações do cliente
- `expires_at` - Expiração da sessão
- `ativa` - Boolean

**Índices:**
- `idx_usuario`, `idx_refresh_token`, `idx_expires`, `idx_ativa`, `idx_access_token_jti`

### 4. `logs_auditoria`

Registra todas as ações importantes do sistema.

**Campos principais:**
- `id` (BIGINT AUTO_INCREMENT) - Identificador sequencial
- `usuario_id`, `startup_id` (FK nullable) - Relacionamentos
- `acao` - LOGIN, LOGOUT, CADASTRO, etc.
- `descricao` - Detalhes da ação
- `sucesso` - Boolean
- `metadados` - JSON para dados adicionais

**Índices:**
- `idx_usuario`, `idx_startup`, `idx_acao`, `idx_created`, `idx_sucesso`

### 5. `configuracoes_sistema`

Configurações gerais do sistema.

**Campos principais:**
- `chave` (UNIQUE) - Nome da configuração
- `valor` - Valor da configuração
- `tipo` - string, number, boolean, json
- `editavel` - Se pode ser editada via interface

**Configurações padrão:**
- `max_tentativas_login` = 5
- `tempo_bloqueio_minutos` = 30
- `expiracao_token_verificacao_horas` = 24
- `expiracao_token_recuperacao_horas` = 1

---

## 🔧 Manutenção Automática

O banco possui eventos automáticos configurados:

### Event Scheduler

```sql
-- Verificar se está ativo
SHOW VARIABLES LIKE 'event_scheduler';

-- Ativar se necessário
SET GLOBAL event_scheduler = ON;
```

### Eventos Configurados

1. **`evt_limpar_tokens`** (a cada hora)
   - Limpa tokens de verificação expirados
   - Limpa tokens de recuperação expirados
   - Desbloqueia usuários cujo tempo expirou
   - Marca sessões expiradas como inativas

2. **`evt_limpar_logs_antigos`** (diariamente)
   - Remove logs com mais de 90 dias
   - Mantém histórico relevante para auditoria

---

## 📊 Queries Úteis

### Verificar Estrutura

```sql
-- Listar todas as tabelas
SHOW TABLES;

-- Descrever estrutura de uma tabela
DESCRIBE startups;
DESCRIBE usuarios;
DESCRIBE sessoes;
DESCRIBE logs_auditoria;

-- Ver índices de uma tabela
SHOW INDEXES FROM usuarios;
```

### Estatísticas

```sql
-- Total de startups por status
SELECT status_associacao, COUNT(*) as total
FROM startups
GROUP BY status_associacao;

-- Total de usuários por tipo
SELECT tipo_usuario, COUNT(*) as total
FROM usuarios
GROUP BY tipo_usuario;

-- Sessões ativas no momento
SELECT COUNT(*) as sessoes_ativas
FROM sessoes
WHERE ativa = TRUE AND expires_at > NOW();

-- Últimos 10 logs
SELECT * FROM logs_auditoria
ORDER BY created_at DESC
LIMIT 10;

-- Estatísticas de login dos últimos 7 dias
SELECT * FROM v_estatisticas_login
LIMIT 7;

-- Startups ativas com representantes
SELECT * FROM v_startups_ativas;
```

### Manutenção Manual

```sql
-- Executar limpeza de tokens manualmente
CALL sp_limpar_tokens_expirados();

-- Registrar log manualmente
CALL sp_registrar_log(
  '660e8400-e29b-41d4-a716-446655440001', -- usuario_id
  '550e8400-e29b-41d4-a716-446655440001', -- startup_id
  'TESTE',                                 -- acao
  'Log de teste manual',                   -- descricao
  '127.0.0.1',                            -- ip_address
  'Manual',                                -- user_agent
  TRUE,                                    -- sucesso
  NULL,                                    -- codigo_erro
  NULL,                                    -- mensagem_erro
  NULL                                     -- metadados
);
```

---

## 🔐 Segurança

### Permissões Recomendadas

```sql
-- Criar usuário da aplicação (backend)
CREATE USER 'anstartup_app'@'%' IDENTIFIED BY 'senha_super_segura_aqui';

-- Conceder permissões necessárias
GRANT SELECT, INSERT, UPDATE ON anstartup_db.* TO 'anstartup_app'@'%';

-- Permitir DELETE apenas em tabelas específicas
GRANT DELETE ON anstartup_db.sessoes TO 'anstartup_app'@'%';
GRANT DELETE ON anstartup_db.logs_auditoria TO 'anstartup_app'@'%';

-- Permitir execução de procedures
GRANT EXECUTE ON PROCEDURE anstartup_db.sp_limpar_tokens_expirados TO 'anstartup_app'@'%';
GRANT EXECUTE ON PROCEDURE anstartup_db.sp_registrar_log TO 'anstartup_app'@'%';

-- Aplicar alterações
FLUSH PRIVILEGES;
```

### Backup

```bash
# Backup completo
mysqldump -h <host> -u <user> -p anstartup_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup apenas da estrutura (sem dados)
mysqldump -h <host> -u <user> -p --no-data anstartup_db > schema_backup.sql

# Backup apenas dos dados (sem estrutura)
mysqldump -h <host> -u <user> -p --no-create-info anstartup_db > data_backup.sql
```

### Restauração

```bash
# Restaurar backup completo
mysql -h <host> -u <user> -p anstartup_db < backup_20251025_120000.sql

# Restaurar apenas estrutura
mysql -h <host> -u <user> -p anstartup_db < schema_backup.sql

# Restaurar apenas dados
mysql -h <host> -u <user> -p anstartup_db < data_backup.sql
```

---

## 🧪 Testes

### Verificar Integridade

```sql
-- Verificar constraints
SELECT * FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = 'anstartup_db';

-- Verificar foreign keys
SELECT * FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'anstartup_db'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Verificar triggers
SELECT * FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'anstartup_db';

-- Verificar eventos
SELECT * FROM information_schema.EVENTS
WHERE EVENT_SCHEMA = 'anstartup_db';
```

### Testar Procedures

```sql
-- Testar limpeza de tokens
-- 1. Inserir token expirado
UPDATE usuarios 
SET token_verificacao = 'test_token', 
    token_verificacao_expira = DATE_SUB(NOW(), INTERVAL 1 DAY)
WHERE id = '660e8400-e29b-41d4-a716-446655440001';

-- 2. Executar procedure
CALL sp_limpar_tokens_expirados();

-- 3. Verificar se foi limpo
SELECT token_verificacao FROM usuarios 
WHERE id = '660e8400-e29b-41d4-a716-446655440001';
-- Deve retornar NULL
```

---

## 📈 Performance

### Otimização de Queries

```sql
-- Analisar query
EXPLAIN SELECT * FROM usuarios WHERE email = 'test@example.com';

-- Ver índices utilizados
SHOW INDEX FROM usuarios;

-- Estatísticas de tabelas
SHOW TABLE STATUS FROM anstartup_db;

-- Tamanho das tabelas
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'anstartup_db'
ORDER BY (data_length + index_length) DESC;
```

### Monitoramento

```sql
-- Processos ativos
SHOW PROCESSLIST;

-- Variáveis do servidor
SHOW VARIABLES LIKE 'max_connections';
SHOW STATUS LIKE 'Threads_connected';

-- Cache de queries
SHOW VARIABLES LIKE 'query_cache%';
SHOW STATUS LIKE 'Qcache%';
```

---

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Event Scheduler não está rodando

```sql
-- Verificar status
SHOW VARIABLES LIKE 'event_scheduler';

-- Ativar
SET GLOBAL event_scheduler = ON;

-- Verificar eventos
SELECT * FROM information_schema.EVENTS
WHERE EVENT_SCHEMA = 'anstartup_db';
```

#### 2. Constraint violation

```sql
-- Desabilitar temporariamente (cuidado!)
SET FOREIGN_KEY_CHECKS = 0;
-- Suas operações aqui
SET FOREIGN_KEY_CHECKS = 1;
```

#### 3. Tabela corrompida

```sql
-- Verificar
CHECK TABLE startups;

-- Reparar
REPAIR TABLE startups;

-- Otimizar
OPTIMIZE TABLE startups;
```

#### 4. Logs de erro

```sql
-- Ver última mensagem de erro
SHOW ERRORS;

-- Ver avisos
SHOW WARNINGS;
```

---

## 📚 Recursos

- [MySQL 8.0 Documentation](https://dev.mysql.com/doc/refman/8.0/en/)
- [Google Cloud SQL for MySQL](https://cloud.google.com/sql/docs/mysql)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [MySQL Security Best Practices](https://dev.mysql.com/doc/refman/8.0/en/security-guidelines.html)

---

## 📝 Changelog

### v1.0.0 (25/10/2025)
- ✅ Criação inicial do schema
- ✅ Tabelas: startups, usuarios, sessoes, logs_auditoria, configuracoes_sistema
- ✅ Views: v_startups_ativas, v_estatisticas_login
- ✅ Procedures: sp_limpar_tokens_expirados, sp_registrar_log
- ✅ Events: evt_limpar_tokens, evt_limpar_logs_antigos
- ✅ Seed data para desenvolvimento

---

*Documentação criada em: 25 de outubro de 2025*
*Última atualização: 25 de outubro de 2025*
