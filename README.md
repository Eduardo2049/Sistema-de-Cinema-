<div align="center">

# 🎬 CinemaControl

**Sistema completo de gerenciamento de cinema** — administre filmes, salas, sessões, vendas e lanches em uma interface web moderna.

[![Deploy](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://systemcinemapr.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](./LICENSE)

**[🌐 Ver Demo ao Vivo](https://systemcinemapr.vercel.app)** · **[📖 Setup do Supabase](./SUPABASE-SETUP.md)** · **[🐛 Reportar Bug](https://github.com/Eduardo2049/CinemaControl/issues)**

</div>

---

## 📌 Sobre o Projeto

O **CinemaControl** é uma aplicação web full-stack desenvolvida como projeto da disciplina de **Tecnologia de Construção de Software**. O sistema permite o gerenciamento completo de um cinema: desde o cadastro de filmes até a venda de ingressos com seleção de assentos e combos de lanchonete.

O banco de dados é gerenciado pelo **Supabase** (PostgreSQL) com Row Level Security habilitado, e o frontend é uma **SPA React + TypeScript** com deploy automatizado na **Vercel**.

---

## ✨ Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 🎥 **Filmes** | Cadastro, edição e exclusão de filmes com título, gênero, classificação, duração e data de lançamento |
| 🏛️ **Salas** | Gerenciamento de salas com tipo, capacidade e layout de assentos (JSONB) |
| 📅 **Sessões** | Criação de sessões vinculando filme + sala, com preço, idioma e formato |
| 🎟️ **Vendas** | Registro de pedidos com seleção de assentos, ingressos inteira/meia e combos |
| 🍿 **Lanches** | Catálogo de combos por categoria (comida, bebida, combo) com preços e disponibilidade |

---

## 🚀 Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [React](https://react.dev/) | 18 | Interface de usuário (SPA) |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipagem estática |
| [Vite](https://vitejs.dev/) | 5 | Bundler e dev server |
| [Bootstrap](https://getbootstrap.com/) + [React-Bootstrap](https://react-bootstrap.netlify.app/) | 5.3 | Componentes e layout responsivo |
| [SCSS / Sass](https://sass-lang.com/) | 1.69 | Estilos customizados |
| [React Router DOM](https://reactrouter.com/) | 6 | Roteamento client-side |
| [Supabase](https://supabase.com/) | 2.39 | Banco de dados PostgreSQL + Auth + API REST |
| [React Icons](https://react-icons.github.io/react-icons/) | 5 | Biblioteca de ícones |
| [Vercel](https://vercel.com/) | — | Hospedagem e CI/CD |

---

## 📁 Estrutura do Projeto

```
CinemaControl/
├── src/
│   ├── components/           # Componentes reutilizáveis por domínio
│   │   ├── films/
│   │   ├── layout/           # Navbar, Footer, Layout wrapper
│   │   ├── orders/
│   │   ├── rooms/
│   │   ├── seats/            # Seletor visual de assentos
│   │   ├── sessions/
│   │   └── snacks/
│   ├── hooks/                # Custom hooks (useFetch, useForm, etc.)
│   ├── lib/
│   │   └── supabase.ts       # Configuração do cliente Supabase
│   ├── pages/                # Páginas da aplicação (rotas)
│   │   ├── HomePage/         # Dashboard principal
│   │   ├── FilmsPage/        # CRUD de filmes
│   │   ├── RoomsPage.tsx     # CRUD de salas
│   │   ├── SessionsPage.tsx  # CRUD de sessões
│   │   ├── SalesPage.tsx     # Gerenciamento de vendas
│   │   └── SnacksPage.tsx    # Catálogo de lanches
│   ├── services/             # Funções de acesso à API do Supabase
│   ├── styles/               # Estilos globais SCSS
│   └── types/                # Interfaces e tipos TypeScript
├── server/                   # API Express auxiliar (TypeScript + lowdb)
├── public/                   # Assets públicos
├── .env.example              # Exemplo de variáveis de ambiente
├── supabase-schema.sql       # Schema completo do banco de dados
├── vercel.json               # Configuração de deploy na Vercel
├── vite.config.ts
└── package.json
```

---

## 🗄️ Modelo de Banco de Dados

```
cinemas
  └── rooms ──────────────────── (cinema_id)
        └── sessions ──────────── (room_id)
              │
              ├─── [film_id] ──── films
              │
              └── orders ──────── (session_id)
                    ├── tickets ── (order_id)  [inteira | meia]
                    └── order_snacks (order_id)
                          └── snack_combos
```

| Tabela | Descrição |
|---|---|
| `cinemas` | Dados do cinema (nome, endereço, horários de funcionamento) |
| `films` | Catálogo de filmes com gênero, classificação e duração |
| `rooms` | Salas com capacidade, tipo e layout de assentos (JSONB) |
| `sessions` | Sessões: filme + sala + data/hora + preço + idioma + formato |
| `orders` | Pedidos dos clientes com status e método de pagamento |
| `tickets` | Ingressos individuais (inteira / meia-entrada) por assento |
| `snack_combos` | Produtos da lanchonete com categoria e disponibilidade |
| `order_snacks` | Itens de lanche vinculados a cada pedido |

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18

### 1. Clonar o repositório

```bash
git clone https://github.com/Eduardo2049/CinemaControl.git
cd CinemaControl
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar o projeto

```bash
npm run dev
```

- **Observação:** O projeto Supabase original foi pausado por tempo prolongado e os dados online não estão acessíveis no momento. A aplicação continua funcional localmente usando dados mock ou apontando para qualquer PostgreSQL/Supabase alternativo configurado.

---

## 🖥️ Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 5173) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Preview do build localmente |
| `npm run lint` | Análise estática com ESLint |
| `npm run server:dev` | Inicia a API Express auxiliar (porta 4000) |

---

## 🌐 Histórico de Deploy

O deploy anterior estava hospedado na Vercel em https://systemcinemapr.vercel.app, mas o Supabase que sustentava os dados foi pausado. Para retomar os deploys, primeiro restaure os dados em outro projeto Supabase ou PostgreSQL e depois atualize as variáveis de ambiente na Vercel (ou outra plataforma) para apontar para o novo endpoint.

---

## 🔒 Segurança

> ⚠️ **Nunca versione o arquivo `.env`** com suas chaves reais.

- O `.gitignore` já ignora `.env` e `.env.local`
- Use `.env.example` como referência (sem valores reais)
- O Supabase possui **Row Level Security (RLS)** habilitado em todas as tabelas
- Consulte [`SUPABASE-SETUP.md`](./SUPABASE-SETUP.md) para detalhes avançados do banco

---

## 📄 Licença

Este projeto está sob a licença **ISC**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

<div align="center">
  Desenvolvido por <a href="https://github.com/Eduardo2049">Eduardo2049</a> &nbsp;·&nbsp; Disciplina de Tecnologia de Construção de Software &nbsp;·&nbsp; <a href="https://github.com/Eduardo2049/CinemaControl">github.com/Eduardo2049/CinemaControl</a>
</div>
