# 📊 Diagramas do Sistema - ANSTARTUP Brasil

## 🏗️ Arquitetura Geral do Sistema

```mermaid
graph TB
    subgraph "Frontend - Vercel"
        A[React App<br/>TypeScript + Vite]
        A1[Componente Login]
        A2[Componente Cadastro]
        A3[Dashboard]
        A --> A1
        A --> A2
        A --> A3
    end
    
    subgraph "Backend - Google Cloud Run"
        B[Express API<br/>Node.js + TypeScript]
        B1[Auth Controller]
        B2[User Controller]
        B3[Startup Controller]
        B4[JWT Middleware]
        B --> B1
        B --> B2
        B --> B3
        B --> B4
    end
    
    subgraph "Database - Google Cloud SQL"
        C[(MySQL 8.0)]
        C1[startups]
        C2[usuarios]
        C3[sessoes]
        C4[logs_auditoria]
        C --> C1
        C --> C2
        C --> C3
        C --> C4
    end
    
    subgraph "Email - SendGrid"
        D[SendGrid API]
        D1[Email Verificação]
        D2[Email Recuperação]
        D3[Email Confirmação]
        D --> D1
        D --> D2
        D --> D3
    end
    
    A -->|HTTPS REST API| B
    B -->|SQL Queries| C
    B -->|Send Email| D
    D -->|Email Link| A
    
    style A fill:#009B3A
    style B fill:#002776
    style C fill:#FFDF00
    style D fill:#002776
```

---

## 🔐 Fluxo de Autenticação (Login)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant L as Logs
    
    U->>F: Clica em "Login"
    F->>F: Abre modal de login
    U->>F: Insere email e senha
    F->>F: Valida formato dos campos
    F->>B: POST /api/auth/login
    
    B->>DB: Busca usuário por email
    DB-->>B: Retorna dados do usuário
    
    alt Email não encontrado
        B-->>F: 404 - Usuário não encontrado
        F-->>U: Exibe erro
    else Email não verificado
        B-->>F: 403 - Email não verificado
        F-->>U: Exibe aviso + botão reenviar
    else Senha incorreta
        B->>DB: Incrementa tentativas_login
        B->>L: Registra tentativa falha
        B-->>F: 401 - Senha incorreta
        F-->>U: Exibe erro
    else Conta bloqueada
        B-->>F: 423 - Conta bloqueada
        F-->>U: Exibe mensagem de bloqueio
    else Login bem-sucedido
        B->>B: Valida senha (bcrypt)
        B->>B: Gera Access Token (15min)
        B->>B: Gera Refresh Token (7 dias)
        B->>DB: Cria sessão na tabela sessoes
        B->>DB: Atualiza ultimo_login
        B->>DB: Zera tentativas_login
        B->>L: Registra login bem-sucedido
        B-->>F: 200 + tokens + dados usuário
        F->>F: Armazena tokens (localStorage + cookie)
        F->>F: Atualiza contexto de autenticação
        F-->>U: Redireciona para dashboard
    end
```

---

## 📝 Fluxo de Cadastro (5 Etapas)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant E as SendGrid
    participant L as Logs
    
    U->>F: Clica em "Associe-se Agora"
    F->>F: Abre modal de cadastro
    
    Note over U,F: ETAPA 1: Dados da Startup
    U->>F: Preenche dados da startup
    F->>F: Valida CNPJ, email, etc.
    F->>F: Avança para etapa 2
    
    Note over U,F: ETAPA 2: Endereço
    U->>F: Insere CEP
    F->>ViaCEP: Busca endereço por CEP
    ViaCEP-->>F: Retorna dados do endereço
    F->>F: Preenche campos automaticamente
    U->>F: Complementa dados se necessário
    F->>F: Avança para etapa 3
    
    Note over U,F: ETAPA 3: Informações do Negócio
    U->>F: Preenche área, descrição, estágio, etc.
    F->>F: Avança para etapa 4
    
    Note over U,F: ETAPA 4: Representante Legal
    U->>F: Preenche dados pessoais
    F->>F: Valida CPF, email
    F->>F: Avança para etapa 5
    
    Note over U,F: ETAPA 5: Definir Senha
    U->>F: Define senha
    F->>F: Valida força da senha
    U->>F: Aceita termos e políticas
    F->>F: Valida todos os dados
    
    F->>B: POST /api/auth/register (payload completo)
    
    B->>B: Valida todos os campos
    B->>DB: Verifica se CNPJ já existe
    B->>DB: Verifica se CPF já existe
    B->>DB: Verifica se email já existe
    
    alt Dados duplicados
        B-->>F: 409 - Conflito (dados já cadastrados)
        F-->>U: Exibe erro específico
    else Validação falhou
        B-->>F: 400 - Dados inválidos
        F-->>U: Exibe erros de validação
    else Cadastro bem-sucedido
        B->>B: Hash da senha (bcrypt)
        B->>B: Gera UUID para startup
        B->>B: Gera UUID para usuário
        B->>B: Gera token de verificação
        B->>DB: BEGIN TRANSACTION
        B->>DB: INSERT INTO startups
        B->>DB: INSERT INTO usuarios
        B->>DB: COMMIT TRANSACTION
        B->>L: Registra cadastro bem-sucedido
        B->>E: Envia email de verificação
        E-->>U: Email com link de verificação
        B-->>F: 201 - Cadastro realizado
        F->>F: Exibe mensagem de sucesso
        F-->>U: Instrui verificar email
    end
```

