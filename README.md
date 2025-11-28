# 🎬 Projeto Cinema

Sistema de gerenciamento de cinema desenvolvido com **React**, **TypeScript** e **Bootstrap**.

## 📋 Funcionalidades

- **Filmes**: Cadastro e gerenciamento de filmes com informações detalhadas (título, descrição, gênero, classificação, duração, data de estreia)
- **Salas**: Configuração de salas de cinema (nome, tipo, capacidade)
- **Sessões**: Criação de sessões de exibição vinculando filmes e salas
- **Vendas**: Sistema de venda de ingressos com seleção de sessão e informações do cliente

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Navegação entre páginas
- **React Bootstrap** - Componentes UI baseados em Bootstrap 5
- **LocalStorage** - Persistência de dados no navegador

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes React reutilizáveis
│   ├── layout/      # Navbar, Footer, Layout
│   ├── films/       # FilmForm, FilmList
│   ├── rooms/       # RoomForm, RoomList
│   ├── sessions/    # SessionForm, SessionList
│   └── sales/       # SalesForm, SalesList
├── pages/           # Páginas da aplicação
├── hooks/           # Custom hooks (useFilms, useRooms, etc)
├── services/        # Serviços (storage)
├── types/           # Definições TypeScript
├── App.tsx          # Componente principal com rotas
└── main.tsx         # Entry point
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build de Produção

```bash
# Criar build otimizada
npm run build

# Visualizar build localmente
npm run preview
```

## 💾 Armazenamento de Dados

Os dados são armazenados localmente no navegador usando **localStorage** com as seguintes chaves:

- `cinema_films` - Lista de filmes
- `cinema_rooms` - Lista de salas
- `sessoes` - Lista de sessões
- `vendas` - Lista de vendas

## 📝 Como Usar

1. **Cadastrar Filmes**: Acesse a página "Filmes" e preencha o formulário com as informações do filme
2. **Configurar Salas**: Na página "Salas", cadastre as salas do cinema
3. **Criar Sessões**: Em "Sessões", selecione um filme e uma sala para criar uma sessão de exibição
4. **Vender Ingressos**: Na página "Vendas", selecione uma sessão e preencha os dados do cliente

## 🔄 Migração da Versão Anterior

Este projeto foi completamente refatorado de HTML/JavaScript vanilla para React + TypeScript. As chaves de localStorage foram mantidas para compatibilidade com dados existentes.

## 📄 Licença

ISC
