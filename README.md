# 🎬 Sistema de Cinema

Sistema completo de gerenciamento de cinema desenvolvido com React, TypeScript e Supabase.

## ✨ Funcionalidades

- 🎥 **Filmes** - CRUD completo com detalhes
- 🏛️ **Salas** - Gerenciamento com layout de poltronas
- 📅 **Sessões** - Agendamento com validações
- 🎫 **Ingressos** - Inteira/Meia com validações de proporção
- 🪑 **Poltronas** - Seleção visual interativa em tempo real
- 🍿 **Lanches** - CRUD de combos e produtos
- 📦 **Pedidos** - Sistema completo (ingressos + lanches)

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Configurar .env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# Executar supabase-schema.sql no Supabase Dashboard

# Iniciar aplicação
npm run dev
```

## 📚 Documentação Completa

Para documentação detalhada, consulte: **[DOCUMENTATION.md](./DOCUMENTATION.md)**

Inclui:
- Estrutura completa do projeto
- Schema do banco de dados
- Componentes React
- Serviços e regras de negócio
- Fluxo de uso
- Exemplos de código
- Guia de deploy

## 📁 Estrutura

```
src/
├── components/     # Componentes React
├── pages/          # Páginas da aplicação
├── services/       # Lógica de negócio
├── hooks/          # Custom hooks
├── types/          # TypeScript types
└── lib/            # Configurações
```

## 🎯 Fluxo Básico

1. Selecionar sessão
2. Informar dados do cliente
3. Escolher ingressos (Inteira/Meia)
4. Selecionar poltronas no mapa
5. Adicionar lanches (opcional)
6. Escolher forma de pagamento
7. Confirmar pedido

## 📊 Exemplo de Uso

```typescript
import { OrderService } from './services/order.service';

const order = await OrderService.createOrder({
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    sessionId: 'uuid-da-sessao',
    sessionPrice: 25.00,
    ticketQuantities: { inteira: 2, meia: 1 },
    selectedSeats: ['A5', 'A6', 'A7'],
    snacks: [
        { snackComboId: 'uuid-combo', quantity: 2, unitPrice: 30.00 }
    ],
    paymentMethod: 'credito'
});
```

## 🗄️ Banco de Dados

Principais tabelas:
- `cinemas` - Informações do cinema
- `films` - Catálogo de filmes
- `rooms` - Salas de exibição
- `sessions` - Sessões programadas
- `tickets` - Ingressos individuais
- `snack_combos` - Lanches e combos
- `orders` - Pedidos completos
- `order_snacks` - Itens de lanche

## 🚀 Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Linter
```

## 📚 Tecnologias

- React 18
- TypeScript
- Vite
- Supabase
- React Router
- React Bootstrap
- SCSS
    
    return <div>Poltronas ocupadas: {occupiedSeats.join(', ')}</div>;
}
```

## 🧪 Validações

### Ingressos
- ✅ Máximo de 50% de meias-entradas
- ✅ Pelo menos 1 ingresso inteiro se houver meias
- ✅ Mínimo de 1 ingresso total

### Poltronas
- ✅ Quantidade selecionada = Quantidade de ingressos
- ✅ Poltrona não pode estar ocupada
- ✅ Constraint única no banco (uma poltrona por sessão)

### Sessões
- ✅ Horário entre 13h e 21h
- ✅ Sem conflitos de sala/horário
- ✅ Apenas sessões futuras

## 🛠️ Tecnologias

- **Frontend:** React 18 + TypeScript
- **UI:** React Bootstrap
- **Backend:** Supabase (PostgreSQL)
- **Build:** Vite
- **Estilo:** CSS Modules

## 📚 Documentação

- [Documentação Técnica Completa](./DOCUMENTACAO-TECNICA.md)
- Schema do banco: `supabase-schema.sql`
- Tipos TypeScript: `src/types/index.ts`

## 🎨 Screenshots

### Mapa de Poltronas
```
         🎬 TELA
  A  [1][2][3][●][●][●][7][8][9][10]
  B  [1][2][3][4][5][6][7][8][9][10]
  C  [1][2][3][4][5][6][7][8][9][10]
  
  🟢 Disponível  🔵 Selecionada  🔴 Ocupada
```

### Resumo do Pedido
```
📊 Resumo do Pedido:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 Ingressos:
  • 2x Inteira - R$ 50,00
  • 1x Meia - R$ 12,50
  • Poltronas: A5, A6, A7
  Subtotal Ingressos: R$ 62,50

🍿 Lanches:
  • 2x Combo Pipoca + Refri - R$ 60,00
  Subtotal Lanches: R$ 60,00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 TOTAL: R$ 122,50
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ por Eduardo Sousa

---

**Versão:** 2.0.0  
**Última Atualização:** 09/12/2025
