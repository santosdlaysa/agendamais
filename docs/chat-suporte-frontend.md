# Chat de Suporte - Documentação para Frontend

## Visão Geral

Chat em tempo real entre **usuários** (donos de empresa) e **super admin** (suporte). Cada usuário tem **1 conversa única** com o suporte. Comunicação via **REST API** + **WebSocket (Socket.IO)**.

---

## REST API

Base URL: `/api/chat`
Todas as rotas exigem header `Authorization: Bearer <token>`

---

### 1. Listar Conversas

```
GET /api/chat/conversations
```

**Query params (apenas para admin):**

| Param | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `page` | int | 1 | Página |
| `per_page` | int | 20 | Itens por página |
| `status` | string | - | Filtrar por `active` ou `closed` |

**Comportamento por role:**
- **superadmin**: retorna todas as conversas paginadas
- **user**: retorna apenas a sua conversa (ou array vazio se não existir)

**Response 200:**
```json
{
  "conversations": [
    {
      "id": 1,
      "user_id": 5,
      "user_name": "João Silva",
      "user_email": "joao@email.com",
      "user_business_name": "Barbearia do João",
      "status": "active",
      "user_unread_count": 0,
      "admin_unread_count": 2,
      "last_message_text": "Preciso de ajuda com...",
      "last_message_at": "2026-02-04T15:30:00",
      "last_message_sender_role": "user",
      "created_at": "2026-02-01T10:00:00",
      "updated_at": "2026-02-04T15:30:00"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 1,
    "per_page": 20,
    "total": 1
  }
}
```

---

### 2. Criar/Obter Conversa

```
POST /api/chat/conversations
```

**Body (apenas para admin):**
```json
{
  "user_id": 5
}
```

**Comportamento:**
- **user**: não precisa enviar body, cria/retorna a conversa dele
- **superadmin**: precisa enviar `user_id` do usuário alvo
- Se já existe conversa, retorna a existente (200). Se não, cria nova (201).

**Response 201 (criada):**
```json
{
  "message": "Conversa criada com sucesso",
  "conversation": { "..." : "..." }
}
```

**Response 200 (já existia):**
```json
{
  "message": "Conversa existente",
  "conversation": { "..." : "..." }
}
```

---

### 3. Histórico de Mensagens

```
GET /api/chat/conversations/:id/messages
```

**Query params:**

| Param | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `page` | int | 1 | Página |
| `per_page` | int | 50 | Mensagens por página |

**Obs:** Mensagens vêm ordenadas por `created_at DESC` (mais recentes primeiro). No frontend, inverta a ordem para exibir na UI.

**Response 200:**
```json
{
  "messages": [
    {
      "id": 10,
      "conversation_id": 1,
      "sender_id": 5,
      "sender_role": "user",
      "sender_name": "João Silva",
      "message": "Olá, preciso de ajuda",
      "read": true,
      "read_at": "2026-02-04T15:35:00",
      "created_at": "2026-02-04T15:30:00"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 1,
    "per_page": 50,
    "total": 1
  }
}
```

---

### 4. Marcar Mensagens como Lidas

```
PATCH /api/chat/conversations/:id/read
```

Marca as mensagens **do outro participante** como lidas. Não precisa de body.

**Response 200:**
```json
{
  "message": "3 mensagens marcadas como lidas",
  "conversation": { "..." : "..." }
}
```

---

### 5. Total de Não Lidas

```
GET /api/chat/conversations/unread-count
```

**Comportamento:**
- **superadmin**: soma de `admin_unread_count` de todas as conversas
- **user**: `user_unread_count` da sua conversa

**Response 200:**
```json
{
  "unread_count": 5
}
```

Use este endpoint para exibir o **badge** no ícone do chat.

---

## WebSocket (Socket.IO)

### Conexão

```javascript
import { io } from "socket.io-client";

const socket = io("https://sua-api.com/chat", {
  auth: {
    token: "jwt-token-aqui"   // sem o prefixo "Bearer"
  }
});
```

**Namespace:** `/chat`

Após conectar com sucesso, o servidor emite:
```javascript
socket.on("connected", (data) => {
  // { user_id: 5, role: "user", message: "Conectado ao chat de suporte" }
});
```

---

### Eventos que o Cliente ENVIA

#### `join_conversation`

Entrar na room de uma conversa. **Obrigatório** para receber mensagens em tempo real.

```javascript
socket.emit("join_conversation", {
  conversation_id: 1
});

// Confirmação:
socket.on("joined_conversation", (data) => {
  // { conversation_id: 1 }
});
```

#### `send_message`

Enviar mensagem.

```javascript
socket.emit("send_message", {
  conversation_id: 1,
  message: "Olá, preciso de ajuda!"
});
```

#### `typing`

Indicador de digitação.

```javascript
// Quando começa a digitar
socket.emit("typing", {
  conversation_id: 1,
  is_typing: true
});

// Quando para de digitar (timeout de ~2s)
socket.emit("typing", {
  conversation_id: 1,
  is_typing: false
});
```

