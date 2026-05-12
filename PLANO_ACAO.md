# Plano de Ação — ANSTARTUP Brasil
> Padronização MVC · Mobile-First · Auth Robusto · Testes

**Última atualização:** 2026-05-07  
**Stack:** React 19 + TypeScript · Express.js · MySQL · Vitest · Supertest

---

## Visão Geral das Fases

| Fase | Escopo | Status |
|------|--------|--------|
| 1 | Frontend MVC — Reestruturação de arquitetura | ✅ Concluído (2026-05-07) |
| 2 | Mobile-First — Responsividade impecável | ✅ Concluído (2026-05-07) |
| 3 | Auth Frontend — Login/Cadastro funcional com API real | ✅ Concluído (2026-05-07) |
| 4 | Backend MVC — API Express robusta + banco de dados | ✅ Concluído (2026-05-07) |
| 5 | Testes — Unitários + Integração | ⏳ Pendente |

---

## Fase 1 — Frontend MVC

### Objetivo
Separar responsabilidades de forma clara: **Models** (tipos), **Services** (API), **Hooks** (lógica), **Components/Pages** (view pura).

### Nova Estrutura de Pastas

```
src/
├── models/                   # M — Interfaces e tipos TypeScript
│   ├── Usuario.ts            # Interface Usuario + DTOs
│   ├── Startup.ts            # Interface Startup + DTOs
│   ├── Sessao.ts             # Interface de sessão/auth
│   └── index.ts              # Re-exports
│
├── services/                 # Camada HTTP — única responsável por fetch/axios
│   ├── api.ts                # Instância axios configurada (baseURL, interceptors)
│   ├── authService.ts        # login(), register(), logout(), refreshToken()
│   ├── startupService.ts     # getStartup(), updateStartup()
│   └── cepService.ts         # buscarCEP() — extraído de validation.ts
│
├── hooks/                    # C — Lógica de negócio desacoplada da UI
│   ├── useAuth.ts            # Consome AuthContext + authService
│   ├── useStartup.ts         # Operações de startup
│   └── useCEP.ts             # Hook para busca de CEP com estado de loading
│
├── contexts/                 # Estado global (sem lógica de negócio)
│   └── AuthContext.tsx       # Só estado + Provider (sem mock, sem fetch)
│
├── pages/                    # V — Páginas/views de alto nível
│   └── HomePage/
│       ├── index.tsx         # Extrai seções do App.tsx atual
│       └── HomePage.css
│
├── components/               # UI reutilizável
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.css
│   ├── LoginModal/
│   │   ├── LoginModal.tsx    # Limpo: só UI + react-hook-form, sem lógica
│   │   └── LoginModal.css
│   ├── CadastroModal/
│   │   ├── CadastroModal.tsx # Quebrado em sub-componentes por etapa
│   │   ├── steps/
│   │   │   ├── Step1DadosStartup.tsx
│   │   │   ├── Step2Endereco.tsx
│   │   │   ├── Step3Negocio.tsx
│   │   │   ├── Step4Representante.tsx
│   │   │   └── Step5Senha.tsx
│   │   └── CadastroModal.css
│   └── shared/
│       ├── PasswordInput.tsx  # Input reutilizável com toggle show/hide
│       ├── FormField.tsx      # Label + input + erro padronizados
│       └── Spinner.tsx        # Loading spinner
│
├── utils/
│   └── validation.ts         # Mantém validadores (CPF, CNPJ, email, senha)
│                             # Remove buscarCEP (vai para services/cepService.ts)
│
├── App.tsx                   # Router + layout + orquestração de modais
└── main.tsx
```

### Tarefas

- [x] Criar `src/models/` com interfaces `Usuario`, `Startup`, `Sessao`
- [x] Criar `src/services/api.ts` — instância axios com baseURL e interceptors de token
- [x] Criar `src/services/authService.ts` — `login()`, `register()`, `logout()`
- [x] Criar `src/services/cepService.ts` — mover `buscarCEP()` de `validation.ts`
- [x] Criar `src/hooks/useAuth.ts` — consome AuthContext + authService (remove lógica do Context)
- [x] Criar `src/hooks/useCEP.ts` — estado `isLoading`, `error`, `buscar(cep)`
- [x] Refatorar `AuthContext.tsx` — só gerencia estado, sem mock, sem fetch direto
- [x] Criar `src/pages/HomePage/` — extrair seções de `App.tsx`
- [x] Quebrar `CadastroModal.tsx` (910 linhas) em 5 sub-componentes por etapa
- [x] Criar componentes shared: `PasswordInput`, `FormField`, `Spinner`
- [x] Remover `console.log` de debug — usar feedback em tela
- [x] Remover `alert()` — substituído por `onSuccess` callback no CadastroModal

