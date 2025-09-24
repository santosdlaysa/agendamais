# 🚀 Guia Frontend - Lembretes Automáticos

## 📱 Visão Geral para o Frontend

Sistema de lembretes automáticos que permite configurar e gerenciar notificações via WhatsApp/SMS para clientes sobre seus agendamentos. Este guia apresenta todas as informações necessárias para implementar o frontend.

---

## 🌐 Base URL da API
```
http://localhost:5000/api/reminders
```

---

## 📋 Endpoints Principais para o Frontend

### 1. **📊 Dashboard/Estatísticas**

#### Obter Estatísticas dos Lembretes
```javascript
GET /api/reminders/stats
```

**Query Parameters:**
```javascript
?start_date=2025-09-01&end_date=2025-09-30&professional_id=1
```

**Response:**
```json
{
  "stats": {
    "total_reminders": 50,
    "sent_reminders": 45,
    "pending_reminders": 3,
    "failed_reminders": 2,
    "success_rate": 90.0,
    "by_type": {
      "whatsapp": 35,
      "sms": 15
    }
  }
}
```

**Código JavaScript:**
```javascript
const getReminderStats = async (startDate, endDate, professionalId = null) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (professionalId) params.append('professional_id', professionalId);
  
  const response = await fetch(`/api/reminders/stats?${params}`);
  return await response.json();
};
```

### 2. **⚙️ Configurações por Profissional**

#### Obter Configurações
```javascript
GET /api/reminders/settings?professional_id=1
```

**Response:**
```json
{
  "professional_id": 1,
  "professional_name": "João Silva",
  "settings": [
    {
      "id": 1,
      "reminder_type": "whatsapp",
      "enabled": true,
      "hours_before": 24,
      "custom_message": null
    },
    {
      "id": 2, 
      "reminder_type": "sms",
      "enabled": false,
      "hours_before": 24,
      "custom_message": null
    }
  ]
}
```

#### Atualizar Configurações
```javascript
PUT /api/reminders/settings
```

**Body:**
```json
{
  "professional_id": 1,
  "settings": [
    {
      "reminder_type": "whatsapp",
      "enabled": true,
      "hours_before": 24,
      "custom_message": "Olá {client_name}! Lembrete do seu agendamento em {date} às {time} com {professional_name}."
    },
    {
      "reminder_type": "sms", 
      "enabled": false,
      "hours_before": 2
    }
  ]
}
```

**Código JavaScript:**
```javascript
const updateReminderSettings = async (professionalId, settings) => {
  const response = await fetch('/api/reminders/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      professional_id: professionalId,
      settings: settings
    })
  });
  return await response.json();
};
```

### 3. **📋 Lista de Lembretes**

#### Listar Lembretes
```javascript
GET /api/reminders
```

**Query Parameters:**
```javascript
?page=1&per_page=20&professional_id=1&status=pending&reminder_type=whatsapp
```

**Response:**
```json
{
  "reminders": [
    {
      "id": 1,
      "appointment_id": 5,
      "reminder_type": "whatsapp",
      "reminder_time": "2025-09-10T13:00:00",
      "message": "🗓️ *Lembrete de Agendamento*\n\nOlá *Maria Santos*!...",
      "phone_number": "+5511999999999",
      "status": "sent",
      "sent_at": "2025-09-10T13:00:15",
      "attempts": 1,
      "appointment": {
        "id": 5,
        "client": {"name": "Maria Santos"},
        "professional": {"name": "João Silva"},
        "service": {"name": "Corte de Cabelo"},
        "appointment_date": "2025-09-11",
        "start_time": "14:00"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 3,
    "per_page": 20,
    "total": 50
  }
}
```

**Código JavaScript:**
```javascript
const getReminders = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  
  const response = await fetch(`/api/reminders?${params}`);
  return await response.json();
};
```

### 4. **📅 Lembretes Próximos**

