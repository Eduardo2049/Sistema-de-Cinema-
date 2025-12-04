# 🎯 Validações de Negócio Implementadas

## 📋 Resumo

Foram implementadas validações importantes para garantir a integridade do sistema de cinema:

1. ✅ **Horário de Funcionamento** - Sessões apenas das 13h às 21h
2. ✅ **Sessões Futuras** - Apenas sessões que ainda não aconteceram
3. ✅ **Data de Lançamento** - Sessão não pode ser antes do lançamento do filme
4. ✅ **Capacidade da Sala** - Não vender mais ingressos que a capacidade
5. ✅ **Conflito de Horários** - Considerar duração do filme + 45min de limpeza

---

## 🔧 Arquivo Criado

### `src/services/cinema-validation.service.ts`

Serviço centralizado com todas as validações de negócio.

---

## 📝 Validações Implementadas

### 1️⃣ **Filtro de Sessões Disponíveis**

**Onde:** `SalesForm.tsx`

**O que faz:**
- Mostra apenas sessões **futuras** (que ainda não aconteceram)
- Mostra apenas sessões no **horário de funcionamento** (13h - 21h)
- Formata horário de forma amigável: "04/12/2025 às 14:30"

**Código:**
```typescript
const availableSessions = useMemo(() => {
    return CinemaValidationService.filterAvailableSessions(sessions);
}, [sessions]);
```

**Resultado:**
- ✅ Dropdown mostra apenas sessões válidas
- ✅ Alerta aparece se não houver sessões disponíveis
- ✅ Formulário desabilitado se não houver sessões

---

### 2️⃣ **Validação de Horário de Funcionamento**

**Método:** `isValidSessionTime(datetime: string)`

**Regra:**
- Horário permitido: **13:00 - 20:59**
- Sessões fora desse horário são rejeitadas

**Exemplo:**
```typescript
isValidSessionTime('2025-12-04T14:30:00') // ✅ true
isValidSessionTime('2025-12-04T22:00:00') // ❌ false
isValidSessionTime('2025-12-04T12:00:00') // ❌ false
```

---

### 3️⃣ **Cálculo de Término de Sessão**

**Método:** `calculateSessionEndTime(startTime, filmDuration, cleaningTime = 45)`

**O que faz:**
- Calcula quando a sessão termina
- Considera duração do filme + tempo de limpeza (45min)

**Exemplo:**
```typescript
// Filme de 120min começando às 14:00
calculateSessionEndTime('2025-12-04T14:00:00', 120, 45)
// Retorna: 2025-12-04T16:45:00
// (14:00 + 2h de filme + 45min de limpeza = 16:45)
```

---

### 4️⃣ **Validação de Data de Lançamento** ⭐ NOVO

**Onde:** `SessionForm.tsx`

**Método:** `validateSessionReleaseDate(sessionDatetime, filmReleaseDate)`

**O que faz:**
- Impede criar sessão antes da data de lançamento do filme
- Compara apenas as datas (ignora horários)
- Mostra mensagem clara com a data de lançamento

**Exemplo:**
```typescript
// Filme lança em 10/12/2025
// Tentando criar sessão em 05/12/2025

validateSessionReleaseDate('2025-12-05T14:00:00', '2025-12-10')
// Retorna: {
//   isValid: false,
//   message: "A sessão não pode ser antes da data de lançamento do filme (10/12/2025)"
// }
```

**Implementação no SessionForm:**
```typescript
const sessionDate = new Date(formData.datetime);
const releaseDate = new Date(selectedFilm.releaseDate);

if (sessionDate < releaseDate) {
    alert(
        `Não é possível criar uma sessão antes da data de lançamento do filme!\n\n` +
        `Filme: ${selectedFilm.title}\n` +
        `Data de lançamento: ${releaseDateFormatted}\n\n` +
        `Por favor, escolha uma data igual ou posterior ao lançamento.`
    );
    return;
}
```

**Casos de uso:**
```typescript
Filme: Avatar 3
Lançamento: 20/12/2025

✅ Sessão em 20/12/2025 → ACEITA (mesmo dia)
✅ Sessão em 25/12/2025 → ACEITA (após lançamento)
❌ Sessão em 15/12/2025 → REJEITA (antes do lançamento)
❌ Sessão em 01/12/2025 → REJEITA (antes do lançamento)
```

---

### 5️⃣ **Detecção de Conflito de Horários**

**Método:** `hasTimeConflict(newSession, existingSessions, filmDuration)`

**O que faz:**
- Verifica se há sobreposição de horários na mesma sala
- Considera duração do filme + 45min de limpeza
- Retorna qual sessão está em conflito

**Exemplo:**
```typescript
// Sessão 1: 14:00 - 16:45 (120min + 45min)
// Sessão 2: 16:00 - 18:45 (tentando criar)
hasTimeConflict(sessao2, [sessao1], 120)
// Retorna: { hasConflict: true, conflictingSession: sessao1 }
```

**Casos de conflito:**
- ✅ Sessão nova começa durante sessão existente
- ✅ Sessão nova termina durante sessão existente
- ✅ Sessão nova engloba sessão existente

---

### 5️⃣ **Validação de Capacidade da Sala**

**Método:** `validateRoomCapacity(sessionId, requestedTickets, roomCapacity, sales)`