---

## Fase 2 — Mobile-First Responsividade

### Objetivo
O projeto é **focado em web mobile**. Toda interface deve ser desenhada primeiro para telas < 480px e expandida para desktop.

### Problemas Identificados

| Componente | Problema | Prioridade |
|-----------|---------|-----------|
| `CadastroModal` | 5 etapas com formulários extensos — scroll difícil no mobile | Alta |
| `planos-grid` | 4 cards em grid — colapsa mal no mobile | Alta |
| `form-row` (2 colunas) | Ocupa pouco espaço em telas pequenas | Alta |
| `Header` | Menu de navegação — não tem menu hambúrguer | Média |
| Modais | `modal-content` pode ultrapassar altura da tela | Alta |
| Campos de input | Altura e espaçamento insuficientes para toque | Alta |

### Diretrizes Mobile-First

```css
/* Ordem de escrita: mobile → tablet → desktop */

/* Base: mobile (< 480px) — DEFAULT */
.modal-content { ... }

/* Tablet (≥ 640px) */
@media (min-width: 640px) { ... }

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) { ... }
```

### Tarefas 1.0

- [x] Reescrever CSS dos modais com `max-height: 92dvh` + `overflow-y: auto` (bottom-sheet em mobile)
- [x] Planos de associação: 1 col → 2 col @600px → 4 col @768px
- [x] `form-row` (Estado/Cidade): empilhar em mobile, row @600px
- [x] Inputs: `min-height: 48px` + `font-size: 1rem` (evita zoom iOS)
- [x] Header: hambúrguer implementado com animação CSS + menu `position: fixed`
- [x] Botões de navegação: `flex-direction: column-reverse` em mobile (primário no topo)
- [x] Progress bar das etapas: compacta em mobile
- [ ] Testar em: 375px (iPhone SE), 390px (iPhone 14), 412px (Pixel 7), 768px (iPad)

---

## Fase 3 — Auth Frontend (conectado ao backend real)

### Objetivo
Login e cadastro funcionando de verdade — sem mocks, com feedback visual completo e fluxos de erro tratados.

### Fluxos a Implementar

#### Login
- [x] Formulário com validação Zod
- [x] Conectado ao `authService.login()` — sem mock no `AuthContext`
- [x] Tratamento de erros: 401, 403, 429 (bloqueado), rede offline
- [x] "Lembrar-me" removido — refresh token (7 dias) já cobre o caso de uso
- [ ] Redirecionar para dashboard após login (depende da Fase 6 — Dashboard)

#### Cadastro
- [x] 5 etapas com validação por passo
- [x] Conectado ao `authService.register()` — sem mock, sem alert()
- [x] Tela de sucesso pós-cadastro inline (email de verificação)
- [x] Tratamento de conflito específico: CNPJ_DUPLICADO, EMAIL_CORP_DUPLICADO, EMAIL_DUPLICADO
- [ ] Validação de CNPJ em tempo real ao sair do campo (melhoria futura)

#### Recuperação de Senha
- [x] Modal `EsqueciSenhaModal.tsx` — campo de email + botão enviar
- [x] Tela de confirmação genérica: "Se o email estiver cadastrado..."
- [x] Página `RedefinirSenhaPage.tsx` — nova senha via token na URL (`/redefinir-senha?token=...`)

#### Verificação de Email
- [x] Tela de sucesso pós-cadastro com instrução de verificar email
- [x] Página `VerificarEmailPage.tsx` — rota `/verificar-email?token=...`
- [x] Após verificação bem-sucedida, redireciona para login
- [ ] Reenvio de email de verificação (melhoria futura)

### Tarefas

