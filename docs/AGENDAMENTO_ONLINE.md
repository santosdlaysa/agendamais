# Documentação: Agendamento Online para Clientes

## Visão Geral

Esta funcionalidade permite que clientes agendem serviços diretamente pelo site, sem necessidade de login. O cliente acessa uma URL pública do estabelecimento e realiza o agendamento de forma autônoma.

---

## Fluxo do Usuário

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FLUXO DE AGENDAMENTO                              │
└─────────────────────────────────────────────────────────────────────────────┘

1. Cliente acessa: /agendar/{slug-estabelecimento}
                            │
                            ▼
2. Visualiza informações do estabelecimento (nome, endereço, logo)
                            │
                            ▼
3. Seleciona o SERVIÇO desejado
   - Lista de serviços com nome, preço e duração
                            │
                            ▼
4. Seleciona o PROFISSIONAL (opcional ou obrigatório)
   - Filtrado pelos que realizam o serviço selecionado
   - Opção "Sem preferência" disponível
                            │
                            ▼
5. Seleciona DATA e HORÁRIO
   - Calendário com dias disponíveis
   - Grade de horários livres baseada na agenda do profissional
                            │
                            ▼
6. Preenche DADOS PESSOAIS
   - Nome completo *
   - Telefone/WhatsApp *
   - Email (opcional)
   - Observações (opcional)
                            │
                            ▼
7. CONFIRMAÇÃO
   - Resumo do agendamento
   - Botão para confirmar
                            │
                            ▼
8. TELA DE SUCESSO
   - Código do agendamento
   - Detalhes do agendamento
   - Opção de adicionar ao calendário
   - Link para cancelar/reagendar
```

---

## Rotas do Backend (API)

### Rotas Públicas (sem autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/public/business/:slug` | Dados do estabelecimento |
| `GET` | `/api/public/business/:slug/services` | Lista de serviços ativos |
| `GET` | `/api/public/business/:slug/professionals` | Lista de profissionais ativos |
| `GET` | `/api/public/business/:slug/professionals/:id/services` | Serviços de um profissional |
| `GET` | `/api/public/business/:slug/availability` | Horários disponíveis |
| `POST` | `/api/public/business/:slug/appointments` | Criar agendamento |
| `GET` | `/api/public/appointments/:code` | Consultar agendamento por código |
| `PUT` | `/api/public/appointments/:code/cancel` | Cancelar agendamento |

---

### Detalhamento das Rotas

#### 1. GET `/api/public/business/:slug`

Retorna informações públicas do estabelecimento.

**Parâmetros:**
- `slug` (path): Identificador único do estabelecimento (ex: "barbearia-do-ze")

**Resposta (200):**
```json
{
  "business": {
    "id": 1,
    "name": "Barbearia do Zé",
    "slug": "barbearia-do-ze",
    "logo_url": "https://...",
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "phone": "(11) 99999-9999",
    "whatsapp": "(11) 99999-9999",
    "description": "A melhor barbearia da região",
    "working_hours": {
      "monday": { "open": "09:00", "close": "18:00" },
      "tuesday": { "open": "09:00", "close": "18:00" },
      "wednesday": { "open": "09:00", "close": "18:00" },
      "thursday": { "open": "09:00", "close": "18:00" },
      "friday": { "open": "09:00", "close": "18:00" },
      "saturday": { "open": "09:00", "close": "14:00" },
      "sunday": null
    },
    "settings": {
      "allow_online_booking": true,
      "advance_booking_days": 30,
      "min_advance_hours": 2,
      "cancellation_hours": 24
    }
  }
}
```

**Erros:**
- `404`: Estabelecimento não encontrado
- `403`: Agendamento online desabilitado

---

#### 2. GET `/api/public/business/:slug/services`

Lista serviços disponíveis para agendamento online.

**Query params:**
- `professional_id` (opcional): Filtrar serviços por profissional

**Resposta (200):**
```json
{
  "services": [
    {
      "id": 1,
      "name": "Corte Masculino",
      "description": "Corte tradicional com máquina e tesoura",
      "duration": 30,
      "price": 45.00,
      "category": "Cabelo",
      "image_url": "https://..."
    },
    {
      "id": 2,
      "name": "Barba",
      "description": "Barba com navalha e toalha quente",
      "duration": 20,
      "price": 30.00,
      "category": "Barba",
      "image_url": null
    }
  ]
}
```

---

#### 3. GET `/api/public/business/:slug/professionals`

