# 🚀 Guia de Deploy no Vercel

## ⚠️ PROBLEMA IDENTIFICADO: Tabelas não existem no Supabase

**Erro no Console:**
```
Could not find the table 'public.rooms' in the schema cache
Could not find the table 'public.films' in the schema cache
```

## 🔧 Solução: Siga estes passos NA ORDEM

### 🎯 PASSO 1: Criar as Tabelas no Supabase (CRÍTICO!)

**Este é o problema principal!** As tabelas do banco de dados não foram criadas.

1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie TODO o conteúdo do arquivo `supabase-schema.sql` (na raiz do projeto)
6. Cole no editor SQL
7. Clique em **RUN** (ou pressione Ctrl+Enter)
8. Aguarde a mensagem de sucesso ✅

**Verificar se funcionou:**
- Vá em **Table Editor** no menu lateral
- Você deve ver 4 tabelas: `films`, `rooms`, `sessions`, `sales`

---

### 🌐 PASSO 2: Obter as Credenciais do Supabase

1. No Supabase Dashboard, vá em **Settings** → **API**
2. Copie:
   - **Project URL** → Esta é sua `VITE_SUPABASE_URL`
   - **anon public** key → Esta é sua `VITE_SUPABASE_ANON_KEY`

---

### 🔑 PASSO 3: Configurar Variáveis de Ambiente no Vercel

1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis (use os valores copiados no Passo 2):

   ```
   VITE_SUPABASE_URL = https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY = sua_chave_anonima_aqui
   ```

4. Certifique-se de marcar as opções:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

---

### ✅ PASSO 4: Arquivo vercel.json (JÁ CRIADO)
O arquivo `vercel.json` já foi criado na raiz do projeto com a configuração necessária para o React Router funcionar.

---

### 🔄 PASSO 5: Fazer Redeploy

Após adicionar as variáveis de ambiente:

1. Vá em **Deployments**
2. Clique nos três pontos (...) do último deployment
3. Selecione **Redeploy**
4. Aguarde o build completar

### 4. 🔍 Verificar Erros no Console

Se ainda houver problemas:

1. Abra o site em produção
2. Pressione **F12** para abrir o DevTools
3. Vá na aba **Console**
4. Procure por erros em vermelho
5. Compartilhe os erros encontrados para análise

### 5. 📋 Checklist de Verificação

- [ ] Arquivo `vercel.json` existe na raiz do projeto
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Redeploy realizado após configurar as variáveis
- [ ] Build completou sem erros
- [ ] Console do navegador verificado

### 6. 🌐 Como Obter as Credenciais do Supabase

1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

---

## Comandos Úteis

```bash
# Testar build localmente
npm run build
npm run preview

# Verificar se há erros de TypeScript
npm run build
```

## Estrutura de Arquivos Importantes

```
projeto-cinema/
├── vercel.json          # Configuração do Vercel (SPA routing)
├── .env.example         # Exemplo de variáveis de ambiente
├── vite.config.ts       # Configuração do Vite
└── src/
    ├── lib/
    │   └── supabase.ts  # Cliente Supabase (usa variáveis de ambiente)
    └── App.tsx          # Rotas da aplicação
```

## Troubleshooting Adicional

### Erro: "Missing Supabase environment variables"
- **Causa:** Variáveis de ambiente não configuradas no Vercel
- **Solução:** Siga o passo 2 acima

### Página 404 ao acessar rotas diretamente
- **Causa:** Falta configuração do `vercel.json`
- **Solução:** O arquivo já foi criado, faça redeploy

### Build falha no Vercel
- **Causa:** Erros de TypeScript ou dependências faltando
- **Solução:** Execute `npm run build` localmente e corrija os erros

---

**Última atualização:** 2025-12-03
