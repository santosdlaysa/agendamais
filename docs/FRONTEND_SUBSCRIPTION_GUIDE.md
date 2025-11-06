# Guia de Uso - Sistema de Assinaturas Frontend

## Visão Geral

Este guia explica como usar o sistema de assinaturas implementado no frontend do AgendaMais.

## Estrutura de Arquivos Criados

```
frontend/src/
├── contexts/
│   └── SubscriptionContext.jsx    # Context para gerenciar estado das assinaturas
├── components/
│   ├── SubscriptionPlans.jsx      # Página de seleção de planos
│   ├── PaymentModal.jsx           # Checkout com Stripe Elements
│   ├── SubscriptionStatus.jsx     # Gerenciamento de assinatura ativa
│   └── SubscriptionGuard.jsx      # HOC para proteger features premium
└── .env.example                    # Variáveis de ambiente necessárias
```

## Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na pasta `frontend/` com:

```env
VITE_API_URL=https://agendamaisbackend.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui
```

**Onde encontrar a chave do Stripe:**
- Acesse https://dashboard.stripe.com/test/apikeys
- Copie a "Publishable key" (começa com `pk_test_`)

### 2. Instalar Dependências

A dependência `@stripe/stripe-js` já foi instalada. Se precisar reinstalar:

```bash
cd frontend
npm install @stripe/stripe-js
```

## Componentes Disponíveis

### 1. SubscriptionContext

**Uso básico:**

```jsx
import { useSubscription } from '../contexts/SubscriptionContext'

function MyComponent() {
  const {
    subscription,           // Dados da assinatura atual
    loading,               // Estado de carregamento
    hasActiveSubscription, // Função para verificar se tem assinatura ativa
    canAccessFeature,      // Verificar acesso a feature específica
    isInTrial,            // Verifica se está em trial
    hasPaymentPending,     // Verifica se tem pagamento pendente
    getTrialDaysRemaining, // Dias restantes do trial
    createSubscription,    // Criar nova assinatura
    cancelSubscription,    // Cancelar assinatura
    reactivateSubscription // Reativar assinatura
  } = useSubscription()

  return (
    <div>
      {hasActiveSubscription() ? (
        <p>Você tem uma assinatura ativa!</p>
      ) : (
        <p>Sem assinatura ativa</p>
      )}
    </div>
  )
}
```

### 2. SubscriptionPlans (Página de Planos)

**Rota:** `/subscription/plans`

Exibe os 3 planos disponíveis (Básico, Pro, Enterprise) em cards side-by-side.

**Funcionalidades:**
- Destaque visual do plano mais popular (Pro)
- Botões "Começar Teste Gratuito"
- Redirecionamento automático para checkout
- Se já tiver assinatura, redireciona para gerenciamento

### 3. PaymentModal (Checkout)

**Rota:** `/subscription/payment`

Modal de pagamento integrado com Stripe Elements.

**Funcionalidades:**
- Formulário de cartão de crédito seguro
- Resumo do plano escolhido
- Confirmação de pagamento
- Redirecionamento após sucesso
- Tratamento de erros

**Fluxo:**
1. Usuário seleciona plano em `/subscription/plans`
2. Backend cria assinatura e retorna `client_secret`
3. Redireciona para `/subscription/payment` com dados
4. Usuário preenche cartão
5. Stripe processa pagamento
6. Redireciona para dashboard

### 4. SubscriptionStatus (Gerenciamento)

**Rota:** `/subscription/manage`

Página para gerenciar assinatura ativa.

**Funcionalidades:**
- Exibir plano atual e status
- Badge colorido por status (ativo, trial, pendente, cancelado)
- Informações de data de renovação/trial
- Botões para cancelar ou reativar
- Alertas para trial expirando
- Aviso de pagamento pendente
- Modal de confirmação de cancelamento

### 5. SubscriptionGuard (Proteção de Features)

HOC para proteger componentes/features premium.

**Uso básico:**