---

## 🔄 Fluxo de Recuperação de Senha

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant E as SendGrid
    participant L as Logs
    
    Note over U,F: ETAPA 1: Solicitar Reset
    U->>F: Clica em "Esqueci minha senha"
    F->>F: Abre modal de recuperação
    U->>F: Insere email cadastrado
    F->>B: POST /api/auth/forgot-password
    
    B->>DB: Busca usuário por email
    
    alt Email não encontrado
        B->>L: Registra tentativa (email não existe)
        B-->>F: 200 (sempre retorna sucesso - segurança)
        F-->>U: "Se o email existir, enviamos instruções"
    else Email encontrado
        B->>B: Gera token de recuperação (UUID)
        B->>B: Define expiração (1 hora)
        B->>DB: Salva token_recuperacao e expiracao
        B->>L: Registra solicitação de recuperação
        B->>E: Envia email com link de reset
        E-->>U: Email com link (válido por 1h)
        B-->>F: 200 - Email enviado
        F-->>U: "Se o email existir, enviamos instruções"
    end
    
    Note over U,E: ETAPA 2: Redefinir Senha
    U->>U: Abre email
    U->>F: Clica no link de reset
    F->>B: GET /api/auth/reset-password?token=xyz
    
    B->>DB: Verifica token e expiração
    
    alt Token inválido ou expirado
        B-->>F: 400 - Token inválido
        F-->>U: "Link expirado ou inválido"
        F-->>U: Oferece reenviar email
    else Token válido
        B-->>F: 200 - Token válido
        F->>F: Exibe formulário de nova senha
        U->>F: Define nova senha
        F->>F: Valida força da senha
        F->>B: POST /api/auth/reset-password
        
        B->>B: Hash da nova senha (bcrypt)
        B->>DB: Atualiza senha_hash
        B->>DB: Remove token_recuperacao
        B->>DB: Invalida todas as sessões ativas
        B->>L: Registra alteração de senha
        B->>E: Envia email de confirmação
        E-->>U: Email "Senha alterada com sucesso"
        B-->>F: 200 - Senha redefinida
        F-->>U: "Senha alterada! Faça login"
        F->>F: Redireciona para login
    end
```

---

## ✉️ Fluxo de Verificação de Email

```mermaid
sequenceDiagram
    participant U as Usuário
    participant E as Email
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant L as Logs
    
    Note over U: Após cadastro
    E->>U: Email com link de verificação
    U->>U: Abre email
    U->>F: Clica no link de verificação
    
    F->>B: GET /api/auth/verify-email?token=xyz
    
    B->>DB: Busca usuário por token_verificacao
    
    alt Token não encontrado
        B-->>F: 400 - Token inválido
        F-->>U: "Link inválido"
    else Token expirado
        B-->>F: 400 - Token expirado
        F-->>U: "Link expirado. Reenviar?"
        U->>F: Clica em "Reenviar"
        F->>B: POST /api/auth/resend-verification
        B->>B: Gera novo token
        B->>DB: Atualiza token e expiração
        B->>E: Envia novo email
        E-->>U: Novo email de verificação
    else Token válido
        B->>DB: UPDATE email_verificado = TRUE
        B->>DB: Remove token_verificacao
        B->>L: Registra verificação bem-sucedida
        B-->>F: 200 - Email verificado
        F-->>U: "Email verificado com sucesso!"
        F->>F: Redireciona para login
    end
