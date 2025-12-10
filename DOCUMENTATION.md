# 🎬 Sistema de Cinema - Documentação Completa

**Projeto:** Sistema de Gerenciamento de Cinema  
**Tecnologias:** React, TypeScript, Bootstrap, Supabase  
**Última Atualização:** Dezembro 2025  
**Status:** Produção

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Início Rápido](#-início-rápido)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Banco de Dados](#-banco-de-dados)
5. [Funcionalidades](#-funcionalidades)
6. [Serviços e Regras de Negócio](#-serviços-e-regras-de-negócio)
7. [Componentes React](#-componentes-react)
8. [Fluxo de Uso](#-fluxo-de-uso)
9. [Deploy](#-deploy)

---

## 🎯 Visão Geral

Sistema completo de gerenciamento de cinema com suporte a:

- ✅ **Filmes** - Catálogo completo com detalhes
- ✅ **Salas** - Gerenciamento de salas com layout de poltronas
- ✅ **Sessões** - Agendamento com validações de horário e conflitos
- ✅ **Ingressos** - Sistema de inteira/meia com validação de proporção (máx 50%)
- ✅ **Poltronas** - Seleção visual interativa em tempo real
- ✅ **Lanches** - Combos e produtos com categorias
- ✅ **Pedidos** - Sistema completo de venda (ingressos + lanches)
- ✅ **Cinema** - Entidade centralizada com informações

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- Conta no Supabase
- npm ou yarn

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Criar arquivo .env na raiz:
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# 3. Configurar banco de dados
# - Acessar https://supabase.com/dashboard
# - Ir em SQL Editor
# - Executar o conteúdo de supabase-schema.sql

# 4. Iniciar aplicação
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Compila para produção
npm run preview  # Preview da build de produção
npm run lint     # Executa linter
```

---

## 📁 Estrutura do Projeto

```
Sistema-de-Cinema-/
├── src/
│   ├── components/          # Componentes React
│   │   ├── films/          # Gerenciamento de filmes
│   │   ├── rooms/          # Gerenciamento de salas
│   │   ├── sessions/       # Gerenciamento de sessões
│   │   ├── sales/          # Sistema de vendas
│   │   ├── seats/          # Mapa de poltronas
│   │   ├── snacks/         # Gerenciamento de lanches
│   │   ├── orders/         # Sistema de pedidos
│   │   └── layout/         # Layout (Navbar, Footer)
│   │
│   ├── pages/              # Páginas da aplicação
│   │   ├── HomePage.tsx
│   │   ├── FilmsPage.tsx
│   │   ├── RoomsPage.tsx
│   │   ├── SessionsPage.tsx
│   │   ├── SalesPage.tsx
│   │   └── SnacksPage.tsx
│   │
│   ├── services/           # Serviços de negócio
│   │   ├── cinema-validation.service.ts
│   │   ├── ticket-pricing.service.ts
│   │   ├── snack-combo.service.ts
│   │   ├── order.service.ts
│   │   └── supabase.service.ts
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── useFilms.ts
│   │   ├── useRooms.ts
│   │   ├── useSessions.ts
│   │   ├── useSales.ts
│   │   └── useOccupiedSeats.ts
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   │
│   ├── lib/                # Configurações
│   │   └── supabase.ts
│   │
│   └── styles/             # Estilos globais
│       └── global.scss
│
├── public/                 # Arquivos estáticos
├── supabase-schema.sql     # Schema do banco
├── package.json
├── tsconfig.json
├── vite.config.ts
└── DOCUMENTATION.md        # Este arquivo
```

---

## 🗄️ Banco de Dados

### Tabelas Principais

#### 1. **cinemas**
Informações centralizadas do cinema.

```sql
id              UUID (PK)
name            TEXT
address         TEXT
phone           TEXT
email           TEXT
opening_hours   JSONB
created_at      TIMESTAMP
```

**Exemplo opening_hours:**
```json
{
  "weekday": "13:00-23:00",
  "weekend": "12:00-00:00"
}
```

---

#### 2. **films**
Catálogo de filmes disponíveis.

```sql
id              UUID (PK)
title           TEXT
description     TEXT
genre           TEXT
rating          TEXT (L, 10, 12, 14, 16, 18)
duration        INTEGER (minutos)
release_date    DATE
created_at      TIMESTAMP
```

---

#### 3. **rooms**
Salas de exibição com layout de poltronas.

```sql
id              UUID (PK)
name            TEXT
type            TEXT (2D, 3D, IMAX)
capacity        INTEGER
seat_layout     JSONB
cinema_id       UUID (FK -> cinemas)
created_at      TIMESTAMP
```

**Exemplo seat_layout:**
```json
{
  "rows": 8,
  "columns": 10,
  "disabledSeats": ["A5", "A6", "H5", "H6"]
}
```

---

#### 4. **sessions**
Sessões programadas de filmes.

```sql
id              UUID (PK)
film_id         UUID (FK -> films)
room_id         UUID (FK -> rooms)
datetime        TIMESTAMP
price           NUMERIC(10,2)
language        TEXT (Dublado, Legendado)
format          TEXT (2D, 3D)
created_at      TIMESTAMP
```

**Validações:**
- Horário entre 13:00 e 21:00
- Sem conflitos de sala/horário
- Duração do filme + 30min de intervalo

---

#### 5. **tickets**
Ingressos individuais de uma venda.

```sql
id              UUID (PK)
session_id      UUID (FK -> sessions)
ticket_type     TEXT (inteira, meia)
base_price      NUMERIC(10,2)
final_price     NUMERIC(10,2)
seat_number     TEXT (A1, B5, etc)
status          TEXT (disponivel, reservado, vendido)
order_id        UUID (FK -> orders)
created_at      TIMESTAMP
```

**Constraint Única:**
```sql
CREATE UNIQUE INDEX idx_tickets_session_seat 
ON tickets(session_id, seat_number) 
WHERE status IN ('reservado', 'vendido') 
AND seat_number IS NOT NULL;
```

---

#### 6. **snack_combos**
Lanches e combos disponíveis.

```sql
id              UUID (PK)
name            TEXT
description     TEXT
unit_price      NUMERIC(10,2)
items_quantity  INTEGER
category        TEXT (bebida, comida, combo)
is_available    BOOLEAN
image_url       TEXT
created_at      TIMESTAMP
```

---

#### 7. **orders**
Pedidos completos (ingressos + lanches).

```sql
id              UUID (PK)
customer_name   TEXT
customer_email  TEXT
session_id      UUID (FK -> sessions)
total_tickets   NUMERIC(10,2)
total_snacks    NUMERIC(10,2)
total_amount    NUMERIC(10,2)
status          TEXT (pendente, confirmado, cancelado)
payment_method  TEXT
created_at      TIMESTAMP
```

---

#### 8. **order_snacks**
Itens de lanches de um pedido.

```sql
id              UUID (PK)
order_id        UUID (FK -> orders)
snack_combo_id  UUID (FK -> snack_combos)
quantity        INTEGER
unit_price      NUMERIC(10,2)
subtotal        NUMERIC(10,2)
created_at      TIMESTAMP
```

---

## ✨ Funcionalidades

### 🎥 Gerenciamento de Filmes

**Tela:** `/films`

- ✅ CRUD completo (Criar, Ler, Atualizar, Deletar)
- ✅ Campos: Título, Descrição, Gênero, Classificação, Duração, Data de Estreia
- ✅ Validações de formulário
- ✅ Lista com cards visuais

**Componentes:**
- `FilmForm.tsx` - Formulário de cadastro/edição
- `FilmList.tsx` - Listagem de filmes

---

### 🏛️ Gerenciamento de Salas

**Tela:** `/rooms`

- ✅ CRUD completo
- ✅ Campos: Nome, Tipo (2D/3D/IMAX), Capacidade
- ✅ Layout de poltronas configurável (JSONB)
- ✅ Vínculo com cinema

**Componentes:**
- `RoomForm.tsx` - Formulário de cadastro/edição
- `RoomList.tsx` - Listagem de salas

---

### 📅 Gerenciamento de Sessões

**Tela:** `/sessions`

- ✅ CRUD completo
- ✅ Seleção de filme e sala
- ✅ Data/hora, preço, idioma, formato
- ✅ Validações automáticas:
  - Horário entre 13:00 e 21:00
  - Sem conflitos de sala
  - Intervalo mínimo entre sessões

**Componentes:**
- `SessionForm.tsx` - Formulário de agendamento
- `SessionList.tsx` - Listagem de sessões

---

### 🎫 Sistema de Ingressos

**Tela:** `/sales`

- ✅ Tipos: Inteira e Meia (50% desconto)
- ✅ Validação de proporção:
  - Máximo 50% de meias por compra
  - Obrigatório ter pelo menos 1 inteira se houver meias
- ✅ Cálculo automático de preços
- ✅ Totalizador em tempo real

**Regras de Negócio:**
```typescript
Preço Meia = Preço Inteira × 0.5
Máximo de Meias = Total de Ingressos × 0.5
```

---

### 🪑 Seleção de Poltronas

**Tela:** `/sales` (integrado)

- ✅ Mapa visual interativo
- ✅ Estados visuais:
  - 🟢 Verde: Disponível
  - 🔵 Azul: Selecionada
  - 🔴 Vermelho: Ocupada
  - ⚪ Transparente: Desabilitada (corredores)
- ✅ Seleção/deseleção com clique
- ✅ Limite máximo baseado na quantidade de ingressos
- ✅ Atualização em tempo real
- ✅ Tooltips informativos
- ✅ Legenda e estatísticas

**Componentes:**
- `SeatMap.tsx` - Componente do mapa
- `SeatMap.css` - Estilos personalizados

**Exemplo de Layout:**
```
┌─────────────────────────────────────┐
│            🎬 TELA                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  A  [1][2][3][4][5][6][7][8][9][10]│
│  B  [1][2][3][4][5][6][7][8][9][10]│
│  C  [1][2][3][4][5][6][7][8][9][10]│
│  D  [1][2][3][4][5][6][7][8][9][10]│
│                                     │
│  Legenda:                           │
│  🟢 Disponível (35)                 │
│  🔵 Selecionada (2)                 │
│  🔴 Ocupada (3)                     │
└─────────────────────────────────────┘
```

---

### 🍿 Lanches e Combos

**Tela:** `/snacks`

- ✅ CRUD completo
- ✅ Categorias: Bebida, Comida, Combo
- ✅ Campos: Nome, Descrição, Preço, Quantidade de Itens
- ✅ Controle de disponibilidade (toggle)
- ✅ Upload de imagem (URL)
- ✅ Filtro por categoria

**Componentes:**
- `SnackComboManager.tsx` - Gerenciamento completo
- `SnackSelector.tsx` - Seletor para vendas

---

### 📦 Sistema de Pedidos

**Tela:** `/sales` (integrado)

- ✅ Pedido completo: Ingressos + Lanches
- ✅ Dados do cliente: Nome, E-mail
- ✅ Múltiplas formas de pagamento:
  - Dinheiro
  - Cartão de Crédito
  - Cartão de Débito
  - PIX
- ✅ Status do pedido:
  - Pendente
  - Confirmado
  - Cancelado
- ✅ Resumo detalhado
- ✅ Histórico de pedidos

**Componentes:**
- `CompleteOrderForm.tsx` - Formulário completo
- `SalesForm.tsx` - Formulário de venda
- `SalesFormWithSeats.tsx` - Com seleção de poltronas
- `SalesList.tsx` - Histórico de vendas

---

## 🔧 Serviços e Regras de Negócio

### 1. CinemaValidationService

**Arquivo:** `src/services/cinema-validation.service.ts`

**Métodos:**
```typescript
validateSessionTime(datetime: string): boolean
validateSessionConflict(sessionData): Promise<boolean>
getValidTimeRange(): { start: string, end: string }
```

**Regras:**
- Sessões apenas entre 13:00 e 21:00
- Intervalo mínimo de duração do filme + 30min
- Sem conflitos de sala no mesmo horário

---

### 2. TicketPricingService

**Arquivo:** `src/services/ticket-pricing.service.ts`

**Métodos:**
```typescript
calculateTicketPrice(basePrice, ticketType): number
calculateTotalPrice(basePrice, quantities): number
validateMeiaQuantity(inteiraQty, meiaQty): boolean
validateMinimumTickets(quantities): boolean
validateTicketSale(basePrice, quantities): ValidationResult
getTotalTickets(quantities): number
calculateTotalDiscount(basePrice, quantities): number
formatPrice(price): string
```

**Regras:**
- Meia-entrada = 50% do preço inteiro
- Máximo de 50% de meias por compra
- Pelo menos 1 inteira obrigatória se houver meias

**Exemplo:**
```typescript
const result = TicketPricingService.validateTicketSale(25.00, {
    inteira: 2,
    meia: 1
});

// result = {
//   isValid: true,
//   totalPrice: 62.50,
//   totalTickets: 3,
//   discount: 12.50
// }
```

---

### 3. SnackComboService

**Arquivo:** `src/services/snack-combo.service.ts`

**Métodos:**
```typescript
getAll(): Promise<SnackCombo[]>
getAvailable(): Promise<SnackCombo[]>
getByCategory(category: string): Promise<SnackCombo[]>
create(data): Promise<SnackCombo>
update(id, data): Promise<SnackCombo>
delete(id): Promise<void>
toggleAvailability(id, isAvailable): Promise<SnackCombo>
calculateSubtotal(unitPrice, quantity): number
formatPrice(price): string
```

---

### 4. OrderService

**Arquivo:** `src/services/order.service.ts`

**Métodos:**
```typescript
createOrder(orderData): Promise<Order>
getById(id): Promise<Order>
getAll(): Promise<Order[]>
updateStatus(id, status): Promise<Order>
confirmOrder(id): Promise<Order>
cancelOrder(id): Promise<Order>
generateOrderSummary(order): string
```

**Fluxo de Criação:**
1. Validar dados de entrada
2. Calcular totais (ingressos + lanches)
3. Criar registro em `orders`
4. Criar registros em `tickets` (um por ingresso)
5. Criar registros em `order_snacks` (um por item)
6. Retornar pedido completo com relacionamentos

**Exemplo:**
```typescript
const order = await OrderService.createOrder({
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    sessionId: 'uuid-sessao',
    sessionPrice: 25.00,
    ticketQuantities: {
        inteira: 2,
        meia: 1
    },
    selectedSeats: ['A5', 'A6', 'A7'],
    snacks: [
        { 
            snackComboId: 'uuid-combo', 
            quantity: 2, 
            unitPrice: 30.00 
        }
    ],
    paymentMethod: 'credito'
});
```

---

## 🎨 Componentes React

### Layout

#### Navbar
**Arquivo:** `src/components/layout/Navbar/Navbar.tsx`

- Logo do cinema
- Menu de navegação
- Links: Home, Filmes, Salas, Sessões, Vendas, Lanches
- Responsivo (mobile-friendly)
- Active state automático

#### Footer
**Arquivo:** `src/components/layout/Footer/Footer.tsx`

- Informações de copyright
- Links úteis
- Redes sociais
- Responsivo

---

### Filmes

#### FilmForm
**Arquivo:** `src/components/films/FilmForm.tsx`

**Props:**
```typescript
onSubmit: (film: FilmInput) => void
initialData?: Film
buttonText?: string
```

**Campos:**
- Título (text)
- Descrição (textarea)
- Gênero (select)
- Classificação (select)
- Duração (number)
- Data de Estreia (date)

#### FilmList
**Arquivo:** `src/components/films/FilmList.tsx`

**Props:**
```typescript
films: Film[]
onEdit: (film: Film) => void
onDelete: (id: string) => void
```

---

### Salas

#### RoomForm
**Arquivo:** `src/components/rooms/RoomForm.tsx`

**Props:**
```typescript
onSubmit: (room: RoomInput) => void
initialData?: Room
cinemaId: string
```

#### RoomList
**Arquivo:** `src/components/rooms/RoomList.tsx`

**Props:**
```typescript
rooms: Room[]
onEdit: (room: Room) => void
onDelete: (id: string) => void
```

---

### Sessões

#### SessionForm
**Arquivo:** `src/components/sessions/SessionForm.tsx`

**Props:**
```typescript
onSubmit: (session: SessionInput) => void
films: Film[]
rooms: Room[]
initialData?: Session
```

#### SessionList
**Arquivo:** `src/components/sessions/SessionList.tsx`

**Props:**
```typescript
sessions: SessionWithDetails[]
onEdit: (session: Session) => void
onDelete: (id: string) => void
```

---

### Poltronas

#### SeatMap
**Arquivo:** `src/components/seats/SeatMap.tsx`

**Props:**
```typescript
sessionId: string
roomLayout: SeatLayout
occupiedSeats: string[]
selectedSeats: string[]
onSeatSelect: (seatId: string) => void
maxSeats: number
```

**Estados:**
- `available` - Verde (clicável)
- `selected` - Azul (clicável)
- `occupied` - Vermelho (não clicável)
- `disabled` - Transparente (corredor)

**Funcionalidades:**
- Renderiza grid dinâmico baseado no layout
- Atualização em tempo real
- Tooltips com informações
- Legenda visual
- Contador de poltronas

---

### Lanches

#### SnackComboManager
**Arquivo:** `src/components/snacks/SnackComboManager.tsx`

- Gerenciamento completo (CRUD)
- Filtro por categoria
- Toggle de disponibilidade
- Formulário inline
- Lista com cards

#### SnackSelector
**Arquivo:** `src/components/snacks/SnackSelector.tsx`

**Props:**
```typescript
snacks: SnackCombo[]
selectedSnacks: SelectedSnack[]
onSnackSelect: (snack, quantity) => void
```

---

### Vendas e Pedidos

#### SalesFormWithSeats
**Arquivo:** `src/components/sales/SalesFormWithSeats.tsx`

- Seleção de sessão
- Dados do cliente
- Quantidade de ingressos (Inteira/Meia)
- Mapa de poltronas integrado
- Seletor de lanches
- Forma de pagamento
- Resumo em tempo real
- Validações integradas

#### CompleteOrderForm
**Arquivo:** `src/components/orders/CompleteOrderForm.tsx`

- Formulário unificado
- Todos os campos necessários
- Cálculo automático de totais
- Preview do pedido

#### SalesList
**Arquivo:** `src/components/sales/SalesList.tsx`

- Histórico de vendas
- Filtros (data, status, cliente)
- Detalhes do pedido
- Ações (confirmar, cancelar)

---

## 🎯 Fluxo de Uso

### Criar Pedido Completo

#### Passo 1: Selecionar Sessão
```
Filme: Avatar 3
Data: 10/12/2025 19:00
Sala: Sala 1 (IMAX)
Preço: R$ 35,00
```

#### Passo 2: Informar Dados do Cliente
```
Nome: Maria Silva
E-mail: maria@email.com
```

#### Passo 3: Escolher Ingressos
```
Inteiras: 2
Meias: 1
Total Ingressos: R$ 87,50
```

#### Passo 4: Selecionar Poltronas
```
Mapa Visual:
[🟢][🟢][🔵][🔵][🔵][🟢][🟢]
 A1   A2   A3   A4   A5   A6   A7
           ↑    ↑    ↑
      Selecionadas: A3, A4, A5
```

#### Passo 5: Adicionar Lanches (Opcional)
```
Combo Tradicional × 2 = R$ 60,00
Pipoca Grande × 1 = R$ 20,00
Total Lanches: R$ 80,00
```

#### Passo 6: Escolher Pagamento
```
☑ Cartão de Crédito
☐ Cartão de Débito
☐ PIX
☐ Dinheiro
```

#### Passo 7: Confirmar Pedido
```
═══════════════════════════════════
         RESUMO DO PEDIDO
═══════════════════════════════════

Cliente: Maria Silva
E-mail: maria@email.com

Sessão:
Avatar 3 - 10/12/2025 19:00
Sala 1 (IMAX) - Legendado

Ingressos:
2x Inteira     R$ 70,00
1x Meia        R$ 17,50
Poltronas: A3, A4, A5
───────────────────────────────────
Subtotal       R$ 87,50

Lanches:
2x Combo Tradicional   R$ 60,00
1x Pipoca Grande       R$ 20,00
───────────────────────────────────
Subtotal               R$ 80,00

═══════════════════════════════════
TOTAL                  R$ 167,50
═══════════════════════════════════

Pagamento: Cartão de Crédito

[Confirmar Compra]
```

---

## 📊 Exemplos de Código

### Buscar Poltronas Ocupadas

```typescript
import { useOccupiedSeats } from '@/hooks/useOccupiedSeats';

function MyComponent() {
    const { occupiedSeats, loading, refetch } = useOccupiedSeats(sessionId);
    
    if (loading) return <div>Carregando...</div>;
    
    return (
        <SeatMap
            sessionId={sessionId}
            occupiedSeats={occupiedSeats}
            // ...
        />
    );
}
```

### Validar Venda de Ingressos

```typescript
import { TicketPricingService } from '@/services/ticket-pricing.service';

const quantities = { inteira: 3, meia: 2 };
const basePrice = 25.00;

const validation = TicketPricingService.validateTicketSale(
    basePrice, 
    quantities
);

if (validation.isValid) {
    console.log(`Total: R$ ${validation.totalPrice.toFixed(2)}`);
    console.log(`Desconto: R$ ${validation.discount.toFixed(2)}`);
} else {
    console.error(validation.error);
}
```

### Criar Pedido

```typescript
import { OrderService } from '@/services/order.service';

const order = await OrderService.createOrder({
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    sessionId: 'abc-123',
    sessionPrice: 30.00,
    ticketQuantities: { inteira: 2, meia: 1 },
    selectedSeats: ['B5', 'B6', 'B7'],
    snacks: [
        { snackComboId: 'def-456', quantity: 2, unitPrice: 25.00 }
    ],
    paymentMethod: 'credito'
});

console.log(`Pedido ${order.id} criado com sucesso!`);
console.log(`Total: R$ ${order.totalAmount.toFixed(2)}`);
```

---

## 🚀 Deploy

### Vercel (Recomendado)

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Fazer login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Configurar Variáveis de Ambiente**
- Acessar dashboard da Vercel
- Settings → Environment Variables
- Adicionar:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

5. **Redeployar**
```bash
vercel --prod
```

### Netlify

1. **Instalar Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Build**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

4. **Configurar Variáveis**
- Site settings → Environment
- Adicionar variáveis do Supabase

---

## 🔐 Segurança

### Row Level Security (RLS)

O Supabase possui RLS habilitado por padrão. Certifique-se de configurar policies adequadas:

```sql
-- Exemplo: Permitir leitura pública de filmes
CREATE POLICY "Public read films"
ON public.films FOR SELECT
USING (true);

-- Exemplo: Apenas usuários autenticados podem criar pedidos
CREATE POLICY "Authenticated create orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Variáveis de Ambiente

**NUNCA** commite arquivos `.env` no Git!

Adicione ao `.gitignore`:
```
.env
.env.local
.env.production
```

---

## 🧪 Testes

### Testes Manuais Recomendados

#### Fluxo Completo de Venda
1. ✅ Criar filme
2. ✅ Criar sala com layout de poltronas
3. ✅ Criar sessão (validar horário)
4. ✅ Tentar criar sessão conflitante (deve falhar)
5. ✅ Criar lanches/combos
6. ✅ Fazer venda com seleção de poltronas
7. ✅ Tentar selecionar poltrona ocupada (deve falhar)
8. ✅ Tentar comprar >50% meias (deve falhar)
9. ✅ Confirmar pedido
10. ✅ Verificar histórico

---

## 📚 Recursos Adicionais

### Documentação Externa

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/docs)
- [React Router](https://reactrouter.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)

### Suporte

Para dúvidas ou problemas:
1. Verificar esta documentação
2. Consultar logs do console
3. Verificar Network tab no DevTools
4. Consultar logs do Supabase Dashboard

---

## 📝 Changelog

### Versão 2.0.0 (Dezembro 2025)
- ✅ Migração completa para React + TypeScript
- ✅ Sistema de ingressos Inteira/Meia
- ✅ Seleção de poltronas interativa
- ✅ Sistema de lanches e combos
- ✅ Sistema de pedidos completo
- ✅ Entidade Cinema implementada
- ✅ Validações de negócio completas
- ✅ Interface moderna e responsiva

### Versão 1.0.0
- ✅ CRUD de Filmes
- ✅ CRUD de Salas
- ✅ CRUD de Sessões
- ✅ Sistema básico de vendas

---

## 📄 Licença

ISC License

---

## 👥 Contribuindo

### Padrões de Código

- TypeScript strict mode
- Componentes funcionais com hooks
- Nomenclatura clara e descritiva
- Comentários em código complexo

### Commits

Usar Conventional Commits:
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração
test: adiciona testes
```

---

**Desenvolvido com ❤️ usando React + TypeScript + Supabase**
