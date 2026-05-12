# 🔐 Credenciais de Teste - ANSTARTUP Brasil

## 👤 Usuário de Teste Principal

Para testar o sistema, use as seguintes credenciais:

```
📧 Email: teste@anstartup.com.br
🔑 Senha: Teste@2025
```

### Informações da Conta de Teste

- **Startup**: Startup Demo Tecnologia LTDA
- **Nome Fantasia**: Startup Demo
- **CNPJ**: 99.999.999/0001-99
- **Plano**: Premium ⭐
- **Status**: Ativa ✅
- **Área de Atuação**: SaaS
- **Email Verificado**: Sim ✓

---

## 📋 Planos Disponíveis

### 🌱 Básico
**Benefícios:**
- Acesso a eventos da associação
- Networking com outras startups
- Newsletter mensal
- Listagem no diretório de startups

**Ideal para:** Startups em fase de ideia ou MVP inicial

---

### 💼 Profissional
**Benefícios:**
- **Todos os benefícios do Básico +**
- Mentoria mensal
- Workshops especializados
- Desconto em ferramentas parceiras
- Acesso a grupos exclusivos

**Ideal para:** Startups com tração e primeiros clientes

---

### ⭐ Premium
**Benefícios:**
- **Todos os benefícios do Profissional +**
- Consultoria especializada trimestral
- Conexão com investidores
- Suporte prioritário
- Participação em eventos VIP
- Análise de pitch deck

**Ideal para:** Startups em crescimento acelerado

---

### 🏆 Enterprise
**Benefícios:**
- **Todos os benefícios do Premium +**
- Suporte dedicado 24/7
- Consultoria personalizada mensal
- Assessoria jurídica básica
- Conexão direta com corporate ventures
- Participação em rodadas de investimento
- Representação em eventos internacionais

**Ideal para:** Startups consolidadas e em escala

---

## ✅ Validações Implementadas

### Cadastro
1. ✓ Todos os campos obrigatórios devem ser preenchidos
2. ✓ CNPJ e CPF são validados
3. ✓ Email é validado
4. ✓ **Plano é obrigatório** - Sem plano, não há acesso ao sistema
5. ✓ Senha deve ter no mínimo 8 caracteres com maiúsculas, minúsculas, números e símbolos

### Login
1. ✓ Verifica se o usuário existe
2. ✓ Valida a senha
3. ✓ **Verifica se a startup tem um plano ativo**
4. ✓ Verifica se o email foi verificado
5. ✓ Verifica se o usuário está ativo

### Acesso ao Sistema
- ❌ **Usuários sem plano não podem acessar**
- ✅ **Somente usuários com plano ativo têm acesso completo**

---

## 🧪 Como Testar

### 1. Testar Login
```bash
# Acesse o sistema e clique em "Login"
# Use as credenciais:
Email: teste@anstartup.com.br
Senha: Teste@2025
```

### 2. Testar Cadastro
```bash
# Clique em "Cadastre-se"
# Preencha todas as 5 etapas
# Na Etapa 3, SELECIONE UM PLANO (obrigatório)
# Complete o cadastro
```

### 3. Verificar Plano
```bash
# Após o login, o sistema deve:
# - Exibir o nome da startup
# - Exibir o plano contratado
# - Liberar acesso apenas se houver plano ativo
```

---

## 🔧 Configuração do Banco de Dados

Para criar o usuário de teste no banco de dados:

```sql
-- Execute o arquivo seed.sql
mysql -u seu_usuario -p seu_banco < database/seed.sql
```

O arquivo `seed.sql` já contém:
- Startup de teste completa
- Usuário de teste com senha hashada
- Plano Premium configurado
- Status ativo

---

## 📝 Observações Importantes

1. **Senha Hash**: A senha "Teste@2025" está hashada com bcrypt no seed.sql
2. **Plano Obrigatório**: Sem escolher um plano, o cadastro não pode ser finalizado
3. **Validação no Login**: O sistema verifica se a startup tem um plano ativo
4. **Benefícios por Plano**: Cada plano oferece benefícios específicos e progressivos

---

## 🚀 Próximos Passos

- [ ] Implementar API real de autenticação
- [ ] Conectar com backend para validação de credenciais
- [ ] Implementar verificação de email real
- [ ] Adicionar página de seleção/upgrade de plano
- [ ] Implementar dashboard com benefícios por plano
- [ ] Adicionar sistema de pagamento para planos

---

**Última atualização**: 28 de dezembro de 2025