```jsx
import SubscriptionGuard from './components/SubscriptionGuard'

// Proteger qualquer assinatura ativa
<SubscriptionGuard featureName="Relatórios Financeiros">
  <FinancialReports />
</SubscriptionGuard>

// Proteger apenas planos específicos
<SubscriptionGuard
  requiredPlans={['pro', 'enterprise']}
  featureName="Relatórios Avançados"
>
  <AdvancedReports />
</SubscriptionGuard>
```

**Hook alternativo:**

```jsx
import { useFeatureAccess } from './components/SubscriptionGuard'

function MyComponent() {
  const { hasAccess, needsUpgrade, currentPlan } = useFeatureAccess(['pro', 'enterprise'])

  if (!hasAccess) {
    return <UpgradeMessage plan={currentPlan} />
  }

  return <PremiumFeature />
}
```

## Rotas Implementadas

```
/subscription/plans    → Página de seleção de planos
/subscription/payment  → Checkout/pagamento
/subscription/manage   → Gerenciar assinatura ativa
```

## Exemplos de Uso

### Exemplo 1: Proteger uma página inteira

```jsx
// Em App.jsx ou no componente de rotas
import SubscriptionGuard from './components/SubscriptionGuard'

<Route
  path="advanced-reports"
  element={
    <SubscriptionGuard requiredPlans={['pro', 'enterprise']}>
      <AdvancedReports />
    </SubscriptionGuard>
  }
/>
```

### Exemplo 2: Proteger uma feature específica

```jsx
function Dashboard() {
  const { canAccessFeature } = useSubscription()

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Disponível para todos */}
      <BasicStats />

      {/* Apenas para Pro e Enterprise */}
      {canAccessFeature(['pro', 'enterprise']) ? (
        <AdvancedAnalytics />
      ) : (
        <button onClick={() => navigate('/subscription/plans')}>
          Fazer Upgrade para ver Analytics Avançados
        </button>
      )}
    </div>
  )
}
```

### Exemplo 3: Verificar status da assinatura

```jsx
function Header() {
  const { subscription, isInTrial, getTrialDaysRemaining } = useSubscription()

  return (
    <header>
      {isInTrial() && (
        <div className="trial-banner">
          Seu trial expira em {getTrialDaysRemaining()} dias!
          <button onClick={() => navigate('/subscription/manage')}>
            Gerenciar
          </button>
        </div>
      )}
    </header>
  )
}
```

### Exemplo 4: Exibir plano atual

```jsx
function UserMenu() {
  const { subscription } = useSubscription()

  const planNames = {
    basic: 'Básico',
    pro: 'Pro',
    enterprise: 'Enterprise'
  }

  return (
    <div className="user-menu">
      {subscription ? (
        <div>
          <span>Plano: {planNames[subscription.plan]}</span>
          <Link to="/subscription/manage">Gerenciar</Link>
        </div>
      ) : (
        <Link to="/subscription/plans">Assinar</Link>
      )}
    </div>
  )
}
```

## Estados da Assinatura

| Status | Significado | Badge | Ações Disponíveis |
|--------|-------------|-------|-------------------|
| `trialing` | Trial de 7 dias | Azul | Cancelar |
| `active` | Assinatura paga e ativa | Verde | Cancelar, Alterar plano |
| `past_due` | Pagamento pendente | Vermelho | Atualizar cartão |
| `canceled` | Cancelada | Cinza | Renovar |

## Fluxo Completo do Usuário

```
1. Usuário acessa o app → Dashboard
   ↓
2. Tenta acessar feature premium
   ↓
3. SubscriptionGuard bloqueia e mostra mensagem
   ↓
4. Clica "Ver Planos" → /subscription/plans
   ↓
5. Escolhe um plano → Backend cria assinatura
   ↓
6. Redireciona para /subscription/payment
   ↓
7. Preenche dados do cartão
   ↓
8. Stripe processa → 7 dias de trial gratuito
   ↓
9. Redireciona para Dashboard
   ↓
10. Agora tem acesso às features premium
```

