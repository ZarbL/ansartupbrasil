# ANSTARTUP Brasil - Site Institucional

> Associação Nacional de Startups do Brasil

## 🚀 Sobre o Projeto

Site institucional da ANSTARTUP Brasil, uma organização que reúne startups, empreendedores digitais, líderes e agentes de inovação de todo o país, com o objetivo de promover um ecossistema vibrante, inclusivo e competitivo, impulsionando o Brasil como referência global em tecnologia, inovação e desenvolvimento sustentável.

## ✨ Características

- **Design Moderno e Responsivo**: Interface adaptada para todos os dispositivos (desktop, tablet e mobile)
- **Tema Claro/Escuro**: Alternância entre modos de visualização com preferência salva no navegador
- **Cores da Bandeira do Brasil**: Paleta baseada nas cores nacionais (#002776 azul, #009B3A verde, #FFDF00 amarelo)
- **Animações Suaves**: Efeitos visuais elegantes em cards, transições e scroll
- **Navegação Intuitiva**: Menu superior fixo com links âncora para todas as seções

## 📋 Seções do Site

1. **Hero/Apresentação**: Introdução impactante da associação
2. **Quem Somos**: Descrição da organização e seus objetivos
3. **Missão & Valores**: Apresentação dos pilares fundamentais
4. **Princípios e Diretrizes**: 5 princípios que norteiam a atuação
5. **O Que Fazemos**: 4 áreas principais de atuação
6. **Nossa Visão**: Aspirações para o futuro do ecossistema
7. **Equipe Diretiva**: Apresentação da liderança executiva
8. **Call-to-Action**: Convite para participação

## 🛠️ Tecnologias Utilizadas

- **React** 18.3.1 - Biblioteca JavaScript para interfaces
- **TypeScript** 5.6.2 - Superset tipado do JavaScript
- **Vite** 7.1.9 - Build tool e servidor de desenvolvimento
- **CSS3** - Estilização com variáveis CSS e animações

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/ZarbL/ansartupbrasil.git
cd anstartup
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

## 🏗️ Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 🚀 Deploy na Vercel

Este projeto está configurado para deploy automático na Vercel.

### Deploy via GitHub (Recomendado)

1. Faça commit das suas alterações:
```bash
git add .
git commit -m "Configuração para Vercel"
git push origin main
```

2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em "Add New Project"
4. Importe o repositório do GitHub
5. A Vercel detectará automaticamente as configurações do Vite
6. Clique em "Deploy"

### Deploy via Vercel CLI

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Execute o deploy:
```bash
vercel
```

3. Para deploy de produção:
```bash
vercel --prod
```

### Configurações da Vercel

O arquivo `vercel.json` já está configurado com:
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite
- Rewrites configurados para SPA

## 📱 Responsividade

O site foi desenvolvido com mobile-first e possui breakpoints para:
- Ultra Small: < 480px
- Extra Small: < 640px
- Small: 640px - 767px
- Medium: 768px - 1023px
- Large: 1024px - 1439px
- Extra Large: ≥ 1440px

## 🎨 Paleta de Cores

### Modo Claro
- **Azul Brasil**: #002776
- **Verde Brasil**: #009B3A
- **Amarelo Brasil**: #FFDF00
- **Background**: #ffffff
- **Texto**: #002776

### Modo Escuro
- **Azul Escuro**: #0a1628
- **Verde Vibrante**: #00c853
- **Amarelo Claro**: #FFE54C
- **Background**: #0a1628
- **Texto**: #f1f5f9

## 👥 Direção Executiva

- **Presidente**: Henrique Carneiro
- **Vice-presidente Executiva**: Erika Gadelha
- **Diretor Financeiro**: Gabriel Nojosa
- **Diretora Administrativa**: Nathalia Finazzi
- **Vice-presidente de Relações Institucionais**: Tony Sechi

## 📄 Licença

Este projeto foi desenvolvido para a ANSTARTUP Brasil.

## 🤝 Contribuindo

Para contribuir com o projeto, entre em contato com a equipe da ANSTARTUP Brasil.

---

**ANSTARTUP Brasil** - Transformando o ecossistema de inovação brasileiro 🇧🇷