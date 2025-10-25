# 🚀 Próximos Passos - Sistema de Login ANSTARTUP Brasil

## 📋 Resumo do que foi Levantado

### ✅ Documentação Criada

1. **REQUISITOS_SISTEMA_LOGIN.md** - Documento completo com:
   - Arquitetura proposta (Frontend React + Backend Node.js + Google Cloud SQL)
   - Estrutura detalhada de 4 tabelas principais do banco de dados
   - Requisitos de segurança (JWT, bcrypt, LGPD, etc.)
   - Interface de usuário (5 etapas de cadastro, login, recuperação de senha)
   - 20+ endpoints de API REST
   - Dependências necessárias (frontend e backend)
   - Cronograma sugerido de 8-10 semanas

2. **database/schema.sql** - Script SQL completo com:
   - 4 tabelas principais: `startups`, `usuarios`, `sessoes`, `logs_auditoria`
   - 1 tabela de configurações: `configuracoes_sistema`
   - Views para consultas otimizadas
   - Stored procedures para manutenção
   - Event scheduler para limpeza automática
   - Totalmente compatível com Google Cloud SQL (MySQL 8.0+)

3. **database/seed.sql** - Dados de teste com:
   - 5 startups de diferentes áreas (Fintech, Healthtech, Edtech, Agritech, Logtech)
   - 6 usuários de exemplo
   - Logs de auditoria simulados
   - Queries úteis para verificação

---

## 🎯 Principais Requisitos Identificados

### Cadastro de Startups (5 etapas)
1. ✅ Dados da Startup (CNPJ, razão social, nome fantasia, email, telefone)
2. ✅ Endereço completo (CEP com busca automática via ViaCEP)
3. ✅ Informações do negócio (área, descrição, estágio, faturamento)
4. ✅ Representante legal (nome, CPF, email, cargo)
5. ✅ Definição de senha (com validação de força)

### Segurança
- ✅ Criptografia bcrypt (12 rounds) para senhas
- ✅ JWT com access token (15min) e refresh token (7 dias)
- ✅ Rate limiting (5 tentativas em 15 minutos)
- ✅ Bloqueio automático após tentativas falhas
- ✅ Verificação de email obrigatória
- ✅ Recuperação de senha segura com token temporário
- ✅ Logs completos de auditoria para compliance LGPD
- ✅ Gerenciamento de múltiplas sessões

### Validações
- ✅ CPF (formato + dígitos verificadores)
- ✅ CNPJ (formato + dígitos verificadores)
- ✅ Email (formato válido)
- ✅ Senha forte (mínimo 8 caracteres, maiúscula, minúscula, número, especial)
- ✅ Campos obrigatórios em cada etapa

### Funcionalidades
- ✅ Login com email/senha
- ✅ Logout com invalidação de sessão
- ✅ "Lembrar-me" (sessão estendida)
- ✅ Recuperação de senha via email
- ✅ Dashboard do associado
- ✅ Edição de perfil (startup e usuário)
- ✅ Gerenciamento de múltiplos usuários por startup
- ✅ Painel administrativo (ANSTARTUP)

---

## 📊 Estrutura do Banco de Dados

### Tabela `startups`
Armazena informações completas das startups associadas:
- Dados cadastrais (CNPJ, razão social, email)
- Endereço completo
- Informações do negócio (área, estágio, faturamento)
- Status de associação (pendente, ativa, suspensa, cancelada)
- Tipo de plano (básico, profissional, premium, enterprise)

### Tabela `usuarios`
Gerencia usuários (representantes das startups):
- Dados pessoais (nome, CPF, email)
- Autenticação (senha hash, tentativas de login, bloqueios)
- Verificação de email (token com expiração)
- Recuperação de senha (token com expiração)
- Tipos de usuário (admin, representante, membro)

### Tabela `sessoes`
Controla sessões ativas:
- Tokens JWT (access e refresh)
- Informações do dispositivo/navegador
- Controle de expiração
- Possibilidade de revogar sessões individuais

### Tabela `logs_auditoria`
Registra todas as ações importantes:
- LOGIN, LOGOUT, CADASTRO, ALTERACAO_SENHA, etc.
- IP, user agent, sucesso/falha
- Metadados em JSON para análises
- Compliance LGPD

---

## 🛠️ Stack Tecnológica Recomendada

### Frontend (Já existente + adições)
- ✅ React 19.2.0 (já instalado)
- ✅ TypeScript 5.9.3 (já instalado)
- ✅ Vite 7.1.9 (já instalado)
- 🔲 **A adicionar:**
  - react-router-dom (navegação)
  - react-hook-form (formulários)
  - zod (validação)
  - axios (requisições HTTP)
  - react-input-mask (máscaras CPF/CNPJ)
  - jwt-decode (decodificar tokens)