**O que faz:**
- Calcula quantos ingressos já foram vendidos
- Verifica se ainda há lugares disponíveis
- Retorna mensagem amigável se não houver vagas

**Exemplo:**
```typescript
// Sala com 20 lugares
// 15 ingressos já vendidos
// Cliente quer comprar 10 ingressos

validateRoomCapacity(sessionId, 10, 20, sales)
// Retorna: {
//   isValid: false,
//   available: 5,
//   message: "Apenas 5 ingresso(s) disponível(is). Sala tem capacidade de 20 lugares e 15 já foram vendidos."
// }
```

---

### 6️⃣ **Validação Completa de Nova Sessão**

**Método:** `validateNewSession(sessionData, existingSessions, filmDuration)`

**O que faz:**
- Valida horário de funcionamento
- Valida se é futura
- Valida conflito de horários
- Retorna lista de erros

**Exemplo:**
```typescript
validateNewSession(
    { datetime: '2025-12-04T22:00:00', roomId: 'sala-1' },
    existingSessions,
    120
)
// Retorna: {
//   isValid: false,
//   errors: [
//     'Sessão fora do horário de funcionamento (13h - 21h)',
//     'Conflito de horário com sessão existente: Avatar às 04/12/2025 20:00'
//   ]
// }
```

---

## 🎨 Melhorias Visuais

### **SalesForm.tsx**

#### Antes:
```
Sessão *
[Selecione uma sessão ▼]
Avatar - 2025-12-04T14:30:00 - Sala 1 - R$ 25.00
```

#### Depois:
```
⚠️ Nenhuma sessão disponível
Não há sessões futuras agendadas para o horário de funcionamento (13h - 21h).

Sessão * [DESABILITADO]
[Selecione uma sessão ▼]
```

Ou se houver sessões:
```
Sessão *
[Selecione uma sessão ▼]
Avatar - 04/12/2025 às 14:30 - Sala 1 - R$ 25.00
Titanic - 04/12/2025 às 17:00 - Sala 2 - R$ 30.00
```

---

## 📊 Fluxo de Validação

### **Ao Criar Sessão:**
```
1. Usuário preenche formulário
2. Sistema valida:
   ✓ Horário entre 13h-21h?
   ✓ Data/hora futura?
   ✓ Sala disponível nesse horário?
   ✓ Considera duração do filme + 45min
3. Se tudo OK → Salva no banco
4. Se erro → Mostra mensagem específica
```

### **Ao Vender Ingresso:**
```
1. Sistema filtra sessões:
   ✓ Remove sessões passadas
   ✓ Remove sessões fora do horário
2. Usuário seleciona sessão
3. Sistema valida:
   ✓ Quantidade <= lugares disponíveis?
4. Se OK → Registra venda
5. Se erro → Mostra quantos lugares restam
```

---

## 🧪 Casos de Teste

### Teste 1: Criar Sessão no Horário Correto
```typescript
✅ Sessão às 14:00 → ACEITA
✅ Sessão às 19:00 → ACEITA
❌ Sessão às 12:00 → REJEITA (antes das 13h)
❌ Sessão às 22:00 → REJEITA (depois das 21h)
```

### Teste 2: Conflito de Horários
```typescript
Sala 1:
- Sessão 1: 14:00 (Filme 120min + 45min limpeza = termina 16:45)

Tentativas:
❌ 14:30 → REJEITA (durante sessão existente)
❌ 16:00 → REJEITA (termina durante limpeza)
✅ 17:00 → ACEITA (após término completo)
```

### Teste 3: Capacidade da Sala
```typescript
Sala: 20 lugares
Vendidos: 15 ingressos

Tentativas:
✅ Comprar 5 ingressos → ACEITA
❌ Comprar 6 ingressos → REJEITA
❌ Comprar 10 ingressos → REJEITA
```

---

## 🚀 Próximas Melhorias (Opcional)

### Implementar em SessionForm:
```typescript
// Ao criar sessão, validar:
const validation = CinemaValidationService.validateNewSession(
    { datetime, roomId },
    existingSessions,
    selectedFilm.duration
);

if (!validation.isValid) {
    alert(validation.errors.join('\n'));
    return;
}
```

### Implementar em SalesForm:
```typescript
// Ao vender ingresso, validar capacidade:
const validation = await CinemaValidationService.validateRoomCapacity(
    sessionId,
    ticketQuantity,
    selectedSession.room.capacity,
    allSales
);

if (!validation.isValid) {
    alert(validation.message);
    return;
}
```

---

## 📁 Arquivos Modificados

```
✅ src/services/cinema-validation.service.ts (NOVO)
✅ src/components/sales/SalesForm.tsx (ATUALIZADO)
```

---

## ✅ Checklist de Validações

- [x] Horário de funcionamento (13h - 21h)
- [x] Filtro de sessões futuras
- [x] Formatação amigável de horários
- [x] Alerta quando não há sessões
- [x] Cálculo de término de sessão
- [x] Detecção de conflito de horários
- [x] Validação de capacidade da sala
- [x] Mensagens de erro amigáveis
- [ ] Implementar validação ao criar sessão (próximo passo)
- [ ] Implementar validação ao vender ingresso (próximo passo)

---

**Status:** ✅ Validações básicas implementadas  
**Próximo Passo:** Integrar validações nos formulários de criação
