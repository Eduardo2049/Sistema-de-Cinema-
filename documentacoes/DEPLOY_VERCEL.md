# 🚀 Guia de Deploy no Vercel

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### 🎯 PASSO 1: Criar as Tabelas no Supabase (CRÍTICO!)

**Erro:** `Could not find the table 'public.rooms' in the schema cache`

**Solução:**
1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie TODO o conteúdo do arquivo `supabase-schema.sql` (na raiz do projeto)
6. Cole no editor SQL
7. Clique em **RUN** (ou pressione Ctrl+Enter)
8. Aguarde a mensagem de sucesso ✅

**Verificar:** Vá em **Table Editor** → Deve ver 4 tabelas: `films`, `rooms`, `sessions`, `sales`

---

### 🔑 PASSO 2: Configurar Variáveis de Ambiente no Vercel

1. No Supabase, vá em **Settings** → **API** e copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

2. No [Vercel Dashboard](https://vercel.com/dashboard):
   - Vá em **Settings** → **Environment Variables**
   - Adicione as 2 variáveis acima
   - Marque: ✅ Production, ✅ Preview, ✅ Development

---

### 🔄 PASSO 3: Fazer Redeploy

1. No Vercel, vá em **Deployments**
2. Clique nos **3 pontos (...)** do último deployment
3. Selecione **Redeploy**
4. Aguarde o build completar

---

## 🐛 Troubleshooting - Erros Comuns

### ❌ Erro: "Could not find the 'releaseDate' column"
**Erro completo:** `PGRST204: Could not find the 'releaseDate' column of 'films'`

**Causa:** O banco usa `release_date` (snake_case) mas o código enviava `releaseDate` (camelCase)

**Status:** ✅ **JÁ CORRIGIDO!** O hook `useFilms.ts` agora faz a conversão automática entre os formatos.

---

### ❌ Erro: "Failed to load resource: favicon.ico (404)"
**Causa:** Faltava o arquivo de ícone

**Status:** ✅ **JÁ CORRIGIDO!** Criado `favicon.svg` na pasta `public/`

**Resultado:** Ícone de cinema aparece na aba do navegador

---

### ❌ Erro: "Missing Supabase environment variables"
**Causa:** Variáveis de ambiente não configuradas no Vercel

**Solução:** Siga o PASSO 2 acima

---

### ❌ Página 404 ao acessar rotas diretamente
**Causa:** Falta configuração do `vercel.json`

**Status:** ✅ **JÁ CORRIGIDO!** O arquivo `vercel.json` foi criado

---

### ❌ Build falha no Vercel
**Causa:** Erros de TypeScript ou dependências faltando

**Solução:** Execute `npm run build` localmente e corrija os erros

---

## 📋 Checklist Final

- [ ] Tabelas criadas no Supabase (4 tabelas visíveis no Table Editor)
- [ ] Variáveis de ambiente configuradas no Vercel (2 variáveis)
- [ ] Redeploy realizado
- [ ] Build completou sem erros
- [ ] Site abrindo sem tela branca
- [ ] Console sem erros (F12)
- [ ] Favicon aparecendo na aba

---

## 🛠️ Comandos Úteis

```bash
# Testar build localmente
npm run build
npm run preview

# Verificar erros de TypeScript
npm run build
```

---

## 📁 Arquivos Importantes

```
projeto-cinema/
├── vercel.json              # ✅ Configuração do Vercel (SPA routing)
├── supabase-schema.sql      # 📝 Script SQL para criar tabelas
├── .env.example             # 📄 Exemplo de variáveis
├── public/
│   └── favicon.svg          # 🎨 Ícone do site
└── src/
    ├── lib/
    │   └── supabase.ts      # 🔌 Cliente Supabase
    ├── hooks/
    │   └── useFilms.ts      # ✅ Conversão camelCase ↔ snake_case
    └── App.tsx              # 🚀 Rotas da aplicação
```

---

**Última atualização:** 2025-12-04  
**Status:** Todos os problemas conhecidos foram corrigidos ✅