### Backend (A criar)
- 🔲 Node.js 20+ com TypeScript
- 🔲 Express.js (framework web)
- 🔲 mysql2 (driver MySQL)
- 🔲 bcrypt (hash de senhas)
- 🔲 jsonwebtoken (JWT)
- 🔲 express-validator (validações)
- 🔲 helmet (segurança)
- 🔲 cors (CORS)
- 🔲 @sendgrid/mail (envio de emails)

### Infraestrutura
- 🔲 Google Cloud SQL (MySQL 8.0)
- 🔲 Google Cloud Run ou App Engine (backend)
- 🔲 Vercel (frontend - já configurado)
- 🔲 SendGrid (emails transacionais)
- 🔲 Google Cloud Storage (uploads futuros)

---

## 🚦 Próximas Ações Recomendadas

### 1️⃣ Configuração do Google Cloud (Prioridade ALTA)
```bash
# Ações necessárias:
□ Criar projeto no Google Cloud Console
□ Ativar Google Cloud SQL API
□ Criar instância Cloud SQL (MySQL 8.0)
□ Configurar usuário e senha do banco
□ Criar database 'anstartup_db'
□ Configurar firewall/IP autorizado
□ Executar script schema.sql
□ (Opcional) Executar seed.sql para testes
```

**Estimativa:** 2-3 horas

### 2️⃣ Setup do Backend (Prioridade ALTA)
```bash
# Criar estrutura do projeto backend
□ mkdir backend && cd backend
□ npm init -y
□ npm install express typescript mysql2 bcrypt jsonwebtoken
□ Configurar tsconfig.json
□ Criar estrutura de pastas (src/controllers, routes, middlewares, etc.)
□ Implementar conexão com Cloud SQL
□ Criar endpoint de teste (health check)
```

**Estimativa:** 1 dia

### 3️⃣ Implementar Autenticação (Prioridade ALTA)
```bash
# Endpoints de autenticação
□ POST /api/auth/register (cadastro completo)
□ POST /api/auth/login (login)
□ POST /api/auth/logout (logout)
□ POST /api/auth/refresh (renovar token)
□ GET /api/auth/verify-email (verificar email)
□ POST /api/auth/forgot-password (solicitar recuperação)
□ POST /api/auth/reset-password (redefinir senha)
□ Middleware de autenticação JWT
□ Validações de CPF/CNPJ
```

**Estimativa:** 1 semana

### 4️⃣ Desenvolver Frontend - Componentes (Prioridade MÉDIA)
```bash
# Instalar dependências frontend
cd /Users/luiszarbielli/Trabalho/anstartup
npm install react-router-dom react-hook-form zod axios react-input-mask jwt-decode

# Criar componentes
□ Modal de Cadastro (5 etapas)
□ Modal de Login
□ Tela de Recuperação de Senha
□ Context/Provider para autenticação
□ Guards de rotas (proteger rotas privadas)
□ Dashboard básico
```

**Estimativa:** 1-2 semanas

### 5️⃣ Integração Frontend + Backend (Prioridade MÉDIA)
```bash
□ Configurar variáveis de ambiente (.env)
□ Conectar formulários com API
□ Implementar interceptors do Axios (tokens)
□ Tratamento de erros
□ Loading states
□ Feedback de sucesso/erro
```

**Estimativa:** 3-4 dias

### 6️⃣ Email & Notificações (Prioridade MÉDIA)
```bash
□ Criar conta no SendGrid
□ Configurar API key
□ Criar templates de email (HTML responsivo)
□ Implementar envio de emails:
  - Verificação de email
  - Recuperação de senha
  - Confirmação de cadastro
  - Novo login detectado
```

**Estimativa:** 2-3 dias

### 7️⃣ Dashboard e Gestão (Prioridade BAIXA)
```bash
□ Dashboard completo do associado
□ Edição de perfil (startup e usuário)
□ Gerenciamento de membros
□ Visualização de plano e benefícios
□ Histórico de atividades
□ Gerenciamento de sessões
```

**Estimativa:** 1-2 semanas

### 8️⃣ Painel Administrativo (Prioridade BAIXA)
```bash
□ Autenticação admin separada
□ Listagem de startups
□ Aprovar/rejeitar cadastros
□ Gerenciar planos
□ Visualizar logs
□ Enviar comunicados
□ Exportar relatórios
```

**Estimativa:** 2 semanas

### 9️⃣ Testes e Qualidade (Prioridade MÉDIA)
```bash
□ Testes unitários (backend)
□ Testes de integração (API)
□ Testes E2E (frontend)
□ Testes de segurança
□ Testes de carga
□ Code review
```