- [x] Criar `EsqueciSenhaModal.tsx` + CSS
- [x] Criar `VerificarEmailPage.tsx` + CSS
- [x] Criar `RedefinirSenhaPage.tsx` (reutiliza CSS da VerificarEmailPage)
- [x] Implementar tela de sucesso pós-cadastro (inline no CadastroModal)
- [x] Configurar `react-router-dom` com rotas `/`, `/verificar-email`, `/redefinir-senha`
- [x] Corrigir `authService.verifyEmail` para usar parâmetro de rota em vez de query string
- [x] Corrigir `authService.resetPassword` payload (`senha` + `confirmar_senha`)
- [ ] Toast/snackbar de feedback global (melhoria futura — Fase 6)
- [ ] `PrivateRoute` para rotas autenticadas (quando o Dashboard for criado)

---

## Fase 4 — Backend MVC (Express + TypeScript)

### Objetivo
API REST robusta com autenticação JWT, integração com banco MySQL, email transacional e segurança de produção.

### Estrutura

```
server/
├── controllers/
│   ├── authController.ts       # login, register, logout, verify, refresh
│   ├── startupController.ts    # CRUD de startups
│   └── usuarioController.ts    # Perfil, atualização, deleção
│
├── models/                     # Queries SQL (ou Prisma ORM)
│   ├── usuario.model.ts
│   ├── startup.model.ts
│   └── sessao.model.ts
│
├── routes/
│   ├── auth.routes.ts          # POST /auth/login, /auth/register, etc.
│   ├── startup.routes.ts       # GET/PUT /startups/:id
│   └── usuario.routes.ts       # GET/PUT /usuarios/perfil
│
├── middleware/
│   ├── auth.middleware.ts      # Verificar JWT em rotas protegidas
│   ├── validate.middleware.ts  # Validação de body com Zod
│   ├── rateLimit.middleware.ts # Limitar tentativas de login (5 por 15min)
│   └── error.middleware.ts     # Handler global de erros
│
├── services/
│   ├── jwt.service.ts          # generateAccessToken, generateRefreshToken, verify
│   ├── hash.service.ts         # bcrypt hash + compare
│   ├── email.service.ts        # Nodemailer/Resend — verificação + recuperação
│   └── audit.service.ts        # Registrar logs_auditoria
│
├── config/
│   ├── database.ts             # Pool de conexão MySQL
│   └── env.ts                  # Validação de variáveis de ambiente
│
├── dtos/                       # Data Transfer Objects (validação de entrada)
│   ├── auth.dto.ts             # LoginDTO, RegisterDTO
│   └── usuario.dto.ts
│
└── index.ts                    # Entry point — app Express + porta
```

### Endpoints Prioritários

```
POST   /api/auth/register          Cadastrar startup + representante
POST   /api/auth/login             Login → retorna accessToken + seta refreshToken cookie
POST   /api/auth/logout            Invalida sessão
POST   /api/auth/refresh           Renovar accessToken via refreshToken (httpOnly cookie)
POST   /api/auth/forgot-password   Enviar email de recuperação
POST   /api/auth/reset-password    Redefinir senha com token
GET    /api/auth/verify-email      Verificar email com token

GET    /api/startups/me            Dados da startup autenticada
PUT    /api/startups/me            Atualizar dados da startup

GET    /api/usuarios/perfil        Perfil do usuário logado
PUT    /api/usuarios/perfil        Atualizar perfil
```

### Segurança

- JWT: `accessToken` em memória (15 min) · `refreshToken` em `httpOnly cookie` (7 dias)
- Rate limiting: 5 tentativas de login por IP/15min → bloqueio
- Bcrypt: custo 12 para hashing de senhas
- CORS: whitelist do domínio Vercel + localhost
- Helmet.js: headers de segurança
- Validação Zod em todos os endpoints
- Sanitização de inputs (evitar SQL injection)

### Tarefas

