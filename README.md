# 🎬 Projeto Cinema

Sistema de gerenciamento de cinema desenvolvido com **React**, **TypeScript**, **Bootstrap** e **SCSS**.

## 📋 Funcionalidades

- **Filmes**: Cadastro e gerenciamento de filmes com informações detalhadas
- **Salas**: Configuração de salas de cinema  
- **Sessões**: Criação de sessões de exibição vinculando filmes e salas
- **Vendas**: Sistema de venda de ingressos

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces com JSX/TSX
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server moderno
- **React Router** - Navegação entre páginas
- **React Bootstrap** - Componentes UI baseados em Bootstrap 5
- **SCSS/Sass** - Pré-processador CSS para estilos avançados
- **LocalStorage** - Persistência de dados no navegador

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── layout/         # Layout components
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx
│   │   │   └── Navbar.scss
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   └── Footer.scss
│   │   └── Layout.tsx
│   ├── films/          # Film components
│   ├── rooms/          # Room components
│   ├── sessions/       # Session components
│   └── sales/          # Sales components
├── pages/              # Páginas da aplicação
│   ├── HomePage/
│   │   ├── HomePage.tsx
│   │   └── HomePage.scss
│   ├── FilmsPage/
│   │   ├── FilmsPage.tsx
│   │   └── FilmsPage.scss
│   └── ... (outras páginas)
├── hooks/              # Custom React hooks
├── services/           # Business logic e storage
├── types/              # TypeScript type definitions
├── styles/             # Global styles
├── App.tsx             # Root component com rotas
└── main.tsx            # Entry point
```

**Arquitetura**: Cada componente/página possui:
- `.tsx` - Componente React com JSX/TSX embutido
- `.scss` - Estilos SCSS separados

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

Os dados são armazenados localmente usando **localStorage**:

- `cinema_films` - Lista de filmes
- `cinema_rooms` - Lista de salas
- `sessoes` - Lista de sessões
- `vendas` - Lista de vendas

## 📝 Como Usar

1. **Cadastrar Filmes**: Página "Filmes" → Preencher formulário
2. **Configurar Salas**: Página "Salas" → Cadastrar salas do cinema
3. **Criar Sessões**: Página "Sessões" → Vincular filme + sala + horário
4. **Vender Ingressos**: Página "Vendas" → Selecionar sessão + dados cliente

## 🔄 Migração da Versão Anterior

Projeto refatorado de HTML/JavaScript vanilla para React + TypeScript com:
- Componentes modulares e reutilizáveis
- Tipagem forte com TypeScript
- Estilos SCSS organizados por componente
- Navegação com React Router
- Estado gerenciado com custom hooks

## 📄 Licença

ISC
