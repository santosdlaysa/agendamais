# Plano: Dashboard Individual para Profissionais

**Data:** Janeiro 2026
**Status:** Planejado
**Prioridade:** Alta

---

## 1. Objetivo

Permitir que cada profissional cadastrado no sistema tenha acesso a uma dashboard própria, onde poderá visualizar apenas os serviços/agendamentos atribuídos a ele, suas estatísticas de performance e sua agenda.

-

## 2. Modelo de Autenticação

**Escolhido:** Login completo (email/senha)

### Fluxo de Acesso:

1. Admin cadastra profissional com email
2. Sistema envia email de convite com link de ativação
3. Profissional clica no link e define sua senha
4. Profissional acessa `/profissional/login`
5. Após login, é redirecionado para sua dashboard em `/profissional/dashboard`

### Vantagens:
- Mais seguro
- Profissional tem autonomia
- Escalável para múltiplos profissionais
- Permite funcionalidades futuras (chat, notificações, etc.)

---

## 3. Alterações no Banco de Dados

### Nova Tabela: `professional_users`

```sql
CREATE TABLE professional_users (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    invite_token VARCHAR(255),
    invite_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_professional_users_professional_id ON professional_users(professional_id);
CREATE INDEX idx_professional_users_email ON professional_users(email);
CREATE INDEX idx_professional_users_invite_token ON professional_users(invite_token);
```

### Alteração na Tabela `professionals`

```sql
ALTER TABLE professionals ADD COLUMN user_email VARCHAR(255);
```

---

## 4. Endpoints do Backend (Flask)

### 4.1 Autenticação de Profissionais

```python
# POST /api/professional-auth/invite
# Envia convite para profissional criar conta
Request:
{
    "professional_id": 1,
    "email": "profissional@email.com"
}
Response:
{
    "message": "Convite enviado com sucesso",
    "invite_token": "abc123..."
}

# POST /api/professional-auth/activate
# Profissional define sua senha
Request:
{
    "token": "abc123...",
    "password": "senha123"
}
Response:
{
    "message": "Conta ativada com sucesso"
}

# POST /api/professional-auth/login
# Login do profissional
Request:
{
    "email": "profissional@email.com",
    "password": "senha123"
}
Response:
{
    "access_token": "jwt...",
    "professional": {
        "id": 1,
        "name": "João Silva",
        "role": "Barbeiro",
        "color": "#3B82F6"
    }
}

# POST /api/professional-auth/logout
# Logout do profissional

# POST /api/professional-auth/forgot-password
# Solicita reset de senha

# POST /api/professional-auth/reset-password
# Reseta senha com token
```

### 4.2 Dashboard do Profissional

```python
# GET /api/professional/dashboard
# Retorna dados da dashboard
# Header: Authorization: Bearer {token}
Response:
{
    "professional": {
        "id": 1,
        "name": "João Silva",
        "role": "Barbeiro",
        "color": "#3B82F6",
        "email": "joao@email.com"
    },
    "stats": {
        "today_appointments": 5,
        "today_completed": 3,
        "today_pending": 2,
        "week_appointments": 23,
        "month_appointments": 87,
        "total_completed": 245,
        "completion_rate": 89.5,
        "month_revenue": 4500.00,
        "total_revenue": 45000.00
    },
    "today_schedule": [
        {
            "id": 123,
            "client_name": "Maria Santos",
            "client_phone": "(11) 99999-9999",
            "service_name": "Corte Masculino",
            "start_time": "09:00",
            "end_time": "09:30",
            "status": "scheduled",
            "price": 50.00
        }
    ],
    "upcoming_appointments": [...],
    "recent_completed": [...]
}

# GET /api/professional/appointments
# Lista agendamentos do profissional
Query params: ?date=2026-01-13&status=scheduled&page=1&limit=20
Response:
{
    "appointments": [...],
    "total": 45,
    "page": 1,
    "pages": 3
}

# PUT /api/professional/appointments/:id/complete
# Marca agendamento como concluído
Request:
{
    "price": 50.00,
    "payment_method": "credit_card",
    "notes": "Cliente satisfeito"
}

# GET /api/professional/schedule
# Retorna agenda semanal
Query params: ?start_date=2026-01-13&end_date=2026-01-19

# GET /api/professional/clients
# Lista clientes atendidos pelo profissional

# PUT /api/professional/working-hours
# Atualiza horários de trabalho

# POST /api/professional/blocked-dates
# Bloqueia data/horário
```