- [x] Inicializar projeto Express com TypeScript em `server/`
- [x] Configurar MySQL com pool de conexão (`server/src/config/database.ts`)
- [x] Implementar `authController` completo (register, login, logout, refresh, verifyEmail, forgotPassword, resetPassword)
- [x] Implementar JWT service (access + refresh tokens com jti)
- [x] Implementar hash service (bcrypt cost 12)
- [x] Implementar email service (verificação + recuperação via Nodemailer, jsonTransport em dev)
- [x] Rate limiting nos endpoints de login, register e forgotPassword
- [x] Implementar middleware de erro global (`AppError` + handler)
- [x] Criar modelos: `usuario.model.ts`, `startup.model.ts`, `sessao.model.ts`
- [x] Criar DTOs Zod para auth (loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema)
- [x] Criar middleware: `auth.middleware.ts`, `validate.middleware.ts`, `rateLimit.middleware.ts`, `error.middleware.ts`
- [x] Criar routes: `auth.routes.ts`, `startup.routes.ts`, `usuario.routes.ts`
- [x] Criar `server/src/index.ts` com Helmet, CORS, cookie-parser
- [x] Adicionar script `dev:all` no `package.json` raiz com `concurrently`
- [ ] Criar `server/.env` a partir de `.env.example` com valores reais
- [ ] Documentar endpoints (Swagger/OpenAPI) — opcional

---

## Fase 5 — Testes

### Objetivo
Cobertura ≥ 80% nas camadas críticas: validação, autenticação e fluxo de cadastro.

### Stack de Testes

| Camada | Ferramenta | O que testa |
|--------|-----------|-------------|
| Frontend unitário | Vitest + React Testing Library | Componentes, hooks, services |
| Backend unitário | Vitest / Jest | Controllers, services, models |
| Integração | Supertest + banco de teste | Endpoints de auth end-to-end |
| E2E (futuro) | Playwright | Fluxo login + cadastro no browser |

### Testes Prioritários — Frontend

```
src/__tests__/
├── utils/
│   └── validation.test.ts        # CPF, CNPJ, email, senha — 100% cobertura
├── hooks/
│   └── useAuth.test.ts           # login, logout, persistência, token expirado
├── services/
│   ├── authService.test.ts       # Mock axios — login OK, 401, 403, 423
│   └── cepService.test.ts        # Mock fetch — CEP válido, inválido, erro de rede
└── components/
    ├── LoginModal.test.tsx        # Render, validação, submit, erros
    └── CadastroModal.test.tsx     # Navegação entre etapas, validação por etapa
```

### Testes Prioritários — Backend

```
server/__tests__/
├── unit/
│   ├── hash.service.test.ts      # hash e compare
│   ├── jwt.service.test.ts       # geração, verificação, expiração
│   └── validation.test.ts        # DTOs Zod
└── integration/
    ├── auth.register.test.ts     # POST /auth/register — sucesso, conflito 409
    ├── auth.login.test.ts        # POST /auth/login — sucesso, 401, 423
    ├── auth.refresh.test.ts      # POST /auth/refresh — token válido, expirado
    └── auth.password.test.ts     # forgot-password, reset-password
```

### Tarefas

- [ ] Configurar Vitest no projeto frontend
- [ ] Escrever testes de `validation.ts` (já testável, 100% cobertura esperada)
- [ ] Escrever testes de `useAuth` com mock do authService
- [ ] Escrever testes de `LoginModal` com React Testing Library
- [ ] Configurar Jest/Vitest no backend
- [ ] Escrever testes de integração de auth com banco de dados de teste
- [ ] Configurar CI (GitHub Actions) para rodar testes em cada PR

---

## Ordem de Execução

```
Fase 1 (Frontend MVC)
    └─► Fase 2 (Mobile-First CSS)
            └─► Fase 3 (Auth Frontend + UX completo)
                    └─► Fase 4 (Backend API)
                            └─► Fase 3 revisão (desligar mocks, conectar ao backend)
                                    └─► Fase 5 (Testes)
```

---

## Decisões Técnicas

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| ORM vs SQL puro | **SQL puro** com helper de query | Schema já existe, sem overhead de ORM |
| Email service | **Resend** (ou Nodemailer + SMTP) | Simples, confiável, free tier generoso |
| Token storage | **Access em memória · Refresh em httpOnly cookie** | Melhor segurança contra XSS |
| CSS framework | **Nenhum** — CSS puro | Projeto já tem identidade visual própria |
| Testes E2E | **Playwright** (fase futura) | Melhor suporte mobile viewport |

---

## Notas de Qualidade

- Nenhum `console.log` em produção — usar log service com nível (info/warn/error)
- Nenhum `alert()` — sempre feedback em tela
- Todas as strings de usuário em português (pt-BR)
- Acessibilidade: `aria-label` em todos os botões de ícone, `role` em modais
- Inputs com `min-height: 48px` para conformidade WCAG em mobile
