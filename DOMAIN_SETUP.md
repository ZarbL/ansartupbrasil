# 🌐 Configuração do Domínio anstartupbrasil.org

Guia passo a passo para configurar o domínio personalizado da Hostinger na Vercel.

---

## 📋 Pré-requisitos

- [ ] Projeto já deployado na Vercel
- [ ] Acesso ao painel da Hostinger
- [ ] Domínio `anstartupbrasil.org` registrado na Hostinger

---

## 🚀 Passo a Passo

### 1️⃣ Adicionar Domínio na Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto **anstartup**
3. Vá em **Settings** (no menu lateral)
4. Clique em **Domains**
5. No campo "Domain", digite: `anstartupbrasil.org`
6. Clique em **Add**
7. A Vercel mostrará uma mensagem com os registros DNS necessários

> 💡 **Dica**: Anote ou tire um print dos registros DNS fornecidos pela Vercel

---

### 2️⃣ Configurar DNS na Hostinger

#### Acessar o Painel DNS

1. Acesse [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Faça login com suas credenciais
3. No menu lateral, clique em **Domínios**
4. Localize `anstartupbrasil.org` e clique em **Gerenciar**
5. Clique na aba **DNS / Nameservers** ou **Zona DNS**

#### Remover Registros Antigos (se necessário)

Antes de adicionar os novos registros, remova:
- Registros A antigos apontando para @ (domínio raiz)
- Registros CNAME conflitantes

#### Adicionar Novos Registros DNS

**Configuração Recomendada - Registros A:**

| Tipo | Nome/Host | Valor/Destino | TTL |
|------|-----------|---------------|-----|
| A | @ | 76.76.19.19 | 3600 |
| A | @ | 76.76.19.61 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

**Como adicionar cada registro:**

1. Clique em **Adicionar Registro** ou **Add Record**
2. Selecione o **Tipo**: `A`
3. No campo **Nome** ou **Host**, digite: `@`
4. No campo **Valor** ou **Points to**, digite: `76.76.19.19`
5. **TTL**: `3600` (1 hora)
6. Clique em **Salvar** ou **Save**
7. Repita para o segundo registro A com IP `76.76.19.61`
8. Adicione o registro CNAME para `www`

---

### 3️⃣ Verificação dos Registros

Após adicionar os registros, verifique se estão corretos:

**Na Hostinger:**
```
Tipo: A     | Nome: @   | Valor: 76.76.19.19
Tipo: A     | Nome: @   | Valor: 76.76.19.61
Tipo: CNAME | Nome: www | Valor: cname.vercel-dns.com
```

---

### 4️⃣ Aguardar Propagação DNS

- **Tempo estimado**: 5 minutos a 48 horas (geralmente 15-30 minutos)
- **Verificar propagação**: Use [dnschecker.org](https://dnschecker.org/#A/anstartupbrasil.org)

**Como verificar:**
1. Acesse [https://dnschecker.org](https://dnschecker.org)
2. Digite: `anstartupbrasil.org`
3. Selecione tipo: `A`
4. Clique em **Search**
5. Verifique se os IPs da Vercel aparecem em várias localizações

---

### 5️⃣ Verificar na Vercel

1. Volte para **Vercel Dashboard** > **Domains**
2. Aguarde o status mudar para:
   - ⏳ "Pending" → 🔄 "Verifying" → ✅ "Valid"
3. Quando aparecer ✅ **Valid**, o domínio está configurado!

---

### 6️⃣ Configurar Redirecionamento www → domínio raiz (Opcional)

Na Vercel Dashboard > Domains:

1. Adicione também o domínio `www.anstartupbrasil.org`
2. A Vercel perguntará se você quer redirecionar
3. Escolha: **Redirect www.anstartupbrasil.org to anstartupbrasil.org**

Isso garante que ambos URLs funcionem.

---

## ✅ Checklist de Configuração

- [ ] Projeto deployado na Vercel
- [ ] Domínio `anstartupbrasil.org` adicionado na Vercel
- [ ] Registros A configurados na Hostinger (76.76.19.19 e 76.76.19.61)
- [ ] Registro CNAME para www configurado
- [ ] DNS propagado (verificado em dnschecker.org)
- [ ] Status "Valid" na Vercel
- [ ] SSL/HTTPS funcionando automaticamente
- [ ] Site acessível em https://anstartupbrasil.org
- [ ] Redirecionamento www configurado (opcional)

---

## 🔧 Troubleshooting

### ❌ Problema: "Invalid Configuration"

**Solução:**
- Verifique se os IPs estão corretos: `76.76.19.19` e `76.76.19.61`
- Aguarde mais tempo para propagação DNS
- Limpe o cache DNS local: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder` (macOS)

### ❌ Problema: "DNS Not Found"

**Solução:**
- Certifique-se de que os registros foram salvos na Hostinger
- Verifique se não há registros conflitantes
- Aguarde alguns minutos e tente novamente

### ❌ Problema: "Too Many Redirects"

**Solução:**
- Remova quaisquer redirecionamentos configurados na Hostinger
- Deixe a Vercel gerenciar os redirecionamentos
- Limpe o cache do navegador

### ❌ Problema: Certificado SSL não ativa

**Solução:**
- Aguarde até 24 horas após DNS estar válido
- Certifique-se de que o domínio está com status "Valid" na Vercel
- O SSL é configurado automaticamente pela Vercel

---

## 📞 Suporte

### Documentação Oficial
- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Hostinger DNS Documentation](https://support.hostinger.com/en/articles/1696802-how-to-manage-dns-records)

### Comandos Úteis

**Verificar DNS (Terminal/CMD):**
```bash
# macOS/Linux
dig anstartupbrasil.org

# Windows
nslookup anstartupbrasil.org

# Verificar propagação global
curl -s https://dnschecker.org/api/check/anstartupbrasil.org/A
```

**Limpar cache DNS:**
```bash
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

---

## 🎉 Pronto!

Após seguir todos os passos, seu site estará acessível em:
- ✅ https://anstartupbrasil.org
- ✅ https://www.anstartupbrasil.org (se configurou redirecionamento)
- 🔒 SSL/HTTPS automático e gratuito

**Tempo total estimado**: 15-30 minutos (+ tempo de propagação DNS)

---

**ANSTARTUP Brasil** - Transformando o ecossistema de inovação brasileiro 🇧🇷