---

## 5. Componentes do Frontend (React)

### 5.1 Estrutura de Arquivos

```
frontend/src/
├── contexts/
│   └── ProfessionalAuthContext.jsx    # NOVO
├── services/
│   └── professionalApi.js              # NOVO
├── pages/
│   └── professional/                   # NOVA PASTA
│       ├── ProfessionalLogin.jsx
│       ├── ProfessionalActivate.jsx
│       ├── ProfessionalDashboard.jsx
│       ├── ProfessionalSchedule.jsx
│       ├── ProfessionalAppointments.jsx
│       ├── ProfessionalClients.jsx
│       └── ProfessionalSettings.jsx
├── components/
│   └── professional/                   # NOVA PASTA
│       ├── DayTimeline.jsx
│       ├── AppointmentCard.jsx
│       ├── StatsCard.jsx
│       ├── WeekCalendar.jsx
│       └── ProfessionalSidebar.jsx
└── App.jsx                             # MODIFICAR (novas rotas)
```

### 5.2 Contexto de Autenticação

```jsx
// frontend/src/contexts/ProfessionalAuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { professionalApi } from '../services/professionalApi';

const ProfessionalAuthContext = createContext();

export function ProfessionalAuthProvider({ children }) {
    const [professional, setProfessional] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('professional_token');
        const storedProfessional = localStorage.getItem('professional');

        if (token && storedProfessional) {
            setProfessional(JSON.parse(storedProfessional));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await professionalApi.login(email, password);
        localStorage.setItem('professional_token', response.access_token);
        localStorage.setItem('professional', JSON.stringify(response.professional));
        setProfessional(response.professional);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('professional_token');
        localStorage.removeItem('professional');
        setProfessional(null);
    };

    return (
        <ProfessionalAuthContext.Provider value={{
            professional,
            loading,
            login,
            logout,
            isAuthenticated: !!professional
        }}>
            {children}
        </ProfessionalAuthContext.Provider>
    );
}

export const useProfessionalAuth = () => useContext(ProfessionalAuthContext);
```

### 5.3 Serviço de API

```jsx
// frontend/src/services/professionalApi.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const professionalAxios = axios.create({
    baseURL: API_URL
});

professionalAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('professional_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const professionalApi = {
    // Auth
    login: (email, password) =>
        professionalAxios.post('/professional-auth/login', { email, password })
            .then(res => res.data),

    activate: (token, password) =>
        professionalAxios.post('/professional-auth/activate', { token, password })
            .then(res => res.data),

    forgotPassword: (email) =>
        professionalAxios.post('/professional-auth/forgot-password', { email })
            .then(res => res.data),

    // Dashboard
    getDashboard: () =>
        professionalAxios.get('/professional/dashboard')
            .then(res => res.data),

    // Appointments
    getAppointments: (params) =>
        professionalAxios.get('/professional/appointments', { params })
            .then(res => res.data),

    completeAppointment: (id, data) =>
        professionalAxios.put(`/professional/appointments/${id}/complete`, data)
            .then(res => res.data),

    // Schedule
    getSchedule: (startDate, endDate) =>
        professionalAxios.get('/professional/schedule', {
            params: { start_date: startDate, end_date: endDate }
        }).then(res => res.data),

    // Working Hours
    updateWorkingHours: (data) =>
        professionalAxios.put('/professional/working-hours', data)
            .then(res => res.data),

    // Blocked Dates
    blockDate: (data) =>
        professionalAxios.post('/professional/blocked-dates', data)
            .then(res => res.data),

    unblockDate: (id) =>
        professionalAxios.delete(`/professional/blocked-dates/${id}`)
            .then(res => res.data)
};
```

### 5.4 Rotas

