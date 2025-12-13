Projeto Cinema - API server

Rápido servidor Express (TypeScript) que expõe rotas REST e usa um banco local (JSON) via lowdb para persistência.

Instalação e execução

1. Vá para a pasta server:

```bash
cd server
```

2. Instale dependências:

```bash
npm install
```

3. Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
# edite .env se desejar mudar PORT
```

4. Inicie em modo desenvolvimento:

```bash
npm run dev
```

Endpoints principais

- GET /api/:table                -> lista registros da tabela
- GET /api/:table/:id            -> busca por id
- POST /api/:table               -> cria registro
- PUT /api/:table/:id            -> atualiza registro
- DELETE /api/:table/:id         -> remove registro
- GET /api/sessions/details      -> sessions com detalhes (films, rooms)
- GET /api/sales/details         -> sales com detalhes (sessions)
- POST /api/orders/create        -> rota auxiliar para criar order + tickets + order_snacks

Exemplo curl

```bash
# listar filmes
curl http://localhost:4000/api/films

# criar filme
curl -X POST http://localhost:4000/api/films -H "Content-Type: application/json" -d '{"title":"Filme X","description":"...","duration":120}'

# criar pedido (exemplo) - substitua ids e preços
curl -X POST http://localhost:4000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{"customerName":"João","customerEmail":"joao@example.com","sessionId":"<session-id>","sessionPrice":30,"ticketQuantities":{"inteira":2,"meia":1},"selectedSeats":["A1","A2","A3"],"snacks":[{"snackComboId":"<combo-id>","quantity":1,"unitPrice":15}]}'
```
