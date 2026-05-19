# 🎬 Sistema de Cinema

Sistema completo de gerenciamento de cinema desenvolvido com **React**, **TypeScript** e **Supabase**. Permite administrar filmes, salas, sessões, vendas de ingressos e lanches/combos em uma interface web moderna.

## 🚀 Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [React](https://react.dev/) | 18 | UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipagem estática |
| [Vite](https://vitejs.dev/) | 5 | Bundler / Dev server |
| [Bootstrap](https://getbootstrap.com/) + [React-Bootstrap](https://react-bootstrap.netlify.app/) | 5.3 | Estilização e componentes |
| [SCSS](https://sass-lang.com/) | 1.69 | Estilos customizados |
| [React Router DOM](https://reactrouter.com/) | 6 | Roteamento SPA |
| [Supabase](https://supabase.com/) | 2.39 | Banco de dados PostgreSQL + API |
| [React Icons](https://react-icons.github.io/react-icons/) | 5 | Ícones |
| [Vercel](https://vercel.com/) | — | Deploy |

## 📋 Funcionalidades

- **Filmes** — Cadastro, edição e remoção de filmes (título, gênero, classificação, duração, data de lançamento)
- **Salas** — Gerenciamento de salas com tipo, capacidade e layout de assentos
- **Sessões** — Criação de sessões vinculando filmes e salas, com preço, idioma e formato
- **Vendas / Pedidos** — Registro de pedidos com dados do cliente, ingressos (inteira/meia) e seleção de assentos
- **Lanches** — Combos e produtos disponíveis por categoria (comida, bebida, combo)

## 📁 Estrutura do Projeto

```
Sistema-de-Cinema/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── films/
│   │   ├── layout/
│   │   ├── orders/
│   │   ├── rooms/
│   │   ├── seats/
│   │   ├── sessions/
│   │   └── snacks/
│   ├── hooks/            # Custom hooks React
│   ├── lib/              # Configuração do Supabase client
│   ├── pages/            # Páginas da aplicação
│   │   ├── HomePage/
│   │   ├── FilmsPage/
│   │   ├── RoomsPage.tsx
│   │   ├── SessionsPage.tsx
│   │   ├── SalesPage.tsx
│   │   └── SnacksPage.tsx
│   ├── services/         # Chamadas à API do Supabase
│   ├── styles/           # Estilos globais SCSS
│   └── types/            # Tipos TypeScript
├── supabase-schema.sql   # Schema completo do banco de dados
├── vercel.json           # Configuração de deploy na Vercel
├── vite.config.ts
└── package.json
```

## 🗄️ Modelo de Banco de Dados

```
cinemas
  └── rooms (cinema_id)
        └── sessions (room_id)
              ├── orders (session_id)
              │     ├── tickets (order_id)
              │     └── order_snacks (order_id)
              │           └── snack_combos
              └── films (film_id)
```

**Tabelas principais:**

| Tabela | Descrição |
|---|---|
| `cinemas` | Dados do cinema (nome, endereço, horários) |
| `films` | Catálogo de filmes |
| `rooms` | Salas com capacidade e layout de assentos |
| `sessions` | Sessões vinculando filme + sala + data/hora |
| `orders` | Pedidos dos clientes |
| `tickets` | Ingressos individuais (inteira / meia-entrada) |
| `snack_combos` | Produtos de lanchonete |
| `order_snacks` | Itens de lanche por pedido |

## ⚙️ Configuração e Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- Conta no [Supabase](https://supabase.com/) (gratuita)

### 1. Clonar o repositório

```bash
git clone https://github.com/Eduardo2049/Sistema-de-Cinema-.git
cd Sistema-de-Cinema-
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

> **Como obter as credenciais:**
> 1. Acesse [app.supabase.com](https://app.supabase.com) e selecione seu projeto
> 2. Vá em **Settings → API**
> 3. Copie `Project URL` → `VITE_SUPABASE_URL`
> 4. Copie `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 4. Executar o schema do banco de dados

No **Supabase Dashboard → SQL Editor**, crie uma nova query, cole o conteúdo de [`supabase-schema.sql`](./supabase-schema.sql) e execute.

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## 🖥️ Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (porta 5173) |
| `npm run build` | Gera o build de produção (`dist/`) |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint no projeto |

## 🌐 Deploy

O projeto está configurado para deploy na **Vercel**. O arquivo [`vercel.json`](./vercel.json) garante que o roteamento SPA funcione corretamente.

Para fazer o deploy:

```bash
npm run build
```

Ou conecte o repositório diretamente na [Vercel](https://vercel.com/) para deploys automáticos a cada push na branch `main`. Não esqueça de configurar as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no painel da Vercel.

## 🔒 Segurança

> ⚠️ **Nunca versione o arquivo `.env`** com suas chaves reais.

O `.gitignore` já está configurado para ignorar `.env` e `.env.local`. Consulte [`SUPABASE-SETUP.md`](./SUPABASE-SETUP.md) para mais detalhes sobre a configuração do banco de dados.

## 📄 Licença

Este projeto está sob a licença **ISC**.