```jsx
// Adicionar em App.jsx

// Rotas públicas do profissional
<Route path="/profissional/login" element={<ProfessionalLogin />} />
<Route path="/profissional/ativar/:token" element={<ProfessionalActivate />} />
<Route path="/profissional/esqueci-senha" element={<ProfessionalForgotPassword />} />
<Route path="/profissional/resetar-senha/:token" element={<ProfessionalResetPassword />} />

// Rotas protegidas do profissional
<Route path="/profissional" element={<ProfessionalLayout />}>
    <Route path="dashboard" element={<ProfessionalDashboard />} />
    <Route path="agenda" element={<ProfessionalSchedule />} />
    <Route path="agendamentos" element={<ProfessionalAppointments />} />
    <Route path="clientes" element={<ProfessionalClients />} />
    <Route path="configuracoes" element={<ProfessionalSettings />} />
</Route>
```

---

## 6. Design da Dashboard

### 6.1 Layout Geral

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  ┌──────────┐  João Silva - Barbeiro            [Sair]          │
│  │  Avatar  │  Último acesso: Hoje às 08:30                     │
│  └──────────┘                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ Hoje        │ │ Esta Semana │ │ Este Mês    │ │ Taxa        ││
│  │     5       │ │     23      │ │     87      │ │   89.5%     ││
│  │ agendamentos│ │ agendamentos│ │ agendamentos│ │ conclusão   ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│                                                                  │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐│
│  │ AGENDA DE HOJE              │ │ AÇÕES RÁPIDAS               ││
│  │                             │ │                             ││
│  │ 09:00 - Maria Santos        │ │ [Bloquear Horário]          ││
│  │        Corte Feminino       │ │ [Ver Agenda Semana]         ││
│  │        ⏳ Pendente          │ │ [Configurar Horários]       ││
│  │                             │ │                             ││
│  │ 10:00 - João Pedro          │ ├─────────────────────────────┤│
│  │        Barba                │ │ RECEITA DO MÊS              ││
│  │        ✅ Concluído         │ │                             ││
│  │                             │ │ R$ 4.500,00                 ││
│  │ 11:00 - Ana Clara           │ │ +12% vs mês anterior        ││
│  │        Corte + Escova       │ │                             ││
│  │        ⏳ Pendente          │ └─────────────────────────────┘│
│  │                             │                               │
│  └─────────────────────────────┘                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Componentes Visuais

**Cards de Estatísticas:**
- Ícones ilustrativos
- Números grandes e destacados
- Cores consistentes com o tema

**Timeline do Dia:**
- Linha do tempo vertical
- Horários à esquerda
- Cards de agendamento à direita
- Status colorido (pendente: amarelo, concluído: verde, cancelado: vermelho)
- Botão de ação rápida para concluir

**Menu Lateral:**
- Dashboard (home)
- Minha Agenda
- Meus Agendamentos
- Meus Clientes
- Configurações
- Sair

---

## 7. Funcionalidades Detalhadas

### 7.1 Dashboard Principal

| Funcionalidade | Descrição |
|----------------|-----------|
| Ver estatísticas | Cards com métricas do dia/semana/mês |
| Ver agenda do dia | Timeline com todos agendamentos |
| Marcar como concluído | Modal para registrar preço e forma de pagamento |
| Ver detalhes do cliente | Nome, telefone, histórico |
| Receita | Total do mês com comparativo |

### 7.2 Página de Agenda

| Funcionalidade | Descrição |
|----------------|-----------|
| Ver semana | Calendário semanal com slots |
| Filtrar por data | Seletor de período |
| Ver detalhes | Clique no agendamento para expandir |
| Bloquear horário | Marcar como indisponível |

### 7.3 Página de Agendamentos

| Funcionalidade | Descrição |
|----------------|-----------|
| Listar todos | Com paginação |
| Filtrar por status | Pendente, concluído, cancelado |
| Filtrar por data | Range de datas |
| Buscar cliente | Por nome ou telefone |

### 7.4 Página de Clientes

| Funcionalidade | Descrição |
|----------------|-----------|
| Ver clientes atendidos | Lista de clientes que já atendeu |
| Ver histórico | Agendamentos anteriores |
| Ver estatísticas | Frequência, serviços preferidos |

### 7.5 Configurações

| Funcionalidade | Descrição |
|----------------|-----------|
| Editar horários | Definir horário de trabalho |
| Bloquear datas | Férias, feriados, folgas |
| Alterar senha | Segurança da conta |
| Notificações | Preferências de alertas |

