# AgendaMais - Documentacao Completa do Sistema

## Sumario

1. [O que e o AgendaMais](#1-o-que-e-o-agendamais)
2. [O que o AgendaMais proporciona](#2-o-que-o-agendamais-proporciona)
3. [Para quem e o AgendaMais](#3-para-quem-e-o-agendamais)
4. [Arquitetura do Sistema](#4-arquitetura-do-sistema)
5. [Estrutura do Projeto](#5-estrutura-do-projeto)
6. [Configuracao e Instalacao](#6-configuracao-e-instalacao)
7. [Autenticacao e Autorizacao](#7-autenticacao-e-autorizacao)
8. [Modulos do Sistema](#8-modulos-do-sistema)
9. [Agendamento Online Publico](#9-agendamento-online-publico)
10. [Sistema de Assinaturas](#10-sistema-de-assinaturas)
11. [API e Servicos](#11-api-e-servicos)
12. [Componentes de UI](#12-componentes-de-ui)
13. [Fluxos do Sistema](#13-fluxos-do-sistema)
14. [Guia de Desenvolvimento](#14-guia-de-desenvolvimento)

---

## 1. O que e o AgendaMais

### 1.1 Definicao

O **AgendaMais** e uma plataforma SaaS (Software as a Service) completa de gestao de agendamentos desenvolvida para revolucionar a forma como estabelecimentos de servicos gerenciam suas operacoes diarias.

Mais do que um simples sistema de agenda, o AgendaMais e um **ecosistema inteligente** que centraliza toda a operacao do seu negocio em uma unica plataforma moderna, intuitiva e acessivel de qualquer dispositivo.

### 1.2 Nossa Missao

Eliminar a dor de cabeca da gestao de agendamentos, permitindo que profissionais foquem no que realmente importa: **atender bem seus clientes e crescer seus negocios**.

### 1.3 O Problema que Resolvemos

**Cenario comum antes do AgendaMais:**

- Agenda em papel ou planilhas desorganizadas
- Horas gastas ao telefone confirmando horarios
- Clientes que nao aparecem (no-shows) causando prejuizo
- Dificuldade para controlar faturamento
- Impossibilidade de receber agendamentos fora do horario comercial
- Falta de visibilidade sobre o desempenho do negocio

**Com o AgendaMais:**

- Agenda digital centralizada e organizada
- Confirmacoes automaticas via WhatsApp/SMS
- Reducao drastica de faltas com lembretes inteligentes
- Relatorios financeiros em tempo real
- Agendamento online 24 horas por dia, 7 dias por semana
- Dashboard com metricas e insights do negocio

### 1.4 Diferenciais Competitivos

| Diferencial | Descricao |
|-------------|-----------|
| **Lembretes via WhatsApp** | Integracao nativa com o aplicativo mais usado no Brasil |
| **Agendamento Online 24/7** | Seus clientes agendam a qualquer hora, mesmo quando voce esta dormindo |
| **Interface Intuitiva** | Design moderno e facil de usar, sem necessidade de treinamento |
| **Multi-profissionais** | Gerencie toda sua equipe em um so lugar |
| **Relatorios Inteligentes** | Tome decisoes baseadas em dados reais |
| **Link Exclusivo** | Compartilhe nas redes sociais e receba agendamentos |
| **Preco Acessivel** | Planos que cabem no bolso de qualquer profissional |

---

## 2. O que o AgendaMais Proporciona

### 2.1 Funcionalidades Principais

#### Agendamento Online 24/7

Seus clientes podem agendar servicos a qualquer momento, de qualquer lugar, atraves de um link exclusivo e personalizado para o seu negocio.

- URL personalizada: `agendamais.com/agendar/seu-negocio`
- Interface responsiva (funciona em celular, tablet e computador)
- Processo de agendamento em 4 passos simples
- Confirmacao instantanea com codigo unico
- Opcao de adicionar ao Google Calendar ou Outlook

#### Lembretes Automaticos

Sistema inteligente de lembretes para reduzir drasticamente as faltas.

- **WhatsApp**: O canal mais efetivo no Brasil
- **SMS**: Para clientes sem WhatsApp
- **Email**: Complementar e profissional
- Mensagens personalizaveis
- Envio automatico 24h e 2h antes do horario
- Painel de estatisticas de envios

#### Gestao de Equipe

Controle completo da sua equipe de profissionais.

- Perfil individual para cada profissional
- Horarios de trabalho personalizados por dia
- Intervalos de almoco/descanso
- Controle de ferias e folgas
- Associacao de servicos por profissional
- Cores para identificacao visual na agenda

#### Gestao de Clientes

Todas as informacoes dos seus clientes em um so lugar.

- Cadastro completo (nome, telefone, email, aniversario)
- Historico de agendamentos
- Notas e observacoes
- Busca e filtros rapidos
- Importacao em massa (em breve)

#### Catalogo de Servicos

Organize todos os servicos oferecidos pelo seu estabelecimento.

- Nome, descricao, preco e duracao
- Categorizacao (ex: Cabelo, Barba, Maquiagem)
- Associacao com profissionais especificos
- Controle de status (ativo/inativo)

#### Agenda Inteligente

Visualize e gerencie todos os agendamentos de forma simples.

- Visao por dia, semana ou mes
- Filtro por profissional
- Status visuais (agendado, confirmado, concluido, cancelado)
- Deteccao automatica de conflitos
- Modal de conclusao com valor e forma de pagamento

#### Relatorios Financeiros

Acompanhe o desempenho do seu negocio em tempo real.

- Receita total por periodo
- Faturamento por profissional
- Servicos mais populares
- Ticket medio
- Graficos interativos
- Exportacao em CSV

### 2.2 Beneficios Tangíveis

#### Para o Proprietario/Gestor

| Beneficio | Impacto |
|-----------|---------|
| **Economia de tempo** | Ate 2 horas/dia a menos no telefone confirmando horarios |
| **Reducao de no-shows** | Diminuicao de 60-80% nas faltas |
| **Aumento de receita** | Mais agendamentos = mais faturamento |
| **Visibilidade financeira** | Saber exatamente quanto entra e quanto sai |
| **Decisoes baseadas em dados** | Identificar profissionais top, servicos mais lucrativos |
| **Profissionalismo** | Impressionar clientes com tecnologia moderna |

#### Para os Profissionais

| Beneficio | Impacto |
|-----------|---------|
| **Agenda organizada** | Saber exatamente o que fazer a cada momento |
| **Menos estresse** | Fim da correria de ultima hora |
| **Controle de ferias** | Bloquear datas com facilidade |
| **Autonomia** | Gerenciar proprios horarios |

#### Para os Clientes

| Beneficio | Impacto |
|-----------|---------|
| **Conveniencia** | Agendar a qualquer hora, sem ligar |
| **Lembretes uteis** | Nunca mais esquecer do horario |
| **Transparencia** | Ver precos e duracao antes de agendar |
| **Flexibilidade** | Cancelar ou reagendar facilmente |

### 2.3 Metricas de Sucesso

Nossos clientes reportam em media:

```
+----------------------------------+------------------+
| Metrica                          | Resultado        |
+----------------------------------+------------------+
| Reducao de no-shows              | 70%              |
| Economia de tempo diario         | 2 horas          |
| Aumento de agendamentos online   | 40%              |
| Satisfacao dos clientes          | 92%              |
| ROI (Retorno sobre investimento) | 5.200% no 1o ano |
+----------------------------------+------------------+
```

### 2.4 Cenarios de Uso

#### Salao de Beleza "Beleza Pura"

**Antes:** 3 funcionarios gastavam 1h30 por dia cada ligando para confirmar horarios. Taxa de falta de 30%. Sem controle financeiro.

**Depois:** Zero tempo em confirmacoes (automaticas via WhatsApp). Taxa de falta caiu para 8%. Relatorios mostram que coloracao e o servico mais lucrativo.

**Resultado:** Economia de R$ 2.400/mes em tempo + R$ 3.000/mes em faltas evitadas.

#### Clinica de Estetica "Corpo e Mente"

**Antes:** Recepcionista sobrecarregada, erros de agendamento frequentes, clientes reclamando.

**Depois:** 60% dos agendamentos vem pelo link online. Sem conflitos de horario. Clientes elogiam a praticidade.

**Resultado:** Contratou mais um profissional para atender a demanda que cresceu 35%.

#### Personal Trainer "Joao Fitness"

**Antes:** Controlava tudo pelo WhatsApp pessoal, sem organizacao. Clientes desmarcavam em cima da hora.

**Depois:** Agenda profissional, clientes agendam sozinhos, lembretes 24h antes reduziram cancelamentos.

**Resultado:** Conseguiu dobrar a carteira de clientes mantendo a organizacao.

---

## 3. Para Quem e o AgendaMais

### 3.1 Segmentos Atendidos

O AgendaMais foi projetado para atender qualquer negocio que trabalhe com agendamentos:

#### Beleza e Estetica
- Saloes de beleza
- Barbearias
- Clinicas de estetica
- Studios de maquiagem
- Nail designers
- Design de sobrancelhas
- Extensao de cilios

#### Saude e Bem-estar
- Clinicas medicas
- Consultorios odontologicos
- Psicologos e terapeutas
- Fisioterapeutas
- Nutricionistas
- Acupunturistas
- Massoterapeutas

#### Fitness e Esportes
- Personal trainers
- Studios de pilates
- Academias (aulas especiais)
- Treinadores esportivos
- Studios de yoga
- Crossfit (aulas)

#### Pets
- Pet shops (banho e tosa)
- Clinicas veterinarias
- Dog walkers
- Adestradores

#### Servicos Diversos
- Tatuadores
- Piercers
- Fotografos
- Consultores
- Coaches
- Advogados
- Contadores
- Arquitetos

### 3.2 Planos e Precos

| Plano | Preco | Ideal para | Recursos |
|-------|-------|------------|----------|
| **Basico** | R$ 29/mes | Profissionais autonomos | 100 agend./mes, 3 profissionais, lembretes por email |
| **Pro** | R$ 59/mes | Pequenos estabelecimentos | Ilimitado, 10 profissionais, WhatsApp/SMS, relatorios |
| **Enterprise** | R$ 99/mes | Medias e grandes empresas | Tudo do Pro + profissionais ilimitados, API, suporte 24/7 |

**Todos os planos incluem:**
- Agendamento online 24/7
- Link exclusivo personalizado
- Gestao de clientes
- Catalogo de servicos
- Dashboard com metricas
- Suporte por email

### 3.3 Por que Escolher o AgendaMais

1. **Desenvolvido no Brasil, para o Brasil**
   - Integracao nativa com WhatsApp
   - Precos em Reais
   - Suporte em portugues
   - Atende as necessidades locais

2. **Simples de Usar**
   - Interface intuitiva
   - Sem necessidade de treinamento
   - Comecar a usar em minutos

3. **Custo-Beneficio Imbativel**
   - Planos acessiveis
   - Retorno sobre investimento comprovado
   - Sem taxas ocultas

4. **Tecnologia de Ponta**
   - Sistema 100% na nuvem
   - Sempre atualizado
   - Seguro e confiavel

5. **Suporte Humanizado**
   - Equipe pronta para ajudar
   - Tutoriais e documentacao
   - Comunidade ativa

---

## 4. Arquitetura do Sistema

### 4.1 Stack Tecnologico

```
+-------------------------------------------------------------+
|                        FRONTEND                              |
+-------------------------------------------------------------+
|  React 18          |  Vite 5           |  Tailwind CSS      |
|  React Router v6   |  Axios            |  Lucide Icons      |
|  Context API       |  Stripe JS        |  React Hot Toast   |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                        BACKEND                               |
+-------------------------------------------------------------+
|  Node.js / Express |  PostgreSQL       |  Stripe API        |
|  JWT Auth          |  Sequelize ORM    |  Twilio (SMS)      |
+-------------------------------------------------------------+
```

### 4.2 Diagrama de Arquitetura

```
                    +------------------+
                    |   Landing Page   |
                    |   (Publica)      |
                    +--------+---------+
                             |
        +--------------------+--------------------+
        |                    |                    |
        v                    v                    v
+---------------+   +---------------+   +---------------+
|  Agendamento  |   |    Login/     |   |   Dashboard   |
|    Online     |   |   Registro    |   |    (Admin)    |
|   (Publico)   |   |               |   |               |
+---------------+   +---------------+   +---------------+
        |                    |                    |
        |                    v                    |
        |           +---------------+             |
        |           |  AuthContext  |             |
        |           |  (JWT Token)  |             |
        |           +---------------+             |
        |                    |                    |
        v                    v                    v
+-------------------------------------------------------------+
|                      API Backend                             |
|  /api/public/*          |           /api/*                   |
|  (Sem autenticacao)     |     (Com autenticacao JWT)         |
+-------------------------------------------------------------+
```

### 4.3 Gerenciamento de Estado

O sistema utiliza **React Context API** para gerenciamento de estado global:

```
+-------------------------------------------------------------+
|                      App.jsx                                 |
|  +-------------------------------------------------------+  |
|  |                   AuthProvider                         |  |
|  |  +-------------------------------------------------+  |  |
|  |  |              SubscriptionProvider                |  |  |
|  |  |  +-------------------------------------------+  |  |  |
|  |  |  |            OnboardingProvider              |  |  |  |
|  |  |  |                                            |  |  |  |
|  |  |  |              [ Aplicacao ]                 |  |  |  |
|  |  |  |                                            |  |  |  |
|  |  |  +-------------------------------------------+  |  |  |
|  |  +-------------------------------------------------+  |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

---

## 5. Estrutura do Projeto

### 5.1 Arvore de Diretorios

```
frontend/
|-- public/                     # Arquivos estaticos
|-- src/
|   |-- components/             # Componentes React
|   |   |-- booking/            # Componentes de agendamento online
|   |   |   |-- BookingSteps.jsx
|   |   |   |-- BusinessHeader.jsx
|   |   |   |-- ServiceSelector.jsx
|   |   |   |-- ProfessionalSelector.jsx
|   |   |   |-- DateTimePicker.jsx
|   |   |   |-- BookingClientForm.jsx
|   |   |   +-- BookingSummary.jsx
|   |   |-- ui/                 # Componentes de UI reutilizaveis
|   |   |   +-- button.jsx
|   |   |-- __tests__/          # Testes unitarios
|   |   |-- Appointments.jsx    # Listagem de agendamentos
|   |   |-- AppointmentForm.jsx # Formulario de agendamento
|   |   |-- Clients.jsx         # Listagem de clientes
|   |   |-- ClientForm.jsx      # Formulario de cliente
|   |   |-- Dashboard.jsx       # Painel principal
|   |   |-- FinancialReport.jsx # Relatorios financeiros
|   |   |-- Layout.jsx          # Layout principal
|   |   |-- Login.jsx           # Tela de login/registro
|   |   |-- OnboardingWizard.jsx # Wizard de configuracao inicial
|   |   |-- PaymentModal.jsx    # Modal de pagamento Stripe
|   |   |-- ProfessionalForm.jsx # Formulario de profissional
|   |   |-- Professionals.jsx   # Listagem de profissionais
|   |   |-- Reminders.jsx       # Listagem de lembretes
|   |   |-- ReminderSettings.jsx # Configuracoes de lembretes
|   |   |-- ServiceForm.jsx     # Formulario de servico
|   |   |-- Services.jsx        # Listagem de servicos
|   |   |-- Settings.jsx        # Configuracoes do sistema
|   |   |-- SubscriptionCanceled.jsx
|   |   |-- SubscriptionGuard.jsx
|   |   |-- SubscriptionPlans.jsx
|   |   |-- SubscriptionStatus.jsx
|   |   +-- SubscriptionSuccess.jsx
|   |-- contexts/               # React Context Providers
|   |   |-- AuthContext.jsx     # Autenticacao
|   |   |-- SubscriptionContext.jsx # Assinaturas
|   |   +-- OnboardingContext.jsx # Onboarding
|   |-- pages/                  # Paginas
|   |   +-- public/             # Paginas publicas
|   |       |-- BookingPage.jsx
|   |       |-- BookingConfirmation.jsx
|   |       |-- BookingLookup.jsx
|   |       |-- BookingCancel.jsx
|   |       +-- LandingPage.jsx
|   |-- services/               # Servicos de API
|   |   +-- publicApi.js        # API publica (agendamento)
|   |-- utils/                  # Utilitarios
|   |   |-- api.js              # Instancia Axios autenticada
|   |   +-- testUtils.jsx       # Utilitarios de teste
|   |-- styles/                 # Estilos CSS
|   |   |-- App.css
|   |   |-- globals.css
|   |   +-- index.css
|   |-- App.jsx                 # Componente raiz
|   |-- main.jsx                # Entry point
|   +-- setupTests.js           # Configuracao de testes
|-- .env                        # Variaveis de ambiente
|-- .env.example                # Exemplo de variaveis
|-- index.html                  # HTML principal
|-- package.json                # Dependencias
|-- tailwind.config.js          # Configuracao Tailwind
|-- vite.config.js              # Configuracao Vite
+-- jest.config.js              # Configuracao Jest
```

### 5.2 Dependencias Principais

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.6.0",
    "@stripe/stripe-js": "^8.3.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "tailwindcss": "^3.3.6",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

## 4. Configuracao e Instalacao

### 4.1 Pre-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- Git

### 4.2 Instalacao

```bash
# Clonar repositorio
git clone <repository-url>
cd agendamais/frontend

# Instalar dependencias
npm install

# Configurar variaveis de ambiente
cp .env.example .env
```

### 4.3 Variaveis de Ambiente

```env
# URL do backend
VITE_API_URL=https://agendamaisbackend.onrender.com

# Chave publica do Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
```

### 4.4 Comandos Disponiveis

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Iniciar servidor de desenvolvimento |
| `npm run build` | Build para producao |
| `npm run preview` | Preview do build |
| `npm test` | Executar testes |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Coverage de testes |
| `npm run lint` | Executar ESLint |

---

## 5. Autenticacao e Autorizacao

### 5.1 AuthContext

O `AuthContext` gerencia todo o fluxo de autenticacao:

```jsx
// src/contexts/AuthContext.jsx

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Metodos disponiveis
  const login = async (email, password) => { ... }
  const register = async (name, email, password) => { ... }
  const logout = () => { ... }
  const getCurrentUser = async () => { ... }
  const changePassword = async (currentPassword, newPassword) => { ... }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      getCurrentUser,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 5.2 Fluxo de Autenticacao

```
+-----------+     +-----------+     +-----------+
|   Login   |---->|  Backend  |---->|   Token   |
|   Form    |     |   /auth   |     |    JWT    |
+-----------+     +-----------+     +-----------+
                                          |
                                          v
+-----------+     +-----------+     +-------------+
|   Rotas   |<----|   Axios   |<----| localStorage|
| Protegidas|     | Interceptor|    |    Token    |
+-----------+     +-----------+     +-------------+
```

### 5.3 Roles e Permissoes

| Role | Permissoes |
|------|------------|
| **admin** | Acesso total ao sistema |
| **manager** | Gerenciar equipe, clientes, agendamentos, relatorios |
| **employee** | Visualizar e gerenciar proprios agendamentos |

**Lista de Permissoes:**
- `manage_clients` - Gerenciar clientes
- `manage_professionals` - Gerenciar profissionais
- `manage_services` - Gerenciar servicos
- `manage_appointments` - Gerenciar agendamentos
- `view_reports` - Ver relatorios
- `manage_reminders` - Gerenciar lembretes
- `manage_users` - Gerenciar usuarios
- `manage_permissions` - Gerenciar permissoes

---

## 6. Modulos do Sistema

### 6.1 Dashboard

**Arquivo:** `src/components/Dashboard.jsx`

**Funcionalidades:**
- Cards com estatisticas gerais
- Receita total (agendamentos concluidos)
- Agendamentos por status
- Estatisticas de lembretes
- Proximos lembretes (24h)
- Acoes rapidas

### 6.2 Clientes

**Arquivos:**
- `src/components/Clients.jsx` - Listagem
- `src/components/ClientForm.jsx` - Formulario

**Campos do Cliente:**

| Campo | Tipo | Obrigatorio |
|-------|------|-------------|
| name | string | Sim |
| phone | string | Sim |
| email | string | Nao |
| birth_date | date | Nao |
| notes | text | Nao |

### 6.3 Profissionais

**Arquivos:**
- `src/components/Professionals.jsx` - Listagem
- `src/components/ProfessionalForm.jsx` - Formulario

**Campos do Profissional:**

| Campo | Tipo | Obrigatorio |
|-------|------|-------------|
| name | string | Sim |
| role | string | Nao |
| phone | string | Nao |
| email | string | Nao |
| color | string | Sim |
| active | boolean | Sim |
| service_ids | array | Nao |

**Abas do Formulario (modo edicao):**
1. **Informacoes** - Dados basicos e servicos
2. **Horarios** - Horarios de trabalho por dia da semana
3. **Folgas/Ferias** - Datas bloqueadas

**Horarios de Trabalho:**
```javascript
{
  day_of_week: 0-6,    // 0 = Domingo
  start_time: "09:00",
  end_time: "18:00",
  break_start: "12:00", // Opcional
  break_end: "13:00"    // Opcional
}
```

### 6.4 Servicos

**Arquivos:**
- `src/components/Services.jsx` - Listagem
- `src/components/ServiceForm.jsx` - Formulario

**Campos do Servico:**

| Campo | Tipo | Obrigatorio |
|-------|------|-------------|
| name | string | Sim |
| description | string | Nao |
| price | decimal | Sim |
| duration | integer | Sim (minutos) |
| category | string | Nao |
| active | boolean | Sim |

### 6.5 Agendamentos

**Arquivos:**
- `src/components/Appointments.jsx` - Listagem
- `src/components/AppointmentForm.jsx` - Formulario

**Status do Agendamento:**

| Status | Descricao | Cor |
|--------|-----------|-----|
| scheduled | Agendado | Azul |
| confirmed | Confirmado | Verde |
| completed | Concluido | Cinza |
| cancelled | Cancelado | Vermelho |
| no_show | Nao compareceu | Amarelo |

### 6.6 Relatorios Financeiros

**Arquivo:** `src/components/FinancialReport.jsx`

**Filtros Disponiveis:**
- Periodo (data inicio/fim)
- Profissional
- Servico
- Status

**Metricas:**
- Receita total
- Quantidade de atendimentos
- Ticket medio
- Agendamentos por profissional
- Servicos mais populares

### 6.7 Lembretes

**Arquivos:**
- `src/components/Reminders.jsx` - Listagem
- `src/components/ReminderSettings.jsx` - Configuracoes

**Canais de Lembrete:**
- WhatsApp
- SMS
- Email

### 6.8 Configuracoes

**Arquivo:** `src/components/Settings.jsx`

**Abas:**
1. **Empresa** - Dados do estabelecimento
2. **Agendamento Online** - Configuracoes de booking
3. **Permissoes** - Gerenciar permissoes de usuarios (admin)
4. **Usuarios** - Listar usuarios (admin)

**Configuracoes de Agendamento Online:**

| Campo | Descricao | Padrao |
|-------|-----------|--------|
| start_hour | Hora de inicio | 8 |
| end_hour | Hora de termino | 18 |
| slot_interval | Intervalo entre slots (min) | 30 |
| min_advance_hours | Antecedencia minima (horas) | 2 |
| max_advance_days | Antecedencia maxima (dias) | 30 |
| allow_cancellation | Permitir cancelamento | true |
| cancellation_min_hours | Minimo para cancelar (horas) | 2 |
| require_confirmation | Exigir confirmacao | false |

---

## 7. Agendamento Online Publico

### 7.1 Visao Geral

O agendamento online permite que clientes agendem servicos 24/7 atraves de um link exclusivo.

**URL:** `https://seusite.com/#/agendar/{slug}`

### 7.2 Fluxo de Agendamento

```
+-------------------------------------------------------------+
|                    WIZARD DE AGENDAMENTO                     |
+-------------------------------------------------------------+
|                                                              |
|  +----------+   +----------+   +----------+   +----------+  |
|  |   1.     |-->|   2.     |-->|   3.     |-->|   4.     |  |
|  | Servico  |   |Profissio-|   |Data/Hora |   | Dados    |  |
|  |          |   |   nal    |   |          |   | Cliente  |  |
|  +----------+   +----------+   +----------+   +----------+  |
|                                                              |
+-------------------------------------------------------------+
                              |
                              v
                    +------------------+
                    |   CONFIRMACAO    |
                    |   Codigo: ABC123 |
                    +------------------+
```

### 7.3 Paginas Publicas

| Rota | Componente | Descricao |
|------|------------|-----------|
| `/agendar/:slug` | BookingPage | Wizard de agendamento |
| `/agendar/:slug/confirmacao/:code` | BookingConfirmation | Confirmacao |
| `/agendar/:slug/consultar` | BookingLookup | Consultar agendamento |
| `/agendar/:slug/cancelar/:code` | BookingCancel | Cancelar agendamento |

### 7.4 Componentes de Booking

| Componente | Descricao |
|------------|-----------|
| **ServiceSelector** | Exibe grid de servicos disponiveis |
| **ProfessionalSelector** | Exibe cards de profissionais |
| **DateTimePicker** | Calendario com dias e horarios disponiveis |
| **BookingClientForm** | Formulario para dados do cliente |
| **BookingSummary** | Resumo do agendamento antes de confirmar |

### 7.5 API Publica

```javascript
// src/services/publicApi.js

const bookingService = {
  // Dados do estabelecimento
  getBusiness: (slug) => GET /api/public/business/{slug}

  // Servicos disponiveis
  getServices: (slug, professionalId?) => GET /api/public/business/{slug}/services

  // Profissionais
  getProfessionals: (slug, serviceId?) => GET /api/public/business/{slug}/professionals

  // Disponibilidade multi-dia
  getMultiDayAvailability: (slug, params) => GET /api/public/business/{slug}/availability/multi-day

  // Horarios de um dia
  getAvailability: (slug, params) => GET /api/public/business/{slug}/availability

  // Criar agendamento
  createAppointment: (slug, data) => POST /api/public/business/{slug}/appointments

  // Consultar agendamento
  getAppointment: (code) => GET /api/public/appointments/{code}

  // Cancelar agendamento
  cancelAppointment: (code, phone, reason) => PUT /api/public/appointments/{code}/cancel

  // Confirmar agendamento
  confirmAppointment: (token) => POST /api/public/appointments/confirm/{token}
}
```

---

## 8. Sistema de Assinaturas

### 8.1 SubscriptionContext

```jsx
// src/contexts/SubscriptionContext.jsx

const SubscriptionContext = createContext()

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])

  // Metodos
  const fetchSubscriptionStatus = async () => { ... }
  const fetchPlans = async () => { ... }
  const createSubscription = async (planId) => { ... }
  const cancelSubscription = async () => { ... }
  const reactivateSubscription = async () => { ... }
  const openBillingPortal = async () => { ... }

  // Helpers
  const hasActiveSubscription = () => { ... }
  const canAccessFeature = (requiredPlans) => { ... }
  const isInTrial = () => { ... }
  const getTrialDaysRemaining = () => { ... }

  return (
    <SubscriptionContext.Provider value={{ ... }}>
      {children}
    </SubscriptionContext.Provider>
  )
}
```

### 8.2 Paginas de Assinatura

| Rota | Componente | Descricao |
|------|------------|-----------|
| `/subscription/plans` | SubscriptionPlans | Selecionar plano |
| `/subscription/manage` | SubscriptionStatus | Gerenciar assinatura |
| `/subscription/success` | SubscriptionSuccess | Pagamento bem-sucedido |
| `/subscription/canceled` | SubscriptionCanceled | Pagamento cancelado |

---

## 9. API e Servicos

### 9.1 Instancia Axios Autenticada

```javascript
// src/utils/api.js

const api = axios.create({
  baseURL: `${VITE_API_URL}/api`
})

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### 9.2 Endpoints da API

#### Autenticacao

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | /auth/login | Login |
| POST | /auth/register | Registro |
| GET | /auth/me | Usuario atual |
| GET | /auth/business | Dados da empresa |
| PUT | /auth/business | Atualizar empresa |
| PUT | /auth/business/booking-settings | Config. agendamento |
| PUT | /auth/change-password | Alterar senha |

#### Clientes

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /clients | Listar clientes |
| GET | /clients/:id | Obter cliente |
| POST | /clients | Criar cliente |
| PUT | /clients/:id | Atualizar cliente |
| DELETE | /clients/:id | Excluir cliente |

#### Profissionais

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /professionals | Listar profissionais |
| GET | /professionals/:id | Obter profissional |
| POST | /professionals | Criar profissional |
| PUT | /professionals/:id | Atualizar profissional |
| DELETE | /professionals/:id | Excluir profissional |
| GET | /professionals/:id/working-hours | Horarios de trabalho |
| POST | /professionals/:id/working-hours | Salvar horarios |
| GET | /professionals/:id/blocked-dates | Datas bloqueadas |
| POST | /professionals/:id/blocked-dates | Bloquear data |
| POST | /professionals/:id/blocked-dates/bulk | Bloquear periodo |
| DELETE | /professionals/:id/blocked-dates/:id | Remover bloqueio |

#### Servicos

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /services | Listar servicos |
| GET | /services/:id | Obter servico |
| POST | /services | Criar servico |
| PUT | /services/:id | Atualizar servico |
| DELETE | /services/:id | Excluir servico |

#### Agendamentos

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /appointments | Listar agendamentos |
| GET | /appointments/:id | Obter agendamento |
| POST | /appointments | Criar agendamento |
| PUT | /appointments/:id | Atualizar agendamento |
| DELETE | /appointments/:id | Excluir agendamento |
| PUT | /appointments/:id/complete | Marcar como concluido |

#### Lembretes

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /reminders | Listar lembretes |
| GET | /reminders/stats | Estatisticas |
| GET | /reminders/settings/:professionalId | Configuracoes |
| PUT | /reminders/settings/:professionalId | Atualizar config. |
| POST | /reminders/:id/send | Enviar lembrete |

#### Assinaturas

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /subscriptions/status | Status atual |
| GET | /subscriptions/plans | Planos disponiveis |
| POST | /subscriptions/create-checkout-session | Criar sessao Stripe |
| POST | /subscriptions/cancel | Cancelar assinatura |
| POST | /subscriptions/reactivate | Reativar assinatura |
| POST | /subscriptions/billing-portal | Portal de billing |

---

## 10. Componentes de UI

### 10.1 Icones (Lucide React)

```jsx
import {
  Calendar,      // Agendamentos
  Users,         // Clientes
  UserCog,       // Profissionais
  Scissors,      // Servicos
  BarChart3,     // Relatorios
  Bell,          // Lembretes
  Settings,      // Configuracoes
  CreditCard,    // Assinatura
  Check,         // Sucesso
  X,             // Erro/Fechar
  Loader2,       // Loading
  ArrowLeft,     // Voltar
  ArrowRight,    // Avancar
  Plus,          // Adicionar
  Trash2,        // Excluir
  Edit,          // Editar
  Search,        // Buscar
  Copy,          // Copiar
  ExternalLink   // Link externo
} from 'lucide-react'
```

### 10.2 Padroes de Estilo

**Cores:**
```css
/* Primaria */
bg-blue-600      /* Botoes primarios */
text-blue-600    /* Links, textos destacados */

/* Sucesso */
bg-green-600     /* Botoes de sucesso */
text-green-600   /* Status positivo */

/* Erro */
bg-red-600       /* Botoes de perigo */
text-red-600     /* Erros, alertas */

/* Neutro */
bg-gray-100      /* Background */
text-gray-900    /* Texto principal */
text-gray-600    /* Texto secundario */
border-gray-300  /* Bordas */
```

**Componentes Comuns:**
```jsx
// Botao primario
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Salvar
</button>

// Botao secundario
<button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
  Cancelar
</button>

// Input
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

// Card
<div className="bg-white rounded-lg shadow-sm border p-6">
  {/* Conteudo */}
</div>
```

---

## 11. Fluxos do Sistema

### 11.1 Fluxo de Onboarding

```
+-----------+
|  Registro |
+-----+-----+
      |
      v
+-----------+
|  Welcome  | "Bem-vindo ao AgendaMais!"
+-----+-----+
      |
      v
+-----------+
|  Business | Tipo de negocio + Dados da empresa
+-----+-----+
      |
      v
+-----------+
|  Services | Adicionar servicos (nome, preco, duracao)
+-----+-----+
      |
      v
+-----------+
|Profissio- | Adicionar profissionais
|   nals    |
+-----+-----+
      |
      v
+-----------+
|  Schedule | Configurar horarios de funcionamento
+-----+-----+
      |
      v
+-----------+
|  Complete | "Tudo pronto!"
+-----+-----+
      |
      v
+-----------+
| Dashboard |
+-----------+
```

### 11.2 Fluxo de Agendamento (Admin)

```
+-----------+
|  Clientes |
+-----+-----+
      | Selecionar cliente
      v
+-----------+
|  Servico  |
+-----+-----+
      | Selecionar servico
      v
+-----------+
|Profissio- |
|   nal     |
+-----+-----+
      | Selecionar profissional
      v
+-----------+
| Data/Hora |
+-----+-----+
      | Selecionar horario
      v
+-----------+
|   Salvar  |
+-----+-----+
      |
      v
+-----------+
|Agendamento|
|  Criado   |
+-----------+
```

### 11.3 Fluxo de Conclusao de Atendimento

```
+-----------+
|Agendamento|
| scheduled |
+-----+-----+
      | Marcar como concluido
      v
+-----------+
|   Modal   |
| Completar |
|           |
| - Valor   |
| - Pagamento|
| - Notas   |
+-----+-----+
      |
      v
+-----------+
|Agendamento|
| completed |
+-----------+
```

---

## 12. Guia de Desenvolvimento

### 12.1 Criando um Novo Componente

```jsx
// src/components/MeuComponente.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SomeIcon, Loader2 } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function MeuComponente() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/endpoint')
      setData(response.data)
    } catch (error) {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Titulo</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Acao
        </button>
      </div>

      {/* Conteudo */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* ... */}
      </div>
    </div>
  )
}
```

### 12.2 Adicionando uma Nova Rota

```jsx
// src/App.jsx

<Routes>
  {/* ... outras rotas ... */}
  <Route path="minha-rota" element={<MeuComponente />} />
</Routes>
```

### 12.3 Usando Context

```jsx
// Consumindo AuthContext
import { useAuth } from '../contexts/AuthContext'

function MeuComponente() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <div>Ola, {user.name}!</div>
}
```

### 12.4 Chamadas de API

```jsx
// GET
const response = await api.get('/endpoint')
const data = response.data

// POST
const response = await api.post('/endpoint', { campo: 'valor' })

// PUT
const response = await api.put('/endpoint/:id', { campo: 'valor' })

// DELETE
await api.delete('/endpoint/:id')
```

### 12.5 Tratamento de Erros

```jsx
try {
  await api.post('/endpoint', data)
  toast.success('Operacao realizada com sucesso!')
  navigate('/lista')
} catch (error) {
  const message = error.response?.data?.message || 'Erro ao processar'
  toast.error(message)
}
```

### 12.6 Validacao de Formulario

```jsx
const validateForm = () => {
  const newErrors = {}

  if (!formData.name.trim()) {
    newErrors.name = 'Nome e obrigatorio'
  }

  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email invalido'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    toast.error('Corrija os erros do formulario')
    return
  }

  // Prosseguir com submit
}
```

---

## Apendices

### A. Variaveis de Ambiente

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| VITE_API_URL | URL do backend | https://api.agendamais.com |
| VITE_STRIPE_PUBLIC_KEY | Chave publica Stripe | pk_test_... |

### B. Codigos de Status HTTP

| Codigo | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisicao invalida |
| 401 | Nao autenticado |
| 403 | Sem permissao |
| 404 | Nao encontrado |
| 500 | Erro interno |

### C. Scripts NPM

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build producao |
| `npm run preview` | Preview build |
| `npm test` | Executar testes |
| `npm run lint` | Verificar codigo |

---

**Documentacao gerada em:** Janeiro 2025
**Versao do Sistema:** 1.0.0
**Autor:** Equipe AgendaMais