#### `mark_read`

Marcar mensagens como lidas (mesma lógica do REST, mas via socket).

```javascript
socket.emit("mark_read", {
  conversation_id: 1
});
```

---

### Eventos que o Cliente RECEBE

#### `new_message`

Nova mensagem na conversa. Recebido por todos na room `conversation_{id}`.

```javascript
socket.on("new_message", (message) => {
  // {
  //   id: 10,
  //   conversation_id: 1,
  //   sender_id: 5,
  //   sender_role: "user",
  //   sender_name: "João Silva",
  //   message: "Olá, preciso de ajuda",
  //   read: false,
  //   read_at: null,
  //   created_at: "2026-02-04T15:30:00"
  // }
});
```

#### `conversation_updated`

Conversa foi atualizada (nova mensagem, leitura, etc). Recebido **apenas por superadmins** na `admin_room`. Use para atualizar a lista de conversas.

```javascript
socket.on("conversation_updated", (conversation) => {
  // Objeto completo da conversa (mesmo formato do REST)
});
```

#### `unread_update`

Contadores de não lidas atualizados. Recebido na room pessoal do usuário `user_{id}`.

```javascript
socket.on("unread_update", (data) => {
  // {
  //   conversation_id: 1,
  //   user_unread_count: 3,
  //   admin_unread_count: 0
  // }
});
```

#### `typing_indicator`

Outro participante está digitando. Recebido por todos na room **exceto** quem emitiu.

```javascript
socket.on("typing_indicator", (data) => {
  // {
  //   conversation_id: 1,
  //   user_id: 99,
  //   sender_role: "superadmin",
  //   is_typing: true
  // }
});
```

#### `messages_read`

Mensagens foram lidas pelo outro participante. Use para atualizar os checks de leitura.

```javascript
socket.on("messages_read", (data) => {
  // {
  //   conversation_id: 1,
  //   read_by: 99,
  //   read_by_role: "superadmin",
  //   read_at: "2026-02-04T15:35:00"
  // }
});
```

#### `error`

Erro em alguma operação.

```javascript
socket.on("error", (data) => {
  // { message: "Acesso negado" }
});
```

---

## Fluxos de Implementação

### Fluxo do Usuário (dono de empresa)

```
1. Clicar no ícone de chat
2. POST /api/chat/conversations              → cria/obtém conversa
3. GET  /api/chat/conversations/:id/messages  → carrega histórico
4. socket.emit("join_conversation", { conversation_id })
5. PATCH /api/chat/conversations/:id/read     → marca como lidas
6. Digitar → socket.emit("send_message", { ... })
7. Ouvir "new_message" para mensagens recebidas
8. Ouvir "typing_indicator" para indicador de digitação
```

### Fluxo do Super Admin (suporte)

```
1. Abrir painel de conversas
2. GET /api/chat/conversations                → lista todas as conversas
3. Ouvir "conversation_updated" para atualizar a lista em tempo real
4. Clicar numa conversa:
   - GET /api/chat/conversations/:id/messages
   - socket.emit("join_conversation", { conversation_id })
   - PATCH /api/chat/conversations/:id/read
5. Digitar → socket.emit("send_message", { ... })
6. Ouvir "new_message" para mensagens recebidas
```

### Badge de não lidas (ambos)

```
- Na montagem do app: GET /api/chat/conversations/unread-count
- Em tempo real: ouvir "unread_update" para atualizar o badge
- Quando marca como lido: atualizar localmente
```

---

## Campos de `sender_role`

| Valor | Quem |
|-------|------|
| `"user"` | Usuário (dono de empresa) |
| `"superadmin"` | Administrador (suporte) |

Use para estilizar mensagens (esquerda/direita, cores diferentes).

---

## Resumo de Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/chat/conversations` | Listar conversas |
| `POST` | `/api/chat/conversations` | Criar/obter conversa |
| `GET` | `/api/chat/conversations/:id/messages` | Histórico paginado |
| `PATCH` | `/api/chat/conversations/:id/read` | Marcar como lidas |
| `GET` | `/api/chat/conversations/unread-count` | Total não lidas |

## Resumo de Eventos Socket.IO

| Socket (emit) | Payload | Descrição |
|----------------|---------|-----------|
| `join_conversation` | `{ conversation_id }` | Entrar na room |
| `send_message` | `{ conversation_id, message }` | Enviar mensagem |
| `typing` | `{ conversation_id, is_typing }` | Digitando |
| `mark_read` | `{ conversation_id }` | Marcar lidas |

| Socket (on) | Descrição |
|--------------|-----------|
| `connected` | Confirmação de conexão |
| `new_message` | Nova mensagem recebida |
| `conversation_updated` | Conversa atualizada (admin) |
| `unread_update` | Contadores atualizados |
| `typing_indicator` | Outro digitando |
| `messages_read` | Mensagens lidas |
| `error` | Erro |