```

---

## 🔒 Modelo de Dados (ER Diagram)

```mermaid
erDiagram
    STARTUPS ||--o{ USUARIOS : "possui"
    USUARIOS ||--o{ SESSOES : "tem"
    STARTUPS ||--o{ LOGS_AUDITORIA : "gera"
    USUARIOS ||--o{ LOGS_AUDITORIA : "gera"
    
    STARTUPS {
        varchar id PK "UUID"
        varchar razao_social
        varchar nome_fantasia
        varchar cnpj UK "UNIQUE"
        varchar email_corporativo UK
        varchar telefone
        varchar cep
        varchar cidade
        varchar estado
        varchar area_atuacao
        text descricao_negocio
        enum status_associacao
        enum tipo_plano
        timestamp data_associacao
        timestamp created_at
        timestamp updated_at
    }
    
    USUARIOS {
        varchar id PK "UUID"
        varchar startup_id FK
        varchar nome_completo
        varchar cpf UK "UNIQUE"
        varchar email UK "UNIQUE"
        varchar cargo
        enum tipo_usuario
        varchar senha_hash
        varchar salt
        timestamp ultimo_login
        int tentativas_login
        timestamp bloqueado_ate
        boolean email_verificado
        varchar token_verificacao
        timestamp token_verificacao_expira
        varchar token_recuperacao
        timestamp token_recuperacao_expira
        boolean ativo
        timestamp created_at
        timestamp updated_at
    }
    
    SESSOES {
        varchar id PK "UUID"
        varchar usuario_id FK
        varchar refresh_token UK
        varchar access_token_jti UK
        varchar ip_address
        text user_agent
        varchar dispositivo
        varchar navegador
        timestamp expires_at
        timestamp ultimo_uso
        boolean ativa
        timestamp revogada_em
        timestamp created_at
    }
    
    LOGS_AUDITORIA {
        bigint id PK "AUTO_INCREMENT"
        varchar usuario_id FK
        varchar startup_id FK
        varchar acao
        text descricao
        varchar ip_address
        text user_agent
        boolean sucesso
        varchar codigo_erro
        text mensagem_erro
        json metadados
        timestamp created_at
    }
```

---

## 🎨 Fluxo de Navegação do Usuário

```mermaid
graph TD
    A[Landing Page] --> B{Usuário logado?}
    B -->|Não| C[Botão Associe-se]
    B -->|Não| D[Botão Login]
    B -->|Sim| E[Dashboard]
    
    C --> F[Modal Cadastro<br/>5 Etapas]
    F --> G[Email Enviado]
    G --> H[Verificar Email]
    H --> I[Email Verificado]
    I --> D
    
    D --> J[Modal Login]
    J --> K{Credenciais<br/>válidas?}
    K -->|Não| L[Exibe Erro]
    K -->|Sim| M{Email<br/>verificado?}
    M -->|Não| N[Aviso + Reenviar]
    M -->|Sim| E
    
    L --> O[Esqueci Senha?]
    O --> P[Solicitar Reset]
    P --> Q[Email Reset]
    Q --> R[Redefinir Senha]
    R --> D
    
    E --> S[Perfil da Startup]
    E --> T[Perfil do Usuário]
    E --> U[Gerenciar Membros]
    E --> V[Histórico]
    E --> W[Configurações]
    E --> X[Logout]
    
    X --> A
    
    style A fill:#009B3A
    style E fill:#002776
    style F fill:#FFDF00
    style J fill:#FFDF00
```

---

## 📈 Estados de uma Startup no Sistema

```mermaid
stateDiagram-v2
    [*] --> Pendente: Cadastro realizado
    Pendente --> Ativa: Email verificado + Admin aprova
    Pendente --> Cancelada: Nunca verificou email (30 dias)
    
    Ativa --> Suspensa: Inadimplência ou violação
    Suspensa --> Ativa: Regularização
    Suspensa --> Cancelada: Não regularizou (90 dias)
    
    Ativa --> Cancelada: Usuário solicita cancelamento
    
    Cancelada --> [*]
    
    note right of Pendente
        - Email não verificado OU
        - Aguardando aprovação admin
    end note
    
    note right of Ativa
        - Pode acessar todos os recursos
        - Plano ativo (básico, profissional, premium, enterprise)
    end note
    
    note right of Suspensa
        - Acesso bloqueado
        - Dados preservados
    end note
    
    note right of Cancelada
        - Dados mantidos por 90 dias (LGPD)
        - Após 90 dias: exclusão permanente
    end note
```

---

## 🔐 Ciclo de Vida de um Token JWT

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    Note over F,DB: LOGIN - Geração de Tokens
    F->>B: POST /api/auth/login
    B->>B: Valida credenciais
    B->>B: Gera Access Token (15min)
    B->>B: Gera Refresh Token (7 dias)
    B->>DB: Salva refresh_token em sessoes
    B-->>F: Retorna ambos os tokens
    F->>F: Armazena Access (localStorage)
    F->>F: Armazena Refresh (httpOnly cookie)
    
    Note over F,B: REQUISIÇÃO PROTEGIDA
    loop A cada requisição
        F->>B: Request + Authorization: Bearer {access_token}
        B->>B: Valida Access Token
        alt Token válido
            B-->>F: 200 + Data
        else Token expirado
            B-->>F: 401 - Token expirado
            F->>F: Detecta 401
            F->>B: POST /api/auth/refresh + refresh_token
            B->>DB: Verifica refresh_token na tabela sessoes
            alt Refresh válido
                B->>B: Gera novo Access Token
                B->>DB: Atualiza ultimo_uso da sessão
                B-->>F: 200 + novo access_token
                F->>F: Atualiza access_token armazenado
                F->>B: Repete requisição original
            else Refresh inválido/expirado
                B-->>F: 401 - Sessão expirada
                F->>F: Limpa tokens
                F->>F: Redireciona para login
            end
        end
    end
    
    Note over F,DB: LOGOUT - Invalidação
    F->>B: POST /api/auth/logout + refresh_token
    B->>DB: UPDATE sessoes SET ativa = FALSE
    B->>DB: SET revogada_em = NOW()
    B-->>F: 200 - Logout bem-sucedido
    F->>F: Limpa tokens do storage
    F->>F: Redireciona para home
```

---

## 🛡️ Camadas de Segurança

```mermaid
graph TB
    subgraph "Camada 1: Frontend"
        A1[Validação de Formulário]
        A2[Máscaras CPF/CNPJ]
        A3[Indicador Força de Senha]
        A4[HTTPS Only]
    end
    
    subgraph "Camada 2: Transporte"
        B1[TLS 1.3]
        B2[CORS Restrito]
        B3[Content Security Policy]
    end
    
    subgraph "Camada 3: Backend"
        C1[Express Validator]
        C2[Rate Limiting]
        C3[Helmet.js]
        C4[JWT Verification]
        C5[bcrypt Hash]
    end
    
    subgraph "Camada 4: Database"
        D1[SQL Injection Prevention]
        D2[Prepared Statements]
        D3[Criptografia em Repouso]
        D4[Backup Automático]
    end
    
    subgraph "Camada 5: Auditoria"
        E1[Logs de Acesso]
        E2[Logs de Erro]
        E3[Alertas de Segurança]
        E4[Compliance LGPD]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    A4 --> B1
    
    B1 --> C1
    B2 --> C2
    B3 --> C3
    
    C1 --> D1
    C2 --> D2
    C4 --> D3
    C5 --> D4
    
    D1 --> E1
    D2 --> E2
    D3 --> E3
    D4 --> E4
    
    style A1 fill:#009B3A
    style B1 fill:#002776
    style C1 fill:#FFDF00
    style D1 fill:#009B3A
    style E1 fill:#002776
```

---

## 📱 Responsividade e Dispositivos

```mermaid
graph LR
    A[Aplicação ANSTARTUP] --> B[Desktop]
    A --> C[Tablet]
    A --> D[Mobile]
    
    B --> B1[Modal Cadastro<br/>Layout Completo]
    B --> B2[Dashboard<br/>Sidebar + Conteúdo]
    
    C --> C1[Modal Cadastro<br/>Layout Adaptado]
    C --> C2[Dashboard<br/>Menu Colapsável]
    
    D --> D1[Cadastro<br/>Fullscreen Steps]
    D --> D2[Dashboard<br/>Menu Bottom Nav]
    
    style A fill:#002776
    style B fill:#009B3A
    style C fill:#009B3A
    style D fill:#009B3A
```

---

*Diagramas criados em: 25 de outubro de 2025*
*Formato: Mermaid (renderizável no GitHub, VSCode, etc.)*
