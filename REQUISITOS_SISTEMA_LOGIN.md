# 📋 Requisitos do Sistema de Login - ANSTARTUP Brasil

## 🎯 Visão Geral

Sistema de autenticação e gerenciamento de associados para startups, integrado ao botão "Associe-se Agora" do site institucional da ANSTARTUP Brasil.

---

## 🏗️ Arquitetura Proposta

```
Frontend (React + TypeScript)
    ↓
Backend API (Node.js/Express + TypeScript)
    ↓
Google Cloud SQL (MySQL ou PostgreSQL)
```

---

## 📊 Estrutura do Banco de Dados

### Tabela: `startups`

Armazena informações das startups associadas.

```sql
CREATE TABLE startups (
  id VARCHAR(36) PRIMARY KEY, -- UUID
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  email_corporativo VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  site_url VARCHAR(255),
  
  -- Endereço
  cep VARCHAR(10),
  endereco VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  pais VARCHAR(50) DEFAULT 'Brasil',
  
  -- Informações da Startup
  area_atuacao VARCHAR(100), -- Ex: Fintech, Healthtech, Edtech, etc.
  descricao_negocio TEXT,
  data_fundacao DATE,
  numero_funcionarios INT,
  estagio_startup VARCHAR(50), -- Ex: Ideia, MVP, Tração, Escala
  faturamento_anual VARCHAR(50), -- Ex: Até 100k, 100k-500k, 500k-1M, 1M+
  
  -- Status de Associação
  status_associacao ENUM('pendente', 'ativa', 'suspensa', 'cancelada') DEFAULT 'pendente',
  tipo_plano ENUM('basico', 'profissional', 'premium', 'enterprise') DEFAULT 'basico',
  data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_renovacao DATE,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_cnpj (cnpj),
  INDEX idx_email (email_corporativo),
  INDEX idx_status (status_associacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `usuarios`

Armazena informações dos usuários (representantes das startups).

```sql
CREATE TABLE usuarios (
  id VARCHAR(36) PRIMARY KEY, -- UUID
  startup_id VARCHAR(36) NOT NULL,
  
  -- Dados Pessoais
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone_celular VARCHAR(20),
  
  -- Cargo/Função
  cargo VARCHAR(100), -- Ex: CEO, CTO, CFO, Fundador, etc.
  tipo_usuario ENUM('admin', 'representante', 'membro') DEFAULT 'representante',
  
  -- Autenticação
  senha_hash VARCHAR(255) NOT NULL, -- bcrypt hash
  salt VARCHAR(255) NOT NULL,
  ultimo_login TIMESTAMP NULL,
  tentativas_login INT DEFAULT 0,
  bloqueado_ate TIMESTAMP NULL,
  
  -- Verificação de Email
  email_verificado BOOLEAN DEFAULT FALSE,
  token_verificacao VARCHAR(255),
  token_verificacao_expira TIMESTAMP NULL,
  
  -- Recuperação de Senha
  token_recuperacao VARCHAR(255),
  token_recuperacao_expira TIMESTAMP NULL,
  
  -- Status
  ativo BOOLEAN DEFAULT TRUE,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE,
  INDEX idx_email (email),
  INDEX idx_cpf (cpf),
  INDEX idx_startup (startup_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `sessoes`

Gerencia sessões ativas e tokens JWT.

```sql
CREATE TABLE sessoes (
  id VARCHAR(36) PRIMARY KEY, -- UUID
  usuario_id VARCHAR(36) NOT NULL,
  
  -- Token
  refresh_token VARCHAR(512) UNIQUE NOT NULL,
  access_token_jti VARCHAR(255) UNIQUE NOT NULL, -- JWT ID para invalidação
  
  -- Informações da Sessão
  ip_address VARCHAR(45), -- IPv6 suportado
  user_agent TEXT,
  dispositivo VARCHAR(100),
  navegador VARCHAR(100),
  
  -- Controle de Expiração
  expires_at TIMESTAMP NOT NULL,
  ultimo_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Status
  ativa BOOLEAN DEFAULT TRUE,
  revogada_em TIMESTAMP NULL,
  motivo_revogacao VARCHAR(255),
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id),
  INDEX idx_refresh_token (refresh_token),
  INDEX idx_expires (expires_at),
  INDEX idx_ativa (ativa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `logs_auditoria`

Registra todas as ações importantes do sistema para compliance.

```sql
CREATE TABLE logs_auditoria (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id VARCHAR(36),
  startup_id VARCHAR(36),
  
  -- Ação
  acao VARCHAR(100) NOT NULL, -- Ex: LOGIN, LOGOUT, ALTERACAO_SENHA, CADASTRO, etc.
  descricao TEXT,
  
  -- Contexto
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Status
  sucesso BOOLEAN DEFAULT TRUE,
  codigo_erro VARCHAR(50),
  mensagem_erro TEXT,
  
  -- Metadados
  metadados JSON, -- Dados adicionais em formato JSON
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE SET NULL,
  INDEX idx_usuario (usuario_id),
  INDEX idx_startup (startup_id),
  INDEX idx_acao (acao),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔐 Requisitos de Segurança

### 1. Autenticação

- **Hash de Senha**: bcrypt com salt (custo mínimo: 12 rounds)
- **JWT (JSON Web Tokens)**:
  - Access Token: curta duração (15 minutos)
  - Refresh Token: longa duração (7 dias), armazenado no banco
  - Tokens assinados com algoritmo HS256 ou RS256
- **Rate Limiting**: máximo de 5 tentativas de login em 15 minutos
- **Bloqueio de Conta**: após 5 tentativas falhas consecutivas, bloqueio por 30 minutos
- **Session Management**: suporte a múltiplos dispositivos com controle individual

### 2. Validação de Dados

- **Email**: validação de formato e verificação via email
- **CPF**: validação de formato e dígitos verificadores
- **CNPJ**: validação de formato e dígitos verificadores
- **Senha**: 
  - Mínimo 8 caracteres
  - Pelo menos 1 letra maiúscula
  - Pelo menos 1 letra minúscula
  - Pelo menos 1 número
  - Pelo menos 1 caractere especial
  - Não pode conter partes do email ou nome

### 3. Proteção de Dados (LGPD)

- **Criptografia em Trânsito**: HTTPS obrigatório (TLS 1.3)
- **Criptografia em Repouso**: Google Cloud SQL com criptografia automática
- **Mascaramento**: CPF e CNPJ parcialmente ocultos na interface
- **Consentimento**: termo de aceite de uso e política de privacidade
- **Direito ao Esquecimento**: funcionalidade de exclusão de conta

### 4. Comunicação Segura

- **CORS**: configurado para domínio específico (anstartupbrasil.org)
- **Helmet.js**: proteção contra vulnerabilidades comuns
- **Content Security Policy (CSP)**: prevenir XSS
- **HTTP Only Cookies**: refresh token em cookie seguro

---

## 📧 Requisitos de Email

### Provedores Recomendados

1. **SendGrid** (Google Cloud Partner)
2. **Amazon SES**
3. **Mailgun**
4. **Google Workspace SMTP**

### Templates de Email Necessários

1. **Verificação de Email**
   - Link de confirmação com token (válido por 24h)
   - Design responsivo com marca ANSTARTUP

2. **Recuperação de Senha**
   - Link de reset com token (válido por 1h)
   - Aviso de segurança caso não tenha solicitado

3. **Confirmação de Cadastro**
   - Boas-vindas após verificação
   - Próximos passos e informações úteis

4. **Notificação de Login Novo Dispositivo**
   - Alerta de segurança
   - Detalhes do dispositivo e localização aproximada

5. **Alteração de Senha**
   - Confirmação de mudança
   - Instruções se não foi você

---

## 🎨 Componentes de Interface (Frontend)

### 1. Modal de Cadastro

**Etapas do Formulário:**

#### Etapa 1: Dados da Startup
- Razão Social *
- Nome Fantasia *
- CNPJ * (com máscara: 00.000.000/0000-00)
- Email Corporativo *
- Telefone (com máscara)
- Site/URL

#### Etapa 2: Endereço
- CEP * (busca automática via ViaCEP)
- Estado *
- Cidade *
- Bairro
- Endereço
- Número
- Complemento

#### Etapa 3: Informações do Negócio
- Área de Atuação * (dropdown)
- Descrição do Negócio *
- Data de Fundação
- Número de Funcionários (dropdown: 1-5, 6-10, 11-50, 51+)
- Estágio da Startup * (dropdown)
- Faturamento Anual (dropdown - opcional)

#### Etapa 4: Representante Legal
- Nome Completo *
- CPF * (com máscara: 000.000.000-00)
- Email Pessoal *
- Telefone Celular *
- Cargo na Empresa *

#### Etapa 5: Definir Senha
- Senha * (com indicador de força)
- Confirmar Senha *
- Aceite dos Termos *
- Aceite da Política de Privacidade *

### 2. Modal de Login

**Campos:**
- Email
- Senha
- Checkbox "Lembrar-me" (mantém sessão por 30 dias)
- Link "Esqueci minha senha"
- Botão "Entrar"
- Link "Não tem conta? Cadastre-se"

**Recursos:**
- Mostrar/ocultar senha
- Validação em tempo real
- Mensagens de erro específicas
- Loading state durante autenticação

### 3. Tela de Recuperação de Senha

**Etapa 1: Solicitar Reset**
- Email cadastrado
- Botão "Enviar link de recuperação"

**Etapa 2: Nova Senha (via link do email)**
- Nova senha (com indicador de força)
- Confirmar nova senha
- Botão "Redefinir senha"

### 4. Dashboard do Associado

**Seções:**
- Perfil da Startup (editar dados)
- Perfil do Usuário (editar dados pessoais)
- Status de Associação (plano, validade, pagamento)
- Benefícios Disponíveis
- Documentos e Certificados
- Histórico de Atividades
- Gerenciar Outros Usuários (para admins)
- Configurações de Segurança:
  - Alterar senha
  - Gerenciar sessões ativas
  - Autenticação de dois fatores (2FA - futuro)

### 5. Painel Administrativo (Admin ANSTARTUP)

**Funcionalidades:**
- Listar todas as startups associadas
- Filtros e busca avançada
- Aprovar/rejeitar novos cadastros
- Gerenciar planos e pagamentos
- Visualizar logs de auditoria
- Exportar relatórios
- Comunicação em massa (emails)

---

## 🔌 API Endpoints

### Autenticação

```
POST   /api/auth/register          - Cadastro de nova startup
POST   /api/auth/login             - Login de usuário
POST   /api/auth/logout            - Logout e invalidação de token
POST   /api/auth/refresh           - Renovar access token
POST   /api/auth/forgot-password   - Solicitar recuperação de senha
POST   /api/auth/reset-password    - Redefinir senha com token
GET    /api/auth/verify-email      - Verificar email com token
POST   /api/auth/resend-verification - Reenviar email de verificação
```

### Usuário

```
GET    /api/user/profile           - Obter dados do usuário logado
PUT    /api/user/profile           - Atualizar dados do usuário
PUT    /api/user/password          - Alterar senha
GET    /api/user/sessions          - Listar sessões ativas
DELETE /api/user/sessions/:id      - Revogar sessão específica
DELETE /api/user/sessions          - Revogar todas as sessões (exceto atual)
DELETE /api/user/account           - Deletar conta (LGPD)
```

### Startup

```
GET    /api/startup/profile        - Obter dados da startup
PUT    /api/startup/profile        - Atualizar dados da startup
GET    /api/startup/members        - Listar membros da startup
POST   /api/startup/members        - Adicionar novo membro
PUT    /api/startup/members/:id    - Atualizar membro
DELETE /api/startup/members/:id    - Remover membro
GET    /api/startup/subscription   - Status da associação
```

### Admin (Requer permissão)

```
GET    /api/admin/startups              - Listar todas as startups
GET    /api/admin/startups/:id          - Detalhes de uma startup
PUT    /api/admin/startups/:id/status   - Aprovar/suspender startup
GET    /api/admin/users                 - Listar todos os usuários
GET    /api/admin/audit-logs            - Logs de auditoria
GET    /api/admin/statistics            - Estatísticas do sistema
POST   /api/admin/email/broadcast       - Enviar email em massa
```

---

## ⚙️ Variáveis de Ambiente

```env
# Node Environment
NODE_ENV=production

# Server
PORT=3000
API_BASE_URL=https://api.anstartupbrasil.org

# Frontend URL
FRONTEND_URL=https://anstartupbrasil.org

# Google Cloud SQL
DB_HOST=<cloud-sql-instance-connection>
DB_PORT=3306
DB_NAME=anstartup_db
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_SSL=true

# JWT Secrets (gerar com crypto.randomBytes(64).toString('hex'))
JWT_ACCESS_SECRET=<secret-key-access>
JWT_REFRESH_SECRET=<secret-key-refresh>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email Service (SendGrid)
SENDGRID_API_KEY=<sendgrid-api-key>
SENDGRID_FROM_EMAIL=noreply@anstartupbrasil.org
SENDGRID_FROM_NAME=ANSTARTUP Brasil

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=https://anstartupbrasil.org,https://www.anstartupbrasil.org

# Session
SESSION_SECRET=<session-secret>
COOKIE_DOMAIN=.anstartupbrasil.org

# ViaCEP API (para busca de endereço)
VIACEP_API_URL=https://viacep.com.br/ws

# Google Cloud Project
GOOGLE_CLOUD_PROJECT_ID=<project-id>
```

---

## 📦 Dependências Backend

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.0.0",
    "mysql2": "^3.6.0",
    "@google-cloud/sql": "^3.0.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.0",
    "@sendgrid/mail": "^7.7.0",
    "uuid": "^9.0.1",
    "cookie-parser": "^1.4.6",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/cookie-parser": "^1.4.6",
    "@types/compression": "^1.7.5",
    "@types/morgan": "^1.9.9",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.2"
  }
}
```

---

## 📦 Dependências Frontend (Adicionar ao projeto)

```json
{
  "dependencies": {
    "axios": "^1.6.2",
    "react-router-dom": "^6.20.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "react-input-mask": "^2.0.4",
    "jwt-decode": "^4.0.0"
  },
  "devDependencies": {
    "@types/react-input-mask": "^3.0.5"
  }
}
```

---

## 🚀 Fluxos de Uso

### Fluxo de Cadastro

1. Usuário clica em "Associe-se Agora"
2. Modal de cadastro abre (5 etapas)
3. Preenchimento e validação de cada etapa
4. Envio dos dados para API
5. Criação de startup e usuário admin no banco
6. Envio de email de verificação
7. Usuário clica no link do email
8. Conta é ativada
9. Redirecionamento para dashboard

### Fluxo de Login

1. Usuário clica em "Login" ou tenta acessar área restrita
2. Modal de login abre
3. Insere email e senha
4. API valida credenciais
5. Verifica se email está verificado
6. Gera access token e refresh token
7. Cria sessão no banco
8. Retorna tokens para frontend
9. Armazena tokens (localStorage + httpOnly cookie)
10. Redireciona para dashboard

### Fluxo de Recuperação de Senha

1. Usuário clica em "Esqueci minha senha"
2. Insere email cadastrado
3. API gera token de recuperação
4. Envia email com link
5. Usuário clica no link (válido por 1h)
6. Página de redefinição de senha abre
7. Usuário define nova senha
8. API atualiza senha e invalida token
9. Email de confirmação é enviado
10. Redireciona para login

---

## 🔒 Segurança Adicional (Fase 2)

- **Autenticação de Dois Fatores (2FA)**: via SMS ou app autenticador
- **ReCAPTCHA**: em formulários de cadastro e login
- **IP Whitelist**: para painel administrativo
- **Logs Detalhados**: todas as ações críticas
- **Backup Automático**: banco de dados diário
- **Monitoramento**: alertas de atividades suspeitas
- **Revisão de Acessos**: auditoria periódica de permissões

---

## 📊 Métricas e Analytics

- Taxa de conversão de cadastros
- Taxa de verificação de email
- Taxa de abandono por etapa
- Tempo médio de cadastro
- Logins por dia/semana/mês
- Dispositivos e navegadores mais usados
- Localização geográfica dos usuários

---

## 🧪 Testes Necessários

### Backend
- Testes unitários para validações
- Testes de integração para API endpoints
- Testes de segurança (penetration testing)
- Testes de carga (stress testing)

### Frontend
- Testes unitários de componentes
- Testes de integração de fluxos
- Testes E2E (Cypress ou Playwright)
- Testes de acessibilidade (a11y)

---

## 📅 Cronograma Sugerido

### Fase 1 - Fundação (2-3 semanas)
- Setup do Google Cloud SQL
- Criação das tabelas do banco
- Setup do backend (Express + TypeScript)
- Implementação de autenticação JWT
- Endpoints básicos de auth

### Fase 2 - Interface (2 semanas)
- Componentes de Login e Cadastro
- Validações de formulário
- Integração com API
- Fluxo de recuperação de senha

### Fase 3 - Dashboard (2-3 semanas)
- Dashboard do associado
- Edição de perfil
- Gerenciamento de sessões
- Área administrativa básica

### Fase 4 - Email e Refinamentos (1-2 semanas)
- Integração com SendGrid
- Templates de email
- Testes completos
- Ajustes de UX/UI

### Fase 5 - Deploy e Monitoramento (1 semana)
- Deploy na Google Cloud
- Configuração de CI/CD
- Monitoramento e logs
- Documentação final

---

## 💡 Considerações Importantes

1. **Compliance LGPD**: garantir que todos os dados sejam tratados conforme a lei
2. **Escalabilidade**: arquitetura preparada para crescimento
3. **Performance**: otimização de queries e cache quando necessário
4. **UX/UI**: processo de cadastro simples e intuitivo
5. **Suporte**: canal de atendimento para dúvidas no cadastro
6. **Documentação**: manter documentação atualizada para manutenção

---

## 🔗 Recursos Úteis

- [Google Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Security Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
- [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## ✅ Próximos Passos

1. **Revisão e Aprovação** deste documento
2. **Setup do Google Cloud Project** e Cloud SQL
3. **Criação do repositório backend** (separado ou monorepo)
4. **Início do desenvolvimento** seguindo as fases do cronograma
5. **Reuniões de acompanhamento** semanais

---

*Documento criado em: 25 de outubro de 2025*
*Última atualização: 25 de outubro de 2025*