**Estimativa:** 1 semana

### 🔟 Deploy e Monitoramento (Prioridade ALTA)
```bash
□ Configurar Google Cloud Run (backend)
□ Configurar variáveis de ambiente (produção)
□ Setup de CI/CD (GitHub Actions)
□ Configurar domínio API (api.anstartupbrasil.org)
□ SSL/TLS (certificado)
□ Monitoramento (Google Cloud Monitoring)
□ Logs (Google Cloud Logging)
□ Backup automático do banco
```

**Estimativa:** 3-4 dias

---

## 💰 Estimativa de Custos Mensais (Google Cloud)

### Ambiente de Desenvolvimento/Staging
- Cloud SQL (db-f1-micro): ~$7-10/mês
- Cloud Run (backend): ~$0-5/mês (free tier)
- **Total: ~$10-15/mês**

### Ambiente de Produção (estimativa inicial)
- Cloud SQL (db-n1-standard-1): ~$25-40/mês
- Cloud Run (backend com escala): ~$10-30/mês
- Cloud Storage (backups): ~$1-5/mês
- Egress (tráfego de saída): ~$5-15/mês
- SendGrid (até 100 emails/dia): FREE
- **Total: ~$45-90/mês**

### Crescimento Futuro (1000+ startups ativas)
- Cloud SQL (db-n1-standard-2): ~$80-120/mês
- Cloud Run (escala automática): ~$50-150/mês
- SendGrid (até 40k emails/mês): ~$15/mês
- **Total: ~$145-285/mês**

---

## 🔐 Checklist de Segurança

Antes de ir para produção:

- [ ] Senhas hasheadas com bcrypt (mínimo 12 rounds)
- [ ] JWT com chaves secretas fortes (64+ caracteres)
- [ ] HTTPS obrigatório em toda comunicação
- [ ] Validação de entrada em todos os endpoints
- [ ] Rate limiting configurado
- [ ] CORS restrito ao domínio correto
- [ ] Helmet.js configurado
- [ ] Logs de auditoria funcionando
- [ ] Backup automático do banco configurado
- [ ] Recuperação de desastres testada
- [ ] Variáveis de ambiente seguras (não no código)
- [ ] Análise de vulnerabilidades (npm audit)
- [ ] Testes de penetração básicos
- [ ] Política de privacidade e termos de uso
- [ ] Consentimento LGPD implementado

---

## 📚 Recursos e Referências

### Documentação Oficial
- [Google Cloud SQL - MySQL](https://cloud.google.com/sql/docs/mysql)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Hook Form](https://react-hook-form.com/)
- [JWT.io](https://jwt.io/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Tutoriais Recomendados
- [Autenticação JWT com Node.js](https://www.youtube.com/results?search_query=jwt+authentication+nodejs)
- [React Router v6](https://reactrouter.com/en/main/start/tutorial)
- [Google Cloud SQL Connection](https://cloud.google.com/sql/docs/mysql/connect-overview)

### Ferramentas Úteis
- [bcrypt Generator](https://bcrypt-generator.com/) - Para gerar hashes de teste
- [UUID Generator](https://www.uuidgenerator.net/) - Para gerar UUIDs
- [ViaCEP API](https://viacep.com.br/) - API de consulta de CEP
- [CPF/CNPJ Validator](https://www.4devs.com.br/gerador_de_cpf) - Gerar CPF/CNPJ para testes

---

## 🎯 Métricas de Sucesso

### Técnicas
- Tempo de resposta da API < 200ms (p95)
- Uptime > 99.5%
- Taxa de erro < 0.5%
- Tempo de cadastro < 5 minutos

### Negócio
- Taxa de conversão de cadastros > 60%
- Taxa de verificação de email > 80%
- Taxa de abandono por etapa < 10%
- NPS (Net Promoter Score) > 8

---

## 📞 Suporte e Contato

Para dúvidas durante a implementação:

- **Google Cloud Support**: [Console do Google Cloud](https://console.cloud.google.com)
- **SendGrid Support**: [SendGrid Docs](https://docs.sendgrid.com)
- **Community**: Stack Overflow, GitHub Discussions

---

## ✅ Conclusão

Todos os requisitos para o sistema de login foram levantados e documentados. O projeto está pronto para entrar em fase de desenvolvimento.

**Recomendação:** Começar pela configuração do Google Cloud SQL e desenvolvimento do backend, já que o frontend React já está estruturado.

**Prazo realista:** 8-10 semanas para MVP completo (todas as funcionalidades básicas)

---

*Documento gerado em: 25 de outubro de 2025*
*Próxima revisão: Após configuração do Google Cloud*