Lista profissionais disponíveis.

**Query params:**
- `service_id` (opcional): Filtrar profissionais que realizam o serviço

**Resposta (200):**
```json
{
  "professionals": [
    {
      "id": 1,
      "name": "João Silva",
      "role": "Barbeiro",
      "photo_url": "https://...",
      "bio": "10 anos de experiência",
      "rating": 4.8,
      "services_count": 5
    }
  ]
}
```

---

#### 4. GET `/api/public/business/:slug/availability`

Retorna horários disponíveis para agendamento.

**Query params (obrigatórios):**
- `service_id`: ID do serviço
- `professional_id`: ID do profissional (ou "any" para qualquer um)
- `date`: Data no formato YYYY-MM-DD

**Query params (opcionais):**
- `days`: Número de dias para buscar (padrão: 1, máximo: 7)

**Resposta (200):**
```json
{
  "availability": {
    "2025-01-15": {
      "available": true,
      "slots": [
        {
          "time": "09:00",
          "end_time": "09:30",
          "professional_id": 1,
          "professional_name": "João Silva"
        },
        {
          "time": "09:30",
          "end_time": "10:00",
          "professional_id": 1,
          "professional_name": "João Silva"
        },
        {
          "time": "10:00",
          "end_time": "10:30",
          "professional_id": 2,
          "professional_name": "Pedro Santos"
        }
      ]
    },
    "2025-01-16": {
      "available": false,
      "slots": [],
      "reason": "Estabelecimento fechado"
    }
  },
  "service": {
    "id": 1,
    "name": "Corte Masculino",
    "duration": 30,
    "price": 45.00
  }
}
```

---

#### 5. POST `/api/public/business/:slug/appointments`

Cria um novo agendamento.

**Body:**
```json
{
  "service_id": 1,
  "professional_id": 1,
  "appointment_date": "2025-01-15",
  "start_time": "09:00",
  "client": {
    "name": "Maria Santos",
    "phone": "(11) 98888-8888",
    "email": "maria@email.com"
  },
  "notes": "Primeira vez no salão"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "appointment": {
    "id": 123,
    "code": "AGD-2025-ABC123",
    "service": {
      "name": "Corte Masculino",
      "duration": 30,
      "price": 45.00
    },
    "professional": {
      "name": "João Silva"
    },
    "appointment_date": "2025-01-15",
    "start_time": "09:00",
    "end_time": "09:30",
    "status": "scheduled",
    "client": {
      "name": "Maria Santos",
      "phone": "(11) 98888-8888"
    },
    "business": {
      "name": "Barbearia do Zé",
      "address": "Rua das Flores, 123",
      "phone": "(11) 99999-9999"
    },
    "cancel_url": "/agendar/barbearia-do-ze/cancelar/AGD-2025-ABC123",
    "calendar_links": {
      "google": "https://calendar.google.com/...",
      "outlook": "https://outlook.live.com/...",
      "ics": "/api/public/appointments/AGD-2025-ABC123/calendar.ics"
    }
  },
  "message": "Agendamento realizado com sucesso!"
}
```

**Erros:**
- `400`: Dados inválidos
- `409`: Horário não disponível
- `422`: Serviço/profissional inativo

---

#### 6. GET `/api/public/appointments/:code`

Consulta detalhes de um agendamento pelo código.

**Resposta (200):**
```json
{
  "appointment": {
    "code": "AGD-2025-ABC123",
    "status": "scheduled",
    "service": {
      "name": "Corte Masculino",
      "duration": 30,
      "price": 45.00
    },
    "professional": {
      "name": "João Silva",
      "phone": "(11) 99999-9999"
    },
    "appointment_date": "2025-01-15",
    "start_time": "09:00",
    "end_time": "09:30",
    "business": {
      "name": "Barbearia do Zé",
      "address": "Rua das Flores, 123",
      "phone": "(11) 99999-9999"
    },
    "can_cancel": true,
    "cancel_deadline": "2025-01-14T09:00:00"
  }
}
```

---

#### 7. PUT `/api/public/appointments/:code/cancel`

Cancela um agendamento.

**Body:**
```json
{
  "phone": "(11) 98888-8888",
  "reason": "Imprevisto pessoal"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Agendamento cancelado com sucesso"
}
```

**Erros:**
- `400`: Telefone não confere
- `403`: Prazo de cancelamento expirado
- `404`: Agendamento não encontrado
- `409`: Agendamento já cancelado/concluído

---

