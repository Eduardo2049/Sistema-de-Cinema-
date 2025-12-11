# 🔧 Configuração do Supabase

## Problema Identificado

Você tem **dois sistemas** no projeto:

1. **Sistema Legado** (HTML/JS puro em `/pages/*.html` e `/js/*.js`)
   - Usa **localStorage** diretamente
   - Chaves: `cinema_films`, `salas`, `sessoes`, `ingressos`
   - Páginas: `filmes.html`, `salas.html`, `sessoes.html`, `vendas.html`

2. **Sistema Novo** (React/TypeScript em `/src`)
   - Usa **Supabase** (banco de dados PostgreSQL)
   - Requer variáveis de ambiente (`.env`)
   - Executado via `npm run dev`

## ⚠️ Inconsistências no Schema

O schema SQL (`supabase-schema.sql`) tem **redundância**:
- Tabela `orders` → sistema principal (usado no código)
- Tabela `sales` → **VAZIA e não usada no código React**
- Ambas têm relacionamentos cruzados que causam confusão

### Tabelas Relacionadas:
```
orders (PRINCIPAL - usado no código)
  ├── tickets (order_id) ✅
  └── order_snacks (order_id) ✅

sales (LEGADO - NÃO usado no código React)
  └── tickets (sale_id) ⚠️ não utilizado
```

## 🛠️ Solução

### 1. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

**Onde obter esses valores:**
1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em: **Settings** → **API**
4. Copie:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 2. Executar o Schema SQL

No Supabase Dashboard:
1. Vá em: **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo de `supabase-schema.sql`
4. Execute

### 3. Limpar Schema (Opcional - Recomendado)

A tabela `sales` está obsoleta. Para remover:

```sql
-- 1. Remover relacionamento órfão em tickets
ALTER TABLE public.tickets DROP COLUMN IF EXISTS sale_id;

-- 2. Remover índices da tabela sales
DROP INDEX IF EXISTS idx_sales_session_id;
DROP INDEX IF EXISTS idx_sales_purchase_date;

-- 3. Remover políticas e tabela
DROP POLICY IF EXISTS "Enable all for sales" ON public.sales;
DROP TABLE IF EXISTS public.sales CASCADE;
```

Depois atualize `supabase-schema.sql` removendo referências a `sales`.

### 4. Testar

```bash
npm run dev
```

A aplicação React deve abrir em `http://localhost:5173` sem erros.

## 📊 Estrutura Corrigida

### Sistema React (Porta 5173)
- **Filmes**: CRUD via Supabase `films`
- **Salas**: CRUD via Supabase `rooms`
- **Sessões**: CRUD via Supabase `sessions`
- **Pedidos**: CRUD via Supabase `orders` + `tickets` + `order_snacks`

### Sistema Legado (HTML estático)
- **Filmes**: localStorage `cinema_films`
- **Salas**: localStorage `salas`
- **Sessões**: localStorage `sessoes`
- **Vendas**: localStorage `ingressos`

## 🎯 Recomendações

1. ✅ **Use o sistema React** (`npm run dev`) - É o sistema principal
2. ⚠️ **Migre dados do localStorage** se necessário
3. 🗑️ **Remova a tabela `sales`** para evitar confusão
4. 📝 **Documente qual sistema usar** no README

## 🔑 Segurança

⚠️ **NUNCA commite o arquivo `.env`** com suas chaves reais!

Adicione ao `.gitignore`:
```
.env
.env.local
```

Use `.env.example` para documentar as variáveis necessárias.
