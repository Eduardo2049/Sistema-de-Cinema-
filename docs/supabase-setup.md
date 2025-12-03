# 🗄️ Setup do Supabase - Sistema de Cinema

Este guia vai ajudá-lo a configurar o banco de dados Supabase para o projeto.

## 1. Executar o Schema SQL

1. Acesse o dashboard do Supabase: https://app.supabase.com
2. Selecione seu projeto: `dwrbzbdxneuwbrnfbriu`
3. No menu lateral, clique em **SQL Editor**
4. Clique em **+ New query**
5. Copie todo o conteúdo do arquivo [`supabase-schema.sql`](file:///c:/Users/eduardo.asousa/Projetos/Remake_Cinema/Sistema-de-Cinema-/supabase-schema.sql)
6. Cole no editor SQL
7. Clique em **Run** (ou pressione `Ctrl+Enter`)

Você deve ver a mensagem "Success. No rows returned" se tudo estiver correto.

## 2. Verificar Tabelas Criadas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver 4 tabelas criadas:
   - `films`
   - `rooms`
   - `sessions`
   - `sales`

## 3. Configurar Variáveis de Ambiente

Você já forneceu as credenciais! Agora precisa criar o arquivo `.env` na raiz do projeto.

**IMPORTANTE:** O arquivo `.env` está bloqueado pelo `.gitignore` por segurança. Você precisa criá-lo manualmente.

### Opção 1: Via Terminal
```bash
# Na raiz do projeto, execute:
echo VITE_SUPABASE_URL=https://dwrbzbdxneuwbrnfbriu.supabase.co > .env
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cmJ6YmR4bmV1d2JybmZicml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTc1MzIsImV4cCI6MjA3OTkzMzUzMn0.mlKgYzWL2pcWTBbeSLWhTgR5678sus2_VpV8S_muZVQ >> .env
```

### Opção 2: Manualmente
1. Crie um arquivo chamado `.env` na raiz do projeto
2. Adicione este conteúdo:
```
VITE_SUPABASE_URL=https://dwrbzbdxneuwbrnfbriu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cmJ6YmR4bmV1d2JybmZicml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTc1MzIsImV4cCI6MjA3OTkzMzUzMn0.mlKgYzWL2pcWTBbeSLWhTgR5678sus2_VpV8S_muZVQ
```
3. Salve o arquivo

## 4. Reiniciar o Servidor de Desenvolvimento

Após criar o `.env`, reinicie o servidor para carregar as novas variáveis de ambiente:

```bash
# Pare o servidor (Ctrl+C) e execute:
npm run dev
```

## 5. Testar a Conexão

A aplicação deve se conectar automaticamente ao Supabase. Você pode verificar no Console do navegador (F12) se há erros de conexão.

## 6. Estrutura do Banco de Dados

### Tabela: `films`
- `id` (UUID) - Chave primária
- `title` - Título do filme
- `description` - Descrição/sinopse
- `genre` - Gênero
- `rating` - Classificação indicativa
- `duration` - Duração em minutos
- `release_date` - Data de estreia
- `created_at` - Data de criação

### Tabela: `rooms`
- `id` (UUID) - Chave primária
- `name` - Nome/número da sala
- `type` - Tipo (2D, 3D, IMAX, etc.)
- `capacity` - Capacidade de assentos
- `created_at` - Data de criação

### Tabela: `sessions`
- `id` (UUID) - Chave primária
- `film_id` (FK → films) - ID do filme
- `room_id` (FK → rooms) - ID da sala
- `datetime` - Data e hora da sessão
- `price` - Preço do ingresso
- `language` - Idioma (Dublado, Legendado, Original)
- `format` - Formato de exibição
- `created_at` - Data de criação

### Tabela: `sales`
- `id` (UUID) - Chave primária
- `session_id` (FK → sessions) - ID da sessão
- `customer_name` - Nome do cliente
- `customer_email` - Email do cliente
- `ticket_quantity` - Quantidade de ingressos
- `total_price` - Preço total
- `purchase_date` - Data da compra
- `created_at` - Data de criação

## 7. Políticas de Segurança (RLS)

As políticas configuradas permitem **acesso público total** (para desenvolvimento).

> [!WARNING]
> **Para produção**, você deve configurar políticas mais restritivas baseadas em autenticação de usuários.

## ✅ Checklist

- [ ] Executar SQL no Supabase SQL Editor
- [ ] Verificar que as 4 tabelas foram criadas
- [ ] Criar arquivo `.env` com credenciais
- [ ] Reiniciar servidor de desenvolvimento
- [ ] Testar cadastro de filme (vai salvar no Supabase!)