---

## 8. Permissões e Segurança

### 8.1 O que o Profissional PODE fazer:

- ✅ Ver seus próprios agendamentos
- ✅ Marcar agendamentos como concluídos
- ✅ Ver informações básicas dos clientes
- ✅ Configurar seus horários de trabalho
- ✅ Bloquear suas próprias datas
- ✅ Ver suas estatísticas e receita
- ✅ Alterar sua própria senha

### 8.2 O que o Profissional NÃO PODE fazer:

- ❌ Ver agendamentos de outros profissionais
- ❌ Criar novos agendamentos
- ❌ Editar informações do estabelecimento
- ❌ Gerenciar outros profissionais
- ❌ Gerenciar serviços
- ❌ Ver relatórios gerais
- ❌ Acessar configurações do sistema
- ❌ Ver receita de outros profissionais

---

## 9. Emails do Sistema

### 9.1 Email de Convite

**Assunto:** Você foi convidado para o AgendaMais!

```
Olá {nome_profissional},

{nome_estabelecimento} convidou você para acessar o sistema AgendaMais.

Com sua conta, você poderá:
• Ver sua agenda de atendimentos
• Marcar serviços como concluídos
• Acompanhar suas estatísticas

Clique no link abaixo para criar sua senha:
{link_ativacao}

Este link expira em 48 horas.

Se você não conhece {nome_estabelecimento}, ignore este email.

Equipe AgendaMais
```

### 9.2 Email de Reset de Senha

**Assunto:** Redefinir sua senha - AgendaMais

```
Olá {nome_profissional},

Recebemos uma solicitação para redefinir sua senha.

Clique no link abaixo para criar uma nova senha:
{link_reset}

Este link expira em 1 hora.

Se você não solicitou esta alteração, ignore este email.

Equipe AgendaMais
```

---

## 10. Checklist de Implementação

### Backend

- [ ] Criar tabela `professional_users`
- [ ] Criar rota POST `/professional-auth/invite`
- [ ] Criar rota POST `/professional-auth/activate`
- [ ] Criar rota POST `/professional-auth/login`
- [ ] Criar rota POST `/professional-auth/forgot-password`
- [ ] Criar rota POST `/professional-auth/reset-password`
- [ ] Criar rota GET `/professional/dashboard`
- [ ] Criar rota GET `/professional/appointments`
- [ ] Criar rota PUT `/professional/appointments/:id/complete`
- [ ] Criar rota GET `/professional/schedule`
- [ ] Criar rota GET `/professional/clients`
- [ ] Criar rota PUT `/professional/working-hours`
- [ ] Criar rota POST `/professional/blocked-dates`
- [ ] Configurar envio de emails
- [ ] Testes unitários

### Frontend

- [ ] Criar `ProfessionalAuthContext.jsx`
- [ ] Criar `professionalApi.js`
- [ ] Criar `ProfessionalLogin.jsx`
- [ ] Criar `ProfessionalActivate.jsx`
- [ ] Criar `ProfessionalDashboard.jsx`
- [ ] Criar `ProfessionalSchedule.jsx`
- [ ] Criar `ProfessionalAppointments.jsx`
- [ ] Criar `ProfessionalClients.jsx`
- [ ] Criar `ProfessionalSettings.jsx`
- [ ] Criar componentes auxiliares
- [ ] Adicionar rotas em `App.jsx`
- [ ] Testes de componentes

### Integração

- [ ] Testar fluxo de convite
- [ ] Testar fluxo de ativação
- [ ] Testar login/logout
- [ ] Testar dashboard
- [ ] Testar marcar como concluído
- [ ] Testar configurações
- [ ] Testar responsividade mobile

---

## 11. Considerações Futuras

### Possíveis Melhorias:

1. **Notificações Push** - Alertar profissional de novos agendamentos
2. **Chat com Cliente** - Comunicação direta
3. **App Mobile Nativo** - React Native para profissionais
4. **Relatórios Avançados** - Gráficos de performance
5. **Metas** - Sistema de metas mensais
6. **Comissões** - Cálculo automático de comissões

---

*Documento criado em Janeiro 2026*
*Última atualização: 13/01/2026*
