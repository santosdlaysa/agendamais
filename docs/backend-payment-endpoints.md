# Pagamento Online para Agendamentos

## Status: BACKEND JA IMPLEMENTADO

O backend em `C:\Users\ldsantos\Documents\ALYSA\agendamaisbackend` ja possui toda a infraestrutura de pagamento implementada.

## Como Funciona

### Fluxo Atual

1. Cliente faz agendamento via `POST /api/public/business/{slug}/appointments`
2. Backend verifica se `user.booking_require_payment = true` e se o servico tem preco > 0
3. Se pagamento obrigatorio:
   - Cria agendamento com `status = 'pending_payment'`
   - Cria sessao Stripe Checkout automaticamente
   - Retorna `checkout_url` na resposta
4. Frontend redireciona cliente para o Stripe Checkout
5. Apos pagamento, Stripe redireciona para `/agendar/{slug}/confirmacao?code={code}&payment=success`
6. Webhook do Stripe (`/api/public/webhook/service-payment`) atualiza o status do agendamento

### Resposta do Endpoint de Agendamento

Quando pagamento e obrigatorio:
```json
{
  "message": "Agendamento criado. Complete o pagamento para confirmar.",
  "booking_code": "ABC12345",
  "appointment": { ... },
  "requires_payment": true,
  "checkout_url": "https://checkout.stripe.com/...",
  "payment_amount": 150.00,
  "payment_type": "full"
}
```

Quando pagamento NAO e obrigatorio:
```json
{
  "message": "Agendamento realizado com sucesso!",
  "booking_code": "ABC12345",
  "appointment": { ... }
}
```

## Configuracao por Usuario

Cada usuario (estabelecimento) pode configurar:

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `booking_require_payment` | boolean | Se true, exige pagamento online |
| `booking_payment_type` | string | 'full' (valor total) ou 'deposit' (entrada) |
| `booking_deposit_percentage` | integer | Percentual da entrada (default: 50) |

## Arquivos do Backend

| Arquivo | Funcao |
|---------|--------|
| `src/app/main/public/booking.py` | Endpoint de agendamento com integracao de pagamento |
| `src/services/payment_service.py` | Servico Stripe (criar checkout, refund, etc) |
| `src/models/appointment.py` | Model com campos de pagamento |
| `src/models/service_payment.py` | Model para rastrear pagamentos |

## Para Ativar Pagamento

Para ativar pagamento obrigatorio para um estabelecimento, basta definir no banco de dados:

```sql
UPDATE users
SET booking_require_payment = true,
    booking_payment_type = 'full'  -- ou 'deposit'
WHERE id = {user_id};
```

Ou via API de configuracoes (se existir).

## Variaveis de Ambiente Necessarias

```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_SERVICE_WEBHOOK_SECRET=whsec_xxx
FRONTEND_URL=https://agendarmais.com
```

## Webhook Stripe

O endpoint `POST /api/public/webhook/service-payment` trata os eventos:
- `checkout.session.completed` - Pagamento bem-sucedido
- `payment_intent.payment_failed` - Pagamento falhou
- `checkout.session.expired` - Sessao expirou (24h)