## Componentes do Frontend

### Estrutura de Arquivos

```
frontend/src/
├── pages/
│   └── public/
│       ├── BookingPage.jsx           # Página principal de agendamento
│       ├── BookingConfirmation.jsx   # Tela de confirmação/sucesso
│       ├── BookingLookup.jsx         # Consultar/cancelar agendamento
│       └── BookingCancel.jsx         # Página de cancelamento
│
├── components/
│   └── booking/
│       ├── BusinessHeader.jsx        # Cabeçalho com info do estabelecimento
│       ├── ServiceSelector.jsx       # Seleção de serviço (cards)
│       ├── ProfessionalSelector.jsx  # Seleção de profissional
│       ├── DateTimePicker.jsx        # Calendário + grade de horários
│       ├── ClientForm.jsx            # Formulário de dados do cliente
│       ├── BookingSummary.jsx        # Resumo antes de confirmar
│       ├── BookingSteps.jsx          # Indicador de progresso (steps)
│       └── TimeSlotGrid.jsx          # Grade de horários disponíveis
│
└── services/
    └── publicApi.js                  # Chamadas à API pública
```

---

### Rotas do Frontend (React Router)

```jsx
// App.jsx - Adicionar rotas públicas

<Routes>
  {/* Rotas públicas (sem autenticação) */}
  <Route path="/agendar/:slug" element={<BookingPage />} />
  <Route path="/agendar/:slug/confirmacao/:code" element={<BookingConfirmation />} />
  <Route path="/agendar/:slug/consultar" element={<BookingLookup />} />
  <Route path="/agendar/:slug/cancelar/:code" element={<BookingCancel />} />

  {/* Rotas autenticadas existentes */}
  ...
</Routes>
```

---

### Componente Principal: BookingPage.jsx

```jsx
// Estrutura do estado
const [step, setStep] = useState(1) // 1-4
const [business, setBusiness] = useState(null)
const [selectedService, setSelectedService] = useState(null)
const [selectedProfessional, setSelectedProfessional] = useState(null)
const [selectedDate, setSelectedDate] = useState(null)
const [selectedTime, setSelectedTime] = useState(null)
const [clientData, setClientData] = useState({
  name: '',
  phone: '',
  email: '',
  notes: ''
})

// Steps:
// 1. Seleção de Serviço
// 2. Seleção de Profissional + Data/Hora
// 3. Dados do Cliente
// 4. Confirmação
```

---

### API Service: publicApi.js

```javascript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

// API pública (sem token de autenticação)
export const publicApi = axios.create({
  baseURL: `${API_BASE_URL}/api/public`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const bookingService = {
  // Buscar dados do estabelecimento
  getBusiness: async (slug) => {
    const response = await publicApi.get(`/business/${slug}`)
    return response.data
  },

  // Listar serviços
  getServices: async (slug, professionalId = null) => {
    const params = professionalId ? `?professional_id=${professionalId}` : ''
    const response = await publicApi.get(`/business/${slug}/services${params}`)
    return response.data
  },

  // Listar profissionais
  getProfessionals: async (slug, serviceId = null) => {
    const params = serviceId ? `?service_id=${serviceId}` : ''
    const response = await publicApi.get(`/business/${slug}/professionals${params}`)
    return response.data
  },

  // Buscar disponibilidade
  getAvailability: async (slug, { serviceId, professionalId, date, days = 1 }) => {
    const params = new URLSearchParams({
      service_id: serviceId,
      professional_id: professionalId,
      date: date,
      days: days
    })
    const response = await publicApi.get(`/business/${slug}/availability?${params}`)
    return response.data
  },

  // Criar agendamento
  createAppointment: async (slug, data) => {
    const response = await publicApi.post(`/business/${slug}/appointments`, data)
    return response.data
  },

  // Consultar agendamento
  getAppointment: async (code) => {
    const response = await publicApi.get(`/appointments/${code}`)
    return response.data
  },

  // Cancelar agendamento
  cancelAppointment: async (code, phone, reason) => {
    const response = await publicApi.put(`/appointments/${code}/cancel`, { phone, reason })
    return response.data
  }
}
```

---

## Modelo de Dados (Backend)

### Novas colunas na tabela `businesses` (ou `users`)