## Cartões de Teste (Stripe)

Para testar em desenvolvimento, use estes cartões:

| Cenário | Número | CVV | Validade | CEP |
|---------|--------|-----|----------|-----|
| Sucesso | 4242 4242 4242 4242 | 123 | 12/34 | Qualquer |
| Falha | 4000 0000 0000 0002 | 123 | 12/34 | Qualquer |
| 3D Secure | 4000 0027 6000 3184 | 123 | 12/34 | Qualquer |

## Tratamento de Erros

O sistema trata automaticamente:

- **Token JWT inválido** → Redireciona para login
- **Sem assinatura** → Mostra mensagem e botão para ver planos
- **Plano insuficiente** → Mostra mensagem de upgrade
- **Pagamento pendente** → Alerta vermelho com botão de atualização
- **Trial expirando** → Banner de aviso

## Integração com API

Todos os componentes usam os endpoints documentados em `SUBSCRIPTION_API_DOCUMENTATION.md`:

- `GET /api/subscriptions/plans` - Listar planos
- `POST /api/subscriptions/subscribe` - Criar assinatura
- `GET /api/subscriptions/status` - Status da assinatura
- `POST /api/subscriptions/cancel` - Cancelar
- `POST /api/subscriptions/reactivate` - Reativar

## Personalizações

### Adicionar novo plano

Edite `SubscriptionPlans.jsx`:

```jsx
const PLANS = [
  // ... planos existentes
  {
    id: 'premium',
    name: 'Premium',
    price: 149,
    popular: false,
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3'
    ]
  }
]
```

### Customizar mensagens do Guard

```jsx
<SubscriptionGuard
  requiredPlans={['pro']}
  featureName="Análise de Dados"
  fallback={<CustomUpgradeMessage />}
>
  <DataAnalytics />
</SubscriptionGuard>
```

### Adicionar lógica customizada

```jsx
const { subscription } = useSubscription()

// Verificar limite de recursos
if (subscription.plan === 'basic' && appointmentsCount >= 100) {
  return <LimitReachedMessage />
}
```

## Checklist de Testes

- [ ] Selecionar plano e criar assinatura
- [ ] Preencher cartão de teste e confirmar pagamento
- [ ] Verificar trial de 7 dias ativo
- [ ] Acessar feature protegida com assinatura ativa
- [ ] Cancelar assinatura
- [ ] Reativar assinatura cancelada
- [ ] Testar plano insuficiente (upgrade necessário)
- [ ] Testar cartão que falha
- [ ] Verificar alerta de trial expirando
- [ ] Logout e verificar persistência da assinatura

## Troubleshooting

### Erro: "Stripe public key not found"
- Verifique se `VITE_STRIPE_PUBLIC_KEY` está no arquivo `.env`
- Reinicie o servidor de desenvolvimento após adicionar

### Componente não bloqueia acesso
- Verifique se `SubscriptionProvider` está no `main.jsx`
- Confirme que está usando `useSubscription()` corretamente

### Pagamento não processa
- Verifique a chave pública do Stripe
- Use cartões de teste válidos
- Verifique console para erros do Stripe

### Status não atualiza
- Chame `refreshSubscription()` após operações
- Verifique se o backend está retornando dados corretos

## Próximos Passos

1. Configurar webhook do Stripe no backend
2. Testar fluxo completo em ambiente de teste
3. Adicionar lógica de upgrade de plano
4. Implementar gestão de método de pagamento
5. Adicionar histórico de faturas
6. Configurar email de notificações

## Recursos Adicionais

- [Documentação da API](./SUBSCRIPTION_API_DOCUMENTATION.md)
- [Guia de Implementação Backend](./SUBSCRIPTION_IMPLEMENTATION_GUIDE.md)
- [Stripe Elements Documentation](https://stripe.com/docs/payments/elements)
- [Stripe Testing](https://stripe.com/docs/testing)

---

**Data:** 2025-11-06
**Versão:** 1.0.0