#### Obter Lembretes que Serão Enviados
```javascript
GET /api/reminders/upcoming?hours=24
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "reminders": [
    {
      "id": 5,
      "reminder_time": "2025-09-11T09:00:00",
      "reminder_type": "whatsapp",
      "status": "pending",
      "appointment": {
        "client": {"name": "Ana Costa"},
        "service": {"name": "Manicure"}
      }
    }
  ]
}
```

### 5. **🎛️ Controles do Agendador**

#### Status do Agendador
```javascript
GET /api/reminders/scheduler/status
```

**Response:**
```json
{
  "scheduler": {
    "running": true,
    "check_interval": 300,
    "thread_alive": true
  }
}
```

#### Iniciar/Parar Agendador
```javascript
POST /api/reminders/scheduler/start
POST /api/reminders/scheduler/stop
```

**Código JavaScript:**
```javascript
const controlScheduler = async (action) => {
  const response = await fetch(`/api/reminders/scheduler/${action}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// Uso
await controlScheduler('start');  // Iniciar
await controlScheduler('stop');   // Parar
```

### 6. **🧪 Testes de Conexão**

#### Testar WhatsApp/SMS
```javascript
POST /api/reminders/test/whatsapp
POST /api/reminders/test/sms
```

**Response:**
```json
{
  "message": "Teste WhatsApp realizado com sucesso",
  "success": true,
  "message_sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### 7. **⚡ Ações Manuais**

#### Enviar Lembrete Específico
```javascript
POST /api/reminders/{reminder_id}/send
```

#### Processar Todos os Lembretes Pendentes
```javascript
POST /api/reminders/process
```

---

## 🎨 Componentes Sugeridos para o Frontend

### 1. **📊 Dashboard de Lembretes**

**Dados necessários:**
- Estatísticas gerais (total, enviados, falhas)
- Gráfico de taxa de sucesso
- Lembretes próximos (próximas 24h)
- Status do agendador automático

**APIs utilizadas:**
```javascript
GET /api/reminders/stats
GET /api/reminders/upcoming
GET /api/reminders/scheduler/status
```

### 2. **⚙️ Configurações por Profissional**

**Interface sugerida:**
```jsx
// Exemplo React
<div className="reminder-settings">
  <h3>Configurações de Lembretes - {professionalName}</h3>
  
  <div className="setting-item">
    <label>
      <input 
        type="checkbox" 
        checked={whatsappEnabled}
        onChange={handleWhatsAppToggle}
      />
      WhatsApp habilitado
    </label>
    
    <input 
      type="number" 
      value={whatsappHours}
      onChange={handleWhatsAppHours}
      placeholder="Horas antes"
    />
  </div>
  
  <div className="setting-item">
    <label>
      <input 
        type="checkbox" 
        checked={smsEnabled}
        onChange={handleSmsToggle}
      />
      SMS habilitado
    </label>
    
    <input 
      type="number" 
      value={smsHours}
      onChange={handleSmsHours}
      placeholder="Horas antes"
    />
  </div>
  
  <textarea 
    placeholder="Mensagem personalizada (use {client_name}, {date}, {time}, {professional_name}, {service_name})"
    value={customMessage}
    onChange={handleCustomMessage}
  />
  
  <button onClick={saveSettings}>Salvar Configurações</button>
</div>
```

### 3. **📋 Lista de Lembretes**

**Filtros sugeridos:**
- Status (Pendente, Enviado, Falhou)
- Tipo (WhatsApp, SMS)
- Profissional
- Período de data

**Colunas da tabela:**
- Cliente
- Profissional 
- Serviço
- Data/Hora do Agendamento
- Data/Hora do Lembrete
- Tipo (WhatsApp/SMS)
- Status
- Tentativas
- Ações (Reenviar, Excluir)

### 4. **🎛️ Painel de Controle**

**Elementos:**
- Status do agendador (ON/OFF)
- Botão Iniciar/Parar agendador
- Processar lembretes pendentes manualmente
- Testes de conexão (WhatsApp/SMS)
- Lembretes próximos

---

## 🔄 Estados dos Lembretes

### Status Possíveis:
- **`pending`** - Aguardando envio (🟡)
- **`sent`** - Enviado com sucesso (🟢) 
- **`failed`** - Falhou no envio (🔴)

### Tipos de Lembrete:
- **`whatsapp`** - WhatsApp
- **`sms`** - SMS

---

## 📱 Integração com Agendamentos

Quando um agendamento é criado, a resposta agora inclui informações dos lembretes:

```json
{
  "message": "Agendamento criado com sucesso",
  "appointment": { /* dados do agendamento */ },
  "reminders_created": [
    {
      "type": "whatsapp",
      "scheduled_for": "2025-09-10T13:00:00",
      "hours_before": 24
    }
  ],
  "total_reminders": 1
}
```

**Código para mostrar feedback:**
```javascript
const createAppointment = async (appointmentData) => {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(appointmentData)
  });
  
  const result = await response.json();
  
  if (result.reminders_created && result.reminders_created.length > 0) {
    // Mostrar notificação de sucesso com lembretes
    showNotification(
      `Agendamento criado! ${result.total_reminders} lembrete(s) agendado(s).`,
      'success'
    );
  }
  
  return result;
};
```

---

## 🎨 Paleta de Cores Sugerida

```css
/* Status dos lembretes */
.status-pending { color: #f59e0b; }    /* Amarelo */
.status-sent { color: #10b981; }       /* Verde */
.status-failed { color: #ef4444; }     /* Vermelho */

/* Tipos de lembrete */
.type-whatsapp { color: #25d366; }     /* Verde WhatsApp */
.type-sms { color: #3b82f6; }          /* Azul SMS */
```

---

## ⚡ Funções Utilitárias JavaScript

```javascript
// Formatador de data/hora
const formatReminderTime = (isoDate) => {
  return new Date(isoDate).toLocaleString('pt-BR');
};

// Gerador de badge de status
const getStatusBadge = (status) => {
  const badges = {
    pending: { text: 'Pendente', class: 'badge-warning' },
    sent: { text: 'Enviado', class: 'badge-success' },
    failed: { text: 'Falhou', class: 'badge-error' }
  };
  return badges[status] || { text: status, class: 'badge-default' };
};

// Formatador de tipo de lembrete
const getReminderTypeIcon = (type) => {
  return type === 'whatsapp' ? '📱' : '📧';
};

// Calculador de tempo até lembrete
const getTimeUntilReminder = (reminderTime) => {
  const now = new Date();
  const reminder = new Date(reminderTime);
  const diff = reminder - now;
  
  if (diff <= 0) return 'Vencido';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};
```

---

## 🔐 Headers de Autenticação

Para endpoints protegidos (quando habilitar JWT):

```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`
};
```

---

## 📋 Checklist de Implementação

### Dashboard
- [ ] Estatísticas gerais dos lembretes
- [ ] Gráfico de taxa de sucesso
- [ ] Lista de lembretes próximos
- [ ] Status do agendador automático

### Configurações
- [ ] Formulário de configurações por profissional
- [ ] Toggle WhatsApp/SMS
- [ ] Campo de horas antes do agendamento
- [ ] Editor de mensagem personalizada
- [ ] Preview da mensagem com placeholders

### Lista de Lembretes
- [ ] Tabela com filtros e paginação
- [ ] Filtros por status, tipo, profissional
- [ ] Botão de reenvio manual
- [ ] Indicador de tentativas

### Controles
- [ ] Botão iniciar/parar agendador
- [ ] Processar lembretes pendentes
- [ ] Testes de conexão WhatsApp/SMS
- [ ] Logs de atividade

### Integração
- [ ] Feedback na criação de agendamentos
- [ ] Notificações de lembretes enviados
- [ ] Tratamento de erros

---

**Este guia contém tudo que você precisa para implementar o frontend dos lembretes automáticos!** 🚀

*Para dúvidas específicas sobre implementação, consulte a documentação completa em `API_DOCUMENTATION.md`*