```sql
ALTER TABLE businesses ADD COLUMN slug VARCHAR(100) UNIQUE;
ALTER TABLE businesses ADD COLUMN logo_url VARCHAR(500);
ALTER TABLE businesses ADD COLUMN description TEXT;
ALTER TABLE businesses ADD COLUMN address VARCHAR(255);
ALTER TABLE businesses ADD COLUMN city VARCHAR(100);
ALTER TABLE businesses ADD COLUMN state VARCHAR(2);
ALTER TABLE businesses ADD COLUMN working_hours JSONB;
ALTER TABLE businesses ADD COLUMN booking_settings JSONB DEFAULT '{
  "allow_online_booking": true,
  "advance_booking_days": 30,
  "min_advance_hours": 2,
  "cancellation_hours": 24
}';
```

### Nova coluna na tabela `appointments`

```sql
ALTER TABLE appointments ADD COLUMN booking_code VARCHAR(20) UNIQUE;
ALTER TABLE appointments ADD COLUMN source VARCHAR(20) DEFAULT 'admin'; -- 'admin' ou 'online'
ALTER TABLE appointments ADD COLUMN client_email VARCHAR(255);
```

---

## Validações Importantes

### No Backend

1. **Verificar se o estabelecimento permite agendamento online**
2. **Validar antecedência mínima** (ex: não permitir agendar para daqui 30 minutos)
3. **Validar limite de dias** (ex: não permitir agendar para daqui 60 dias)
4. **Verificar se o horário ainda está disponível** (double-check antes de criar)
5. **Gerar código único** para o agendamento (ex: AGD-2025-ABC123)
6. **Validar telefone** para cancelamento (segurança básica)
7. **Rate limiting** para evitar spam de agendamentos

### No Frontend

1. **Validar campos obrigatórios** antes de enviar
2. **Formatar telefone** automaticamente
3. **Bloquear datas passadas** no calendário
4. **Mostrar loading** durante requisições
5. **Tratar erros** de forma amigável
6. **Confirmar antes de cancelar**

---

## Notificações (Opcional)

Após criar o agendamento, enviar:

1. **WhatsApp/SMS para o cliente:**
   ```
   Olá Maria! Seu agendamento foi confirmado.

   Serviço: Corte Masculino
   Data: 15/01/2025 às 09:00
   Profissional: João Silva
   Local: Barbearia do Zé - Rua das Flores, 123

   Código: AGD-2025-ABC123

   Para cancelar: [link]
   ```

2. **Notificação push/email para o estabelecimento:**
   ```
   Novo agendamento online!
   Cliente: Maria Santos
   Serviço: Corte Masculino
   Data: 15/01/2025 às 09:00
   ```

---

## Considerações de UX

1. **Mobile First**: A maioria dos clientes agendará pelo celular
2. **Poucos cliques**: Máximo 4 passos até confirmar
3. **Feedback visual**: Sempre mostrar o que foi selecionado
4. **Recuperação de erros**: Não perder dados se der erro
5. **Confirmação clara**: Resumo completo antes de finalizar
6. **Fácil cancelamento**: Link direto para cancelar

---

## Checklist de Implementação

### Backend
- [ ] Criar rotas públicas `/api/public/*`
- [ ] Adicionar campo `slug` ao estabelecimento
- [ ] Adicionar campo `booking_code` aos agendamentos
- [ ] Implementar geração de código único
- [ ] Implementar verificação de disponibilidade
- [ ] Adicionar validações de antecedência
- [ ] Implementar rate limiting
- [ ] Criar/atualizar cliente automaticamente

### Frontend
- [ ] Criar página `BookingPage.jsx`
- [ ] Criar componente `ServiceSelector.jsx`
- [ ] Criar componente `ProfessionalSelector.jsx`
- [ ] Criar componente `DateTimePicker.jsx`
- [ ] Criar componente `ClientForm.jsx`
- [ ] Criar componente `BookingSummary.jsx`
- [ ] Criar página `BookingConfirmation.jsx`
- [ ] Criar página `BookingLookup.jsx`
- [ ] Criar serviço `publicApi.js`
- [ ] Adicionar rotas públicas no App.jsx
- [ ] Implementar responsividade mobile
- [ ] Adicionar animações de transição

### Testes
- [ ] Testar fluxo completo de agendamento
- [ ] Testar cancelamento
- [ ] Testar conflitos de horário
- [ ] Testar em dispositivos móveis
- [ ] Testar com múltiplos profissionais
- [ ] Testar validações de formulário

---

## Exemplo de URL Final

```
https://agendamais.site/agendar/barbearia-do-ze
```

O cliente acessa essa URL e pode agendar diretamente, sem criar conta.
